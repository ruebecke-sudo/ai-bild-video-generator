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
  Zap,
  LogOut
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
    title: "Accessoires (Uhren, Schmuck etc.)",
    desc: "Platziert Uhren oder Schmuck auf elegantem Marmor oder Beton.",
    prompt: "High-end luxury commercial shot of a gold wristwatch, resting on a clean minimalist sandstone block, sharp shadows, elegant sunset lighting, 8k, professional jewelry photography.",
    translation: "Hochwertige luxuriöse Werbeaufnahme einer goldenen Armbanduhr auf einem sauberen, minimalistischen Sandsteinblock, scharfe Schatten, elegantes Sonnenuntergangslicht.",
    type: "ecommerce"
  },
  {
    title: "Schokoladenprodukte (Pralinen, Tafeln etc.)",
    desc: "Präsentiert Schokolade cremig schmelzend in warmem Licht.",
    prompt: "Macro studio commercial shot of dark chocolate pieces with golden leaf accents, melted rich chocolate dripping around, cocoa powder dust in the air, warm ambient lighting, highly detailed texture.",
    translation: "Makro-Studioaufnahme von dunklen Schokoladenstücken mit Blattgold-Akzenten, geschmolzene Schokolade tropft herum, Kakaopulver in der Luft, warme Beleuchtung.",
    type: "ecommerce"
  },
  {
    title: "Exklusive Damenmode (Taschen, Kleider etc.)",
    desc: "Platziert Modeprodukte in minimalistisch-architektonischen Kulissen.",
    prompt: "High-end fashion commercial photography of a luxury leather handbag, standing on a sleek concrete architectural pedestal, volumetric sun rays, tropical leaf shadows, modern minimal design.",
    translation: "High-End-Modewerbung einer luxuriösen Lederhandtasche auf einem eleganten, architektonischen Betonpodest, Sonnenstrahlen, tropische Blattschatten.",
    type: "ecommerce"
  },
  {
    title: "Exklusive Herrenmode (Anzüge, Schuhe etc.)",
    desc: "Inszeniert Herrenschnürschuhe oder Anzüge im modernen Studio-Look.",
    prompt: "Professional studio product photography of a classic brown leather dress shoe, isolated on a textured grey background, perfect studio rim lighting, sharp leather texture details, high-end commercial style.",
    translation: "Professionelle Studio-Produktfotografie eines klassischen braunen Lederschuhs, isoliert auf einem strukturierten grauen Hintergrund, perfekte Studio-Randbeleuchtung.",
    type: "ecommerce"
  }
]

const ECOMMERCE_CATEGORIES = [
  { id: 'spirituosen', name: 'Edle Spirituosen & Getränke', icon: '🥃', subject: 'a luxury whiskey bottle' },
  { id: 'kosmetik', name: 'Parfüm & Kosmetik', icon: '🧴', subject: 'a premium perfume bottle' },
  { id: 'accessoires', name: 'Accessoires', icon: '⌚', subject: 'a luxury gold watch' },
  { id: 'schokoladen', name: 'Schokoladenprodukte', icon: '🍫', subject: 'an organic dark chocolate bar' },
  { id: 'damenmode', name: 'Exklusive Damenmode', icon: '👗', subject: 'a designer handbag' },
  { id: 'herrenmode', name: 'Exklusive Herrenmode', icon: '👔', subject: 'a classic leather dress shoe' }
]

