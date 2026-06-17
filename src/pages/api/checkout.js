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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'sofort', 'giropay'],
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        userId: userId,
        credits: credits.toString(),
        categoryId: req.body.categoryId || ''
      },
      success_url: `${req.headers.origin}/?payment=success&category=${req.body.categoryId || ''}`,
      cancel_url: `${req.headers.origin}/pricing?payment=cancelled`,
    })

    return res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe Checkout Fehler:', err)
    return res.status(500).json({ error: err.message || 'Stripe Session konnte nicht erstellt werden.' })
  }
}
