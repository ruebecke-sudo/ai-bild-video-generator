import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
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
  ChevronDown
} from 'lucide-react'

export default function PromptsPage() {
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [selectedPromptCategory, setSelectedPromptCategory] = useState(PROMPT_CATEGORIES[0]?.id || '')
  const [activePromptType, setActivePromptType] = useState('image') // 'image', 'video'
  const [copiedPromptText, setCopiedPromptText] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.auth.getUser().then(() => {
          // Credits laden
          supabase.from('profiles').select('credits').eq('id', session.user.id).single().then(({ data }) => {
            if (data) setCredits(data.credits)
          })
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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
      <header className="header">
        <Link href="/" className="brand">
          <span>AI Bild & Videogenerator</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/prompts" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Book size={16} /> Nischenprompts
          </Link>
          <Link href="/manual" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <BookOpen size={16} /> Anleitung
          </Link>
          <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
            Preise
          </Link>
          
          {user && (
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px' }}>
              <Coins size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{credits} Credits</span>
            </div>
          )}
          <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ArrowLeft size={16} /> Zum Generator
          </Link>
        </div>
      </header>

      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', margin: '3rem 0 3rem 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Bis zu 140 exklusive Prompts zur Bild & Videoerstellung
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Wähle deine Nische aus, kopiere professionelle Prompts mit einem Klick oder lade sie direkt in dein Generator-Dashboard.
          </p>
        </div>

        {/* Kategorien-Auswahl */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '2.5rem' }}>
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

          {/* Volle Höhe Bild-Vorschau */}
          {activeCategory.previewImage && (
            <div style={{ 
              width: '100%', 
              minHeight: '350px',
              position: 'relative',
              borderLeft: '1px solid var(--border-color)'
            }}>
              <img 
                src={activeCategory.previewImage} 
                alt={`Vorschau für ${activeCategory.name}`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
              />
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
                backdropFilter: 'blur(6px)'
              }}>
                Beispiel-Generierung 📷
              </div>
            </div>
          )}
        </div>

        {/* Prompt Liste */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem' }}>
          {(activePromptType === 'image' ? activeCategory.images : activeCategory.videos).slice(0, 3).map((promptText, idx) => {
            return (
              <div 
                key={idx} 
                className="prompt-card glass-panel"
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Prompt #{idx + 1}
                  </span>
                  
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

        {/* Globaler Button zur Freigabe des Prompt-Pakets */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
          <Link href="/pricing#nischen-pricing" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            background: 'var(--gradient-gold)', 
            color: '#fff', 
            padding: '16px 32px', 
            borderRadius: '30px', 
            textDecoration: 'none', 
            fontSize: '1.1rem', 
            fontWeight: 800,
            boxShadow: '0 4px 20px rgba(246, 190, 26, 0.4)',
            transition: 'transform 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          className="hover-scale"
          >
            <Lock size={18} />
            <span>Bis zu 140 exklusive Prompts freigeben. 🔓</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
