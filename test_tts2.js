const { EdgeTTS } = require('node-edge-tts');
const fs = require('fs');

async function test() {
  try {
    const tts = new EdgeTTS({
        voice: 'es-CO-SalomeNeural',
        lang: 'es-CO',
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    });
    console.log("Generando...");
    await tts.ttsPromise("Hola, probando la voz de Salome", "./test.mp3");
    console.log("Generado! Existe?", fs.existsSync("./test.mp3"));
  } catch (err) {
    console.error("ERROR EN TEST:", err);
  }
}
test();
