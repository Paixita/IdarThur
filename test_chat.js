async function test() {
  try {
    const res = await fetch('https://idarthur.pages.dev/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hola' }] })
    });
    const text = await res.text();
    console.log(res.status, text.substring(0, 200));
  } catch(e) {
    console.error(e);
  }
}
test();
