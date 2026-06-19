import Link from 'next/link'
import Head from 'next/head'
import { Download, Sparkles, Video, Image as ImageIcon, Zap, Shield, Mail, ArrowLeft, TrendingUp, Globe, Book, ShoppingBag } from 'lucide-react'

export default function Manual() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)' }}>
      <Head>
        <title>Anleitung & Handbuch - KI-Bilder & Videos optimal erstellen | AI Video Generator</title>
        <meta name="description" content="Lerne, wie du perfekte KI-Bilder und Videos in 1080p generierst. Tipps zu Prompts, Upscaling, Nischenprompts und der Community-Galerie." />
        <meta name="robots" content="index, follow" />
      </Head>
      {/* Header */}
      <header className="header no-print">
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
          <Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
            Preise
          </Link>
          <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ArrowLeft size={16} /> Zum Generator
          </Link>
          <button onClick={handlePrint} className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Download size={16} /> PDF speichern / Drucken
          </button>
        </div>
      </header>

      {/* Manual Content Container */}
      <main className="main-content" style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
        
        {/* PDF-Styled Document Sheet */}
        <div className="glass-panel print-sheet" style={{ 
          padding: '3rem', 
          position: 'relative', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-premium)',
          background: 'rgba(19, 27, 46, 0.9)'
        }}>
          {/* Header Graphic Elements */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                KI-Anleitung & Handbuch
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '5px' }}>
                Meistere Bild- und Video-Generierung in 1080p
              </p>
            </div>
            <div style={{ background: 'var(--gradient-neon)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
              <Sparkles size={32} />
            </div>
          </div>

          {/* Section 1: Intro */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} style={{ color: 'var(--secondary)' }} />
              1. Einführung in die KI-Modelle
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Willkommen bei deinem **AI Bild & Videogenerator**! Diese Anwendung nutzt modernste künstliche Intelligenz, um aus deinen Textbeschreibungen oder Bildern hochauflösende Medien zu erstellen. Wir nutzen **FLUX Schnell** für ultrascharfe Bilder und die **Luma Dream Machine** für flüssige Full-HD-Videosequenzen.
            </p>
          </section>

          {/* Section 2: Image Gen */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ImageIcon size={20} style={{ color: 'var(--primary)' }} />
              2. Perfekte KI-Bilder generieren
            </h2>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>Für herausragende Bildergebnisse solltest du folgende Tipps beachten:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Klare Prompts:</strong> Beschreibe das Hauptmotiv, die Umgebung und die Beleuchtung (z. B. <i>"Eine futuristische Stadt bei Nacht, neonbeleuchtete Wolkenkratzer, Spiegelungen im Regen, filmische Beleuchtung"</i>).</li>
                <li><strong>Art Styles nutzen:</strong> Wähle einen vordefinierten Stil aus dem Dropdown, um dem Bild automatisch professionelle Details wie <i>Fotorealistisch</i>, <i>Anime</i> oder <i>Comic-Stil</i> zu verleihen.</li>
                <li><strong>Enhance-Stil:</strong> Nutze den Stil <i>✨ Enhance / High Detail</i>, um das Bild mit Studio-Lichteffekten und maximaler Detailschärfe zu rendern.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Video Gen */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video size={20} style={{ color: 'var(--primary)' }} />
              3. Videos & Animationen erstellen
            </h2>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>Videos erfordern Bewegungsbeschreibungen:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Bild zu Video (Image-to-Video):</strong> Lade ein Bild hoch und beschreibe im Textfeld, was darin passieren soll (z. B. <i>"Die Haare wehen sanft im Wind, Kamera fährt langsam heran"</i>).</li>
                <li><strong>Text zu Video (Text-to-Video):</strong> Beschreibe eine dynamische Szene. Verben helfen der KI, Bewegungen besser zu verstehen (z. B. <i>"Ein goldener Adler fliegt majestätisch über Berggipfel bei Sonnenaufgang"</i>).</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Upscaling / Enhance */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} style={{ color: 'var(--secondary)' }} />
              4. Bilder verbessern (Enhance)
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Nachdem du ein Bild generiert hast, kannst du die **"Enhance"**-Schaltfläche nutzen. Ein spezieller KI-Upscaler verdoppelt die Auflösung deines Bildes, korrigiert Verzerrungen in Gesichtern und liefert eine glasklare Qualität für den Druck oder professionellen Einsatz.
            </p>
          </section>

          {/* Section 5: Exkl. Prompt-Generator */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} />
              5. Exkl. Prompt-Generator (Nischen-Prompts)
            </h2>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>Unser <strong>Exklusive Prompt-Generator</strong> bietet zwei mächtige Wege, um professionelle und verkaufsstarke Prompts für deine Branche oder Produkte zu erhalten:</p>
              
              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '10px 0 5px 0' }}>A) Vordefinierte Premium-Prompts</h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                <li><strong>Branche auswählen:</strong> Wähle eine der vorkonfigurierten Kategorien (z. B. <i>Winzer</i>, <i>Immobilien</i>, <i>Kosmetik</i>, <i>Schokolade</i>, <i>Herrenmode</i> u.v.m.).</li>
                <li><strong>Deutsche Vorschau:</strong> Jeder Prompt zeigt eine deutsche Beschreibung zur Orientierung.</li>
                <li><strong>Englischen Prompt laden:</strong> Klicke auf <i>In Generator laden</i>, um den optimierten englischen Prompt direkt in dein Dashboard zu übertragen, oder kopiere ihn. Die Bild- und Videomodelle arbeiten für beste Ergebnisse ausschließlich auf Englisch.</li>
                <li><strong>Pakete freischalten:</strong> Die ersten 3 Prompts sind frei nutzbar. Die restlichen Prompts der Kategorie lassen sich über den Freischalt-Button als Paket freischalten.</li>
              </ul>

              <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '10px 0 5px 0' }}>B) Eigene exklusive Nischen-Prompts generieren (KI-gestützt)</h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Zielgerichtete hooks nutzen:</strong> Suchst du für deine spezielle Nische, Branche oder deine Produkte den perfekten Prompt? Verwende das Generierungs-Formular direkt über der Liste.</li>
                <li><strong>Reale KI-Generierung:</strong> Gib deine Nische oder dein Produkt ein und klicke auf <i>„Exklusiven Prompt generieren“</i>. Unser System nutzt modernste KI (Meta Llama-3-70b), um in Sekundenschnelle einen maßgeschneiderten, hochqualitativen englischen Prompt sowie eine deutsche Übersetzung für dich zu erstellen (Kosten: 10 Credits).</li>
                <li><strong>Direkt anwenden:</strong> Übertrage deinen frisch generierten, exklusiven Prompt mit einem Klick in den Generator und erstelle sofort perfekt passende Bilder oder Videos für dein Business.</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Community-Galerie */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={20} style={{ color: 'var(--secondary)' }} />
              6. Die Community-Galerie
            </h2>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>Nutze die Galerie, um deine Kreationen zu präsentieren oder dich von anderen inspirieren zu lassen:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Kreationen teilen:</strong> Klicke direkt unter deinem fertigen Bild/Video oder im Medienarchiv auf <i>„In Galerie teilen“</i> 🌐. Deine Generierung ist ab sofort öffentlich in der Community-Galerie sichtbar.</li>
                <li><strong>Teilen widerrufen:</strong> Ein Klick auf <i>„Aus Galerie entfernen“</i> zieht dein Bild/Video sofort wieder zurück.</li>
                <li><strong>Prompt-Kopierschutz:</strong> Um exklusive Inhalte zu schützen, werden Premium-Nischenprompts für Nutzer, die diese Nische nicht erworben haben, weichgezeichnet (blurred) dargestellt.</li>
                <li><strong>Inspiration & Wiederverwendung:</strong> Eigene Kreationen und Prompts deiner erworbenen Nischen-Pakete können mit Klick auf <i>„In Generator laden“</i> direkt geladen und angepasst werden.</li>
              </ul>
            </div>
          </section>

          {/* Footer Copyright */}
          <div style={{ 
            borderTop: '1px dashed var(--border-color)', 
            paddingTop: '2rem', 
            marginTop: '3rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            fontSize: '0.85rem', 
            color: 'var(--text-dim)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} />
              <span>© www.my-digital-world 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} />
              <span>info@my-digital-world.de</span>
            </div>
          </div>

        </div>
      </main>

      {/* Print Specific CSS Rules */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-sheet {
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-sheet h1, .print-sheet h2 {
            color: #000000 !important;
            background: none !important;
            -webkit-text-fill-color: initial !important;
          }
          .print-sheet p, .print-sheet li, .print-sheet span {
            color: #333333 !important;
          }
        }
      `}</style>
    </div>
  )
}
