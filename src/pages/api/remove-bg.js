import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Erlaube größere Payloads (Base64-Bilder von Kameras/Smartphones)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageUrl, userId } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'Bitte melde dich an.' })
  }

  if (!imageUrl) {
    return res.status(400).json({ error: 'Kein Bild bereitgestellt.' })
  }

  try {
    // 1. Gast-Status prüfen
    let isGuest = false
    try {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
      if (!userError && userData?.user?.email === 'gast@my-digital-world.de') {
        isGuest = true
      }
    } catch (authErr) {
      console.error('Gast-Check Fehler:', authErr)
    }

    // 2. Credits prüfen
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(400).json({ error: 'Benutzerprofil nicht gefunden.' })
    }

    const requiredCredits = 1
    if (!isGuest && profile.credits < requiredCredits) {
      return res.status(402).json({ error: 'Nicht genügend Credits.' })
    }

    // 3. Replicate remove-bg Prediction erstellen
    // Wir nutzen das Modell lucataco/remove-bg, das sehr schnell und präzise arbeitet
    const prediction = await replicate.predictions.create({
      model: "lucataco/remove-bg",
      input: {
        image: imageUrl
      }
    })

    if (!prediction || !prediction.id) {
      throw new Error('Keine Prediction-ID von Replicate erhalten.')
    }

    // 4. Credits abziehen (nicht für Gäste)
    if (!isGuest) {
      await supabaseAdmin
        .from('profiles')
        .update({ credits: profile.credits - requiredCredits })
        .eq('id', userId)
    }

    // 5. In Generierungs-Datenbank eintragen (damit es getrackt und gesichert werden kann)
    await supabaseAdmin
      .from('generations')
      .insert([
        {
          user_id: userId,
          type: 'remove-bg',
          prompt: 'Background Removal (E-Commerce)',
          input_image: imageUrl,
          prediction_id: prediction.id,
          status: 'starting',
          created_at: new Date()
        }
      ])

    return res.status(200).json({ predictionId: prediction.id, creditsLeft: isGuest ? profile.credits : profile.credits - requiredCredits })
  } catch (err) {
    console.error('Fehler bei Hintergrundentfernung:', err)
    return res.status(500).json({ error: err.message || 'Fehler beim Starten der Hintergrundentfernung.' })
  }
}
