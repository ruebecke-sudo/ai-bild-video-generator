import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import { 
  Globe, 
  Book, 
  BookOpen, 
  ArrowLeft, 
  Coins, 
  CheckCircle, 
  Sparkles, 
  Copy, 
  Check, 
  ShoppingBag,
  Image as ImageIcon,
  Video,
  ArrowRight
} from 'lucide-react'

const PRODUCT_PROMPTS = [
  {
    title: "Edle Spirituosen & Getränke (Whiskey, Gin etc.)",
    desc: "Platziert Flaschen in einem edlen, warmen Bar-Ambiente mit stimmungsvollem Rauch.",
    prompt: "High-end commercial product photography of an amber whiskey glass bottle, placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind the bottle. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting.",
    translation: "Hochwertige kommerzielle Produktfotografie einer bernsteinfarbenen Whiskey-Glasflasche auf einer dunklen, polierten Marmorbar. Daneben ein Kristallglas mit Eis. Dramatischer goldener Rauch steigt hinter der Flasche auf. Luxuriöser Bar-Hintergrund mit warmen Lichtern.",
    type: "image"
  },
  {
    title: "Parfüm & Kosmetik (Wellness & Luxus)",
    desc: "Platziert Tiegel, Tuben und Flakons auf nassen Steinen mit natürlichen Lichtstrahlen.",
    prompt: "Minimalist luxury product photography of perfume bottle, standing on a wet dark volcanic rock plate with water droplets. Volumetric sunlight rays piercing through dark sand, elegant stone blocks, packaging, cinematic shadows, highly detailed.",
    translation: "Minimalistische Luxus-Produktfotografie einer Parfümflasche auf einer nassen, dunklen Vulkansteinplatte mit Wassertropfen. Sonnenstrahlen scheinen durch dunklen Sand, elegante Steinblöcke, filmische Schatten.",
    type: "image"
  },
  {
    title: "Sneaker & Streetwear (Dynamisch & Modern)",
    desc: "Lässt Sneaker und Kleidung mit explodierenden Farb- und Wassereffekten in der Luft schweben.",
    prompt: "Professional studio commercial shot of a brand new sneaker, floating in mid-air. Splashes of colorful neon water and liquid paint exploding around the shoe. Dark background with blue and purple studio backlighting, high speed action photography, sharp details.",
    translation: "Professionelles Studio-Werbebild eines brandneuen Sneakers, der in der Luft schwebt. Bunte Neon-Wasserspritzer und flüssige Farbe explodieren um den Schuh. Dunkler Hintergrund mit blau-violetter Beleuchtung.",
    type: "image"
  }
]

