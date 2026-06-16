import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, getUserCredits } from '../lib/supabase'
import { PROMPT_CATEGORIES } from '../lib/promptsData'
import { 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  LogOut, 
  Download, 
  Clock, 
  Play, 
  Upload,
  Coins,
  Tv,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  Palette,
  TrendingUp,
  FolderOpen,
  Maximize2,
  X,
  BookOpen,
  Zap,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  Cpu,
  MessageSquare,
  Star,
  Book,
  Copy,
  Check
} from 'lucide-react'

const STYLES = [
  { id: 'none', name: 'Kein Stil (Standard)', promptAdd: '' },
  { id: 'enhance-style', name: '✨ Enhance / High Detail', promptAdd: ', 8k resolution, highly detailed, sharp focus, professional photography, studio lighting' },
  { id: 'photorealistic', name: 'Fotorealistisch', promptAdd: ', photorealistic, ultra-detailed 8k resolution, highly realistic, professional lighting' },
  { id: 'comic', name: 'Comic / Graphic Novel', promptAdd: ', comic book style, bold lines, vibrant colors, illustrated, classic graphic novel art' },
  { id: 'anime', name: 'Anime / Manga', promptAdd: ', anime style, beautiful key visual, detailed manga art style, studio ghibli inspired' },
  { id: '3d-render', name: '3D Render / Pixar', promptAdd: ', 3d render, blender style, octanerender, pixar style, cute, smooth textures, vibrant lighting' },
  { id: 'cyberpunk', name: 'Cyberpunk', promptAdd: ', cyberpunk style, neon lights, dark rainy streets, high tech low life, glowing violet and cyan details' },
  { id: 'fantasy', name: 'Fantasy / Magic', promptAdd: ', fantasy illustration, mythical, epic scale, magical glowing elements, dramatic clouds, highly detailed digital painting' },
  { id: 'oil-painting', name: 'Ölgemälde', promptAdd: ', oil painting style, visible brush strokes, textured canvas, classical art, rich colors' },
  { id: 'watercolor', name: 'Aquarell / Wasserfarben', promptAdd: ', watercolor painting, soft textures, bleeding paint edges, artistic, elegant ink wash' },
  { id: 'pencil-sketch', name: 'Bleistiftzeichnung', promptAdd: ', hand-drawn pencil sketch, monochrome, highly detailed shading, crosshatching, graphite art' },
  { id: 'vintage-retro', name: 'Retro / 80er Jahre', promptAdd: ', vintage retro style, 1980s aesthetic, synthwave colors, VHS film grain, nostalgic mood' },
  { id: 'pixel-art', name: 'Pixel-Art / 16-Bit', promptAdd: ', retro pixel art, 16-bit, video game aesthetic, blocky, clean pixel patterns' },
  { id: 'claymation', name: 'Knetfiguren / Claymation', promptAdd: ', claymation style, plastiline art, clay textures, stop-motion look, handcrafted' },
  { id: 'steampunk', name: 'Steampunk', promptAdd: ', steampunk aesthetic, brass gears, copper pipes, smoke, victorian machinery, glowing amber lights' },
  { id: 'neon-art', name: 'Neon-Glow / Vektor', promptAdd: ', vibrant neon glow vector art, dark background, glowing outlines, minimalist and modern' },
  { id: 'cinematic', name: 'Kino-Atmosphäre', promptAdd: ', cinematic lighting, anamorphic lens flare, dramatic shadows, movie scene still, moody' },
  { id: 'graffiti', name: 'Street Art / Graffiti', promptAdd: ', street art style, graffiti, spray paint drips, stencil art, vibrant urban wall mural' },
  { id: 'origami', name: 'Origami / Papierkunst', promptAdd: ', origami style, folded paper art, geometric paper folds, clean studio lighting, papercraft' }
]

