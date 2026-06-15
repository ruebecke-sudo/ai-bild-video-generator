import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export const config = {
  api: {
    bodyParser: false, // Deaktiviere Body-Parser für Stripe Signaturverifikation
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const reqBuffer = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, endpointSecret)
  } catch (err) {
    console.error(`Webhook Signaturfehler: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Behandle das Checkout Session Completed Event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.metadata.userId
    const creditsToAdd = parseInt(session.metadata.credits, 10)

    if (userId && !isNaN(creditsToAdd)) {
      try {
        // Lade das aktuelle Profil des Nutzers
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single()

        const currentCredits = profile ? profile.credits : 0

        // Aktualisiere oder erstelle das Profil mit den neuen Credits
        const { error } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            credits: currentCredits + creditsToAdd,
            updated_at: new Date()
          })

        if (error) throw error;
        console.log(`Erfolgreich ${creditsToAdd} Credits zu Benutzer ${userId} hinzugefügt.`)
      } catch (dbError) {
        console.error('Fehler beim Aktualisieren der Credits in Supabase:', dbError)
        return res.status(500).json({ error: 'Datenbank-Aktualisierung fehlgeschlagen.' })
      }
    }
  }

  return res.status(200).json({ received: true })
}
