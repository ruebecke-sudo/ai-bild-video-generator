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

  const { type, prompt, imageUrl, refImageUrl, promptStrength, aspect_ratio, resolution, userId } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'Bitte melde dich an.' })
  }

  try {
    // 1. Credits prüfen
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(400).json({ error: 'Benutzerprofil nicht gefunden.' })
    }

    const requiredCredits = type === 'image' ? 1 : 5
    if (profile.credits < requiredCredits) {
      return res.status(402).json({ error: 'Nicht genügend Credits.' })
    }

    // 2. Replicate Prediction erstellen
    let prediction;
    
    if (type === 'image') {
      if (refImageUrl) {
        // FLUX Dev (Image-to-Image / Img2Img)
        prediction = await replicate.predictions.create({
          model: "black-forest-labs/flux-dev",
          input: {
            prompt: prompt,
            image: refImageUrl,
            prompt_strength: promptStrength !== undefined ? promptStrength : 0.65,
            output_format: "webp",
            disable_safety_checker: true
          }
        })
      } else {
        // FLUX Schnell (Standard Text-to-Image)
        prediction = await replicate.predictions.create({
          model: "black-forest-labs/flux-schnell",
          input: {
            prompt: prompt,
            aspect_ratio: aspect_ratio || "16:9",
            output_format: "webp",
            disable_safety_checker: true
          }
        })
      }
    } else {
      // Luma Dream Machine für HD Video-Generierung
      const inputOptions = {
        prompt: prompt,
        aspect_ratio: aspect_ratio || "16:9"
      }

      if (type === 'image-to-video' && imageUrl) {
        inputOptions.image = imageUrl
      }

      prediction = await replicate.predictions.create({
        model: "luma/dream-machine",
        input: inputOptions
      })
    }

    if (!prediction || !prediction.id) {
      throw new Error('Keine Prediction-ID von Replicate erhalten.')
    }

    // 3. Credits abziehen
    await supabaseAdmin
      .from('profiles')
      .update({ credits: profile.credits - requiredCredits })
      .eq('id', userId)

    // 4. In Generierungs-Datenbank eintragen
    await supabaseAdmin
      .from('generations')
      .insert([
        {
          user_id: userId,
          type: type,
          prompt: prompt,
          input_image: imageUrl || refImageUrl || null,
          prediction_id: prediction.id,
          status: 'starting',
          created_at: new Date()
        }
      ])

    return res.status(200).json({ predictionId: prediction.id, creditsLeft: profile.credits - requiredCredits })
  } catch (err) {
    console.error('Generierungsfehler:', err)
    return res.status(500).json({ error: err.message || 'Fehler beim Starten der Generierung.' })
  }
}
