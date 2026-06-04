export async function playPremiumAudio(text, agentId) {
  const res = await fetch(`/api/edge-tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      agentId: agentId || 'candy'
    })
  });
  
  if (!res.ok) throw new Error("Fallo la generación de voz Edge TTS");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    if (typeof window !== 'undefined') window.currentAudio = audio;
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error al reproducir el audio"));
    };
    
    audio.play().catch(reject);
  });
}
