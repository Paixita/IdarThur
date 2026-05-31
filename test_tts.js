async function test() {
  try {
    const res = await fetch('https://idarthur.pages.dev/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hola', voiceId: 'EXAVITQu4vr4xnSDxMaL' })
    });
    console.log(res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log('Error text:', text);
    } else {
      const buff = await res.arrayBuffer();
      console.log('Success, audio length:', buff.byteLength);
    }
  } catch(e) {
    console.error(e);
  }
}
test();
