import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { categoryId, userId } = req.body

  if (!userId || !categoryId) {
    return res.status(400).json({ error: 'Fehlende Parameter.' })
  }

  try {
    // 1. Credits und freigeschaltete Kategorien abfragen
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits, unlocked_categories')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return res.status(400).json({ error: 'Profil nicht gefunden.' })
    }

    // Falls Kategorie bereits freigeschaltet ist
    const unlocked = Array.isArray(profile.unlocked_categories) ? profile.unlocked_categories : []
    if (unlocked.includes(categoryId)) {
      return res.status(200).json({ message: 'Bereits freigeschaltet.', unlockedCategories: unlocked, creditsLeft: profile.credits })
    }

    // Eine Nische kostet z. B. 50 Credits
    const unlockCost = 50

    if (profile.credits < unlockCost) {
      return res.status(402).json({ error: `Nicht genügend Credits. Das Freischalten einer Nische kostet ${unlockCost} Credits.` })
    }

    const updatedUnlocked = [...unlocked, categoryId]

    // 2. Credits abziehen und Kategorie hinzufügen
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        credits: profile.credits - unlockCost,
        unlocked_categories: updatedUnlocked
      })
      .eq('id', userId)

    if (updateError) {
      throw updateError
    }

    return res.status(200).json({ 
      message: 'Erfolgreich freigeschaltet!', 
      unlockedCategories: updatedUnlocked, 
      creditsLeft: profile.credits - unlockCost 
    })
  } catch (err) {
    console.error('Nischen-Freischaltung Fehler:', err)
    return res.status(500).json({ error: err.message || 'Freischaltung fehlgeschlagen.' })
  }
}
