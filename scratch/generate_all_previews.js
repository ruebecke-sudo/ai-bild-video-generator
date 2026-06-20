const fs = require('fs');
const path = require('path');

// Dieses Skript generiert über die Replicate-API-Route der App 
// die 14 echten Nischen-Videos und lädt sie in den public/previews Ordner.
// Starte das Skript, wenn die App lokal läuft (npm run dev).

const CATEGORIES = [
  { id: 'winzer', prompt: 'Slow motion drone flyover above rolling green vineyard hills at sunrise, mist rising from the valley, cinematic golden light.' },
  { id: 'immo', prompt: 'Smooth cinematic walk-through video entering a luxury villa through double front doors, revealing a massive open-space living room.' },
  { id: 'hochzeit', prompt: 'Slow motion of the bride’s veil catching the wind at sunset, golden light illuminating the fabric, romantic camera rotation.' },
  { id: 'strand', prompt: 'Cinematic slow motion of crystal clear turquoise waves gently rolling onto a pristine white sand beach, palm tree shadow.' },
  { id: 'urlaub', prompt: 'Slow motion drone shot of a tropical island beach with coral reefs, luxury speed boat leaving a soft wake on water.' },
  { id: 'lostplaces', prompt: 'Slow panning shot through a dusty, abandoned grand ballroom of a historic mansion, sun rays passing through broken windows.' },
  { id: 'schloesser', prompt: 'Cinematic drone shot flying slowly towards a majestic medieval castle standing on a mountain peak surrounded by green forests.' },
  { id: 'food', prompt: 'Extreme close-up slow motion of cheese melting on a fresh hot pizza being pulled apart, steam rising, professional food commercial.' },
  { id: 'fitness', prompt: 'Slow motion shot of an athlete running on a track at sunset, close-up on running shoes, dramatic lighting, sweat splashing.' },
  { id: 'auto', prompt: 'Sleek luxury sports car driving fast down a winding coastal highway during sunset, camera tracking side-by-side, reflections.' },
  { id: 'socialmedia', prompt: 'A highly energetic young content creator smiling, gesturing to the camera inside a modern glowing RGB studio setup, cinematic.' },
  { id: 'nature', prompt: 'Slow motion majestic waterfall cascading down mossy green volcanic rocks in Iceland under a beautiful clean rainbow sky.' },
  { id: 'cyberpunk', prompt: 'Slow motion walk down a dark rainy cyberpunk street illuminated by glowing neon signs in violet, cyan, and gold.' },
  { id: 'artistic', prompt: 'Slow motion close-up of colorful ink droplets expanding and mixing in water, creating beautiful fluid clouds.' }
];

async function generateAll() {
  console.log("Starte Generierung der 14 Nischenvideos...");
  
  for (const cat of CATEGORIES) {
    console.log(`\nGeneriere Video für [${cat.name || cat.id}]...`);
    try {
      // Wir senden die Anfrage an die lokale API-Route (setzt voraus, dass das Backend läuft)
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video', // Wir nutzen das Video-Modul (Luma Dream Machine)
          prompt: cat.prompt,
          userId: 'gast-system-override' // System-ID
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
        const statusRes = await fetch(`http://localhost:3000/api/check-status?id=${data.predictionId}`);
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
