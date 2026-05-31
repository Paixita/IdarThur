const { Communicate } = require('edge-tts-universal');

async function test() {
  try {
    const communicate = new Communicate('Hola, esto es una prueba', 'es-CO-SalomeNeural');
    let chunks = [];
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio') {
        chunks.push(chunk.data);
      }
    }
    console.log('Audio chunks received:', chunks.length);
    console.log('Total bytes:', chunks.reduce((acc, c) => acc + c.length, 0));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
