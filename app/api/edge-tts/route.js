import { UniversalEdgeTTS } from 'edge-tts-universal';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { text, agentId } = await req.json();
    
    // Asignación de voces naturales de Microsoft Azure
    let voice = 'es-CO-SalomeNeural'; // Candy (Colombiana súper natural)
    if (agentId === 'nicolas') voice = 'es-ES-AlvaroNeural'; // Joven, dinámico
    if (agentId === 'vitalis') voice = 'es-MX-DaliaNeural'; // Doctora, profesional, madura
    if (agentId === 'altamar') voice = 'es-ES-EmilioNeural'; // Capitán, maduro
    if (agentId === 'cyberguard') voice = 'es-ES-ElviraNeural'; // Fuerte, segura, protectora (Femenina)

    const tts = new UniversalEdgeTTS(text, voice);
    const result = await tts.synthesize();
    const arrayBuffer = await result.audio.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (err) {
    console.error("Error en Edge TTS Universal:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
