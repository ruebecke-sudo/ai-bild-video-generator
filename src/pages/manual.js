import Link from 'next/link'
import { Download, Sparkles, Video, Image as ImageIcon, Zap, Shield, Mail, ArrowLeft, TrendingUp } from 'lucide-react'

export default function Manual() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)' }}>
      {/* Header */}
      <header className="header no-print">
        <Link href="/" className="brand">
          <span>AI Bild & Videogenerator</span>
        </Link>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <button onClick={handlePrint} className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
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

          {/* Section 5: Nischenprompts */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} />
              5. Verwendung von Nischenprompts
            </h2>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>Unser System bietet exklusive, erprobte Prompts für verschiedene Branchen (Nischen):</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Branche auswählen:</strong> Navigiere über das obere Menü auf „Nischenprompts“ und wähle eine Kategorie wie <i>Winzer</i>, <i>Immobilien</i>, <i>Hochzeit</i>, <i>Social Media</i>, <i>Cyberpunk</i> u.v.m.</li>
                <li><strong>Deutsche Übersetzung lesen:</strong> Jeder Prompt hat eine deutsche Kurzbeschreibung zur Vorschau (diese ist kopiergeschützt und dient nur zur Orientierung).</li>
                <li><strong>Englischen Prompt nutzen:</strong> Klicke auf <i>In Generator laden</i>, um den optimierten englischen Prompt direkt in das Dashboard zu übertragen, oder kopiere ihn mit dem <i>Kopieren</i>-Button. Für beste KI-Ergebnisse arbeiten die Modelle ausschließlich mit englischen Begriffen.</li>
                <li><strong>Pakete freischalten:</strong> Die ersten 3 Prompts sind frei nutzbar. Die restlichen Prompts können über den Button am Ende der Liste als Paket auf der Preise-Seite freigeschaltet werden.</li>
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
