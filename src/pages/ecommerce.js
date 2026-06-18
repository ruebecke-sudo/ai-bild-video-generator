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
  Upload,
  Trash2,
  Download,
  Loader2,
  Sliders,
  ArrowRight,
  RefreshCw,
  Lock,
  Zap
} from 'lucide-react'

const PRODUCT_PROMPTS = [
  {
    title: "Edle Spirituosen & Getränke (Whiskey, Gin etc.)",
    desc: "Platziert Flaschen in einem edlen, warmen Bar-Ambiente mit stimmungsvollem Rauch.",
    prompt: "High-end commercial product photography of an amber whiskey glass bottle, placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind the bottle. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting.",
    translation: "Hochwertige kommerzielle Produktfotografie einer bernsteinfarbenen Whiskey-Glasflasche auf einer dunklen, polierten Marmorbar. Daneben ein Kristallglas mit Eis. Dramatischer goldener Rauch steigt hinter der Flasche auf. Luxuriöser Bar-Hintergrund mit warmen Lichtern.",
    type: "ecommerce"
  },
  {
    title: "Parfüm & Kosmetik (Wellness & Luxus)",
    desc: "Platziert Tiegel, Tuben und Flakons auf nassen Steinen mit natürlichen Lichtstrahlen.",
    prompt: "Minimalist luxury product photography of perfume bottle, standing on a wet dark volcanic rock plate with water droplets. Volumetric sunlight rays piercing through dark sand, elegant stone blocks, packaging, cinematic shadows, highly detailed.",
    translation: "Minimalistische Luxus-Produktfotografie einer Parfümflasche auf einer nassen, dunklen Vulkansteinplatte mit Wassertropfen. Sonnenstrahlen scheinen durch dunklen Sand, elegante Steinblöcke, filmische Schatten.",
    type: "ecommerce"
  },
  {
    title: "Sneaker & Streetwear (Dynamisch & Modern)",
    desc: "Lässt Sneaker und Kleidung mit explodierenden Farb- und Wassereffekten in der Luft schweben.",
    prompt: "Professional studio commercial shot of a brand new sneaker, floating in mid-air. Splashes of colorful neon water and liquid paint exploding around the shoe. Dark background with blue and purple studio backlighting, high speed action photography, sharp details.",
    translation: "Professionelles Studio-Werbebild eines brandneuen Sneakers, der in der Luft schwebt. Bunte Neon-Wasserspritzer und flüssige Farbe explodieren um den Schuh. Dunkler Hintergrund mit blau-violetter Beleuchtung.",
    type: "ecommerce"
  }
]

