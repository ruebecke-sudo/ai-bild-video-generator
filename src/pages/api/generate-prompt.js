import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { industry, product, style, type, userId } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'Bitte melde dich an.' })
  }

  if (!industry || !product) {
    return res.status(400).json({ error: 'Bitte fülle alle Pflichtfelder aus.' })
  }

  try {
    // 1. Credits prüfen (Jede maßgeschneiderte Generierung kostet 1 Credit)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(400).json({ error: 'Profil nicht gefunden.' })
    }

    if (profile.credits < 1) {
      return res.status(402).json({ error: 'Nicht genügend Credits. Das Generieren von Nischenprompts kostet 1 Credit.' })
    }

    // System-Instruktion an das Llama-Textmodell für präzise Ergebnisse
    const systemPrompt = `You are a professional AI Prompt Engineer for image and video generation models like FLUX, Midjourney and Luma.
Your task is to generate one high-quality, professional English prompt based on the user's business niche and product details.
Also provide a concise German translation of the prompt.

Output your response strictly as a JSON object with two fields:
{
  "prompt": "The generated professional English prompt...",
  "translation": "Die präzise deutsche Übersetzung des Prompts..."
}

Rules for the English prompt:
1. Make it extremely photorealistic, detailed and optimized for commercial marketing.
2. Use descriptive keywords like "photorealistic", "cinematic lighting", "8k resolution", "sharp focus", "depth of field", "studio lighting".
3. Place the product beautifully in the requested scene style.
4. Keep the prompt around 40-70 words.
5. Do NOT output any conversational text, just the raw JSON.`

    const userPrompt = `Generate a prompt for:
- Business/Niche: ${industry}
- Product/Service: ${product}
- Visual Mood/Style: ${style || 'Elegant & Modern'}
- Generation Type: ${type === 'video' ? 'Video (Luma Dream Machine)' : 'Image (FLUX)'}`

    // Wir rufen das Llama-3-Modell auf Replicate auf, um den Prompt im JSON-Format zu erzeugen
    const response = await replicate.run(
      "meta/meta-llama-3-70b-instruct",
      {
        input: {
          prompt: userPrompt,
          system_prompt: systemPrompt,
          max_new_tokens: 250,
          temperature: 0.75,
          top_p: 0.9
        }
      }
    )

    // Zusammenfügen der Llama-Ausgabe
    const rawOutput = Array.isArray(response) ? response.join('') : response
    
    // JSON parsen
    let result;
    try {
      const jsonStart = rawOutput.indexOf('{')
      const jsonEnd = rawOutput.lastIndexOf('}') + 1
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = rawOutput.substring(jsonStart, jsonEnd)
        result = JSON.parse(jsonString)
      } else {
        throw new Error('No JSON block found')
      }
    } catch (parseError) {
      console.error('Llama Output Parse Error:', rawOutput)
      // Robustes Fallback, falls JSON mal fehlschlagen sollte
      result = {
        prompt: `Commercial product photography of ${product} for a ${industry} business, ${style || 'elegant and modern style'}, volumetric lighting, highly detailed, photorealistic 8k.`,
        translation: `Kommerzielle Produktfotografie von ${product} für ein ${industry}-Unternehmen im ${style || 'eleganten und modernen Stil'}, volumetrische Beleuchtung, hochdetailliert, fotorealistisch 8k.`
      }
    }

    // 3. 1 Credit abziehen
    await supabaseAdmin
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId)

    return res.status(200).json({ 
      prompt: result.prompt, 
      translation: result.translation, 
      creditsLeft: profile.credits - 1 
    })
  } catch (err) {
    console.error('Nischen-Prompt Generator Fehler:', err)
    return res.status(500).json({ error: err.message || 'Prompt-Generierung fehlgeschlagen.' })
  }
}
