import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function POST(req) {
  try {
    const { text, agentId } = await req.json();
    
    // Asignación de voces naturales de Microsoft Azure
    let voice = 'es-CO-SalomeNeural'; // Candy (Colombiana súper natural)
    if (agentId === 'nicolas') voice = 'es-ES-AlvaroNeural'; // Joven, dinámico
    if (agentId === 'vitalis') voice = 'es-MX-DaliaNeural'; // Doctora, profesional, madura
    if (agentId === 'altamar') voice = 'es-ES-EmilioNeural'; // Capitán, maduro
    if (agentId === 'cyberguard') voice = 'es-MX-JorgeNeural'; // Fuerte, seguro

    const lang = voice.split('-').slice(0, 2).join('-');

    const tts = new EdgeTTS({
      voice: voice,
      lang: lang,
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });

    const tmpFile = path.join(os.tmpdir(), `tts-${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`);
    
    // Generar archivo de audio temporal
    await tts.ttsPromise(text, tmpFile);

    // Leer a memoria y devolver al cliente
    const audioBuffer = await fs.readFile(tmpFile);
    await fs.unlink(tmpFile).catch(() => {}); // Borrar archivo temporal sin fallar si hay error

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (err) {
    console.error("Error en Edge TTS:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
