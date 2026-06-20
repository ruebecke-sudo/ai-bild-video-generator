import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import { Check, Zap, Sparkles, CreditCard, Video, Globe, Book, BookOpen, ArrowLeft, ShoppingBag, Coins } from 'lucide-react'

// WICHTIG: Ersetze diese Platzhalter durch deine echten Stripe Price IDs aus deinem Dashboard (Abonnements)
const SUBSCRIPTION_PLANS = [
  {
    name: 'Basic',
    description: 'Für den regelmäßigen Bedarf und Einstieg.',
    popular: false,
    icon: Zap,
    monthly: {
      price: '6.99',
      credits: 200,
      priceId: 'price_1TjxIBCNQcSoGQI6PAqZOJEA', // Stripe monatlicher Basic Price ID
      features: [
        '200 Credits inklusive',
        'Entspricht 40 Videos oder 299 Bildern',
        'Standard-Verarbeitungsgeschwindigkeit',
        'Bild & Video-Ausgabe in HD (bis 720p)',
        'Persönliche Nutzungslizenz',
      ],
    },
    yearly: {
      price: '70.00', // 12 * 6,99 € = 83,88 €, abzüglich 15% = 71,29 €, abgerundet auf gerade Zahl
      credits: 2400, // 200 * 12
      priceId: 'price_1TjxLbCNQcSoGQI6bypb7uT1', // Stripe jährlicher Basic Price ID
      features: [
        '2.400 Credits inklusive',
        'Entspricht 480 Videos oder 3.588 Bildern',
        'Standard-Verarbeitungsgeschwindigkeit',
        'Bild & Video-Ausgabe in HD (bis 720p)',
        'Persönliche Nutzungslizenz',
      ],
    }
  },
  {
    name: 'Pro',
    description: 'Für anspruchsvolle Anwender und Creator.',
    popular: true,
    icon: Sparkles,
    monthly: {
      price: '17.99',
      credits: 700,
      priceId: 'price_1TjxPFCNQcSoGQI608gwHihE', // Stripe monatlicher Pro Price ID
      features: [
        '700 Credits inklusive',
        'Entspricht 140 Videos oder 700 Bildern',
        'Priorisierte Generierung (Schneller)',
        'Full-HD-Ausgabe (1080p) & Enhance-Funktion',
        'Kommerzielle Nutzungslizenz',
        'Premium-Support',
      ],
    },
    yearly: {
      price: '182.00', // 12 * 17,99 € = 215,88 €, abzüglich 15% = 183,50 €, abgerundet auf gerade Zahl
      credits: 8400, // 700 * 12
      priceId: 'price_1TjxT9CNQcSoGQI6YP8kYD4W', // Stripe jährlicher Pro Price ID
      features: [
        '8.400 Credits inklusive',
        'Entspricht 1.680 Videos oder 8.400 Bildern',
        'Priorisierte Generierung (Schneller)',
        'Full-HD-Ausgabe (1080p) & Enhance-Funktion',
        'Kommerzielle Nutzungslizenz',
        'Premium-Support',
      ],
    }
  }
]

const PREPAID_PLANS = [
  {
    name: 'Starter',
    price: '3.99',
    credits: 100,
    priceId: 'price_1TjFkECNQcSoGQI6fSGQOCOS', // Stripe Live Price-ID Starter
    description: 'Der perfekte Einstieg zum Testen.',
    features: [
      '100 Credits (~20 Videos oder 100 Bilder)',
      'Standard-Verarbeitungsgeschwindigkeit',
      'Bild & Video-Ausgabe in HD (720p)',
      'Persönliche Nutzungslizenz',
    ],
    popular: false,
    icon: Zap,
  },
  {
    name: 'Pro (Einmalig)',
    price: '8.99',
    credits: 350,
    priceId: 'price_1TjFmLCNQcSoGQI6o9opPfQ3', // Stripe Live Price-ID Pro
    description: 'Für Content-Creator und professionelle Ansprüche.',
    features: [
      '350 Credits (~70 Videos oder 350 Bilder)',
      'Priorisierte Generierung (Schneller)',
      'Full-HD-Ausgabe (1080p) & Enhance-Funktion',
      'Kommerzielle Nutzungslizenz',
      'Premium-Support',
    ],
    popular: true,
    icon: Sparkles,
  },
  {
    name: 'Elite',
    price: '20.99',
    credits: 1000,
    priceId: 'price_1TjFnFCNQcSoGQI6g2BpmUzI', // Stripe Live Price-ID Elite
    description: 'Das ultimative Paket für Power-User.',
    features: [
      '1000 Credits (~200 Videos oder 1000 Bilder)',
      'Höchste Priorität in der Warteschlange',
      'Full-HD-Ausgabe (1080p) & Maximale Qualität',
      'Kommerzielle Lizenz & API-Zugang',
      'Exklusiver VIP-Support',
    ],
    popular: false,
    icon: Video,
  },
]