const CATEGORY_STYLES = {
  spirituosen: [
    { name: "Marmor Bar", styleId: "marmor_bar", promptPattern: "High-end commercial product photography of [SUBJECT], placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting." },
    { name: "Vulkanstein", styleId: "vulkanstein", promptPattern: "Minimalist luxury product photography of [SUBJECT], standing on a wet dark volcanic rock plate with water droplets. Volumetric sunlight rays piercing through dark sand, elegant stone blocks, packaging, cinematic shadows, highly detailed." },
    { name: "Neon-Splash", styleId: "neon_splash", promptPattern: "Professional studio commercial shot of [SUBJECT], floating in mid-air. Splashes of colorful neon water and liquid paint exploding around. Dark background with blue and purple studio backlighting, high speed action photography, sharp details." },
    { name: "Beton-Podest", styleId: "beton_podest", promptPattern: "Modern studio commercial photography of [SUBJECT], standing on a minimalist architectural concrete pedestal. Warm sunset volumetric rays, palm leaf shadows, premium textures, sharp detail, 8k." },
    { name: "Strand & Sand", styleId: "strand", promptPattern: "Luxury commercial shot of [SUBJECT], resting on wet golden sand with gentle sea foam washing up. Clear water droplets, bright sun rays reflecting off, high contrast, premium summer vibe." },
    { name: "Bio-Natur", styleId: "bio_natur", promptPattern: "Minimalist product shot of [SUBJECT], placed on a light beige sandstone block next to a green monstera leaf. Warm direct sunlight, hard shadows, organic aesthetic, ultra-sharp, professional cosmetic photography." },
    { name: "Cyberpunk", styleId: "cyberpunk", promptPattern: "Spectacular product shot of [SUBJECT], hovering above a neon blue glowing circuit board. Deep shadows, electric blue and purple rim lights, ultra-modern tech aesthetic, razor sharp." },
    { name: "Profi-Küche", styleId: "profi_kueche", promptPattern: "Dramatic product shot of [SUBJECT], embedded in a rustic dark wood chopping board. Scattered fresh herbs, salt dust floating in the air, side studio lighting, sharp texture, high contrast." },
    { name: "Edelschoko", styleId: "edelschoko", promptPattern: "Macro studio shot of [SUBJECT], with gold leaf accents. Melted rich chocolate dripping, dark cocoa powder dusting, warm amber lighting, ultra-realistic texture, 8k." },
    { name: "Weißer HG", styleId: "weisser_hg", promptPattern: "[SUBJECT], isolated on a pure white background, soft studio shadows, professional commercial photography, 8k.", isWhiteBg: true }
  ],
  kosmetik: [
    { name: "Wellness Oase", styleId: "wellness_oase", promptPattern: "Luxury spa cosmetics shot of [SUBJECT], sitting on a wet white marble ledge next to burning incense and soft orchids, warm morning light, zen garden background." },
    { name: "Rosenwasser", styleId: "rosenwasser", promptPattern: "High-end product photography of [SUBJECT], floating on crystal clear water surface with delicate floating pink rose petals, soft pink studio lighting, elegant ripples." },
    { name: "Bambuswald", styleId: "bambuswald", promptPattern: "Organic cosmetics presentation of [SUBJECT], placed on a split bamboo trunk, mist rising in a lush green bamboo forest, soft natural sunbeams, fresh wet textures." },
    { name: "Goldstaub", styleId: "goldstaub", promptPattern: "Elegant studio commercial shot of [SUBJECT], surrounded by swirling fine gold dust and floating gold particles, dark velvet backdrop, dramatic key lighting, luxury look." },
    { name: "Vulkanstein", styleId: "vulkanstein", promptPattern: "Minimalist luxury product photography of [SUBJECT], standing on a wet dark volcanic rock plate with water droplets. Volumetric sunlight rays piercing through dark sand, elegant stone blocks, packaging, cinematic shadows, highly detailed." },
    { name: "Marmor Bad", styleId: "marmor_bad", promptPattern: "Luxury cosmetics shot of [SUBJECT] placed on a clean white Carrera marble bathroom counter, soft towels and a green eucalyptus vase in soft-focus background, bright day light." },
    { name: "Strand & Sand", styleId: "strand", promptPattern: "Luxury commercial shot of [SUBJECT], resting on wet golden sand with gentle sea foam washing up. Clear water droplets, bright sun rays reflecting off, high contrast, premium summer vibe." },
    { name: "Wüstenoase", styleId: "wuestenoase", promptPattern: "Minimalist shot of [SUBJECT] standing on a dry cracked sand block, warm glowing sunset sun behind, warm orange and beige aesthetic, soft shadows." },
    { name: "Cyberpunk", styleId: "cyberpunk", promptPattern: "Spectacular product shot of [SUBJECT], hovering above a neon blue glowing circuit board. Deep shadows, electric blue and purple rim lights, ultra-modern tech aesthetic, razor sharp." },
    { name: "Weißer HG", styleId: "weisser_hg", promptPattern: "[SUBJECT], isolated on a pure white background, soft studio shadows, professional commercial photography, 8k.", isWhiteBg: true }
  ],
  accessoires: [
    { name: "Leder-Unterlage", styleId: "leder_unterlage", promptPattern: "High-end commercial watch photography of [SUBJECT], placed on a dark textured genuine leather desk pad next to a classic fountain pen, rich mahogany wood background, warm moody studio lighting." },
    { name: "Marmor Bar", styleId: "marmor_bar", promptPattern: "High-end commercial product photography of [SUBJECT], placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting." },
    { name: "Beton-Podest", styleId: "beton_podest", promptPattern: "Modern studio commercial photography of [SUBJECT], standing on a minimalist architectural concrete pedestal. Warm sunset volumetric rays, palm leaf shadows, premium textures, sharp detail, 8k." },
    { name: "Wasserspiegel", styleId: "wasserspiegel", promptPattern: "Creative commercial shot of [SUBJECT] resting on a dark glossy mirror surface flooded with thin layer of water, elegant water ripples, dark moody backdrop, high contrast rim lighting." },
    { name: "Goldstaub", styleId: "goldstaub", promptPattern: "Elegant studio commercial shot of [SUBJECT], surrounded by swirling fine gold dust and floating gold particles, dark velvet backdrop, dramatic key lighting, luxury look." },
    { name: "Vulkanstein", styleId: "vulkanstein", promptPattern: "Minimalist luxury product photography of [SUBJECT], standing on a wet dark volcanic rock plate with water droplets. Volumetric sunlight rays piercing through dark sand, elegant stone blocks, packaging, cinematic shadows, highly detailed." },
    { name: "Modernes Büro", styleId: "modernes_buero", promptPattern: "Professional product shot of [SUBJECT] next to a sleek silver laptop on a polished white oak office desk, modern minimalist design, soft window morning light, blurred green office plant." },
    { name: "Neon-Splash", styleId: "neon_splash", promptPattern: "Professional studio commercial shot of [SUBJECT], floating in mid-air. Splashes of colorful neon water and liquid paint exploding around. Dark background with blue and purple studio backlighting, high speed action photography, sharp details." },
    { name: "Strand & Sand", styleId: "strand", promptPattern: "Luxury commercial shot of [SUBJECT], resting on wet golden sand with gentle sea foam washing up. Clear water droplets, bright sun rays reflecting off, high contrast, premium summer vibe." },
    { name: "Weißer HG", styleId: "weisser_hg", promptPattern: "[SUBJECT], isolated on a pure white background, soft studio shadows, professional commercial photography, 8k.", isWhiteBg: true }
  ],
  schokoladen: [
    { name: "Kakaobohnen", styleId: "kakaobohnen", promptPattern: "Macro food photography of [SUBJECT] resting on a rich bed of raw dark cocoa beans and cinnamon sticks, warm amber spot lighting, cozy chocolate factory vibe, high detail." },
    { name: "Schoko-Splash", styleId: "schoko_splash", promptPattern: "Action food shot of [SUBJECT] floating while a splash of thick glossy liquid hot milk chocolate explodes around it, dark warm brown background, professional high speed photography." },
    { name: "Haselnuss-Bett", styleId: "haselnuss_bett", promptPattern: "Macro product shot of [SUBJECT] nestled among whole roasted hazelnuts and dark cocoa powder dusting, rustic dark stone background, dramatic side studio lighting." },
    { name: "Goldfolie", styleId: "goldfolie", promptPattern: "Premium commercial shot of [SUBJECT], with luxury torn gold foil wrapping details, standing on a dark obsidian stone slab, moody dark ambient light, ultra-premium gourmet styling." },
    { name: "Marmor Bar", styleId: "marmor_bar", promptPattern: "High-end commercial product photography of [SUBJECT], placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting." },
    { name: "Patisserie", styleId: "patisserie", promptPattern: "Commercial food shot of [SUBJECT] on a flour-dusted marble kitchen counter next to a pastry chef's whisk and raw chocolate blocks, warm kitchen background with glowing oven light." },
    { name: "Himbeer-Feld", styleId: "himbeer_feld", promptPattern: "Vibrant product shot of [SUBJECT] placed next to fresh ripe red raspberries and green mint leaves, splashes of red raspberry juice, bright studio light, high contrast." },
    { name: "Edelschoko", styleId: "edelschoko", promptPattern: "Macro studio shot of [SUBJECT], with gold leaf accents. Melted rich chocolate dripping, dark cocoa powder dusting, warm amber lighting, ultra-realistic texture, 8k." },
    { name: "Wüstenoase", styleId: "wuestenoase", promptPattern: "Minimalist shot of [SUBJECT] standing on a dry cracked sand block, warm glowing sunset sun behind, warm orange and beige aesthetic, soft shadows." },
    { name: "Weißer HG", styleId: "weisser_hg", promptPattern: "[SUBJECT], isolated on a pure white background, soft studio shadows, professional commercial photography, 8k.", isWhiteBg: true }
  ],
  damenmode: [
    { name: "Boutique", styleId: "boutique", promptPattern: "Luxury fashion store setting, [SUBJECT] elegantly displayed on a golden glass shelf, warm designer spotlights, blurry boutique interior with high-end designer clothes, elite lifestyle." },
    { name: "Pariser Balkon", styleId: "pariser_balkon", promptPattern: "High-fashion lifestyle shot of [SUBJECT] resting on a classic Parisian wrought-iron balcony table, Parisian townhouse facade and Eiffel Tower in soft sunset background, morning coffee glass." },
    { name: "Marmor-Treppe", styleId: "marmor_treppe", promptPattern: "Elegant editorial photography of [SUBJECT] placed on a grand white marble staircase of a royal palace, glowing golden light beams, dramatic shadows, premium fashion look." },
    { name: "Roter Teppich", styleId: "roter_teppich", promptPattern: "Glamorous red carpet event photography, [SUBJECT] in the spotlight, glittering paparazzi camera flashes in dark background, luxury celebrity aesthetic." },
    { name: "Beton-Podest", styleId: "beton_podest", promptPattern: "Modern studio commercial photography of [SUBJECT], standing on a minimalist architectural concrete pedestal. Warm sunset volumetric rays, palm leaf shadows, premium textures, sharp detail, 8k." },
    { name: "Loft-Industrie", styleId: "loft_industrie", promptPattern: "Chic fashion editorial of [SUBJECT] placed in a modern industrial loft apartment, brick walls, massive metal windows, afternoon sunlight rays casting long linear shadows." },
    { name: "Blumenwand", styleId: "blumenwand", promptPattern: "Romantic commercial photography of [SUBJECT] in front of a giant wall covered in fresh white roses and light pink peonies, soft natural outdoor lighting, pastel aesthetic." },
    { name: "Strandpromenade", styleId: "strandpromenade", promptPattern: "Summer fashion shot of [SUBJECT] on a beach club wooden deck table, turquoise sea and white sunbeds in background, bright sun, luxury holiday vibe." },
    { name: "Modernist Villa", styleId: "modernist_villa", promptPattern: "Clean architectural shot of [SUBJECT] next to a private infinity pool of a contemporary concrete villa, clear blue sky, luxury lifestyle aesthetic." },
    { name: "Weißer HG", styleId: "weisser_hg", promptPattern: "[SUBJECT], isolated on a pure white background, soft studio shadows, professional commercial photography, 8k.", isWhiteBg: true }
  ],
  herrenmode: [
    { name: "Chesterfield", styleId: "chesterfield", promptPattern: "High-end luxury commercial photography of [SUBJECT] resting on a vintage brown leather Chesterfield sofa, dark wood library background, warm glowing desk lamp, glass of whiskey next to it." },
    { name: "Maßschneiderei", styleId: "massschneiderei", promptPattern: "Classic gentleman's atelier shot, [SUBJECT] on a dark oak work table next to custom tailor's scissors, chalk, measuring tape, and premium suit fabric samples, warm moody workshop light." },
    { name: "Büro Penthouse", styleId: "buero_penthouse", promptPattern: "Sleek executive office setting, [SUBJECT] on a polished black glass table, floor-to-ceiling windows showing a glowing metropolis city skyline at dusk, sharp modern reflections." },
    { name: "Sportwagen", styleId: "sportwagen", promptPattern: "Luxury automotive commercial shot, [SUBJECT] placed inside a sports car cockpit with premium carbon fiber and leather dashboard, dashboard dials glowing red, night city lights streaking through windshield." },
    { name: "Industrial Loft", styleId: "industrial_loft", promptPattern: "Masculine editorial of [SUBJECT] placed in a modern industrial loft apartment, brick walls, massive metal windows, afternoon sunlight rays casting long linear shadows." },
    { name: "Yachtdeck", styleId: "yachtdeck", promptPattern: "Maritime luxury shoot, [SUBJECT] resting on a polished teak wood deck of a mega yacht, blue sunny ocean and coastal cliffs in background, premium lifestyle." },
    { name: "Beton-HG", styleId: "beton_hg", promptPattern: "Minimalist studio shot of [SUBJECT] standing on a raw textured dark grey concrete block, dramatic key studio lighting, high contrast, clean industrial aesthetic." },
    { name: "Golfplatz", styleId: "golfplatz", promptPattern: "Prestigious lifestyle shot of [SUBJECT] on the green lawn of a luxury country club golf course, early morning dew, warm rising sun flare, misty background trees." },
    { name: "Marmor Bar", styleId: "marmor_bar", promptPattern: "High-end commercial product photography of [SUBJECT], placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting." },
    { name: "Weißer HG", styleId: "weisser_hg", promptPattern: "[SUBJECT], isolated on a pure white background, soft studio shadows, professional commercial photography, 8k.", isWhiteBg: true }
  ]
}

