import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { supabase, getUserCredits } from '../lib/supabase'
import { PROMPT_CATEGORIES } from '../lib/promptsData'
import { PROMPT_TRANSLATIONS } from '../lib/translations'
import { 
  Book, 
  BookOpen,
  Image as ImageIcon, 
  Video, 
  Copy, 
  Check, 
  Sparkles, 
  Lock,
  ArrowLeft,
  Tv,
  Coins,
  LogOut,
  HelpCircle,
  ChevronDown,
  Globe,
  ShoppingBag,
  Wand2,
  Loader2,
  Gift
} from 'lucide-react'

export default function PromptsPage() {
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [selectedPromptCategory, setSelectedPromptCategory] = useState(PROMPT_CATEGORIES[0]?.id || '')
  const [activePromptType, setActivePromptType] = useState('image') // 'image', 'video'
  const [copiedPromptText, setCopiedPromptText] = useState('')

  const [unlockedCategories, setUnlockedCategories] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Nischen-Prompt-Assistent States
  const [wizardIndustry, setWizardIndustry] = useState('')
  const [wizardProduct, setWizardProduct] = useState('')
  const [wizardStyle, setWizardStyle] = useState('Elegant & Luxuriös')
  const [wizardType, setWizardType] = useState('image')
  const [isGeneratingWizard, setIsGeneratingWizard] = useState(false)
  const [wizardResult, setWizardResult] = useState(null) // { prompt: '', translation: '' }
  const [wizardError, setWizardError] = useState('')

  const handleGenerateWizardPrompt = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Bitte logge dich ein, um eigene Nischenprompts zu generieren!')
      return
    }
    if (!wizardIndustry.trim() || !wizardProduct.trim()) {
      alert('Bitte fülle Branche und Produkt aus.')
      return
    }
    if (credits < 1) {
      alert('Nicht genügend Credits. Das Generieren von maßgeschneiderten Prompts kostet 1 Credit.');
      return;
    }

    setIsGeneratingWizard(true)
    setWizardError('')
    setWizardResult(null)

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: wizardIndustry,
          product: wizardProduct,
          style: wizardStyle,
          type: wizardType,
          userId: user.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        setWizardResult({
          prompt: data.prompt,
          translation: data.translation
        })
        setCredits(data.creditsLeft)
      } else {
        setWizardError(data.error || 'Fehler beim Generieren des Prompts.')
      }
    } catch (err) {
      console.error(err)
      setWizardError('Netzwerkfehler beim Generieren.')
    } finally {
      setIsGeneratingWizard(false)
    }
  }

  const [isUnlocking, setIsUnlocking] = useState(false)

  const handleUnlockNicheWithCredits = async (categoryId) => {
    if (!user) {
      alert('Bitte logge dich zuerst ein.')
      return
    }
    const cost = 50
    if (credits < cost) {
      alert(`Nicht genügend Credits. Das Freischalten dieser Nische kostet ${cost} Credits. Du hast ${credits} Credits. Bitte lade dein Guthaben auf der Preise-Seite auf.`)
      return
    }

    if (!confirm(`Möchtest du die Kategorie "${activeCategory.name}" für ${cost} Credits freischalten?`)) {
      return
    }

    setIsUnlocking(true)
    try {
      const response = await fetch('/api/unlock-niche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, userId: user.id })
      })

      const data = await response.json()
      if (response.ok) {
        setUnlockedCategories(data.unlockedCategories)
        setCredits(data.creditsLeft)
        alert('Kategorie erfolgreich freigeschaltet!')
      } else {
        alert(data.error || 'Fehler beim Freischalten der Kategorie.')
      }
    } catch (err) {
      console.error(err)
      alert('Verbindungsfehler beim Freischalten.')
    } finally {
      setIsUnlocking(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Falls Gastzugang, schalten wir direkt alles frei
        if (session.user.email === 'gast@my-digital-world.de') {
          setUnlockedCategories(['winzer', 'immo', 'hochzeit', 'strand', 'urlaub', 'lostplaces', 'schloesser', 'food', 'fitness', 'auto', 'socialmedia', 'nature', 'cyberpunk', 'artistic'])
          setCredits(9999)
          setLoadingProfile(false)
          return
        }

        // Verwende getUserCredits für robustes Credit-Laden
        getUserCredits(session.user.id).then(userCredits => {
          setCredits(userCredits)
          
          // unlocked_categories separat laden
          supabase
            .from('profiles')
            .select('unlocked_categories')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data && Array.isArray(data.unlocked_categories)) {
                setUnlockedCategories(data.unlocked_categories)
              }
              setLoadingProfile(false)
            }).catch(() => setLoadingProfile(false))
        })
      } else {
        setLoadingProfile(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setUnlockedCategories([])
        setCredits(0)
      } else {
        if (session.user.email === 'gast@my-digital-world.de') {
          setUnlockedCategories(['winzer', 'immo', 'hochzeit', 'strand', 'urlaub', 'lostplaces', 'schloesser', 'food', 'fitness', 'auto', 'socialmedia', 'nature', 'cyberpunk', 'artistic'])
          setCredits(9999)
        } else {
          getUserCredits(session.user.id).then(userCredits => {
            setCredits(userCredits)
            
            supabase
              .from('profiles')
              .select('unlocked_categories')
              .eq('id', session.user.id)
              .single()
              .then(({ data }) => {
                if (data && Array.isArray(data.unlocked_categories)) {
                  setUnlockedCategories(data.unlocked_categories)
                }
              })
          })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedPromptText(text)
    setTimeout(() => setCopiedPromptText(''), 2500)
  }

  const handleUsePrompt = (text, type) => {
    // Speichere den Prompt und Typ in der Session, damit index.js ihn laden kann
    sessionStorage.setItem('selected_prompt_text', text)
    sessionStorage.setItem('selected_prompt_type', type)
    window.location.href = '/'
  }

  const activeCategory = PROMPT_CATEGORIES.find(c => c.id === selectedPromptCategory) || PROMPT_CATEGORIES[0] || { name: '', icon: '', description: '', images: [], videos: [] }

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)' }}>
      <Head>
        <title>Nischenprompts für KI-Generierung - Vorlagen & Ideen | AI Video Generator</title>
        <meta name="description" content="Entdecke exklusive, professionell optimierte KI-Prompts für deine Branche. Perfekt geeignet für Marketing, Immobilien, Fotografie und Social Media." />
        <meta name="robots" content="index, follow" />
      </Head>
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Bild & Videogenerator
            </span>
          </Link>
          <Link href="/" className="btn-outline" style={{ 
            padding: '6px 14px', 
            fontSize: '0.85rem', 
            display: 'flex', 
            gap: '6px', 
            alignItems: 'center',
            background: 'var(--gradient-neon)',
            color: '#000',
            border: 'none',
            fontWeight: 800,
            boxShadow: 'var(--shadow-neon)',
            borderRadius: '30px',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={14} /> Zum Generator
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/ecommerce" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ShoppingBag size={16} /> E-Commerce
          </Link>
          <Link href="/gallery" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Globe size={16} /> Community-Galerie
          </Link>
          <Link href="/prompts" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Book size={16} /> Exkl. Prompt-Generator
          </Link>
          <Link href="/manual" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <BookOpen size={16} /> Anleitung
          </Link>
          <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
            Preise
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
        </div>
      </header>

      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* GRANDIOSE IDEE: Der Interaktive Nischen-Prompt-Assistent */}
        <section className="glass-panel" style={{ 
          padding: '0', 
          marginBottom: '4rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          overflow: 'hidden', 
          border: '2px solid var(--secondary)', 
          boxShadow: 'var(--shadow-neon)',
          background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.95) 0%, rgba(30, 41, 66, 0.4) 100%)'
        }}>
          {/* Linker Bereich: Das grandiose Vorschau-Bild */}
          <div style={{ position: 'relative', minHeight: '350px', borderRight: '1px solid var(--border-color)' }}>
            <img 
              src="/previews/geschenk_exklusiv.png" 
              alt="Exklusiver Geschenk-Prompt-Assistent" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'var(--gradient-neon)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(168,85,247,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Wand2 size={14} /> NEU: Prompt-Assistent
            </div>
          </div>

          {/* Rechter Bereich: Formular & Generierung */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Sparkles style={{ color: 'var(--secondary)' }} size={24} />
                Eigene exklusive Nischenprompts erstellen
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Du suchst für deine Branche oder deine Produkte die besten Prompts? Hier ist die Lösung! Gib einfach deine Nische und dein Produkt ein und unser KI-Assistent formuliert dir sofort verkaufsstarke Prompts für Bilder und Videos.
              </p>
            </div>

            <form onSubmit={handleGenerateWizardPrompt} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)' }}>Deine Branche / Nische</label>
                  <input 
                    type="text" 
                    required
                    placeholder="z.B. Kaffeerösterei, Zahnarzt" 
                    className="glass-input" 
                    style={{ width: '100%', fontSize: '0.9rem', padding: '10px 12px' }}
                    value={wizardIndustry}
                    onChange={(e) => setWizardIndustry(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)' }}>Exakte Produktbeschreibung</label>
                  <input 
                    type="text" 
                    required
                    placeholder="z.B. Bio-Espresso, Bleaching" 
                    className="glass-input" 
                    style={{ width: '100%', fontSize: '0.9rem', padding: '10px 12px' }}
                    value={wizardProduct}
                    onChange={(e) => setWizardProduct(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)' }}>Gewünschter Stil</label>
                  <select 
                    className="glass-input"
                    style={{ width: '100%', fontSize: '0.9rem', padding: '10px 12px', color: '#fff', background: 'var(--bg-input)' }}
                    value={wizardStyle}
                    onChange={(e) => setWizardStyle(e.target.value)}
                  >
                    <option value="Elegant & Luxuriös">✨ Elegant & Luxuriös</option>
                    <option value="Modern & Minimalistisch">📐 Modern & Minimalistisch</option>
                    <option value="Natürlich & Organisch">🌿 Natürlich & Organisch</option>
                    <option value="Cyberpunk & Neon">👾 Cyberpunk & Neon</option>
                    <option value="Fotorealistisch & Studio">📷 Fotorealistisch & Studio</option>
                    <option value="Klassisch & Rustikal">🪵 Klassisch & Rustikal</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)' }}>Erstellungs-Typ</label>
                  <div style={{ display: 'flex', gap: '6px', height: '100%' }}>
                    <button 
                      type="button" 
                      onClick={() => setWizardType('image')}
                      style={{ flex: 1, padding: '8px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '8px', border: wizardType === 'image' ? '1px solid var(--primary)' : '1px solid var(--border-color)', background: wizardType === 'image' ? 'rgba(168,85,247,0.15)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                    >
                      Bild
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setWizardType('video')}
                      style={{ flex: 1, padding: '8px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '8px', border: wizardType === 'video' ? '1px solid var(--primary)' : '1px solid var(--border-color)', background: wizardType === 'video' ? 'rgba(168,85,247,0.15)' : 'transparent', color: '#fff', cursor: 'pointer' }}
                    >
                      Video
                    </button>
                  </div>
                </div>
              </div>

              {wizardError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px' }}>
                  ⚠️ {wizardError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isGeneratingWizard} 
                className="btn-gold" 
                style={{ 
                  background: 'var(--gradient-neon)', 
                  boxShadow: 'var(--shadow-neon)', 
                  fontWeight: 800, 
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isGeneratingWizard ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Analysiere Nische & Generiere...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Maßgeschneiderten Prompt erstellen (1 Credit)
                  </>
                )}
              </button>
            </form>

            {/* Generierungs-Ergebnis */}
            {wizardResult && (
              <div className="glass-panel" style={{ 
                padding: '1.25rem', 
                background: 'rgba(168, 85, 247, 0.08)', 
                border: '1px solid var(--primary)', 
                borderRadius: '12px',
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deutscher Übersetzungs-Entwurf (Kopierschutz)</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: '4px 0 0 0', userSelect: 'none', WebkitUserSelect: 'none' }}>
                    {wizardResult.translation}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Generierter Englischer Prompt</span>
                  <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '4px 0 0 0' }}>
                    {wizardResult.prompt}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                  <button 
                    onClick={() => handleCopyPrompt(wizardResult.prompt)}
                    className="btn-outline" 
                    style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
                  >
                    {copiedPromptText === wizardResult.prompt ? (
                      <>
                        <Check size={14} style={{ color: '#22c55e' }} /> Kopiert
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Prompt kopieren
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleUsePrompt(wizardResult.prompt, wizardType)}
                    className="btn-gold" 
                    style={{ flex: 1, fontSize: '0.8rem', padding: '8px', display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Sparkles size={14} /> In Generator laden
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <div style={{ textAlign: 'center', margin: '3rem 0 3rem 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Bis zu 140 exklusive Prompts zur Bild & Videoerstellung
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Wähle deine Nische aus, kopiere professionelle Prompts mit einem Klick oder lade sie direkt in dein Generator-Dashboard.
          </p>
        </div>

        {/* Kategorien-Auswahl */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
          {PROMPT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedPromptCategory(cat.id)}
              className={`glass-panel`}
              style={{
                padding: '16px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                border: selectedPromptCategory === cat.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: selectedPromptCategory === cat.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(30, 41, 66, 0.2)',
                transition: 'all 0.2s',
                borderRadius: '12px'
              }}
            >
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '8px' }}>{cat.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Freischalten Button direkt unter der Auswahl */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '3rem' }}>
          {!unlockedCategories.includes(activeCategory.id) ? (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                onClick={() => handleUnlockNicheWithCredits(activeCategory.id)}
                disabled={isUnlocking}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  background: 'var(--gradient-neon)', 
                  color: '#fff', 
                  padding: '14px 28px', 
                  borderRadius: '30px', 
                  fontSize: '1rem', 
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-neon)',
                  transition: 'transform 0.2s',
                  border: 'none',
                  cursor: 'pointer'
                }}
                className="hover-scale"
              >
                <Coins size={16} />
                <span>{isUnlocking ? 'Wird freigeschaltet...' : 'Mit 50 Credits freischalten 🔓'}</span>
              </button>

              <Link href="/pricing#nischen-pricing" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                background: 'var(--gradient-gold)', 
                color: '#fff', 
                padding: '14px 28px', 
                borderRadius: '30px', 
                textDecoration: 'none', 
                fontSize: '1rem', 
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(246, 190, 26, 0.3)',
                transition: 'transform 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
              className="hover-scale"
              >
                <Lock size={16} />
                <span>Paket kaufen / Preise ansehen 💳</span>
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#22c55e',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '0.9rem',
              fontWeight: 700,
              border: '1px solid rgba(34, 197, 94, 0.4)'
            }}>
              <Check size={16} />
              <span>Kategorie freigeschaltet! 🎉</span>
            </div>
          )}
        </div>

        {/* Beschreibung & Vorschau-Bild auf volle Höhe */}
        <div className="glass-panel" style={{ padding: '0', marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {activeCategory.name} {activeCategory.icon}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '10px', lineHeight: '1.6' }}>
                {activeCategory.description}
              </p>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Für wen ist das?</span>
                <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginTop: '6px' }}>
                  {activeCategory.id === 'winzer' && '🍇 Winzer, Weingüter, Weinhändler & Genuss-Blogger'}
                  {activeCategory.id === 'immo' && '🏠 Immobilienmakler, Bauträger & Interior-Designer'}
                  {activeCategory.id === 'hochzeit' && '💍 Hochzeitsfotografen, Wedding-Planner & Brautpaare'}
                  {activeCategory.id === 'strand' && '🏖️ Content-Creator, Reisebüros & Surflabels'}
                  {activeCategory.id === 'urlaub' && '✈️ Reise-Influencer, Vlogger & Tourismus-Dienstleister'}
                  {activeCategory.id === 'lostplaces' && '🏚️ Urbexer, Fotografen, Storyteller & Mystik-Fans'}
                  {activeCategory.id === 'schloesser' && '🏰 Historiker, Event-Veranstalter & Fantasy-Künstler'}
                  {activeCategory.id === 'food' && '🍔 Köche, Restaurants, Food-Blogger & Lieferdienste'}
                  {activeCategory.id === 'fitness' && '🏋️ Personal Trainer, Fitnessstudios & Sportmarken'}
                  {activeCategory.id === 'auto' && '🏎️ Autohändler, Kfz-Betriebe, Vlogger & Tuning-Fans'}
                  {activeCategory.id === 'socialmedia' && '📱 Influencer, Streamer, Vlogger & Content-Creator'}
                  {activeCategory.id === 'nature' && '🏔️ Landschaftsfotografen, Wanderer & Natur-Blogger'}
                  {activeCategory.id === 'cyberpunk' && '👾 Game-Designer, Sci-Fi-Autoren & Cyberpunk-Künstler'}
                  {activeCategory.id === 'artistic' && '🎨 Designer, Galeristen, abstrakte Künstler & Illustratoren'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setActivePromptType('image')}
                className={`tab-btn ${activePromptType === 'image' ? 'active' : ''}`}
                style={{ padding: '12px 24px', fontSize: '0.95rem', flex: 1 }}
              >
                <ImageIcon size={16} />
                Bild-Prompts
              </button>
              <button
                onClick={() => setActivePromptType('video')}
                className={`tab-btn ${activePromptType === 'video' ? 'active' : ''}`}
                style={{ padding: '12px 24px', fontSize: '0.95rem', flex: 1 }}
              >
                <Video size={16} />
                Video-Prompts
              </button>
            </div>
          </div>

          {/* Volle Höhe Bild- oder Video-Vorschau */}
          <div style={{ 
            width: '100%', 
            minHeight: '350px',
            position: 'relative',
            borderLeft: '1px solid var(--border-color)',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {activePromptType === 'video' ? (
              <img 
                src="/beispiel.jpeg"
                alt="Video-Vorschau Platzhalter"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '350px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            ) : (
              activeCategory.previewImage && (
                <img 
                  src={activeCategory.previewImage} 
                  alt={`Vorschau für ${activeCategory.name}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                />
              )
            )}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              right: '15px',
              background: 'rgba(0,0,0,0.7)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#fff',
              backdropFilter: 'blur(6px)',
              zIndex: 10
            }}>
              {activePromptType === 'video' ? 'Beispiel-Video 🎥' : 'Beispiel-Bild 📷'}
            </div>
          </div>
        </div>

        {/* Neuer Zwischentitel vor der Liste */}
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', marginTop: '4rem' }}>
          Exklusive Prompts Ihrer ausgewählten Kategorie
        </h3>

        {/* Prompt Liste (Nur die ersten 3 unverschlüsselten/lesbaren zeigen) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '5rem' }}>
          {(activePromptType === 'image' ? activeCategory.images : activeCategory.videos).slice(0, 3).map((promptText, idx) => {
            return (
              <div 
                key={idx} 
                className="prompt-card glass-panel"
                style={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(30, 41, 66, 0.25)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Prompt #{idx + 1}
                    </span>
                  </div>
                  
                  {/* Deutsche Übersetzung (nicht kopierbar) */}
                  {PROMPT_TRANSLATIONS[promptText] && (
                    <div style={{ 
                      userSelect: 'none', 
                      WebkitUserSelect: 'none', 
                      msUserSelect: 'none',
                      color: 'var(--text-muted)', 
                      fontSize: '0.95rem', 
                      lineHeight: '1.5',
                      marginBottom: '8px', 
                      marginTop: '4px',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      borderLeft: '3px solid var(--primary)'
                    }}>
                      <p style={{ margin: 0, fontWeight: 500 }}>{PROMPT_TRANSLATIONS[promptText]}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', display: 'block', marginTop: '4px', fontWeight: 600 }}>
                        ⚠️ Benutze den englischen Prompt unten für die besten Ergebnisse
                      </span>
                    </div>
                  )}

                  <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6', marginTop: '6px', fontStyle: 'italic' }}>
                    {promptText}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleCopyPrompt(promptText)}
                    className="btn-outline"
                    title="In Zwischenablage kopieren"
                    style={{ padding: '10px 12px' }}
                  >
                    {copiedPromptText === promptText ? (
                      <Check size={18} style={{ color: '#22c55e' }} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleUsePrompt(promptText, activePromptType)}
                    className="btn-gold"
                    style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}
                  >
                    <Sparkles size={14} />
                    In Generator laden
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
