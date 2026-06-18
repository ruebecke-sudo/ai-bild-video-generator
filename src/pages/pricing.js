import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import { Check, Zap, Sparkles, CreditCard, Video, Globe, Book, BookOpen, ArrowLeft, ShoppingBag } from 'lucide-react'

// WICHTIG: Ersetze diese Platzhalter durch deine echten Stripe Price IDs aus deinem Dashboard (Test-Modus oder Live-Modus)
// Erstelle dafür in Stripe ein Produkt (z.B. "Starter Paket", 3.99€ Einmalzahlung) und kopiere die Preis-ID (beginnt mit price_...)
const PLANS = [
  {
    name: 'Starter',
    price: '3.99',
    credits: 100,
    priceId: 'prod_Uih8x4OpHVszWh', // 3,99 €
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
    name: 'Pro (Empfohlen)',
    price: '8.99',
    credits: 350,
    priceId: 'prod_UihAz4aPM1AZJ6', // 8,99 €
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
    priceId: 'prod_UihBUKHr6GOhtp', // 20,99 €
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
  const [loadingPlan, setLoadingPlan] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleCheckout = async (plan) => {
    if (!user) {
      alert('Bitte melde dich zuerst an, um Credits zu erwerben!')
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
          priceId: plan.priceId,
          userId: user.id,
          credits: plan.credits,
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
        <title>Preise & Credit-Pakete - Günstig KI Videos erstellen | AI Video Generator</title>
        <meta name="description" content="Lade deine Credits flexibel ohne Abo-Zwang auf. Starter, Pro und Elite Pakete sowie exklusive Nischenprompts für professionelle KI-Medien-Generierung." />
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
            <Book size={16} /> Nischenprompts
          </Link>
          <Link href="/manual" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <BookOpen size={16} /> Anleitung
          </Link>
          <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ArrowLeft size={16} /> Zum Generator
          </Link>
        </div>
      </header>

      <main className="main-content" style={{ maxWidth: '1200px' }}>
        <div style={{ textAlign: 'center', margin: '3rem 0 4rem 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Wähle dein Credit-Paket
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Lade deine Credits zu unschlagbaren Preisen auf. Keine Abo-Falle, zahle nur, was du brauchst.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {PLANS.map((plan) => {
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
                    Bestseller - Top Deal
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
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingPlan === plan.name}
                  className="btn-gold" 
                  style={{ width: '100%', background: plan.popular ? 'var(--gradient-neon)' : 'var(--gradient-gold)' }}
                >
                  {loadingPlan === plan.name ? 'Verbinde...' : 'Jetzt aufladen'}
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

              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: '1 Nische - 20 Prompts', priceId: 'prod_UihEMBqexHpgIQ', credits: 200 })}>
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
 
              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: '1 Nische - 40 Prompts', priceId: 'prod_UihFhuJMf7nsQg', credits: 400 })}>
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
 
              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: '3 Nischen - 60 Prompts', priceId: 'prod_UihIJxfZVR0Yax', credits: 600 })}>
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

              <button className="btn-gold" style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }} onClick={() => handleCheckout({ name: 'All Access - 840 Prompts', priceId: 'prod_UihKEAStIdM6RJ', credits: 1400 })}>
                All-Access sichern
              </button>
            </div>
          </div>

          {/* NEU: Übersicht aller 14 Prompt-Kategorien */}
          <div className="glass-panel" style={{ marginTop: '4rem', padding: '3rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Enthaltene Nischen-Kategorien im All-Access Paket
            </h3>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
              Jede Kategorie enthält genau 30 professionell ausformulierte Bild-Prompts und 30 Video-Prompts (insgesamt 60 Prompts pro Nische).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[
                { name: 'Winzer & Weinberge', icon: '🍇' },
                { name: 'Immobilienmakler', icon: '🏠' },
                { name: 'Hochzeit', icon: '💍' },
                { name: 'Strandmotive', icon: '🏖️' },
                { name: 'Urlaubsmotive', icon: '✈️' },
                { name: 'Lost Places', icon: '🏚️' },
                { name: 'Schlösser & Burgen', icon: '🏰' },
                { name: 'Food & Gastronomie', icon: '🍔' },
                { name: 'Fitness & Sport', icon: '🏋️' },
                { name: 'Automotive & Autos', icon: '🏎️' },
                { name: 'Social Media', icon: '📱' },
                { name: 'Natur & Landschaften', icon: '🏔️' },
                { name: 'Cyberpunk & Sci-Fi', icon: '👾' },
                { name: 'Kunst & Abstrakt', icon: '🎨' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    background: 'rgba(255, 255, 255, 0.02)', 
                    padding: '12px 18px', 
                    borderRadius: '10px', 
                    border: '1px solid var(--border-color)' 
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                </div>
              ))}
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
                { id: 'artistic', name: 'Kunst & Abstrakt', icon: '🎨' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => handleCheckout({ name: `Nische - ${item.name}`, priceId: 'prod_UihEMBqexHpgIQ', credits: 200, categoryId: item.id })}
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
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