export default function EcommerceLanding() {
  // Auth & Account
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState('')

  // Generator States
  const [refImageFile, setRefImageFile] = useState(null)
  const [refImageUrl, setRefImageUrl] = useState('')
  const [prompt, setPrompt] = useState('High-end commercial product photography of an amber whiskey glass bottle, placed on a dark polished marble bar counter. Next to it is a crystal glass with ice. Swirling dramatic golden smoke rising behind the bottle. Moody luxury bar background with warm out-of-focus lights, depth of field, 8k resolution, professional studio lighting.')
  const [promptStrength, setPromptStrength] = useState(0.7)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [mode, setMode] = useState('image')
  const [selectedCategory, setSelectedCategory] = useState('spirituosen')
  
  // Statuses
  const [isRemovingBg, setIsRemovingBg] = useState(false)
  const [removeBgProgress, setRemoveBgProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancingProgress, setEnhancingProgress] = useState(0)

  const getCategoryPrompts = (catId) => {
    const category = ECOMMERCE_CATEGORIES.find(c => c.id === catId)
    const subject = category ? category.subject : "a product"
    const templates = CATEGORY_STYLES[catId] || CATEGORY_STYLES.spirituosen
    return templates.map(tmpl => {
      const p = tmpl.promptPattern.replace("[SUBJECT]", subject)
      return {
        name: tmpl.name,
        image: `/previews/${catId}_${tmpl.styleId}.png`,
        fallbackImage: `/previews/${catId}.png`,
        prompt: p,
        isWhiteBg: tmpl.isWhiteBg || false
      }
    })
  }

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
        base64Image = refImageUrl
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
            setRefImageFile(null)
            setIsRemovingBg(false)
            alert('Hintergrund erfolgreich entfernt!')
          }, 800)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          clearInterval(progressInterval)
          alert('Freistellen failed.')
          setIsRemovingBg(false)
        }
      } catch (err) {
        console.error('Polling Fehler:', err)
      }
    }, 3000)
  }

  const handleStartGeneration = async () => {
    if (!user) {
      alert('Bitte logge dich zuerst ein!')
      return
    }
    if (!refImageUrl) {
      alert('Bitte lade ein Produktfoto hoch.')
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
        alert(data.error || 'Bildverbesserung failed.')
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
          alert('Bildverbesserung failed.')
          setIsEnhancing(false)
        }
      } catch (err) {
        console.error(err)
      }
    }, 4000)
  }

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Head>
        <title>KI-Produktfotografie & Studio für Onlineshops | AI Video Generator</title>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/ecommerce" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center', borderBottom: '2px solid var(--secondary)', paddingBottom: '2px' }}>
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

      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', margin: '4rem 0 3rem 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>KI Bild & Video Marketingstudio</h1>
        </div>

        <section id="ecommerce-generator" className="glass-panel" style={{ padding: '2.5rem', marginBottom: '4rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-neon)' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Sparkles style={{ color: 'var(--secondary)' }} />
            Dein KI-Studio Generator
          </h2>

          {!user ? (
            <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }} className="glass-panel">
              <Lock size={48} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Anmelden zur Generierung</h3>
              <form onSubmit={authMode === 'login' ? handleSignIn : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
                <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
                <button type="submit" className="btn-gold" style={{ background: 'var(--gradient-gold)', padding: '12px' }}>{authMode === 'login' ? 'Anmelden' : 'Registrieren'}</button>
              </form>
              <button onClick={handleGuestLogin} className="btn-outline" style={{ marginTop: '1rem' }}>Gast-Modus starten</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* Grid für Upload (links) und Output (rechts) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                
                {/* Upload Bereich */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                  <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <button type="button" onClick={() => setMode('image')} style={{ flex: 1, padding: '10px 0', borderRadius: '8px', background: mode === 'image' ? 'var(--primary)' : 'transparent', color: mode === 'image' ? '#000' : 'var(--text-muted)', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Bild erstellen</button>
                    <button type="button" onClick={() => setMode('video')} style={{ flex: 1, padding: '10px 0', borderRadius: '8px', background: mode === 'video' ? 'var(--primary)' : 'transparent', color: mode === 'video' ? '#000' : 'var(--text-muted)', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Video erstellen</button>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: 'var(--secondary)', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                      Produktfoto hochladen
                    </h3>
                    {!refImageUrl ? (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '3rem 1rem', cursor: 'pointer', background: 'rgba(255,255,255,0.01)' }}>
                        <Upload size={32} style={{ marginBottom: '0.8rem' }} />
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </label>
                    ) : (
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img src={refImageUrl} alt="Vorschau" style={{ width: '100%', height: '260px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)' }} />
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                          <button onClick={handleRemoveBackground} className="btn-outline" style={{ background: '#000', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }} disabled={isRemovingBg}>
                            {isRemovingBg ? <Loader2 className="animate-spin" size={14} /> : null}
                            Hintergrund entfernen
                          </button>
                          <button onClick={() => { setRefImageUrl(''); setRefImageFile(null); }} className="btn-outline" style={{ background: '#000', padding: '8px' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Output Bereich */}
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

              {/* Design-Prompt & Stile komplett darunter, zentriert und volle Breite wie das erste Element */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <span style={{ background: 'var(--secondary)', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                      Szenerie & Design-Prompt wählen
                    </h3>
                    
                    {/* Kategorie Dropdown vergrößert */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <Link 
                        href="/prompts" 
                        className="btn-outline" 
                        style={{ 
                          padding: '10px 20px', 
                          background: 'rgba(168, 85, 247, 0.1)', 
                          border: '2px solid var(--primary)', 
                          color: '#fff', 
                          borderRadius: '8px', 
                          fontWeight: '700', 
                          textDecoration: 'none', 
                          fontSize: '0.95rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: 'var(--shadow-neon)'
                        }}
                      >
                        <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
                        Eigene exklusive Prompts
                      </Link>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 700 }}>Kategorie:</span>
                        <select
                          value={selectedCategory}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            // Direkt den ersten Prompt der neuen Kategorie laden
                            const prompts = getCategoryPrompts(e.target.value);
                            if (prompts.length > 0) setPrompt(prompts[0].prompt);
                          }}
                          className="input-field"
                          style={{ 
                            padding: '10px 20px', 
                            background: 'var(--bg-input)', 
                            border: '2px solid var(--border-color)', 
                            color: '#fff', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontSize: '1rem', 
                            fontWeight: '700',
                            width: 'auto',
                            boxShadow: 'var(--shadow-premium)'
                          }}
                        >
                          {ECOMMERCE_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id} style={{ background: '#0f172a', color: '#fff' }}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Promptfeld mit doppelter Breite (800px) */}
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Beschreibe das gewünschte Ambiente (z. B. 'High-end product photography, luxury stone block counter, soft morning sun, botanical background')"
                    className="input-field"
                    style={{ 
                      minHeight: '120px', 
                      fontSize: '1rem', 
                      fontFamily: 'inherit', 
                      resize: 'vertical', 
                      width: '100%', 
                      padding: '15px',
                      background: 'rgba(15, 23, 42, 0.6)', // Dunkler, kontrastreicher Schieferton
                      color: '#ffffff', // Klares reines Weiß für beste Lesbarkeit
                      border: '1px solid rgba(255, 255, 255, 0.15)', // Dezenter, heller Rahmen
                      borderRadius: '8px',
                      lineHeight: '1.6'
                    }}
                  />
                  
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textAlign: 'center', fontWeight: 700, margin: '5px 0' }}>
                    Tipp: Wähle ein Design-Szenario aus den 2 Reihen unten, um dein Produkt in diesem Stil rendern zu lassen!
                  </div>

                  {/* Stil Vorschaubilder in genau 5 Spalten (2 Reihen) und vergrößert */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(5, 1fr)', 
                    gap: '15px', 
                    width: '100%',
                    marginTop: '10px'
                  }}>
                    {getCategoryPrompts(selectedCategory).map((tmpl, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setPrompt(tmpl.prompt);
                        }}
                        style={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'transform 0.2s',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                      >
                        <div style={{
                          height: '110px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid',
                          borderColor: prompt === tmpl.prompt ? 'var(--secondary)' : 'var(--border-color)',
                          boxShadow: prompt === tmpl.prompt ? '0 0 12px rgba(249, 115, 22, 0.5)' : 'none',
                          background: 'rgba(0,0,0,0.3)',
                          position: 'relative',
                          width: '100%'
                        }}>
                          <img 
                            src={tmpl.image} 
                            alt={tmpl.name} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = tmpl.fallbackImage;
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: prompt === tmpl.prompt ? 'var(--gradient-neon)' : 'rgba(0,0,0,0.75)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '4px 0',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {tmpl.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Einstellungen */}
                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', width: '100%' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders size={14} style={{ color: 'var(--primary)' }} />
                    Erweiterte Einstellungen
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Prompt Strength */}
                    {mode === 'image' ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
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
                      </div>
                    ) : <div />}

                    {/* Aspekt-Verhältnis */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Format:</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                        {['1:1', '4:5', '16:9', '9:16'].map(ratio => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => setAspectRatio(ratio)}
                            style={{
                              padding: '4px 0',
                              borderRadius: '4px',
                              background: aspectRatio === ratio ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                              color: aspectRatio === ratio ? '#000' : 'var(--text-muted)',
                              border: '1px solid',
                              borderColor: aspectRatio === ratio ? 'var(--primary)' : 'var(--border-color)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generieren Button */}
                <button 
                  onClick={handleStartGeneration}
                  className="btn-gold"
                  style={{ background: 'var(--gradient-gold)', padding: '12px 24px', fontSize: '0.95rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '400px' }}
                  disabled={isGenerating || isRemovingBg}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {mode === 'image' ? 'Erstelle Werbebild' : 'Erstelle Werbevideo'} ({generationProgress}%)
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      {mode === 'image' ? 'Werbebild erstellen (Kosten: 2 Credits)' : 'Werbevideo erstellen (Kosten: 5 Credits)'}
                    </>
                  )}
                </button>

                {isGenerating && (
                  <div className="progress-bar-container" style={{ height: '6px', width: '100%', maxWidth: '400px' }}>
                    <div className="progress-bar-fill" style={{ width: `${generationProgress}%` }} />
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
