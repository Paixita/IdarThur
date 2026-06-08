export const playAlvaroAudio = (text) => {
  if (typeof window === 'undefined') return;

  window.speechSynthesis.cancel();
  
  const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

  // Separar el texto en frases para aplicar la Red Neuronal a cada frase individual
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
    if (spanishVoices.length > 0) {
      const alvaroVoice = spanishVoices.find(v => v.name.toLowerCase().includes('alvaro'));
      const msMaleVoice = spanishVoices.find(v => v.name.toLowerCase().includes('microsoft') && (v.name.toLowerCase().includes('pablo') || v.name.toLowerCase().includes('raul') || !v.name.toLowerCase().includes('elena') && !v.name.toLowerCase().includes('laura')));
      return alvaroVoice || msMaleVoice || spanishVoices[0];
    }
    return null;
  };

  const selectedVoice = getVoice();

  sentences.forEach((sentence) => {
    const utterance = new SpeechSynthesisUtterance(sentence.trim());
    utterance.lang = 'es-ES';
    
    // Motor Neuronal de Sentimiento
    const lowerSentence = sentence.toLowerCase();
    let rate = 1.05;
    let pitch = 1.0;
    
    if (lowerSentence.match(/(misterio|secreto|suspenso|oculto|noche|oscuro|miedo|tensión|desconocido|silencio)/)) {
      rate = 0.9; pitch = 0.8;
    } else if (lowerSentence.match(/(rápido|correr|acción|increíble|explosión|emoción|corazón|adrenalina|peligro|urgente)/)) {
      rate = 1.25; pitch = 1.15;
    } else if (lowerSentence.match(/(amor|romance|paz|calma|suave|tranquilo|relajante|brisa|luna|hermoso)/)) {
      rate = 0.95; pitch = 1.05;
    } else if (lowerSentence.match(/(vip|exclusivo|confidencial|premium|garantizado|lujo|único|especial)/)) {
      rate = 1.0; pitch = 0.95;
    }

    if (sentence.includes('!')) { rate += 0.05; pitch += 0.05; }
    if (sentence.includes('?')) { pitch += 0.1; }

    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = Math.max(0.0, Math.min(2.0, pitch));
    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  });
};
