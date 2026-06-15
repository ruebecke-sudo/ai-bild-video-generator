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

  const { imageUrl, userId, generationId } = req.body

  if (!userId || !imageUrl) {
    return res.status(400).json({ error: 'Fehlende Parameter.' })
  }

  try {
    // 1. Credits prüfen (Das Verbessern / Upscaling kostet z.B. 1 Credit)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(400).json({ error: 'Profil nicht gefunden.' })
    }

    if (profile.credits < 1) {
      return res.status(402).json({ error: 'Nicht genügend Credits für Bildverbesserung.' })
    }

    // 2. Real-ESRGAN oder GFPGAN (für Gesichter) Upscaler über Replicate aufrufen
    // Wir nutzen hier den führenden Real-ESRGAN Upscaler für ultra-scharfe Details
    const prediction = await replicate.predictions.create({
      model: "nightmareai/real-esrgan",
      input: {
        image: imageUrl,
        scale: 2, // Verdoppelt die Auflösung (z.B. auf 4k)
        face_enhance: true // Verbessert Gesichter automatisch
      }
    })

    // 3. 1 Credit abziehen
    await supabaseAdmin
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId)

    // 4. Den Status in der generations Tabelle aktualisieren oder einen neuen Eintrag für das verbesserte Bild anlegen
    return res.status(200).json({ predictionId: prediction.id, creditsLeft: profile.credits - 1 })
  } catch (err) {
    console.error('Enhance Fehler:', err)
    return res.status(500).json({ error: err.message || 'Upscaling fehlgeschlagen.' })
  }
}
