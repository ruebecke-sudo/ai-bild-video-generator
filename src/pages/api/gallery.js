import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req, res) {
  // GET: Abrufen aller öffentlichen Generierungen
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('generations')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json(data)
    } catch (err) {
      console.error('Fehler beim Laden der Galerie:', err)
      return res.status(500).json({ error: 'Galerie konnte nicht geladen werden.' })
    }
  }

  // POST: Eine Generierung öffentlich machen (is_public = true/false)
  if (req.method === 'POST') {
    const { genId, isPublic, userId } = req.body

    if (!genId || !userId) {
      return res.status(400).json({ error: 'Fehlende Parameter.' })
    }

    try {
      // Sicherheits-Check: Gehört die Generierung dem anfordernden User?
      const { data: gen, error: checkError } = await supabaseAdmin
        .from('generations')
        .select('user_id')
        .eq('id', genId)
        .single()

      if (checkError || !gen) {
        return res.status(404).json({ error: 'Generierung nicht gefunden.' })
      }

      if (gen.user_id !== userId) {
        return res.status(403).json({ error: 'Keine Berechtigung zum Teilen dieser Generierung.' })
      }

      // Aktualisiere den Status
      const { data, error } = await supabaseAdmin
        .from('generations')
        .update({ is_public: !!isPublic })
        .eq('id', genId)
        .select()
        .single()

      if (error) throw error

      return res.status(200).json({ success: true, isPublic: data.is_public })
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Teilen-Status:', err)
      return res.status(500).json({ error: 'Teilen-Status konnte nicht geändert werden.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
