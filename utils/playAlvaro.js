// playAlvaro.js - Gestor de voz neural premium para Yessel con cola de reproducción por frases
let audioQueue = [];
let currentQueueIndex = 0;
let currentAudio = null;
let isPlaying = false;

export const playAlvaroAudio = (text) => {
  if (typeof window === 'undefined') return;

  // Detener cualquier reproducción previa y limpiar la cola
  stopAlvaroAudio();

  if (!text || text.trim() === '') return;

  // Dividir el texto en frases usando puntos, signos de interrogación y exclamación
  // Esto evita enviar textos largos que causen timeout en el servidor
  audioQueue = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (audioQueue.length === 0) return;

  currentQueueIndex = 0;
  isPlaying = true;

  window.dispatchEvent(new CustomEvent('alvaro-tts-start'));
  playNextInQueue();
};

const playNextInQueue = () => {
  if (!isPlaying) return;

  if (currentQueueIndex >= audioQueue.length) {
    // Fin de la cola
    currentAudio = null;
    isPlaying = false;
    window.dispatchEvent(new CustomEvent('alvaro-tts-end'));
    return;
  }

  const sentence = audioQueue[currentQueueIndex];
  const encodedText = encodeURIComponent(sentence);
  const audioUrl = `/api/tts?text=${encodedText}`;

  currentAudio = new Audio(audioUrl);

  const handleEnd = () => {
    currentQueueIndex++;
    playNextInQueue();
  };

  currentAudio.addEventListener('ended', handleEnd);

  currentAudio.addEventListener('error', (e) => {
    console.error('[Neural TTS Client Error]', e);
    // Intentar saltar a la siguiente frase si hay un fallo
    currentQueueIndex++;
    playNextInQueue();
  });

  currentAudio.play().catch((err) => {
    console.error('[Neural TTS Play Blocked/Failed]', err);
    // Detener la reproducción si es bloqueado por el navegador
    stopAlvaroAudio();
  });
};

export const stopAlvaroAudio = () => {
  if (typeof window === 'undefined') return;
  isPlaying = false;
  audioQueue = [];
  currentQueueIndex = 0;
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch (e) {
      console.error('[Neural TTS Stop Error]', e);
    }
    currentAudio = null;
  }
  window.dispatchEvent(new CustomEvent('alvaro-tts-end'));
};

export const isAlvaroSpeaking = () => {
  if (typeof window === 'undefined') return false;
  return isPlaying;
};
