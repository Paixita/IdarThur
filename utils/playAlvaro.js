export const playAlvaroAudio = (text) => {
  if (typeof window === 'undefined') return;

  // Detener audios anteriores
  window.speechSynthesis.cancel();
  
  // Limpiar emojis y caracteres especiales
  const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'es-ES';
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
  
  if (spanishVoices.length > 0) {
    // Buscar la voz premium "Alvaro" (Microsoft Edge / Windows nativa)
    const alvaroVoice = spanishVoices.find(v => v.name.toLowerCase().includes('alvaro'));
    
    // Si no encuentra Alvaro, busca cualquier voz masculina de Microsoft
    const msMaleVoice = spanishVoices.find(v => v.name.toLowerCase().includes('microsoft') && (v.name.toLowerCase().includes('pablo') || v.name.toLowerCase().includes('raul') || !v.name.toLowerCase().includes('elena') && !v.name.toLowerCase().includes('laura')));
    
    // Fallback a cualquier voz si ninguna de las anteriores existe
    utterance.voice = alvaroVoice || msMaleVoice || spanishVoices[0];
  }

  window.speechSynthesis.speak(utterance);
};
