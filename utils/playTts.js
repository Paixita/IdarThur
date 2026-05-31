export async function playPremiumAudio(text, agentId) {
  let voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Bella (Candy) por defecto
  if (agentId === 'nicolas') voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam
  if (agentId === 'vitalis') voiceId = 'MF3mGyEYCl7XYWbV9V6O'; // Elli
  if (agentId === 'sophia') voiceId = 'EXAVITQu4vr4xnSDxMaL';

  // Obtenemos la llave directamente para evitar el proxy de Cloudflare que bloquea ElevenLabs Free Tier
  const keyRes = await fetch('/api/tts');
  const { apiKey } = await keyRes.json();
  if (!apiKey) throw new Error("No hay API Key de ElevenLabs");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });
  
  if (!res.ok) throw new Error("Fallo la generación de voz ElevenLabs");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    if (typeof window !== 'undefined') window.currentAudio = audio;
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = reject;
    
    audio.play().catch(reject);
  });
}