const FAQS = [
  {
    question: "Was ist der AI Bild & Videogenerator?",
    answer: "Unser Generator ist ein Online-Tool, das modernste künstliche Intelligenz (wie FLUX und Luma Dream Machine) nutzt, um aus einfachen Texteingaben (Prompts) oder hochgeladenen Bildern hochauflösende Full-HD Videos und Bilder zu erzeugen."
  },
  {
    question: "Unterstützen die Modelle 1080p Full-HD?",
    answer: "Ja, absolut! Sowohl unsere Bild- als auch unsere Videogeneratoren sind darauf ausgelegt, Medien in gestochen scharfem 1080p auszugeben. Über den 'Enhance'-Button können Bilder zudem weiter hochskaliert und geschärft werden."
  },
  {
    question: "Wie funktioniert das Credit-System?",
    answer: "Jeder neue Nutzer erhält nach der Registrierung 10 kostenfreie Credits zum Ausprobieren. Eine Bildgenerierung kostet 1 Credit, eine Videogenerierung kostet 5 Credits. Zusätzliche Credits können ohne Abo-Zwang jederzeit flexibel auf unserer Preisseite aufgeladen werden."
  },
  {
    question: "Darf ich die erzeugten Inhalte kommerziell nutzen?",
    answer: "Ja! Ab unserem 'Pro'-Paket sind alle generierten und verbesserten Medien für kommerzielle Zwecke (wie Marketing, YouTube, Social Media oder Kundenprojekte) freigegeben."
  },
  {
    question: "Wie lade ich die generierten Videos und Bilder herunter?",
    answer: "Unter jedem fertigen Ergebnis und im Medienarchiv befindet sich eine 'Download'-Schaltfläche. Zudem können Bilder über den 'Vollbildmodus' vergrößert und direkt per Rechtsklick gesichert werden."
  }
]

