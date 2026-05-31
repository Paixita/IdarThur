async function test() {
  try {
    const res = await fetch('https://api.tts.quest/v3/voice/synthesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hola, prueba de voz', voice: 'es-CO-SalomeNeural' })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
test();
