export async function playPremiumAudio(text, agentId) {
  // Para Google TTS, diferenciamos acentos sutilmente.
  // Google TTS es extremadamente natural, humano y gratuito.
  const lang = agentId === 'nicolas' ? 'es-US' : 'es-MX'; 
  
  // Dividir el texto en oraciones pequeñas
  const sentences = text.match(/[^.?!]+[.?!]+[\])'"`’”]*|.+/g) || [text];
  
  let currentAudio = null;
  let isCancelled = false;

  const resultProxy = {
    onended: () => {},
    pause: () => {
      isCancelled = true;
      if (currentAudio) currentAudio.pause();
    }
  };

  window.currentAudio = resultProxy;

  // Ejecutamos la reproducción en segundo plano sin bloquear el hilo principal
  (async () => {
    try {
      for (let i = 0; i < sentences.length; i++) {
        if (isCancelled) break;
        
        let sentence = sentences[i].trim();
        if (!sentence) continue;

        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(sentence)}`;
        
        await new Promise((res, rej) => {
          currentAudio = new Audio(url);
          currentAudio.onended = res;
          currentAudio.onerror = rej; // Si falla un fragmento, aborta
          currentAudio.play().catch(rej);
        });
      }
      if (!isCancelled) {
        resultProxy.onended();
      }
    } catch (error) {
      console.error("Error en Google TTS:", error);
      if (!isCancelled) resultProxy.onended(); // Finalizar el estado aunque haya error
    }
  })();

  // Resolvemos inmediatamente para que el UI pueda reaccionar
  return resultProxy;
}
