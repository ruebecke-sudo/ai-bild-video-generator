import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { supabase, getUserCredits } from '../lib/supabase'
import { PROMPT_CATEGORIES } from '../lib/promptsData'
import { 
  Globe, 
  Book, 
  BookOpen, 
  ArrowLeft, 
  Coins, 
  Image as ImageIcon, 
  Video, 
  Search, 
  Lock, 
  Copy, 
  Check, 
  Play, 
  X, 
  Sparkles,
  Download,
  ExternalLink,
  ShoppingBag
} from 'lucide-react'

// Helper to determine which premium category a prompt belongs to
const findPromptCategory = (promptText) => {
  if (!promptText) return null
  const cleanPrompt = promptText.trim().toLowerCase()
  for (const cat of PROMPT_CATEGORIES) {
    const matchedImage = cat.images.some(p => cleanPrompt.includes(p.trim().toLowerCase()))
    const matchedVideo = cat.videos.some(p => cleanPrompt.includes(p.trim().toLowerCase()))
    if (matchedImage || matchedVideo) {
      return cat
    }
  }
  return null
}

export default function GalleryPage() {
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [unlockedCategories, setUnlockedCategories] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Gallery items state
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  
  // Filters state
  const [selectedType, setSelectedType] = useState('all') // 'all', 'image', 'video'
  const [selectedCategory, setSelectedCategory] = useState('all') // 'all', 'custom', or category ID
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState(null)
  const [copiedText, setCopiedText] = useState('')

  useEffect(() => {
    // 1. Fetch User Session & Profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
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

    // 2. Fetch Public Gallery Items
    fetchGalleryItems()

    return () => subscription.unsubscribe()
  }, [])

  const fetchGalleryItems = async () => {
    setLoadingItems(true)
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) {
        const data = await res.json()
        
        // Map items to include their detected category for easy filtering
        const enrichedData = data.map(item => {
          const cat = findPromptCategory(item.prompt)
          return {
            ...item,
            detectedCategory: cat ? cat.id : 'custom',
            categoryName: cat ? cat.name : 'Eigene Kreation',
            categoryIcon: cat ? cat.icon : '✨'
          }
        })
        setItems(enrichedData)
      } else {
        console.error('Fehler beim Laden der Galerie')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingItems(false)
    }
  }

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(''), 2500)
  }

  const handleUsePrompt = (item) => {
    // Save prompt and type to session storage and redirect to dashboard
    sessionStorage.setItem('selected_prompt_text', item.prompt)
    sessionStorage.setItem('selected_prompt_type', item.type === 'image' ? 'image' : 'video')
    window.location.href = '/'
  }

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesType
  })

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Head>
        <title>Community Galerie - KI-generierte Bilder & Videos | AI Video Generator</title>
        <meta name="description" content="Entdecke atemberaubende, KI-generierte Bilder und Videos aus unserer Community. Lass dich inspirieren und lade Prompts direkt in den Generator." />
        <meta name="robots" content="index, follow" />
      </Head>
      <header className="header">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Link href="/" className="brand" style={{ marginBottom: 0 }}>
            <span>AI Bild & Videogenerator</span>
          </Link>
          <Link href="/" className="btn-header-generator">
            <ArrowLeft size={14} /> Zum Generator
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/ecommerce" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ShoppingBag size={16} /> E-Commerce
          </Link>
          <Link href="/gallery" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Globe size={16} /> Community-Galerie
          </Link>
          <Link href="/prompts" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Book size={16} /> Exkl. Prompt-Generator
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
            </>
          ) : (
            <Link href="/" className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Anmelden
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Community Kunstgalerie 🌐
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Entdecke atemberaubende, KI-generierte Bilder und Videos aus unserer Community. Lass dich inspirieren und lade Prompts direkt in den Generator!
          </p>
        </div>

        {/* Filters Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Media Type Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setSelectedType('all')}
                className={`tab-btn ${selectedType === 'all' ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Alle Medien
              </button>
              <button 
                onClick={() => setSelectedType('image')}
                className={`tab-btn ${selectedType === 'image' ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                <ImageIcon size={14} /> Bilder
              </button>
              <button 
                onClick={() => setSelectedType('video')}
                className={`tab-btn ${selectedType === 'video' ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                <Video size={14} /> Videos
              </button>
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
              {filteredItems.length} {filteredItems.length === 1 ? 'Eintrag gefunden' : 'Einträge gefunden'}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loadingItems ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="shimmer-bg" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1.5rem' }}></div>
            <h3>Lade Galerie...</h3>
          </div>
        ) : filteredItems.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '25px', 
            marginBottom: '5rem' 
          }}>
            {filteredItems.map(item => {
              const isPremium = item.detectedCategory !== 'custom'
              const isLocked = isPremium && !unlockedCategories.includes(item.detectedCategory) && item.user_id !== user?.id
              const isVideo = item.type === 'video' || (item.output_url && !/\.(webp|png|jpe?g)(?:\?.*)?$/i.test(item.output_url))

              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="glass-panel animate-hover"
                  style={{ 
                    padding: '0', 
                    borderRadius: '15px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-premium)',
                    height: '380px',
                    position: 'relative'
                  }}
                >
                  {/* Media Content */}
                  <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative', background: '#000' }}>
                    {isVideo ? (
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <video 
                          src={item.output_url} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                          loop
                          playsInline
                          onMouseOver={(e) => e.target.play()}
                          onMouseOut={(e) => e.target.pause()}
                        />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '12px', pointerEvents: 'none' }}>
                          <Play size={22} style={{ color: '#fff' }} />
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={item.output_url} 
                        alt={item.prompt} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        className="gallery-image"
                      />
                    )}

                    {/* Category Badge */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      left: '12px', 
                      background: 'rgba(10, 15, 29, 0.85)', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: '#fff',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid var(--border-color)'
                    }}>
                      {item.categoryIcon} {item.categoryName}
                    </div>

                    {/* Media Type Badge */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      background: 'rgba(168, 85, 247, 0.9)', 
                      padding: '4px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      {isVideo ? <Video size={14} /> : <ImageIcon size={14} />}
                    </div>
                  </div>

                  {/* Card Description */}
                  <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative' }}>
                      {isLocked ? (
                        <div style={{ filter: 'blur(3px)', userSelect: 'none' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: 'italic' }}>
                            {item.prompt}
                          </p>
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: 'italic' }}>
                          {item.prompt}
                        </p>
                      )}

                      {/* Glowing Lock Overlay */}
                      {isLocked && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, left: 0, right: 0, bottom: 0, 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '4px'
                        }}>
                          <Lock size={16} style={{ color: 'var(--secondary)' }} className="animate-pulse" />
                          <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Gesperrt</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {new Date(item.created_at).toLocaleDateString('de-DE')}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                        Details ansehen &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', marginBottom: '5rem' }}>
            <h3>Keine Einträge gefunden.</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Probiere einen anderen Filter aus oder teile deine eigenen Kreationen aus dem Dashboard!</p>
          </div>
        )}

      </main>

      {/* Item Details Modal */}
      {selectedItem && (() => {
        const isPremium = selectedItem.detectedCategory !== 'custom'
        const isLocked = isPremium && !unlockedCategories.includes(selectedItem.detectedCategory) && selectedItem.user_id !== user?.id
        const isVideo = selectedItem.type === 'video' || (selectedItem.output_url && !/\.(webp|png|jpe?g)(?:\?.*)?$/i.test(selectedItem.output_url))

        return (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <div 
              className="glass-panel" 
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                width: '90%', 
                maxWidth: '900px', 
                maxHeight: '90vh', 
                overflowY: 'auto', 
                padding: '0', 
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-neon)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
              }}
            >
              {/* Media Column */}
              <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', position: 'relative' }}>
                {isVideo ? (
                  <video 
                    src={selectedItem.output_url} 
                    controls 
                    autoPlay 
                    loop 
                    style={{ width: '100%', height: '100%', maxHeight: '600px', objectFit: 'contain' }}
                  />
                ) : (
                  <img 
                    src={selectedItem.output_url} 
                    alt="Selected creation" 
                    style={{ width: '100%', height: '100%', maxHeight: '600px', objectFit: 'contain' }}
                  />
                )}
                
                <button 
                  onClick={() => setSelectedItem(null)}
                  style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '15px', 
                    background: 'rgba(10, 15, 29, 0.8)', 
                    border: 'none', 
                    borderRadius: '50%', 
                    padding: '8px', 
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Info Column */}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <span style={{ 
                      background: 'rgba(168, 85, 247, 0.15)', 
                      padding: '5px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: 'var(--primary)',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}>
                      {selectedItem.categoryIcon} {selectedItem.categoryName}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {new Date(selectedItem.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                    {isVideo ? 'KI-Videokreation' : 'KI-Bildkreation'}
                  </h3>

                  {/* Prompt Box */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Verwendeter Prompt:
                    </span>

                    <div style={{ position: 'relative', minHeight: '100px' }}>
                      <div className="glass-panel" style={{ 
                        padding: '1.2rem', 
                        background: 'rgba(30, 41, 66, 0.2)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '10px',
                        filter: isLocked ? 'blur(6px)' : 'none',
                        pointerEvents: isLocked ? 'none' : 'auto',
                        transition: 'filter 0.3s'
                      }}>
                        <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                          {selectedItem.prompt}
                        </p>
                      </div>

                      {/* Locked Overlay inside Modal */}
                      {isLocked && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, left: 0, right: 0, bottom: 0, 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '12px',
                          background: 'rgba(10, 15, 29, 0.6)',
                          borderRadius: '10px',
                          border: '1px dashed rgba(168, 85, 247, 0.4)',
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '12px', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Lock size={22} className="animate-pulse" />
                          </div>
                          <div>
                            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', margin: '0 0 4px 0' }}>Prompt gesperrt</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                              Schalte das entsprechende Nischen-Paket frei, um diesen Prompt anzusehen und zu nutzen.
                            </p>
                          </div>
                          <Link 
                            href="/pricing#nischen-pricing" 
                            className="btn-gold" 
                            style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            Nische freischalten 🔓
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  {!isLocked && (
                    <>
                      <button 
                        onClick={() => handleCopyPrompt(selectedItem.prompt)}
                        className="btn-outline"
                        style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {copiedText === selectedItem.prompt ? (
                          <>
                            <Check size={16} style={{ color: 'var(--primary)' }} />
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
                        onClick={() => handleUsePrompt(selectedItem)}
                        className="btn-gold"
                        style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Sparkles size={16} />
                        In Generator laden
                      </button>
                    </>
                  )}

                  <a 
                    href={selectedItem.output_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    download="community-ki-kunst"
                    className="btn-outline" 
                    style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    title="Downloaden"
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

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
