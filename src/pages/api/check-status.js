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
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Prediction ID fehlt.' })
  }

  try {
    const prediction = await replicate.predictions.get(id)

    // Falls fertiggestellt, aktualisiere den Status in unserer Datenbank
    if (prediction.status === 'succeeded') {
      let outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output

      // Versuche, das Medium dauerhaft in Supabase Storage zu sichern
      try {
        const fileResponse = await fetch(outputUrl)
        if (fileResponse.ok) {
          const arrayBuffer = await fileResponse.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const contentType = fileResponse.headers.get('content-type') || ''
          
          // Bestimme Dateiendung basierend auf Content-Type
          const ext = contentType.includes('video') ? 'mp4' : 'webp'
          const fileName = `${id}.${ext}`

          const { error: uploadError } = await supabaseAdmin.storage
            .from('generations')
            .upload(fileName, buffer, {
              contentType: contentType || (contentType.includes('video') ? 'video/mp4' : 'image/webp'),
              upsert: true
            })

          if (!uploadError) {
            const { data: { publicUrl } } = supabaseAdmin.storage
              .from('generations')
              .getPublicUrl(fileName)
            outputUrl = publicUrl
            console.log('Erfolgreich in Supabase Storage gesichert:', publicUrl)
          } else {
            console.error('Supabase Storage Upload Fehler:', uploadError)
          }
        }
      } catch (uploadErr) {
        console.error('Fehler beim Herunterladen/Speichern des Mediums:', uploadErr)
      }

      await supabaseAdmin
        .from('generations')
        .update({
          status: 'succeeded',
          output_url: outputUrl,
          completed_at: new Date()
        })
        .eq('prediction_id', id)
    } else if (prediction.status === 'failed') {
      await supabaseAdmin
        .from('generations')
        .update({
          status: 'failed',
          completed_at: new Date()
        })
        .eq('prediction_id', id)
    }

    return res.status(200).json(prediction)
  } catch (err) {
    console.error('Fehler beim Statusabruf:', err)
    return res.status(500).json({ error: err.message || 'Fehler beim Abrufen des Status.' })
  }
}