export default function Pricing() {
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'monthly' oder 'yearly'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Falls Gastzugang, schalten wir direkt alles frei
        if (session.user.email === 'gast@my-digital-world.de') {
          setCredits(9999)
          return
        }

        supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setCredits(data.credits)
            }
          })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setCredits(0)
      } else {
        if (session.user.email === 'gast@my-digital-world.de') {
          setCredits(9999)
        } else {
          supabase
            .from('profiles')
            .select('credits')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setCredits(data.credits)
              }
            })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleCheckout = async (plan, currentPeriodData) => {
    if (!user) {
      alert('Bitte melde dich zuerst an, um ein Paket zu abonnieren!')
      return
    }

    setLoadingPlan(plan.name)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: currentPeriodData.priceId,
          userId: user.id,
          credits: currentPeriodData.credits,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Fehler beim Starten des Bezahlvorgangs: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Verbindungsfehler.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)' }}>
      <Head>
        <title>Preise & Abonnements - Günstig KI Videos erstellen | AI Video Generator</title>
        <meta name="description" content="Wähle dein passendes Abonnement. Basic oder Pro mit monatlicher oder jährlicher Abrechnung (15% Rabatt) für professionelle KI-Medien-Generierung." />
        <meta name="robots" content="index, follow" />
      </Head>
      <header className="header">
        <Link href="/" className="brand">
          <span>AI Bild & Videogenerator</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/ecommerce" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ShoppingBag size={16} /> E-Commerce
          </Link>
          <Link href="/gallery" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Globe size={16} /> Community-Galerie
          </Link>
          <Link href="/prompts" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Book size={16} /> Exkl. Prompt-Generator
          </Link>
          <Link href="/manual" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <BookOpen size={16} /> Anleitung
          </Link>
          
          {user && (
            user.email === 'gast@my-digital-world.de' ? (
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', borderColor: 'var(--secondary)' }}>
                <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary)' }}>Demo-Modus</span>
              </div>
            ) : (
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px' }}>
                <Coins size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{credits} Credits</span>
              </div>
            )
          )}

          <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ArrowLeft size={16} /> Zum Generator
          </Link>
        </div>
      </header>

      <main className="main-content" style={{ maxWidth: '1200px' }}>
        <div style={{ textAlign: 'center', margin: '3rem 0 2rem 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Wähle dein Abonnement
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Profitiere von monatlichen Credits ohne Limits. Jederzeit kündbar.
          </p>

          {/* Stylischer Abrechnungs-Umschalter */}
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-input)', padding: '6px', borderRadius: '50px', border: '1px solid var(--border-color)', position: 'relative', marginBottom: '2rem' }}>
            <button 
              onClick={() => setBillingPeriod('monthly')}
              style={{
                background: billingPeriod === 'monthly' ? 'var(--gradient-neon)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '8px 24px',
                borderRadius: '50px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Monatlich
            </button>
            <button 
              onClick={() => setBillingPeriod('yearly')}
              style={{
                background: billingPeriod === 'yearly' ? 'var(--gradient-neon)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '8px 24px',
                borderRadius: '50px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Jährlich
              <span style={{ fontSize: '0.75rem', background: '#22c55e', color: '#fff', padding: '2px 8px', borderRadius: '50px', fontWeight: 800 }}>-15%</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const Icon = plan.icon
            const currentPeriodData = plan[billingPeriod]
            return (
              <div 
                key={plan.name} 
                className="glass-panel" 
                style={{ 
                  padding: '2.5rem', 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: plan.popular ? 'var(--shadow-neon)' : 'var(--shadow-premium)'
                }}
              >
                {plan.popular && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    background: 'var(--gradient-neon)', 
                    color: '#fff', 
                    padding: '4px 16px', 
                    borderRadius: '50px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Empfohlen
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{ background: plan.popular ? 'var(--gradient-neon)' : 'var(--bg-input)', padding: '10px', borderRadius: '10px' }}>
                    <Icon size={24} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{plan.name}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{plan.description}</p>
                  </div>
                </div>

                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>€{currentPeriodData.price}</span>
                  <span style={{ color: 'var(--text-muted)' }}>/{billingPeriod === 'monthly' ? 'Monat' : 'Jahr'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(168, 85, 247, 0.15)', padding: '10px 15px', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentPeriodData.credits} Credits inklusive</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem', flex: 1 }}>
                  {currentPeriodData.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleCheckout(plan, currentPeriodData)}
                  disabled={loadingPlan === plan.name}
                  className="btn-gold" 
                  style={{ width: '100%', background: plan.popular ? 'var(--gradient-neon)' : 'var(--gradient-gold)' }}
                >
                  {loadingPlan === plan.name ? 'Verbinde...' : (billingPeriod === 'monthly' ? 'Monatlich abonnieren' : 'Jährlich abonnieren')}
                </button>
              </div>
            )
          })}
        </div>

        {/* NEU: Sektion für Einmalige Credit-Aufladungen */}
        <div style={{ textAlign: 'center', margin: '6rem 0 3rem 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Einmalige Credit-Aufladungen
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Lade deine Credits ganz flexibel auf – ohne Vertragsbindung, ohne monatliche Fixkosten.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {PREPAID_PLANS.map((plan) => {
            const Icon = plan.icon
            return (
              <div 
                key={plan.name} 
                className="glass-panel" 
                style={{ 
                  padding: '2.5rem', 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: plan.popular ? 'var(--shadow-neon)' : 'var(--shadow-premium)'
                }}
              >
                {plan.popular && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    background: 'var(--gradient-neon)', 
                    color: '#fff', 
                    padding: '4px 16px', 
                    borderRadius: '50px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Beliebt
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{ background: plan.popular ? 'var(--gradient-neon)' : 'var(--bg-input)', padding: '10px', borderRadius: '10px' }}>
                    <Icon size={24} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{plan.name}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{plan.description}</p>
                  </div>
                </div>

                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>€{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)' }}>einmalig</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(168, 85, 247, 0.15)', padding: '10px 15px', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{plan.credits} Credits inklusive</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem', flex: 1 }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleCheckout(plan, plan)}
                  disabled={loadingPlan === plan.name}
                  className="btn-gold" 
                  style={{ width: '100%', background: plan.popular ? 'var(--gradient-neon)' : 'var(--gradient-gold)' }}
                >
                  {loadingPlan === plan.name ? 'Verbinde...' : 'Einmalig aufladen'}
                </button>
              </div>
            )
          })}
        </div>

        {/* NEU: Sektion für Nischen-Prompt-Pakete */}
        <div id="nischen-pricing" style={{ marginTop: '6rem', marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Exklusive Nischen-Prompt-Pakete
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              Du möchtest sofort professionelle Ergebnisse ohne langes Ausprobieren? Sichere dir unsere maßgeschneiderten Prompt-Pakete für Winzer, Immobilienmakler, Hochzeiten und mehr.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Paket 1: 1 Nische - 20 Prompts */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '10px' }}>
                  <Sparkles size={20} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1 Nische - 20</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Einstieg für eine Kategorie</p>
                </div>
              </div>

              <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>€7.99</span>
                <span style={{ color: 'var(--text-muted)' }}>einmalig</span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem', flex: 1 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>1 Nischen-Kategorie nach Wahl</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>20 exklusive Prompts</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>Bild- & Video-Prompts</span>
                </li>
              </ul>

              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: '1 Nische - 20 Prompts', priceId: 'price_1TjFpmCNQcSoGQI6fkHIYXgW', credits: 200 })}>
                Wählen
              </button>
            </div>
 
            {/* Paket 2: 1 Nische - 40 Prompts */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '10px' }}>
                  <Zap size={20} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1 Nische - 40</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Mehr Auswahl für deine Nische</p>
                </div>
              </div>
 
              <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>€13.99</span>
                <span style={{ color: 'var(--text-muted)' }}>einmalig</span>
              </div>
 
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem', flex: 1 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>1 Nischen-Kategorie nach Wahl</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>40 exklusive Prompts</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>Lebenslange Updates für diese Nische</span>
                </li>
              </ul>
 
              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: '1 Nische - 40 Prompts', priceId: 'price_1TjFqpCNQcSoGQI6LYRwAN0i', credits: 400 })}>
                Wählen
              </button>
            </div>
 
            {/* Paket 3: 3 Nischen - 60 Prompts */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '2px solid #3b82f6', boxShadow: '0 0 15px rgba(59, 130, 246, 0.25)', position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                top: '-12px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                color: '#fff', 
                padding: '2px 12px', 
                borderRadius: '50px', 
                fontSize: '0.75rem', 
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                Top Deal
              </span>
 
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.25)', padding: '10px', borderRadius: '10px' }}>
                  <Video size={20} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>3 Nischen - 60</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Für vielseitige Dienstleister</p>
                </div>
              </div>
 
              <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>€19.99</span>
                <span style={{ color: 'var(--text-muted)' }}>einmalig</span>
              </div>
 
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem', flex: 1 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>3 Nischen-Kategorien frei wählbar</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>60 exklusive Prompts</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>Kommerzielle Nutzung inklusive</span>
                </li>
              </ul>
 
              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: '3 Nischen - 60 Prompts', priceId: 'price_1TjFtwCNQcSoGQI6YEiB8DDz', credits: 600 })}>
                Bundle sichern
              </button>
            </div>
 
            {/* Paket 4: All Access - 840 Prompts */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '10px' }}>
                  <Sparkles size={20} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>All Access</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Voller Zugriff auf alle Ideen</p>
                </div>
              </div>

              <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>€39.99</span>
                <span style={{ color: 'var(--text-muted)' }}>einmalig</span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem', flex: 1 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>Alle 14 Kategorien vollständig freigeschaltet</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>840 exklusive Prompts (420 Bilder / 420 Videos)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Check size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <span>Alle aktuellen & zukünftigen Nischen</span>
                </li>
              </ul>

              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: 'All Access - 840 Prompts', priceId: 'price_1TjFvNCNQcSoGQI6psW8GZ25', credits: 1400 })}>
                All-Access sichern
              </button>
            </div>
          </div>


          {/* NEU: Übersicht aller 14 Prompt-Kategorien */}
          <div className="glass-panel" style={{ marginTop: '4rem', padding: '3rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Nischen-Kategorien
            </h3>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
              Bis zu 60 exklusive Prompts für Bild & Videogenerierung je Kategorie. Klicke auf eine Nische, um das Paket einzeln freizuschalten (1 Nische für 7,99 €) oder sichere dir oben das All-Access-Bundle.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[
                { id: 'winzer', name: 'Winzer & Weinberge', icon: '🍇' },
                { id: 'immo', name: 'Immobilienmakler', icon: '🏠' },
                { id: 'hochzeit', name: 'Hochzeit', icon: '💍' },
                { id: 'strand', name: 'Strandmotive', icon: '🏖️' },
                { id: 'urlaub', name: 'Urlaubsmotive', icon: '✈️' },
                { id: 'lostplaces', name: 'Lost Places', icon: '🏚️' },
                { id: 'schloesser', name: 'Schlösser & Burgen', icon: '🏰' },
                { id: 'food', name: 'Food & Gastronomie', icon: '🍔' },
                { id: 'fitness', name: 'Fitness & Sport', icon: '🏋️' },
                { id: 'auto', name: 'Automotive & Autos', icon: '🏎️' },
                { id: 'socialmedia', name: 'Social Media', icon: '📱' },
                { id: 'nature', name: 'Natur & Landschaften', icon: '🏔️' },
                { id: 'cyberpunk', name: 'Cyberpunk & Sci-Fi', icon: '👾' },
                { id: 'artistic', name: 'Kunst & Abstrakt', icon: '🎨' },
                { id: 'custom_prompts', name: 'Eigene Prompts', icon: '✨', isCustom: true }
              ].map((item, index) => {
                if (item.isCustom) {
                  return (
                    <Link 
                      key={index} 
                      href="/prompts"
                      className="hover-scale"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        background: 'rgba(249, 115, 22, 0.08)', 
                        padding: '12px 18px', 
                        borderRadius: '10px', 
                        border: '2px solid var(--secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textDecoration: 'none'
                      }}
                      title="Eigene exklusive Nischenprompts generieren"
                    >
                      <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>{item.name}</span>
                        <span style={{ color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: 800 }}>KI-Prompt Generator</span>
                      </div>
                    </Link>
                  )
                }
                return (
                  <div 
                    key={index} 
                    onClick={() => handleCheckout({ name: `Nische - ${item.name}`, priceId: 'price_1TjFpmCNQcSoGQI6fkHIYXgW', credits: 200, categoryId: item.id })}
                    className="hover-scale"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      background: 'rgba(168, 85, 247, 0.05)', 
                      padding: '12px 18px', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title={`Nischenpaket "${item.name}" jetzt freischalten`}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                      <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>Einzeln freischalten</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
