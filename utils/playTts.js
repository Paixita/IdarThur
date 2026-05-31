export async function playPremiumAudio(text, agentId) {
  // IDs de voces de ElevenLabs
  // Candy -> Bella (Voz dulce y amable)
  // Nicolas -> Adam (Voz masculina profesional)
  // Vitalis -> Elli (Voz joven y clara)
  
  let voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Bella (Candy) por defecto
  
  if (agentId === 'nicolas') voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam
  if (agentId === 'vitalis') voiceId = 'MF3mGyEYCl7XYWbV9V6O'; // Elli
  if (agentId === 'sophia') voiceId = 'EXAVITQu4vr4xnSDxMaL';

  // Dividir el texto en fragmentos si es muy largo, aunque ElevenLabs maneja bien textos largos.
  // Lo mandaremos entero para que tenga mejor entonación.
  
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId })
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
