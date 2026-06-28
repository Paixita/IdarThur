// playAlvaro.js - Gestor de voz neural premium para Yessel con precarga paralela de frases
import { sendLogisticsAlert } from './alerts';

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
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) return;

  // Crear y precargar todos los audios en paralelo de inmediato
  // Esto elimina las demoras por latencia de red entre oraciones
  audioQueue = sentences.map(sentence => {
    const encodedText = encodeURIComponent(sentence);
    const clientLang = typeof navigator !== 'undefined' ? (navigator.language || '') : '';
    const clientTz = typeof Intl !== 'undefined' ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '') : '';
    const audioUrl = `/api/tts?text=${encodedText}&lang=${encodeURIComponent(clientLang)}&timezone=${encodeURIComponent(clientTz)}`;
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    audio.load(); // Iniciar precarga inmediata
    return {
      text: sentence,
      audio: audio
    };
  });

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

  const currentItem = audioQueue[currentQueueIndex];
  currentAudio = currentItem.audio;

  const handleEnd = () => {
    currentAudio.removeEventListener('ended', handleEnd);
    currentAudio.removeEventListener('error', handleError);
    currentQueueIndex++;
    playNextInQueue();
  };

  const handleError = (e) => {
    console.error('[Neural TTS Client Error]', e);
    sendLogisticsAlert('TTS_AUDIO_FAIL', 'Error al sintetizar o reproducir segmento de audio', {
      text: currentItem.text,
      error: String(e.message || e)
    });
    currentAudio.removeEventListener('ended', handleEnd);
    currentAudio.removeEventListener('error', handleError);
    currentQueueIndex++;
    playNextInQueue();
  };

  currentAudio.addEventListener('ended', handleEnd);
  currentAudio.addEventListener('error', handleError);

  currentAudio.play().catch((err) => {
    console.error('[Neural TTS Play Blocked/Failed]', err);
    sendLogisticsAlert('TTS_PLAYBACK_BLOCKED', 'Reproducción de audio bloqueada por el navegador o fallo de carga', {
      text: currentItem.text,
      error: String(err.message || err)
    });
    stopAlvaroAudio();
  });
};

export const stopAlvaroAudio = () => {
  if (typeof window === 'undefined') return;
  isPlaying = false;

  // Detener y liberar recursos de toda la cola
  audioQueue.forEach(item => {
    if (item.audio) {
      try {
        item.audio.pause();
        item.audio.src = '';
        item.audio.load();
      } catch (e) {
        console.error('[Neural TTS Stop Error]', e);
      }
    }
  });

  audioQueue = [];
  currentQueueIndex = 0;
  currentAudio = null;

  window.dispatchEvent(new CustomEvent('alvaro-tts-end'));
};

export const isAlvaroSpeaking = () => {
  if (typeof window === 'undefined') return false;
  return isPlaying;
};
