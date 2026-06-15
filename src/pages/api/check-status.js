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
      const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output

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
