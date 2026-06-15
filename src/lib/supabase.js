import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Ruft das aktuelle Credit-Guthaben eines Benutzers ab.
 * Wenn der Benutzer noch keinen Eintrag in der Profile-Tabelle hat,
 * wird ein Standardprofil mit Start-Credits erstellt.
 */
export async function getUserCredits(userId) {
  if (!userId) return 0;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Profil existiert noch nicht, erstelle es mit 10 Start-Credits
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: userId, credits: 10 }])
          .select('credits')
          .single()
          
        if (createError) throw createError;
        return newProfile.credits;
      }
      throw error;
    }
    
    return data.credits;
  } catch (err) {
    console.error('Fehler beim Laden der Credits:', err)
    return 0;
  }
}
