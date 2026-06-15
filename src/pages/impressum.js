import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Impressum() {
  return (
    <div className="app-container">
      <header className="header">
        <Link href="/" className="brand">
          <span>AI Bild & Videogenerator</span>
        </Link>
        <Link href="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </header>

      <main className="main-content" style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Impressum
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Angaben gemäß § 5 TMG</h2>
              <p style={{ fontSize: '1rem', color: '#fff' }}><strong>My Digital World</strong></p>
              <p>Rüdiger Becker</p>
              <p>Hauptstr. 11a</p>
              <p>54344 Kenn</p>
            </section>

            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Kontakt</h2>
              <p>Telefon: +49 (0) 159 0614 6147</p>
              <p>E-Mail: info@my-digital-world.de</p>
            </section>

            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Umsatzsteuer-ID</h2>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: [Noch eintragen oder Kleinunternehmerregelung]</p>
            </section>

            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>Rüdiger Becker</p>
              <p>Hauptstr. 11a</p>
              <p>54344 Kenn</p>
            </section>

            <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>EU-Streitschlichtung</h2>
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>https://ec.europa.eu/consumers/odr/</a>. Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
