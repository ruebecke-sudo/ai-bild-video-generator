import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Datenschutz() {
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
            Datenschutzerklärung
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Datenschutz auf einen Blick</h2>
              <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden auf dieser Website nur im technisch notwendigen Umfang (Registrierung, Login, Credit-Käufe) erhoben.</p>
            </section>

            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Verantwortliche Stelle</h2>
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
              <p style={{ color: '#fff', marginTop: '5px' }}><strong>My Digital World</strong></p>
              <p>Rüdiger Becker</p>
              <p>Hauptstr. 11a</p>
              <p>54344 Kenn</p>
              <p>E-Mail: info@my-digital-world.de</p>
            </section>

            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Datenerfassung auf unserer Website</h2>
              <p><strong>Registrierung und Login:</strong> Wir erfassen Ihre E-Mail-Adresse und ein verschlüsseltes Passwort (über Supabase Auth), um Ihr Benutzerkonto zu verwalten und Ihnen Ihre Credits zuzuordnen.</p>
              <p><strong>Generierungsdaten:</strong> Wenn Sie Bilder oder Videos generieren, werden Ihre Prompts und die Links zu den Ausgabemedien in unserer Datenbank (Supabase) gespeichert, um Ihnen Ihre Galerie anzuzeigen.</p>
              <p><strong>Zahlungsabwicklung:</strong> Kreditkartendaten und Abrechnungsinformationen werden direkt von unserem Partner Stripe verarbeitet. Wir speichern keine Zahlungsinformationen auf unseren Servern.</p>
            </section>

            <section>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Rechte der betroffenen Person</h2>
              <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten. Sie haben außerdem ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Wenden Sie sich hierzu einfach per E-Mail an uns.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
