import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { priceId, userId, credits } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'Bitte melde dich an, um Credits zu kaufen.' })
  }

  let resolvedPriceId = priceId

  if (!priceId) {
    return res.status(400).json({ error: 'Keine Price-ID oder Product-ID übergeben.' })
  }

  try {
    let mode = 'payment'

    // Falls eine Product-ID übergeben wurde (startet mit prod_), holen wir uns den aktiven Preis dafür
    if (priceId.startsWith('prod_')) {
      const prices = await stripe.prices.list({
        product: priceId,
        active: true,
        limit: 1,
      })
      if (prices.data.length === 0) {
        throw new Error(`Kein aktiver Preis für Produkt ${priceId} gefunden.`)
      }
      resolvedPriceId = prices.data[0].id
    }

    // Überprüfen, ob es sich um einen wiederkehrenden Preis (Abo) handelt
    try {
      if (resolvedPriceId.startsWith('price_')) {
        const priceDetails = await stripe.prices.retrieve(resolvedPriceId)
        if (priceDetails && priceDetails.type === 'recurring') {
          mode = 'subscription'
        }
      }
    } catch (e) {
      console.warn('Preis-Typ konnte nicht bestimmt werden, fahre mit payment fort:', e)
    }

    const sessionData = {
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      mode: mode,
      metadata: {
        userId: userId,
        credits: credits.toString(),
        categoryId: req.body.categoryId || ''
      },
      success_url: `${req.headers.origin}/?payment=success&category=${req.body.categoryId || ''}`,
      cancel_url: `${req.headers.origin}/pricing?payment=cancelled`,
    }

    // Bei Subscriptions lassen wir Stripe die optimalen Zahlungsmethoden aus dem Dashboard wählen.
    // Bei Einmalzahlungen verwenden wir die explizite Liste.
    if (mode === 'payment') {
      sessionData.payment_method_types = ['card', 'paypal', 'sofort', 'giropay']
    }

    const session = await stripe.checkout.sessions.create(sessionData)

    return res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe Checkout Fehler:', err)
    return res.status(500).json({ error: err.message || 'Stripe Session konnte nicht erstellt werden.' })
  }
}
