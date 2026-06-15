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

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'sofort', 'giropay'],
      line_items: [
        {
          price: priceId, // Stripe Price ID (z.B. starter, pro etc.)
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        userId: userId,
        credits: credits.toString()
      },
      success_url: `${req.headers.origin}/?payment=success`,
      cancel_url: `${req.headers.origin}/pricing?payment=cancelled`,
    })

    return res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe Checkout Fehler:', err)
    return res.status(500).json({ error: err.message || 'Stripe Session konnte nicht erstellt werden.' })
  }
}
