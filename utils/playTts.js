export async function playPremiumAudio(text, agentId) {
  const lang = agentId === 'nicolas' ? 'es-US' : 'es-MX'; 
  const sentences = text.match(/[^.?!]+[.?!]+[\])'"`’”]*|.+/g) || [text];
  
  return new Promise((resolve, reject) => {
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

    // Reproducir la primera oración inmediatamente para detectar errores (autoplay o red)
    const firstSentence = sentences[0].trim();
    if (!firstSentence) {
      return reject(new Error("Texto vacío"));
    }

    const firstUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(firstSentence)}`;
    currentAudio = new Audio(firstUrl);
    
    currentAudio.onplay = () => {
      // Si la primera oración empieza a sonar con éxito, resolvemos la promesa para que el UI sepa que sí funcionó
      resolve(resultProxy);
    };

    currentAudio.onerror = (e) => reject(new Error("Error cargando Google TTS"));
    
    currentAudio.onended = async () => {
      // Reproducir el resto de las oraciones
      for (let i = 1; i < sentences.length; i++) {
        if (isCancelled) break;
        let sentence = sentences[i].trim();
        if (!sentence) continue;

        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(sentence)}`;
        await new Promise((res, rej) => {
          currentAudio = new Audio(url);
          currentAudio.onended = res;
          currentAudio.onerror = rej;
          currentAudio.play().catch(rej);
        });
      }
      if (!isCancelled) resultProxy.onended();
    };

    // Iniciar el primer audio. Si falla (ej. por autoplay), lanzará el catch y rechazará la promesa
    currentAudio.play().catch(err => {
      reject(err);
    });
  });
}
