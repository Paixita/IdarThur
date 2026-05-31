import { EdgeTTSBrowser } from 'edge-tts-universal';

export async function playPremiumAudio(text, agentId) {
  // Configuración por defecto (Candy)
  let voiceId = 'es-CO-SalomeNeural'; 

  // Personalidad de voces según el agente
  if (agentId === 'nicolas') {
    voiceId = 'es-MX-JorgeNeural'; 
  } else if (agentId === 'vitalis') {
    voiceId = 'es-MX-DaliaNeural'; 
  }

  try {
    const tts = new EdgeTTSBrowser(text, voiceId);
    const { audio } = await tts.synthesize();
    const url = URL.createObjectURL(audio);
    return new Promise((resolve, reject) => {
      const audioElement = new Audio(url);
      window.currentAudio = audioElement;
      audioElement.onplay = () => resolve(audioElement);
      audioElement.onerror = (e) => reject(e);
      audioElement.play();
    });
  } catch (error) {
    console.error("Error playing premium audio:", error);
    throw error;
  }
}
