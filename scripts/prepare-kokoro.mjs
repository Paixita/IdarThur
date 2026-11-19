// npm ci debe instalar también la voz española, que kokoro-js 1.2.1 no distribuye.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const target = resolve(dirname(require.resolve('kokoro-js')), '../voices/em_alex.bin');
const expected = '27809e9eafdcbcfff90a3016c697568676531de2a2c39cee29c96c7bd6b83e95';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
let current;
try { current = await readFile(target); } catch { /* Primera instalación. */ }
if (!current || hash(current) !== expected) {
  const url = 'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices/em_alex.bin';
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error('No se pudo descargar la voz española: ' + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (hash(bytes) !== expected) throw new Error('La voz descargada no coincide con la versión verificada.');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
}
console.log('Kokoro: voz española em_alex instalada y verificada.');
