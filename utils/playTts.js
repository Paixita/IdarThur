export async function playPremiumAudio(text, agentId) {
  let voice = 'es_mx_001'; // Femenina natural (Candy, Vitalis, CyberGuard)
  if (agentId === 'nicolas' || agentId === 'altamar') {
    voice = 'es_mx_002'; // Masculina natural
  }

  // Petición directa desde el navegador (evita restricciones de Cloudflare/Vercel)
  const res = await fetch("https://tiktok-tts.weilnet.workers.dev/api/generation", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      voice: voice
    })
  });
  
  if (!res.ok) throw new Error("Fallo la red de TikTok TTS");

  const data = await res.json();
  if (data.error || !data.data) throw new Error(data.error || "Fallo la generación de voz TikTok");

  // Decodificar Base64 a Blob en el cliente
  const binaryString = window.atob(data.data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/mpeg' });
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
