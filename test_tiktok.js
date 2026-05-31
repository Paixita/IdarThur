async function test() {
  try {
    const res = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Hola panita, probando la voz de tiktok',
        voice: 'es_mx_002' // voz de tiktok
      })
    });
    const json = await res.json();
    console.log(res.status, Object.keys(json));
  } catch (e) {
    console.error(e);
  }
}
test();
