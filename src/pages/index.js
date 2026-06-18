import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
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
  Check,
  Globe,
  ShoppingBag,
  ArrowRight
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
  },
  {
    question: "Was sind die Nischenprompts und wie verwende ich sie?",
    answer: "Unsere Nischenprompts sind vorformulierte, professionell erprobte Texteingaben für spezielle Branchen (z. B. Immobilien, Gastronomie, Hochzeiten). Du kannst sie über das Menü auswählen, anpassen und mit einem Klick auf 'In Generator laden' direkt in das Erstellungs-Dashboard einfügen."
  },
  {
    question: "Warum sind die Prompts auf Englisch, obwohl deutsche Übersetzungen dabei stehen?",
    answer: "Die modernsten KI-Bild- und Videomodelle verstehen Englisch weitaus präziser als andere Sprachen. Um dir die Auswahl zu erleichtern, haben wir deutsche Kurzübersetzungen hinzugefügt (diese sind kopiergeschützt). Kopiere oder lade jedoch stets den englischen Prompt in den Generator für bestmögliche, fotorealistische Resultate."
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
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
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
  const [imageErrors, setImageErrors] = useState({})
  
  // States für Bildgenerator Referenzbild (Img2Img)
  const [refImageFile, setRefImageFile] = useState(null)
  const [refImageUrl, setRefImageUrl] = useState('')
  const [imageGenStrength, setImageGenStrength] = useState(0.65)

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

    // Nischenprompt aus Session laden (falls von prompts.js weitergeleitet)
    const sessionPrompt = sessionStorage.getItem('selected_prompt_text')
    const sessionPromptType = sessionStorage.getItem('selected_prompt_type')
    if (sessionPrompt) {
      setPrompt(sessionPrompt)
      if (sessionPromptType === 'image') {
        setActiveTab('image-gen')
      } else {
        setActiveTab('text-to-video')
      }
      sessionStorage.removeItem('selected_prompt_text')
      sessionStorage.removeItem('selected_prompt_type')
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
    
    if (gens) {
      // Filtere Einträge heraus, die dauerhaft im Status 'starting'/'processing' hängen (älter als 5 Minuten)
      const now = new Date()
      const filteredGens = gens.filter(gen => {
        if (gen.status === 'starting' || gen.status === 'processing') {
          const createdAt = new Date(gen.created_at)
          const diffMinutes = (now - createdAt) / 1000 / 60
          return diffMinutes < 5 // Behalte sie nur, wenn sie jünger als 5 Minuten sind
        }
        return true // Erfolgreiche oder definitiv fehlgeschlagene immer anzeigen
      })
      setHistory(filteredGens)
    }
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

  const handleGuestLogin = async () => {
    setAuthLoading(true)
    setAuthMessage('')
    try {
      // 1. Versuche einzuloggen
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'gast@my-digital-world.de',
        password: 'gastzugang123',
      })
      
      if (error) {
        // 2. Falls der Account noch nicht existiert, registriere ihn automatisch
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'gast@my-digital-world.de',
          password: 'gastzugang123',
        })
        
        if (signUpError) throw signUpError
        
        // Nach Registrierung einloggen
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
      setAuthMessage(`Gast-Login Fehler: ${err.message}`)
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

  const handleRefImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setRefImageFile(file)
      setRefImageUrl(URL.createObjectURL(file))
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
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
      let finalImageUrl = null
      if (activeTab === 'image-to-video' && imageFile) {
        finalImageUrl = await fileToBase64(imageFile)
      }

      let finalRefImageUrl = null
      if (activeTab === 'image-gen' && refImageFile) {
        finalRefImageUrl = await fileToBase64(refImageFile)
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab === 'image-gen' ? 'image' : (activeTab === 'image-to-video' ? 'image-to-video' : 'video'),
          prompt: finalPrompt,
          imageUrl: finalImageUrl,
          refImageUrl: finalRefImageUrl,
          promptStrength: imageGenStrength,
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
    setGenerationProgress(10)
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) return 95
        const increment = prev < 50 ? 5 : (prev < 80 ? 2 : 0.5)
        return prev + increment
      })
    }, 500)

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status?id=${id}`)
        const data = await response.json()

        if (data.status === 'succeeded') {
          clearInterval(interval)
          clearInterval(progressInterval)
          setGenerationProgress(100)
          setTimeout(() => {
            setPrediction(data)
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
        console.error('Polling Fehler:', err)
      }
    }, 4000)
  }

  const pollPrediction = async (id) => {
    setGenerationProgress(5)
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) return 95
        const increment = prev < 50 ? 5 : (prev < 80 ? 2 : 0.5)
        return prev + increment
      })
    }, 500)

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status?id=${id}`)
        const data = await response.json()

        if (data.status === 'succeeded') {
          clearInterval(interval)
          clearInterval(progressInterval)
          setGenerationProgress(100)
          setTimeout(() => {
            setSelectedArchiveItem(null) // Archiv-Auswahl zurücksetzen!
            
            // Wichtig: Replicate liefert 'output' zurück (als Array oder String). 
            // Wir weisen es activeMediaUrl-kompatibel als 'output_url' zu.
            const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output
            const formattedData = {
              ...data,
              output_url: outputUrl
            }
            
            setPrediction(formattedData) // Setzt das neue Bild als aktive prediction
            setIsGenerating(false)
            loadUserStats(user.id) // Lädt die Historie neu
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

  const activeGen = selectedArchiveItem 
    ? selectedArchiveItem 
    : history.find(h => h.prediction_id === prediction?.id)

  const handleShareToggle = async (gen) => {
    if (!gen) return
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genId: gen.id,
          isPublic: !gen.is_public,
          userId: user.id
        })
      })
      const data = await response.json()
      if (response.ok) {
        setHistory(prev => prev.map(item => item.id === gen.id ? { ...item, is_public: data.isPublic } : item))
        if (selectedArchiveItem && selectedArchiveItem.id === gen.id) {
          setSelectedArchiveItem(prev => ({ ...prev, is_public: data.isPublic }))
        }
      } else {
        alert(data.error || 'Fehler beim Teilen.')
      }
    } catch (err) {
      console.error(err)
      alert('Netzwerkfehler beim Teilen.')
    }
  }

  const activeMediaUrl = selectedArchiveItem 
    ? selectedArchiveItem.output_url 
    : (prediction?.output_url ? prediction.output_url : null)

  const isCurrentImage = selectedArchiveItem 
    ? selectedArchiveItem.type === 'image' 
    : (prediction?.type === 'image' || (activeMediaUrl && /\.(webp|png|jpe?g)(?:\?.*)?$/i.test(activeMediaUrl)))

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)' }}>
      <Head>
        <title>AI Bild & Videogenerator - 1080p Full-HD Medien mit KI erstellen</title>
        <meta name="description" content="Erstelle atemberaubende, hochauflösende KI-Bilder und Videos in 1080p Full-HD. Nutze professionelle Nischenprompts für Marketing, Immobilien, E-Commerce und mehr." />
        <meta name="keywords" content="AI Video Generator, KI Video Generator, KI Bildgenerator, Text to Video, Image to Video, 1080p Video erstellen, Flux AI, Luma Dream Machine, Nischenprompts" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="AI Bild & Videogenerator - 1080p Full-HD Medien mit KI erstellen" />
        <meta property="og:description" content="Erstelle hochauflösende KI-Bilder und Videos in 1080p Full-HD mit modernen KI-Modellen." />
        <meta property="og:type" content="website" />
      </Head>
      {/* Header */}
      <header className="header">
        <Link href="/" className="brand">
          <span>AI Bild & Videogenerator</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

                {authMode === 'login' && (
                  <button 
                    type="button" 
                    onClick={handleGuestLogin} 
                    disabled={authLoading} 
                    className="btn-outline" 
                    style={{ width: '100%', marginTop: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }}
                  >
                    Als Gast ausprobieren (Ohne Registrierung) 🚀
                  </button>
                )}
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
              <div className="glass-panel" style={{ padding: '1.8rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="tab-headers" style={{ marginBottom: '1.8rem' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', flex: 1, justifyContent: 'space-between' }}>
                  
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

                  {activeTab === 'image-gen' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Referenzbild hochladen (Optional)</span>
                      <div style={{ 
                        border: '2px dashed var(--border-color)', 
                        borderRadius: '10px', 
                        padding: '1.5rem', 
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: refImageUrl ? 'none' : 'rgba(30, 41, 66, 0.2)',
                        position: 'relative'
                      }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleRefImageUpload} 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        {refImageUrl ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={refImageUrl} alt="Reference source" style={{ maxHeight: '120px', borderRadius: '8px', margin: '0 auto' }} />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setRefImageFile(null);
                                setRefImageUrl('');
                              }}
                              className="btn-outline"
                              style={{ position: 'absolute', top: '-10px', right: '-10px', padding: '4px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: '#fff', height: '24px', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
                            <Upload size={20} />
                            <span style={{ fontSize: '0.8rem' }}>Bild als Stil- oder Layout-Vorlage (Dev-Modell)</span>
                          </div>
                        )}
                      </div>

                      {refImageUrl && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <span>Veränderungs-Stärke:</span>
                            <span style={{ color: 'var(--primary)' }}>{Math.round(imageGenStrength * 100)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="0.9" 
                            step="0.05"
                            value={imageGenStrength}
                            onChange={(e) => setImageGenStrength(parseFloat(e.target.value))}
                            style={{ 
                              width: '100%', 
                              accentColor: 'var(--primary)', 
                              background: 'var(--bg-input)', 
                              height: '6px', 
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: '1.3' }}>
                            Niedrig = Sehr nah am Originalbild. Hoch = Stark verändert gemäß Prompt.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Beschreibung (Prompt)</span>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link 
                          href="/prompts"
                          className="btn-outline"
                          style={{ 
                            padding: '4px 10px', 
                            fontSize: '0.75rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            borderColor: 'var(--text-muted)',
                            color: 'var(--text-muted)',
                            textDecoration: 'none'
                          }}
                        >
                          <Book size={12} />
                          Nischenprompts
                        </Link>

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
                          {isTranslating ? 'Übersetze...' : 'Übersetzen 🇩🇪 ➔ 🇺🇸'}
                        </button>
                      </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', position: 'relative', width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                   {isGenerating || isEnhancing ? (
                    <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 20px', boxSizing: 'border-box' }}>
                      <div className="shimmer-bg" style={{ width: '100%', height: '180px', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
                      <h3>{isEnhancing ? 'Bild wird hochskaliert (Enhance)...' : 'Dein Kunstwerk wird generiert...'}</h3>
                      
                      {/* Fortschrittsbalken */}
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '4px', 
                        marginTop: '15px', 
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ 
                          width: `${generationProgress}%`, 
                          height: '100%', 
                          background: 'var(--gradient-neon)', 
                          boxShadow: 'var(--shadow-neon)',
                          transition: 'width 0.4s ease-out',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                        <span>Status: {generationProgress < 20 ? 'Warteschlange...' : (generationProgress < 85 ? 'Generiere Medien...' : 'Finalisiere...')}</span>
                        <span>{Math.round(generationProgress)}%</span>
                      </div>
                      
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '12px' }}>Bitte verlasse diese Seite nicht.</p>
                    </div>
                  ) : activeMediaUrl ? (
                    <div style={{ width: '100%', maxWidth: '700px', position: 'relative', boxSizing: 'border-box' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
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
                          style={{ width: '100%', maxWidth: '100%', borderRadius: '12px', maxHeight: '500px', objectFit: 'contain', display: 'block' }} 
                        />
                      ) : (
                        <video 
                          src={activeMediaUrl} 
                          controls 
                          autoPlay 
                          loop 
                          style={{ width: '100%', maxWidth: '100%', borderRadius: '12px', display: 'block' }}
                        />
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
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
                          
                          {activeGen && (
                            <button
                              onClick={() => handleShareToggle(activeGen)}
                              className="btn-outline"
                              style={{ 
                                borderColor: activeGen.is_public ? '#ef4444' : 'var(--primary)', 
                                color: activeGen.is_public ? '#ef4444' : 'var(--primary)', 
                                display: 'flex', 
                                gap: '8px', 
                                alignItems: 'center' 
                              }}
                            >
                              <span>🌐</span>
                              {activeGen.is_public ? 'Aus Galerie entfernen' : 'In Galerie teilen'}
                            </button>
                          )}
                        </div>
                        
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
                    <div style={{ width: '100%', maxWidth: '700px', position: 'relative', boxSizing: 'border-box', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                          Beispiel-Generierung:
                        </h3>
                      </div>
                      
                      <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                        <video 
                          src="/beispiel.mp4" 
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          style={{ width: '100%', maxWidth: '100%', borderRadius: '12px', display: 'block' }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(10, 15, 29, 0.9)',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#fff',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid var(--border-color)',
                          whiteSpace: 'nowrap',
                          boxShadow: 'var(--shadow-neon)'
                        }}>
                          Melde dich an und erschaffe dein eigenes Video! ✨
                        </div>
                      </div>
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
                    <div className="archive-grid">
                      {history.map((gen) => (
                        <div 
                          key={gen.id} 
                          onClick={() => {
                            setPrediction(null) // Vorherige Generierungs-Vorschau zurücksetzen!
                            setSelectedArchiveItem(gen)
                          }}
                          className="archive-card glass-panel animate-hover" 
                          style={{ 
                            border: selectedArchiveItem?.id === gen.id ? '2px solid var(--primary)' : '1px solid var(--border-color)'
                          }}
                        >
                          {gen.status === 'succeeded' ? (
                            imageErrors[gen.id] ? (
                              <div style={{ height: '90px', background: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                                {gen.type === 'image' ? <ImageIcon size={20} /> : <Video size={20} />}
                                <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                                  {gen.type === 'image' ? 'Bild abgelaufen' : 'Video abgelaufen'}
                                </span>
                              </div>
                            ) : (gen.type === 'image' || (gen.output_url && /\.(webp|png|jpe?g)(?:\?.*)?$/i.test(gen.output_url))) ? (
                              <img 
                                src={gen.output_url} 
                                alt="Vorschau" 
                                className="archive-card-media" 
                                onError={() => setImageErrors(prev => ({ ...prev, [gen.id]: true }))}
                              />
                            ) : (
                              <div style={{ position: 'relative', height: '100%' }}>
                                <video 
                                  src={gen.output_url} 
                                  className="archive-card-media" 
                                  onError={() => setImageErrors(prev => ({ ...prev, [gen.id]: true }))}
                                />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '6px' }}>
                                  <Play size={16} style={{ color: '#fff' }} />
                                </div>
                              </div>
                            )
                          ) : gen.status === 'failed' ? (
                            <div style={{ height: '90px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                              <X size={20} />
                              <span style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: 600 }}>Fehlgeschlagen</span>
                            </div>
                          ) : (
                            <div className="shimmer-bg" style={{ height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                              <Clock className="animate-spin" size={18} />
                              <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>Generiere...</span>
                            </div>
                          )}
                          <div style={{ padding: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)', flex: 1 }}>
                              {gen.prompt}
                            </p>
                            {gen.is_public && (
                              <span title="In Galerie geteilt" style={{ fontSize: '0.75rem', marginLeft: '6px' }}>🌐</span>
                            )}
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
              <section className="features-grid">
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

              {/* NEU: E-Commerce & Produktfotografie Banner */}
              <section className="glass-panel animate-hover" style={{ padding: '2rem 3rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-neon)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--secondary)' }}>
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Onlineshop & Produkt-Studio 🛍️</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>Mache aus einfachen Produktfotos verkaufsstarke High-End-Motive für Shopify, Amazon & Social Media.</p>
                  </div>
                </div>
                <Link href="/ecommerce" className="btn-gold" style={{ background: 'var(--gradient-gold)', textDecoration: 'none', display: 'flex', gap: '8px', alignItems: 'center', whiteSpace: 'nowrap' }}>
                  Fotostudio öffnen
                  <ArrowRight size={16} />
                </Link>
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