const REVIEWS = [
  {
    name: "Maximilian S.",
    role: "Freelance Designer",
    review: "Absolut geniales Tool! Der 'Enhance'-Knopf spart mir stundenlange Photoshop-Arbeit. Ich jage meine KI-Bilder einfach kurz durch den Upscaler und habe direkt druckfertige Ergebnisse für meine Klienten.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
  },
  {
    name: "Sarah K.",
    role: "Social Media Manager",
    review: "Ich nutze das Text-zu-Video Tool täglich für unsere TikTok und Instagram Kanäle. Die 1080p Videos im 9:16 Format sind extrem flüssig und die Ladezeit ist im Vergleich zu anderen Generatoren unschlagbar.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
  },
  {
    name: "Thomas B.",
    role: "E-Commerce Betreiber",
    review: "Die Bild-zu-Video Funktion ist für meinen Online-Shop ein Gamechanger. Ich lade einfache Produktfotos hoch und lasse sie von der KI animieren. Das wertet unsere Werbeanzeigen extrem auf. Volle Empfehlung!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
  }
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('image-to-video') // 'image-to-video', 'text-to-video', 'image-gen'
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  
  // Auth Form State
  const [authMode, setAuthMode] = useState('login') // 'login', 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState('')

  // Form State
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('none')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [resolution, setResolution] = useState('1080p')
  
  // Status State
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedArchiveItem, setSelectedArchiveItem] = useState(null)
  const [isFullsizeOpen, setIsFullsizeOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  // Prompt Library State
  const [selectedPromptCategory, setSelectedPromptCategory] = useState(PROMPT_CATEGORIES[0]?.id || '')
  const [activePromptType, setActivePromptType] = useState('image') // 'image', 'video'
  const [copiedPromptText, setCopiedPromptText] = useState('')

  // Translation State
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    if (!prompt.trim()) {
      alert('Bitte gib zuerst einen Text auf Deutsch ein!')
      return
    }

    setIsTranslating(true)
    try {
      // Nutze die kostenlose MyMemory API (öffentlich zugänglich, ohne API-Key)
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(prompt)}&langpair=de|en`)
      const data = await res.json()
      
      if (data.responseData && data.responseData.translatedText) {
        let translated = data.responseData.translatedText
        // Entferne eventuelle API-Rückgabeartefakte oder Anführungszeichen
        translated = translated.replace(/^"|"$/g, '')

        // Optionale Verbesserung/Optimierung anhängen
        const enhanceSuffix = ", photorealistic, highly detailed, cinematic lighting, 8k resolution, sharp focus"
        
        // Trage das Ergebnis ein
        setPrompt(translated + enhanceSuffix)
      } else {
        alert('Die Übersetzung konnte nicht geladen werden. Bitte versuche es noch einmal.')
      }
    } catch (err) {
      console.error(err)
      alert('Verbindungsfehler bei der Übersetzung.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedPromptText(text)
    setTimeout(() => setCopiedPromptText(''), 2500)
  }

  const handleUsePrompt = (text, type) => {
    setPrompt(text)
    if (type === 'image') {
      setActiveTab('image-gen')
    } else {
      setActiveTab('text-to-video')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeCategory = PROMPT_CATEGORIES.find(c => c.id === selectedPromptCategory) || PROMPT_CATEGORIES[0] || { name: '', icon: '', description: '', images: [], videos: [] }

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserStats(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserStats(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserStats = async (userId) => {
    const userCredits = await getUserCredits(userId)
    setCredits(userCredits)

    const { data: gens } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (gens) setHistory(gens)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      setAuthMessage('Registrierung erfolgreich! Bitte logge dich jetzt ein.')
      setAuthMode('login')
    } catch (err) {
      setAuthMessage(`Fehler: ${err.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      localStorage.setItem('remembered_email', email)
      
      setUser(data.user)
      loadUserStats(data.user.id)
    } catch (err) {
      setAuthMessage(`Fehler: ${err.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCredits(0)
    setHistory([])
    setPassword('')
    setAuthMessage('')
    setSelectedArchiveItem(null)
    setPrediction(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const startGeneration = async () => {
    if (!user) {
      alert('Bitte logge dich zuerst ein!')
      return
    }

    if (!prompt && activeTab !== 'image-to-video') {
      alert('Bitte gib einen Prompt ein.')
      return
    }

    setIsGenerating(true)
    setPrediction(null)
    setSelectedArchiveItem(null)

    const styleObj = STYLES.find(s => s.id === selectedStyle)
    const finalPrompt = prompt + (styleObj ? styleObj.promptAdd : '')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab === 'image-gen' ? 'image' : (activeTab === 'image-to-video' ? 'image-to-video' : 'video'),
          prompt: finalPrompt,
          imageUrl: activeTab === 'image-to-video' ? imageUrl : null,
          aspect_ratio: aspectRatio,
          resolution: resolution,
          userId: user.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        setCredits(data.creditsLeft)
        pollPrediction(data.predictionId)
      } else {
        alert(data.error || 'Fehler bei der Generierung.')
        setIsGenerating(false)
      }
    } catch (err) {
      console.error(err)
      alert('Netzwerkfehler.')
      setIsGenerating(false)
    }
  }

  const enhanceImage = async (url) => {
    if (credits < 1) {
      alert('Nicht genügend Credits. Das Upscaling kostet 1 Credit.')
      return
    }

    setIsEnhancing(true)
    
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: url,
          userId: user.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        setCredits(data.creditsLeft)
        pollEnhance(data.predictionId)
      } else {
        alert(data.error || 'Enhance failed.')
        setIsEnhancing(false)
      }
    } catch (err) {
      console.error(err)
      alert('Netzwerkfehler.')
      setIsEnhancing(false)
    }
  }

  const pollEnhance = async (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status?id=${id}`)
        const data = await response.json()

        if (data.status === 'succeeded') {
          clearInterval(interval)
          setPrediction(data)
          setIsEnhancing(false)
          loadUserStats(user.id)
          alert('Bild erfolgreich hochskaliert!')
        } else if (data.status === 'failed') {
          clearInterval(interval)
          alert('Bildverbesserung fehlgeschlagen.')
          setIsEnhancing(false)
        }
      } catch (err) {
        console.error('Polling Fehler:', err)
      }
    }, 4000)
  }

  const activeMediaUrl = selectedArchiveItem 
    ? selectedArchiveItem.output_url 
    : (prediction?.status === 'succeeded' ? prediction.output_url : null)

  const isCurrentImage = selectedArchiveItem 
    ? selectedArchiveItem.type === 'image' 
    : (prediction?.type === 'image')

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)' }}>
      {/* Header */}
      <header className="header">
        <Link href="/" className="brand">
          <span>AI Bild & Videogenerator</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/manual" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <BookOpen size={16} /> Anleitung
          </Link>
          
          <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
            Preise
          </Link>
          
          {user ? (
            <>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px' }}>
                <Coins size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{credits} Credits</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.email}</span>
                <button onClick={handleLogout} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <LogOut size={14} />
                  Abmelden
                </button>
              </div>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nicht angemeldet</span>
          )}
        </div>
      </header>

      {/* Main Area */}
      <main className="main-content">
        {!user ? (
          /* Login/Register Formular */
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {authMode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {authMode === 'login' ? 'Melde dich an, um Videos zu generieren.' : 'Registriere dich, um 10 freie Credits zu erhalten.'}
                </p>
              </div>

              <form onSubmit={authMode === 'login' ? handleSignIn : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>E-Mail Adresse</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                      type="email" 
                      required
                      placeholder="name@beispiel.de"
                      className="glass-input" 
                      style={{ width: '100%', paddingLeft: '40px' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Passwort</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="glass-input" 
                      style={{ width: '100%', paddingLeft: '40px' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {authMessage && (
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: authMessage.startsWith('Fehler') ? '#ef4444' : 'var(--primary)',
                    background: 'rgba(168, 85, 247, 0.1)', 
                    padding: '8px 12px', 
                    borderRadius: '6px',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}>
                    {authMessage}
                  </div>
                )}

                <button type="submit" disabled={authLoading} className="btn-gold" style={{ width: '100%' }}>
                  {authLoading ? (
                    'Bitte warten...'
                  ) : authMode === 'login' ? (
                    <>
                      <LogIn size={16} />
                      Einloggen
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Registrieren
                    </>
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                {authMode === 'login' ? (
                  <p style={{ color: 'var(--text-muted)' }}>
                    Noch kein Konto?{' '}
                    <button 
                      onClick={() => { setAuthMode('register'); setAuthMessage(''); }} 
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Jetzt registrieren
                    </button>
                  </p>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>
                    Bereits registriert?{' '}
                    <button 
                      onClick={() => { setAuthMode('login'); setAuthMessage(''); }} 
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Jetzt einloggen
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Generator UI */
          <>
            <div className="grid-layout">
              {/* Linke Spalte */}
              <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                <div className="tab-headers">
                  <button 
                    className={`tab-btn ${activeTab === 'image-to-video' ? 'active' : ''}`}
                    onClick={() => setActiveTab('image-to-video')}
                  >
                    <Video size={16} />
                    Bild zu Video
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'text-to-video' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text-to-video')}
                  >
                    <Video size={16} />
                    Text zu Video
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'image-gen' ? 'active' : ''}`}
                    onClick={() => setActiveTab('image-gen')}
                  >
                    <ImageIcon size={16} />
                    Bildgenerator
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  
                  {activeTab === 'image-to-video' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Startbild hochladen</span>
                      <div style={{ 
                        border: '2px dashed var(--border-color)', 
                        borderRadius: '10px', 
                        padding: '2rem', 
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: imageUrl ? 'none' : 'rgba(30, 41, 66, 0.2)',
                        position: 'relative'
                      }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        {imageUrl ? (
                          <img src={imageUrl} alt="Uploaded source" style={{ maxHeight: '150px', borderRadius: '8px', margin: '0 auto' }} />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
                            <Upload size={24} />
                            <span style={{ fontSize: '0.85rem' }}>PNG, JPG oder WEBP bis zu 10MB</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Beschreibung (Prompt)</span>
                      
                      <button 
                        onClick={handleTranslate}
                        disabled={isTranslating}
                        className="btn-outline"
                        style={{ 
                          padding: '4px 10px', 
                          fontSize: '0.75rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          borderColor: 'var(--primary)', 
                          color: 'var(--primary)' 
                        }}
                      >
                        <Sparkles size={12} />
                        {isTranslating ? 'Übersetze...' : 'Übersetzen & Optimieren 🇩🇪 ➔ 🇺🇸'}
                      </button>
                    </div>

                    <textarea 
                      className="glass-input" 
                      rows={4}
                      placeholder={
                        activeTab === 'image-gen' 
                        ? "Schreibe deine Idee auf Deutsch und klicke oben rechts auf 'Übersetzen'..."
                        : "Beschreibe die gewünschte Bewegung des Videos..."
                      }
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Tipp: Gib deinen Prompt auf Deutsch ein und klicke auf den Button, um ihn in ein perfekt optimiertes Englisch übersetzen zu lassen.
                    </span>
                  </div>

                  {/* Stil-Auswahl */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Palette size={16} /> Art Style (Stil)
                    </span>
                    <select 
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="glass-input" 
                      style={{ width: '100%', padding: '10px 12px' }}
                    >
                      {STYLES.map(style => (
                        <option key={style.id} value={style.id}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Seitenverhältnis (Aspect Ratio)</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['16:9', '9:16', '1:1'].map((ratio) => (
                        <button 
                           key={ratio} 
                           onClick={() => setAspectRatio(ratio)}
                           style={{
                             flex: 1,
                             padding: '10px',
                             borderRadius: '8px',
                             background: aspectRatio === ratio ? 'var(--primary)' : 'var(--bg-input)',
                             color: '#fff',
                             border: 'none',
                             cursor: 'pointer',
                             fontWeight: 600,
                             transition: 'all 0.2s'
                           }}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Qualität / Auflösung</span>
                      <select 
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="glass-input" 
                        style={{ padding: '8px 12px' }}
                      >
                        <option value="1080p">1080p (Full-HD)</option>
                        <option value="720p">720p (HD)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={startGeneration}
                    disabled={isGenerating}
                    className="btn-gold" 
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="animate-spin" size={18} />
                        Generiere...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Kostenpflichtig Generieren ({activeTab === 'image-gen' ? '1 Credit' : '5 Credits'})
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rechte Spalte */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', position: 'relative' }}>
                  {isGenerating || isEnhancing ? (
                    <div style={{ textAlign: 'center' }}>
                      <div className="shimmer-bg" style={{ width: '320px', height: '180px', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
                      <h3>{isEnhancing ? 'Bild wird hochskaliert (Enhance)...' : 'Dein Kunstwerk wird generiert...'}</h3>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '6px' }}>Bitte verlasse diese Seite nicht.</p>
                    </div>
                  ) : activeMediaUrl ? (
                    <div style={{ width: '100%', maxWidth: '700px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>
                          {selectedArchiveItem ? 'Archiv-Element:' : 'Generiertes Ergebnis:'}
                        </h3>
                        
                        {isCurrentImage && (
                          <button 
                            onClick={() => setIsFullsizeOpen(true)}
                            className="btn-outline" 
                            style={{ padding: '6px 10px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}
                          >
                            <Maximize2 size={14} />
                            Endgröße anzeigen
                          </button>
                        )}
                      </div>
                      
                      {isCurrentImage ? (
                        <img 
                          src={activeMediaUrl} 
                          alt="Result" 
                          style={{ width: '100%', borderRadius: '12px', maxHeight: '500px', objectFit: 'contain' }} 
                        />
                      ) : (
                        <video 
                          src={activeMediaUrl} 
                          controls 
                          autoPlay 
                          loop 
                          style={{ width: '100%', borderRadius: '12px' }}
                        />
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '15px' }}>
                        {isCurrentImage && (
                          <button 
                            onClick={() => enhanceImage(activeMediaUrl)}
                            className="btn-outline"
                            style={{ borderColor: 'var(--primary)', color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center' }}
                          >
                            <TrendingUp size={16} />
                            Enhance (1 Credit)
                          </button>
                        )}
                        
                        <a 
                          href={activeMediaUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          download="ki-kunstwerk"
                          className="btn-gold" 
                          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                        >
                          <Download size={16} />
                          Downloaden
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-dim)', textAlign: 'center' }}>
                      <Tv size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <p>Melde dich an und starte eine Generierung, um das Ergebnis zu sehen.</p>
                    </div>
                  )}
                </div>

                {/* Bilder-Archiv */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderOpen size={20} style={{ color: 'var(--primary)' }} />
                    Dein Medienarchiv & Galerie
                  </h2>
                  
                  {history.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                      {history.map((gen) => (
                        <div 
                          key={gen.id} 
                          onClick={() => setSelectedArchiveItem(gen)}
                          className="glass-panel" 
                          style={{ 
                            overflow: 'hidden', 
                            borderRadius: '10px', 
                            cursor: 'pointer',
                            border: selectedArchiveItem?.id === gen.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            transition: 'transform 0.2s',
                          }}
                        >
                          {gen.status === 'succeeded' ? (
                            gen.type === 'image' ? (
                              <img src={gen.output_url} alt={gen.prompt} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ position: 'relative', height: '90px' }}>
                                <video src={gen.output_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px' }}>
                                  <Play size={12} style={{ color: '#fff' }} />
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="shimmer-bg" style={{ height: '90px' }}></div>
                          )}
                          <div style={{ padding: '6px' }}>
                            <p style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                              {gen.prompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Noch keine Generierungen im Archiv vorhanden.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Marketing & Content-Sektionen */}
            <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              
              {/* Sektion 1: Kreativer Workflow */}
              <section className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Schneller kreativer Workflow
                </h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                  Vergiss komplizierte Renderzeiten und komplexe Software. Mit unserem Tool erstellst du professionellen Content für Social Media und Marketing in Sekundenschnelle.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '15px', borderRadius: '50%', color: 'var(--primary)' }}>
                      <Zap size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1. Idee eingeben</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Beschreibe deine Szene oder lade einfach ein Startfoto hoch.</p>
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '15px', borderRadius: '50%', color: 'var(--primary)' }}>
                      <Palette size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>2. Stil & Format wählen</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Wähle aus 18+ Kunststilen und dem passenden Seitenverhältnis für TikTok, YouTube & Co.</p>
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '15px', borderRadius: '50%', color: 'var(--primary)' }}>
                      <Cpu size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>3. Generieren</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Die KI rendert dein 1080p Video oder Bild in weniger als einer Minute.</p>
                  </div>
                </div>
              </section>

              {/* Sektion 2: Unendliche Videoerstellungsfälle */}
              <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.2rem' }}>
                    Ein Tool für unendliche KI-Videoerstellungsfälle
                  </h2>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    Egal ob für persönliches Storytelling, virale TikTok-Clips, Instagram Reels oder Werbekampagnen für dein Business. Unser KI-System passt sich flexibel deinen Zielen an.
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                      <CheckCircle size={18} style={{ color: 'var(--primary)' }} />
                      <span>E-Commerce Produktanimationen</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                      <CheckCircle size={18} style={{ color: 'var(--primary)' }} />
                      <span>Social Media Content (9:16 & 16:9)</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                      <CheckCircle size={18} style={{ color: 'var(--primary)' }} />
                      <span>Kreative Kunstprojekte und Bild-zu-Video Erstellungen</span>
                    </li>
                  </ul>
                </div>
                <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Layers style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontWeight: 700 }}>Plattformbereite Ausgabe</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Die generierten Ausgabedateien unterstützen direkt die Standard-Videoformate für alle großen Plattformen (z. B. TikTok, Instagram, YouTube Shorts, LinkedIn). Keine Nachbearbeitung oder Konvertierung nötig.
                  </p>
                </div>
              </section>

              {/* NEU: Kundenbewertungen (Testimonials) */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <MessageSquare size={24} style={{ color: 'var(--primary)' }} />
                    Was unsere Kunden sagen
                  </h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginTop: '5px' }}>Erfahrungsberichte von Designern, Marketern und Creatorn.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {REVIEWS.map((review, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(review.rating)].map((_, idx) => (
                          <Star key={idx} size={16} fill="var(--secondary)" color="var(--secondary)" />
                        ))}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, fontStyle: 'italic' }}>
                        "{review.review}"
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <img 
                          src={review.avatar} 
                          alt={review.name} 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{review.name}</h4>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{review.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* NEU: Premium Prompt-Bibliothek */}
              <section className="glass-panel" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    <Book size={28} style={{ color: 'var(--primary)' }} />
                    Premium Nischen-Prompts
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '700px', margin: '10px auto 0 auto', lineHeight: '1.6' }}>
                    Kopiere exklusive Prompts für Winzer, Immobilienmakler, Hochzeiten und mehr direkt in deine Zwischenablage oder lade sie mit einem Klick in den Generator.
                  </p>
                </div>

                {/* Kategorien-Auswahl */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
                  {PROMPT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedPromptCategory(cat.id)}
                      className={`glass-panel`}
                      style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: selectedPromptCategory === cat.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: selectedPromptCategory === cat.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(30, 41, 66, 0.2)',
                        transition: 'all 0.2s',
                        borderRadius: '10px'
                      }}
                    >
                      <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '6px' }}>{cat.icon}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Beschreibung der aktiven Kategorie & Typ-Filter (Bild vs. Video) */}
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {activeCategory.name} {activeCategory.icon}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', lineHeight: '1.5' }}>
                        {activeCategory.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Für wen ist das?</span>
                      <p style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, marginTop: '4px' }}>
                        {activeCategory.id === 'winzer' && '🍇 Winzer, Weingüter, Weinhändler & Genuss-Blogger'}
                        {activeCategory.id === 'immo' && '🏠 Immobilienmakler, Bauträger & Interior-Designer'}
                        {activeCategory.id === 'hochzeit' && '💍 Hochzeitsfotografen, Wedding-Planner & Brautpaare'}
                        {activeCategory.id === 'strand' && '🏖️ Content-Creator, Reisebüros & Surflabels'}
                        {activeCategory.id === 'urlaub' && '✈️ Reise-Influencer, Vlogger & Tourismus-Dienstleister'}
                        {activeCategory.id === 'lostplaces' && '🏚️ Urbexer, Fotografen, Storyteller & Mystik-Fans'}
                        {activeCategory.id === 'schloesser' && '🏰 Historiker, Event-Veranstalter & Fantasy-Künstler'}
                      </p>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '2px' }}>
                        Optimiere deinen Workflow und erstelle virale Social Media Beiträge oder professionelles Marketingmaterial.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                      <button
                        onClick={() => setActivePromptType('image')}
                        className={`tab-btn ${activePromptType === 'image' ? 'active' : ''}`}
                        style={{ padding: '8px 16px', fontSize: '0.85rem', flex: 1 }}
                      >
                        <ImageIcon size={14} />
                        Bild-Prompts
                      </button>
                      <button
                        onClick={() => setActivePromptType('video')}
                        className={`tab-btn ${activePromptType === 'video' ? 'active' : ''}`}
                        style={{ padding: '8px 16px', fontSize: '0.85rem', flex: 1 }}
                      >
                        <Video size={14} />
                        Video-Prompts
                      </button>
                    </div>
                  </div>

                  {/* Kategorie Vorschau-Bild */}
                  {activeCategory.previewImage && (
                    <div style={{ 
                      width: '100%', 
                      height: '200px', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      position: 'relative',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-premium)'
                    }}>
                      <img 
                        src={activeCategory.previewImage} 
                        alt={`Vorschau für ${activeCategory.name}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.5s'
                        }}
                        className="hover-zoom"
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#fff',
                        backdropFilter: 'blur(4px)'
                      }}>
                        Beispiel-Generierung 📷
                      </div>
                    </div>
                  )}
                </div>

                {/* Prompt Liste */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '6px' }}>
                  {(activePromptType === 'image' ? activeCategory.images : activeCategory.videos).map((promptText, idx) => {
                    const isLocked = idx >= 3; // Zeige nur die ersten 3 Prompts lesbar an
                    return (
                      <div 
                        key={idx} 
                        className="glass-panel" 
                        style={{ 
                          padding: '1.2rem', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          gap: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ flex: 1, filter: isLocked ? 'blur(4px)' : 'none', opacity: isLocked ? 0.35 : 1, transition: 'all 0.3s' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Prompt #{idx + 1}
                          </span>
                          <p style={{ color: '#fff', fontSize: '0.92rem', lineHeight: '1.5', marginTop: '4px', fontStyle: 'italic' }}>
                            {promptText}
                          </p>
                        </div>

                        {!isLocked ? (
                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button
                              onClick={() => handleCopyPrompt(promptText)}
                              className="btn-outline"
                              title="In Zwischenablage kopieren"
                              style={{ padding: '8px 10px' }}
                            >
                              {copiedPromptText === promptText ? (
                                <Check size={16} style={{ color: '#22c55e' }} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleUsePrompt(promptText, activePromptType)}
                              className="btn-gold"
                              style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}
                            >
                              <Sparkles size={12} />
                              In Generator laden
                            </button>
                          </div>
                        ) : (
                          <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            background: 'rgba(10, 15, 30, 0.5)',
                            padding: '10px'
                          }}>
                            <Link href="/pricing" style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              background: 'var(--primary)', 
                              color: '#fff', 
                              padding: '8px 16px', 
                              borderRadius: '30px', 
                              textDecoration: 'none', 
                              fontSize: '0.82rem', 
                              fontWeight: 700,
                              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                              transition: 'transform 0.2s'
                            }}
                            className="hover-scale"
                            >
                              <Lock size={12} />
                              <span>Prompt-Paket freischalten 🔓</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* FAQ Bereich (Akkordeon) */}
              <section className="glass-panel" style={{ padding: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <HelpCircle size={26} style={{ color: 'var(--primary)' }} />
                  Häufig gestellte Fragen (FAQ)
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {FAQS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div 
                        key={index} 
                        style={{ 
                          borderBottom: '1px solid var(--border-color)', 
                          paddingBottom: '1rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: isOpen ? 'var(--primary)' : '#fff' }}>
                            {faq.question}
                          </h3>
                          <ChevronDown 
                            size={18} 
                            style={{ 
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                              transition: 'transform 0.2s',
                              color: 'var(--text-dim)'
                            }} 
                          />
                        </div>
                        {isOpen && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', padding: '10px 0 5px 0' }}>
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>

            </div>
          </>
        )}
      </main>

      {/* Vollbild Modal */}
      {isFullsizeOpen && activeMediaUrl && (
        <div className="modal-overlay" onClick={() => setIsFullsizeOpen(false)}>
          <button 
            onClick={() => setIsFullsizeOpen(false)}
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'rgba(255,255,255,0.1)', 
              border: 'none', 
              borderRadius: '50%', 
              padding: '10px', 
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={activeMediaUrl} 
            alt="Fullsize Result" 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Rechtlicher Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '2rem 0', 
        marginTop: '4rem', 
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
