import { NextResponse } from 'next/server';
import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req) {
  try {
    const { text, agentId } = await req.json();
    
    // Configuración por defecto (Candy)
    let voiceId = 'es-CO-SalomeNeural'; // Voz colombiana ultra-realista

    // Personalidad de voces según el agente
    if (agentId === 'nicolas') {
      voiceId = 'es-MX-JorgeNeural'; // Voz de hombre muy grave y masculina (México)
    } else if (agentId === 'vitalis') {
      voiceId = 'es-MX-DaliaNeural'; // Voz de doctora formal (México)
    }

    const tts = new EdgeTTS({
        voice: voiceId,
        lang: 'es-ES',
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });

    // Creamos un archivo temporal para guardar el audio
    const tmpFilePath = path.join(os.tmpdir(), `tts-${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`);
    
    // Generamos la voz con la IA de Microsoft Edge
    await tts.ttsPromise(text, tmpFilePath);
    
    // Leemos el archivo y lo convertimos a datos
    const audioBuffer = await fs.promises.readFile(tmpFilePath);
    
    // Borramos el archivo temporal para no llenar el disco
    await fs.promises.unlink(tmpFilePath).catch(console.error);

    // Le entregamos el audio binario a la página web
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store'
      },
    });
  } catch (error) {
    console.error('Error TTS Edge:', error);
    return NextResponse.json({ error: 'Fallo al generar el audio' }, { status: 500 });
  }
}
