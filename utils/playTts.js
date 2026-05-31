export async function playPremiumAudio(text, agentId) {
  // Voces súper realistas de TikTok
  let voice = 'es_female_f6'; // Candy
  if (agentId === 'nicolas') voice = 'es_mx_002'; // Nicolas
  if (agentId === 'sophia') voice = 'es_female_f6';

  // Dividir el texto por oraciones (límite de TikTok es aprox 300 caracteres)
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];

  const playSentence = async (sentence) => {
    if (!sentence.trim()) return;
    
    const res = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: sentence.trim(), voice })
    });
    
    const json = await res.json();
    if (!json.success || !json.data) throw new Error("Fallo la generación de voz TikTok");

    return new Promise((resolve, reject) => {
      const audio = new Audio("data:audio/mpeg;base64," + json.data);
      if (typeof window !== 'undefined') window.currentAudio = audio;
      
      audio.onended = resolve;
      audio.onerror = reject;
      
      audio.play().catch(reject);
    });
  };

  for (const sentence of sentences) {
    if (window.stopAudioFlag) {
      window.stopAudioFlag = false;
      break;
    }
    await playSentence(sentence);
  }
}
