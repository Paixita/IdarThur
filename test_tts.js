const { EdgeTTS } = require('node-edge-tts');

async function test() {
  try {
    const tts = new EdgeTTS({
        voice: 'es-CO-SalomeNeural',
        lang: 'es-CO',
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    });
    // Let's see if we can get the buffer
    // node-edge-tts usually writes to file. Let's see if it has a stream or buffer method.
    // wait, what properties does EdgeTTS have?
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(tts)));
  } catch (err) {
    console.error(err);
  }
}
test();
