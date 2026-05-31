async function test() {
  while(true) {
    try {
      const res = await fetch('https://idarthur.pages.dev/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hola', voiceId: 'EXAVITQu4vr4xnSDxMaL' })
      });
      const text = await res.text();
      console.log(res.status, text);
      if (text.includes("details")) break;
    } catch(e) {
      console.error(e);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}
test();
