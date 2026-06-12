// playAlvaro.js - Gestor de voz neural premium para Yessel
let currentAudio = null;

export const playAlvaroAudio = (text) => {
  if (typeof window === 'undefined') return;

  // Detener cualquier reproducción previa
  stopAlvaroAudio();

  if (!text || text.trim() === '') return;

  // Despachar evento indicando que la voz neural ha comenzado a sonar
  window.dispatchEvent(new CustomEvent('alvaro-tts-start'));

  const encodedText = encodeURIComponent(text.trim());
  const audioUrl = `/api/tts?text=${encodedText}`;

  currentAudio = new Audio(audioUrl);

  const handleEnd = () => {
    currentAudio = null;
    window.dispatchEvent(new CustomEvent('alvaro-tts-end'));
  };

  currentAudio.addEventListener('ended', handleEnd);

  currentAudio.addEventListener('error', (e) => {
    console.error('[Neural TTS Client Error]', e);
    handleEnd();
  });

  currentAudio.play().catch((err) => {
    console.error('[Neural TTS Play Blocked/Failed]', err);
    handleEnd();
  });
};

export const stopAlvaroAudio = () => {
  if (typeof window === 'undefined') return;
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
  return currentAudio !== null && !currentAudio.paused;
};