export default function EcommerceLanding() {
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [copiedText, setCopiedText] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
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
            if (data) setCredits(data.credits)
          })
      }
    })
  }, [])

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(''), 2500)
  }

  const handleUsePrompt = (text, type) => {
    sessionStorage.setItem('selected_prompt_text', text)
    sessionStorage.setItem('selected_prompt_type', type)
    window.location.href = '/'
  }

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Head>
        <title>KI-Produktfotografie für Onlineshops - E-Commerce Werbebilder | AI Video Generator</title>
        <meta name="description" content="Erstelle aus einfachen Produktfotos spektakuläre Werbebilder und Videos für deinen Onlineshop. Fotostudio-Qualität auf Knopfdruck dank modernster KI." />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Header */}
      <header className="header">
        <Link href="/" className="brand">
          <span>AI Bild & Videogenerator</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/ecommerce" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
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
          <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
            Preise
          </Link>
          
          {user ? (
            <>
              {user.email === 'gast@my-digital-world.de' ? (
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', borderColor: 'var(--secondary)' }}>
                  <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary)' }}>Demo-Modus</span>
                </div>
              ) : (
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px' }}>
                  <Coins size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{credits} Credits</span>
                </div>
              )}
              <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <ArrowLeft size={16} /> Zum Generator
              </Link>
            </>
          ) : (
            <Link href="/" className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Anmelden
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', margin: '4rem 0 3rem 0' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(249, 115, 22, 0.1)', padding: '6px 14px', borderRadius: '20px' }}>
            Für Onlineshops, Shopify & Amazon Seller 🛍️
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '1.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.2' }}>
            Erstelle spektakuläre Produktbilder ohne teures Fotostudio
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Lade einfach dein Produktfoto hoch, wähle einen Prompt und lasse die KI einen luxuriösen, verkaufsstarken Hintergrund generieren. Perfekt geeignet für Instagram Ads, Shopify-Banner und Marketingkampagnen.
          </p>
        </div>

        {/* Vorher Nachher Showcase */}
        <div className="glass-panel features-grid" style={{ padding: '3.5rem', marginBottom: '4rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-neon)' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.2rem' }}>
              Wie aus einem einfachen Foto ein High-End-Werbemotiv wird
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Bisher musstest du für professionelle Aufnahmen teure Fotografen buchen, Dekorationen kaufen und stundenlang nachbearbeiten. 
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.8rem' }}>
              Unsere App nimmt dein Produktbild (vorzugsweise mit transparentem oder weißem Hintergrund) und verschmilzt es nahtlos mit einem neu generierten 3D-Hintergrund, inklusive realistischer Schatten, Spiegelungen und Lichteffekte.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} style={{ color: 'var(--secondary)' }} />
                <span><strong>95% Kostenersparnis:</strong> Keine Mietstudios oder teure Ausrüstung nötig.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} style={{ color: 'var(--secondary)' }} />
                <span><strong>Sekundenschnelle Ergebnisse:</strong> Variiere Hintergründe passend zur Jahreszeit.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} style={{ color: 'var(--secondary)' }} />
                <span><strong>Kommerzielle Lizenz:</strong> Alle Ergebnisse gehören dir und dürfen kommerziell genutzt werden.</span>
              </div>
            </div>

            <Link href="/" className="btn-gold" style={{ background: 'var(--gradient-gold)', textDecoration: 'none', display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
              <Sparkles size={16} />
              Jetzt zum Generator & ausprobieren
            </Link>
          </div>

          {/* Vorher / Nachher Visuell */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' }}>
              
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>1. Vorher (Dein Foto)</span>
                <div className="glass-panel" style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <img 
                    src="/whiskey-before.png" 
                    alt="Whiskey Vorher" 
                    style={{ width: '100%', height: '220px', objectFit: 'contain', borderRadius: '8px' }} 
                  />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary)', display: 'block', marginBottom: '8px' }}>2. Nachher (KI-Studio)</span>
                <div className="glass-panel" style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 0 15px rgba(249, 115, 22, 0.15)' }}>
                  <img 
                    src="/whiskey-after.png" 
                    alt="Whiskey Nachher" 
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                </div>
              </div>

            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center' }}>
              Beispiel: Aus einer freigestellten Flasche wird mit einem Klick ein verkaufsstarkes Werbemotiv.
            </div>
          </div>
        </div>

        {/* E-Commerce Prompts List */}
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
            Professionelle E-Commerce Prompts zum Kopieren
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {PRODUCT_PROMPTS.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-panel"
                style={{ 
                  padding: '2rem',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(30, 41, 66, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>{item.title}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Vorlage #{idx + 1}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{item.desc}</p>
                </div>

                {/* Deutsche Übersetzung */}
                <div style={{ 
                  userSelect: 'none', 
                  WebkitUserSelect: 'none', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.9rem', 
                  background: 'rgba(255,255,255,0.02)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  borderLeft: '3px solid var(--secondary)'
                }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>{item.translation}</p>
                </div>

                {/* Englischer Prompt */}
                <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  {item.prompt}
                </p>

                {/* Aktionen */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleCopyPrompt(item.prompt)}
                    className="btn-outline"
                    style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 18px' }}
                  >
                    {copiedText === item.prompt ? (
                      <>
                        <Check size={16} style={{ color: '#22c55e' }} />
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Prompt kopieren
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleUsePrompt(item.prompt, item.type)}
                    className="btn-gold"
                    style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 18px', background: 'var(--gradient-gold)' }}
                  >
                    <Sparkles size={16} />
                    In Generator laden
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '2rem 0', 
        marginTop: '6rem', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        gap: '10px',
        fontSize: '0.9rem', 
        color: 'var(--text-dim)' 
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/impressum" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Impressum</Link>
          <Link href="/datenschutz" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Datenschutz</Link>
          <Link href="/manual" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Anleitung (PDF)</Link>
        </div>
        <div>
          <span>© www.my-digital-world 2026 | info@my-digital-world.de</span>
        </div>
      </footer>
    </div>
  )
}
