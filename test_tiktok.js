async function test() {
  const res = await fetch("https://tiktok-tts.weilnet.workers.dev/api/generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          text: "Hola probando",
          voice: "es_mx_002"
      })
  });
  const data = await res.json();
  console.log(data.data ? "EXITO: Audio Base64 recibido" : "ERROR", data.error);
}
test();
