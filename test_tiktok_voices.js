async function test() {
  const voices = ['es_mx_002', 'es_female_f6', 'es_male_m3', 'es_female_fp1'];
  for (let v of voices) {
    try {
      const res = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hola', voice: v })
      });
      const json = await res.json();
      console.log(v, json.success);
    } catch(e) {}
  }
}
test();