export default function EcommerceLanding() {
  // Auth & Account
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState('')

  // Generator States
  const [refImageFile, setRefImageFile] = useState(null)
  const [refImageUrl, setRefImageUrl] = useState('/whiskey-before.png')
  const [prompt, setPrompt] = useState('High-end commercial product photography of an amber whiskey glass bottle, placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind the bottle. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting.')
  const [promptStrength, setPromptStrength] = useState(0.7)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [mode, setMode] = useState('image') // 'image' | 'video'
  
  // Statuses
  const [isRemovingBg, setIsRemovingBg] = useState(false)
  const [removeBgProgress, setRemoveBgProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancingProgress, setEnhancingProgress] = useState(0)

  // Copy helper
  const [copiedText, setCopiedText] = useState('')

  // Predictions output
  const [prediction, setPrediction] = useState({
    id: 'demo-whiskey',
    output_url: '/whiskey-after.png',
    status: 'succeeded'
  })

  useEffect(() => {
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
      } else {
        setCredits(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Falls der Benutzer noch das Standard-Demoszenario verwendet, passen wir das Vorschaubild und die Prediction an
    if (refImageUrl === '/whiskey-before.png' || refImageUrl === '') {
      if (mode === 'image') {
        setPrediction({
          id: 'demo-whiskey',
          output_url: '/whiskey-after.png',
          status: 'succeeded'
        })
      } else {
        setPrediction({
          id: 'demo-video',
          output_url: '/beispiel.mp4',
          status: 'succeeded'
        })
      }
    }
  }, [mode])

  const loadUserStats = async (userId) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
      if (!userError && userData?.user?.email === 'gast@my-digital-world.de') {
        setCredits(9999)
        return
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single()

      if (data) setCredits(data.credits)
    } catch (err) {
      console.error(err)
    }
  }

  // --- Auth Handlers ---
  const handleSignIn = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user)
      loadUserStats(data.user.id)
    } catch (err) {
      setAuthMessage(`Fehler: ${err.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setAuthMessage('Registrierung erfolgreich! Bitte logge dich jetzt ein.')
      setAuthMode('login')
    } catch (err) {
      setAuthMessage(`Fehler: ${err.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setAuthLoading(true)
    setAuthMessage('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'gast@my-digital-world.de',
        password: 'gastzugang123',
      })
      if (error) {
        // Falls nicht existiert, registrieren
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'gast@my-digital-world.de',
          password: 'gastzugang123',
        })
        if (signUpError) throw signUpError
        const { data: logInData, error: logInError } = await supabase.auth.signInWithPassword({
          email: 'gast@my-digital-world.de',
          password: 'gastzugang123',
        })
        if (logInError) throw logInError
        setUser(logInData.user)
        loadUserStats(logInData.user.id)
      } else {
        setUser(data.user)
        loadUserStats(data.user.id)
      }
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
    setPrediction(null)
    setRefImageUrl('')
    setRefImageFile(null)
    setPrompt('')
    setPassword('')
    setAuthMessage('')
  }

  // --- Image Upload Helper ---
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setRefImageFile(file)
      setRefImageUrl(URL.createObjectURL(file))
      setPrediction(null)
    }
  }

  // --- Background Removal ---
  const handleRemoveBackground = async () => {
    if (!user) {
      alert('Bitte melde dich an, um die Freistellungs-Funktion zu nutzen.')
      return
    }
    if (!refImageUrl) {
      alert('Bitte lade zuerst ein Produktfoto hoch.')
      return
    }

    setIsRemovingBg(true)
    setRemoveBgProgress(10)
    
    // Simulate initial progress
    const progressInterval = setInterval(() => {
      setRemoveBgProgress(prev => {
        if (prev >= 90) return 90
        return prev + 10
      })
    }, 400)

    try {
      let base64Image = ''
      if (refImageFile) {
        base64Image = await fileToBase64(refImageFile)
      } else {
        base64Image = refImageUrl // Falls bereits ein URL-Format vorliegt
      }

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: base64Image,
          userId: user.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        setCredits(data.creditsLeft)
        pollRemoveBg(data.predictionId, progressInterval)
      } else {
        alert(data.error || 'Fehler beim Freistellen.')
        setIsRemovingBg(false)
        clearInterval(progressInterval)
      }
    } catch (err) {
      console.error(err)
      alert('Netzwerkfehler.')
      setIsRemovingBg(false)
      clearInterval(progressInterval)
    }
  }

  const pollRemoveBg = async (id, progressInterval) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status?id=${id}`)
        const data = await response.json()

        if (data.status === 'succeeded') {
          clearInterval(interval)
          clearInterval(progressInterval)
          setRemoveBgProgress(100)
          
          const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output
          setTimeout(() => {
            setRefImageUrl(outputUrl)
            setRefImageFile(null) // Dateihandle verwerfen, da wir nun die Remote-URL nutzen
            setIsRemovingBg(false)
            alert('Hintergrund erfolgreich entfernt!')
          }, 800)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          clearInterval(progressInterval)
          alert('Freistellen fehlgeschlagen.')
          setIsRemovingBg(false)
        }
      } catch (err) {
        console.error('Polling Fehler:', err)
      }
    }, 3000)
  }

  // --- Generation Logic ---
  const handleStartGeneration = async () => {
    if (!user) {
      alert('Bitte logge dich zuerst ein!')
      return
    }
    if (!refImageUrl) {
      alert('Bitte lade ein Produktfoto hoch (Schritt 1) und nutze es für die Generierung.')
      return
    }
    if (!prompt) {
      alert('Bitte wähle einen Prompt oder tippe eine Beschreibung ein.')
      return
    }

    setIsGenerating(true)
    setPrediction(null)
    setGenerationProgress(5)

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) return 95
        const increment = prev < 50 ? 5 : (prev < 80 ? 2 : 0.5)
        return prev + increment
      })
    }, 500)

    try {
      let base64Image = ''
      if (refImageFile) {
        base64Image = await fileToBase64(refImageFile)
      } else {
        base64Image = refImageUrl
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode === 'image' ? 'ecommerce' : 'ecommerce-video',
          prompt: prompt,
          refImageUrl: base64Image,
          promptStrength: promptStrength,
          aspect_ratio: aspectRatio,
          userId: user.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        setCredits(data.creditsLeft)
        pollGeneration(data.predictionId, progressInterval)
      } else {
        alert(data.error || 'Fehler bei der Generierung.')
        setIsGenerating(false)
        clearInterval(progressInterval)
      }
    } catch (err) {
      console.error(err)
      alert('Netzwerkfehler.')
      setIsGenerating(false)
      clearInterval(progressInterval)
    }
  }

  const pollGeneration = async (id, progressInterval) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status?id=${id}`)
        const data = await response.json()

        if (data.status === 'succeeded') {
          clearInterval(interval)
          clearInterval(progressInterval)
          setGenerationProgress(100)
          
          const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output
          const formattedData = {
            ...data,
            output_url: outputUrl
          }
          
          setTimeout(() => {
            setPrediction(formattedData)
            setIsGenerating(false)
            loadUserStats(user.id)
          }, 800)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          clearInterval(progressInterval)
          alert('Generierung fehlgeschlagen.')
          setIsGenerating(false)
        }
      } catch (err) {
        console.error('Polling Fehler:', err)
      }
    }, 4000)
  }

  // --- High Res Enhancer ---
  const handleEnhanceImage = async () => {
    if (!prediction || !prediction.output_url) return
    if (credits < 1) {
      alert('Nicht genügend Credits. Das Upscaling kostet 1 Credit.')
      return
    }

    setIsEnhancing(true)
    setEnhancingProgress(10)

    const progressInterval = setInterval(() => {
      setEnhancingProgress(prev => {
        if (prev >= 95) return 95
        return prev + 5
      })
    }, 400)

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: prediction.output_url,
          userId: user.id
        })
      })

      const data = await response.json()
      if (response.ok) {
        setCredits(data.creditsLeft)
        pollEnhance(data.predictionId, progressInterval)
      } else {
        alert(data.error || 'Bildverbesserung fehlgeschlagen.')
        setIsEnhancing(false)
        clearInterval(progressInterval)
      }
    } catch (err) {
      console.error(err)
      alert('Netzwerkfehler.')
      setIsEnhancing(false)
      clearInterval(progressInterval)
    }
  }

  const pollEnhance = async (id, progressInterval) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status?id=${id}`)
        const data = await response.json()

        if (data.status === 'succeeded') {
          clearInterval(interval)
          clearInterval(progressInterval)
          setEnhancingProgress(100)
          
          const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output
          setTimeout(() => {
            setPrediction(prev => ({ ...prev, output_url: outputUrl }))
            setIsEnhancing(false)
            loadUserStats(user.id)
            alert('Bild erfolgreich hochskaliert!')
          }, 800)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          clearInterval(progressInterval)
          alert('Bildverbesserung fehlgeschlagen.')
          setIsEnhancing(false)
        }
      } catch (err) {
        console.error(err)
      }
    }, 4000)
  }

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(''), 2500)
  }

  const handleUsePrompt = (text) => {
    setPrompt(text)
    // Scrollen zum Generator-Bereich
    document.getElementById('ecommerce-generator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Head>
        <title>KI-Produktfotografie & Studio für Onlineshops | AI Video Generator</title>
        <meta name="description" content="Erstelle aus einfachen Produktfotos spektakuläre Werbebilder für deinen Onlineshop. Fotostudio-Qualität inklusive Freistellungs-Funktion dank modernster KI." />
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
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Abmelden
              </button>
            </>
          ) : null}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Title Section */}
        <div style={{ textAlign: 'center', margin: '4rem 0 3rem 0' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(249, 115, 22, 0.1)', padding: '6px 14px', borderRadius: '20px' }}>
            Integrierter KI-Produktfoto-Generator 🛍️
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '1.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.2' }}>
            KI-Fotostudio & Freisteller für dein E-Commerce
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Lade dein Produktfoto hoch, entferne unschöne Hintergründe mit einem Klick und lasse unsere KI ein verkaufsstarkes Werbemotiv in Fotostudio-Qualität erstellen.
          </p>
        </div>

        {/* --- DYNAMISCHER GENERATOR-BEREICH --- */}
        <section id="ecommerce-generator" className="glass-panel" style={{ padding: '2.5rem', marginBottom: '4rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-neon)' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Sparkles style={{ color: 'var(--secondary)' }} />
            Dein KI-Studio Generator
          </h2>

          {!user ? (
            /* Auth Box falls nicht eingeloggt */
            <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }} className="glass-panel">
              <Lock size={48} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Anmelden zur Generierung</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Bitte logge dich ein oder nutze den kostenfreien Demo-Modus, um Bilder freizustellen und Werbemotive zu erstellen.
              </p>

              <form onSubmit={authMode === 'login' ? handleSignIn : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="email" 
                  placeholder="E-Mail" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Passwort" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
                {authMessage && <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>{authMessage}</p>}
                
                <button type="submit" className="btn-gold" style={{ background: 'var(--gradient-gold)', padding: '12px' }} disabled={authLoading}>
                  {authLoading ? <Loader2 className="animate-spin" size={18} /> : (authMode === 'login' ? 'Anmelden' : 'Registrieren')}
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  {authMode === 'login' ? 'Noch kein Konto? Registrieren' : 'Bereits registriert? Einloggen'}
                </button>
                <div style={{ margin: '10px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>oder</div>
                <button onClick={handleGuestLogin} className="btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }} disabled={authLoading}>
                  <Sparkles size={16} /> Gast-Modus starten (kostenlos)
                </button>
              </div>
            </div>
          ) : (
            /* Generator UI wenn eingeloggt */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', flexWrap: 'wrap' }} className="features-grid">
              
              {/* Linke Spalte: Upload & Einstellungen */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                
                {/* Modus-Wähler */}
                <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setMode('image')}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: mode === 'image' ? 'var(--primary)' : 'transparent',
                      color: mode === 'image' ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <ImageIcon size={16} />
                    Bild erstellen (2 Credits)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('video')}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: mode === 'video' ? 'var(--primary)' : 'transparent',
                      color: mode === 'video' ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Video size={16} />
                    Video erstellen (5 Credits)
                  </button>
                </div>

                {/* Schritt 1: Produktfoto hochladen */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'var(--secondary)', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                    Produktfoto hochladen
                  </h3>
                  
                  {!refImageUrl ? (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '3rem 1rem', cursor: 'pointer', background: 'rgba(255,255,255,0.01)', transition: 'border-color 0.3s' }}>
                      <Upload size={32} style={{ color: 'var(--text-dim)', marginBottom: '0.8rem' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Klicke hier oder ziehe ein Foto hinein</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>PNG, JPG oder WEBP</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  ) : (
                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={refImageUrl} alt="Produkt Vorschau" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)' }} />
                      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => { setRefImageUrl(''); setRefImageFile(null); }}
                          className="btn-outline" 
                          style={{ background: 'rgba(20, 30, 50, 0.85)', padding: '8px', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                          title="Bild löschen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schritt 2: Hintergrund entfernen (Freisteller) */}
                {refImageUrl && (
                  <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.05)', border: '1px dashed var(--secondary)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Hintergrund unordentlich?
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                      Entferne den aktuellen Hintergrund deines Produktes automatisch mit unserer integrierten KI, um eine perfekte Verschmelzung mit dem neuen Hintergrund zu garantieren.
                    </p>
                    <button 
                      onClick={handleRemoveBackground}
                      className="btn-gold" 
                      style={{ background: 'var(--gradient-gold)', display: 'flex', gap: '8px', alignItems: 'center', width: '100%', justifyContent: 'center' }}
                      disabled={isRemovingBg || isGenerating}
                    >
                      {isRemovingBg ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Hintergrund wird entfernt ({removeBgProgress}%)
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          Hintergrund entfernen (Kosten: 1 Credit)
                        </>
                      )}
                    </button>
                    {isRemovingBg && (
                      <div className="progress-bar-container" style={{ marginTop: '10px', height: '6px' }}>
                        <div className="progress-bar-fill" style={{ width: `${removeBgProgress}%`, background: 'var(--secondary)' }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Schritt 3: Szenerie & Design-Prompt */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'var(--secondary)', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                    Szenerie & Design-Prompt wählen
                  </h3>
                  
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Beschreibe das gewünschte Ambiente (z. B. 'High-end product photography, luxury stone block counter, soft morning sun, botanical background')"
                    className="input-field"
                    style={{ minHeight: '100px', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Tipp: Klicke unten auf eine unserer Vorlagen, um einen Prompt automatisch einzufügen!
                  </div>
                </div>

                {/* Einstellungen */}
                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders size={16} style={{ color: 'var(--primary)' }} />
                    Erweiterte Einstellungen
                  </h4>
                  
                  {/* Prompt Strength */}
                  {mode === 'image' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Bildtreue (Prompt-Stärke):</span>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{Math.round(promptStrength * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.05"
                        value={promptStrength}
                        onChange={(e) => setPromptStrength(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                      />
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                        Höhere Werte verändern das Produktfoto stärker. Empfohlen: 65% - 75% für beste Konsistenz.
                      </div>
                    </div>
                  )}

                  {/* Aspekt-Verhältnis */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Format:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {['1:1', '4:5', '16:9', '9:16'].map(ratio => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          style={{
                            padding: '6px 0',
                            borderRadius: '6px',
                            background: aspectRatio === ratio ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                            color: aspectRatio === ratio ? '#000' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: aspectRatio === ratio ? 'var(--primary)' : 'var(--border-color)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generieren Button */}
                 <button 
                   onClick={handleStartGeneration}
                   className="btn-gold"
                   style={{ background: 'var(--gradient-gold)', padding: '14px', fontSize: '1rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                   disabled={isGenerating || isRemovingBg}
                 >
                   {isGenerating ? (
                     <>
                       <Loader2 className="animate-spin" size={20} />
                       {mode === 'image' ? 'Erstelle Werbebild' : 'Erstelle Werbevideo'} ({generationProgress}%)
                     </>
                   ) : (
                     <>
                       <Sparkles size={20} />
                       {mode === 'image' ? 'Werbebild erstellen (Kosten: 2 Credits)' : 'Werbevideo erstellen (Kosten: 5 Credits)'}
                     </>
                   )}
                 </button>

                {isGenerating && (
                  <div className="progress-bar-container" style={{ height: '8px' }}>
                    <div className="progress-bar-fill" style={{ width: `${generationProgress}%` }} />
                  </div>
                )}

              </div>

              {/* Rechte Spalte: Output */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '350px', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'rgba(0,0,0,0.15)', padding: '2rem' }}>
                {prediction && prediction.output_url ? (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
                      {prediction.output_url.endsWith('.mp4') || prediction.id === 'demo-video' ? 'Generiertes Studio-Werbevideo' : 'Generiertes Studio-Werbebild'}
                    </h3>
                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'inline-block', maxWidth: '100%' }}>
                      {prediction.output_url.endsWith('.mp4') || prediction.id === 'demo-video' ? (
                        <video 
                          src={prediction.output_url} 
                          controls 
                          loop 
                          autoPlay 
                          muted 
                          style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px' }} 
                        />
                      ) : (
                        <img 
                          src={prediction.output_url} 
                          alt="Generiertes E-Commerce Bild" 
                          style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px' }} 
                        />
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                      <a 
                        href={prediction.output_url} 
                        download={`product-studio-${prediction.id}${prediction.output_url.endsWith('.mp4') ? '.mp4' : '.png'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-gold"
                        style={{ background: 'var(--gradient-gold)', textDecoration: 'none', display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 20px' }}
                      >
                        <Download size={16} />
                        Downloaden
                      </a>
                      
                      {!(prediction.output_url.endsWith('.mp4') || prediction.id === 'demo-video') && (
                        <button 
                          onClick={handleEnhanceImage}
                          className="btn-outline"
                          style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 20px' }}
                          disabled={isEnhancing}
                        >
                          {isEnhancing ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              Verbesse... ({enhancingProgress}%)
                            </>
                          ) : (
                            <>
                              <RefreshCw size={16} />
                              4K High-Res Upscale (1 Credit)
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isEnhancing && (
                      <div className="progress-bar-container" style={{ marginTop: '10px', height: '6px', maxWidth: '300px', margin: '15px auto 0 auto' }}>
                        <div className="progress-bar-fill" style={{ width: `${enhancingProgress}%`, background: 'var(--primary)' }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                    <ImageIcon size={64} style={{ color: 'var(--border-color)', marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1rem', fontWeight: 600 }}>Dein Ergebnis erscheint hier</p>
                    <p style={{ fontSize: '0.85rem', maxWidth: '300px', margin: '0.5rem auto 0 auto', lineHeight: '1.5' }}>
                      Lade links ein Produktbild hoch, wähle ein Design-Szenario und klicke auf Generieren.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </section>

        {/* Vorher Nachher Showcase */}
        <div className="glass-panel features-grid" style={{ padding: '3.5rem', marginBottom: '4rem', border: '1px solid var(--border-color)' }}>
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
                    onClick={() => handleUsePrompt(item.prompt)}
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
