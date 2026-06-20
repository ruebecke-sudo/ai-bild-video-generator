const fs = require('fs');
const path = require('path');

// Dieses Skript generiert über die Replicate-API-Route der App 
// die 14 echten Nischen-Videos und lädt sie in den public/previews Ordner.
// Starte das Skript, wenn die App lokal läuft (npm run dev).

const CATEGORIES = [
  { id: 'immo', prompt: 'Cinematic drone shot flying slowly over a modern luxury villa with a massive infinity pool and an exclusive manicured green garden at sunset, realistic, 1080p.' }
];

async function generateAll() {
  console.log("Starte Generierung der 14 Nischenvideos...");
  
  for (const cat of CATEGORIES) {
    console.log(`\nGeneriere Video für [${cat.name || cat.id}]...`);
    try {
      // Wir senden die Anfrage an die lokale API-Route (setzt voraus, dass das Backend läuft)
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video', // Wir nutzen das Video-Modul (Luma Dream Machine)
          prompt: cat.prompt,
          userId: '5ecfe4cd-c69e-4db8-8b5a-aa7b8462b704' // Echte Gast-Benutzer-ID aus Supabase
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "API Fehler");
      }
      
      console.log(`Generierung gestartet. ID: ${data.predictionId}. Warte auf Fertigstellung...`);
      
      // Polling, bis das Video fertig generiert wurde
      let videoUrl = null;
      while (!videoUrl) {
        await new Promise(r => setTimeout(r, 6000)); // 6 Sekunden warten
        const statusRes = await fetch(`http://localhost:3001/api/check-status?id=${data.predictionId}`);
        const statusData = await statusRes.json();
        
        if (statusData.status === 'succeeded') {
          videoUrl = Array.isArray(statusData.output) ? statusData.output[0] : statusData.output;
          console.log(`✓ Video fertig! URL: ${videoUrl}`);
        } else if (statusData.status === 'failed') {
          throw new Error("Generierung auf Replicate fehlgeschlagen.");
        } else {
          console.log(`Status: ${statusData.status}...`);
        }
      }
      
      // Video herunterladen und im previews-Ordner speichern
      const videoBuffer = await fetch(videoUrl).then(res => res.arrayBuffer());
      const destPath = path.join(__dirname, '..', 'public', 'previews', `${cat.id}.mp4`);
      fs.writeFileSync(destPath, Buffer.from(videoBuffer));
      console.log(`✓ Video erfolgreich gespeichert unter public/previews/${cat.id}.mp4`);
      
    } catch (err) {
      console.error(`❌ Fehler bei Kategorie [${cat.id}]:`, err.message);
    }
  }
  console.log("\nGenerierungsprozess beendet.");
}

generateAll();
