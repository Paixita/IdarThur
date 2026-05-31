async function test() {
  try {
    const res = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es-CO&q=${encodeURIComponent('Hola mundo')}`);
    console.log(res.status, res.headers.get('content-type'));
  } catch(e) {
    console.error(e);
  }
}
test();
