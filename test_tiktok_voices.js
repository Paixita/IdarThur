async function checkVoice(voice) {
  const res = await fetch("https://tiktok-tts.weilnet.workers.dev/api/generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Hola", voice: voice })
  });
  const data = await res.json();
  console.log(voice, data.error ? data.error : "OK");
}

async function run() {
  await checkVoice("es_mx_001");
  await checkVoice("es_mx_002");
  await checkVoice("es_es_001");
  await checkVoice("es_es_002");
  await checkVoice("es_female_f08_salut_damour");
}
run();
