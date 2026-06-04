export const runtime = 'edge';

export async function POST(req) {
  try {
    const { text, agentId } = await req.json();
    
    // Asignación de voces naturales (TikTok TTS API)
    let voice = 'es_mx_001'; // Femenina natural (Candy, Vitalis, CyberGuard)
    if (agentId === 'nicolas' || agentId === 'altamar') {
      voice = 'es_mx_002'; // Masculina natural
    }

    // Usar la API REST pública de TikTok TTS (100% compatible con Edge/Cloudflare sin WebSockets)
    const ttsRes = await fetch("https://tiktok-tts.weilnet.workers.dev/api/generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          text: text,
          voice: voice
      })
    });

    const data = await ttsRes.json();
    if (data.error || !data.data) throw new Error(data.error || "Fallo TikTok TTS");

    // Decodificar Base64 a Uint8Array (Compatible con Edge Runtime)
    const binaryString = atob(data.data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Response(bytes, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (err) {
    console.error("Error en TikTok TTS Proxy:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
