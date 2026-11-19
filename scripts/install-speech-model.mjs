import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
const files = {
  'config.json': 'df34b4f930b23447cd4dc410fabfb42eb3f24e803e6c3f97d618fb359380a36f',
  'tokenizer_config.json': 'be1cb066d6ef6b074b3f15e6a6dd21ac88ff3cdaedf325f0aaed686c70f75d20',
  'tokenizer.json': '77a02c8e164413299b4b4c403b14f8e0e1c1b727db4d46a09d6327b861060a34',
  'onnx/model_quantized.onnx': 'fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478',
};
const hash = (data) => createHash('sha256').update(data).digest('hex');
for (const [name, expected] of Object.entries(files)) {
  const target = join(process.cwd(), 'assets/kokoro-model', name);
  let existing;
  try { existing = await readFile(target); } catch { /* Primera instalación. */ }
  if (existing && hash(existing) === expected) continue;
  await mkdir(dirname(target), { recursive: true });
  const cached = join(process.cwd(), 'node_modules/@huggingface/transformers/.cache/onnx-community/Kokoro-82M-v1.0-ONNX', name);
  try {
    if (hash(await readFile(cached)) === expected) { await copyFile(cached, target); continue; }
  } catch { /* Descargar la versión fijada. */ }
  const response = await fetch('https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/' + name, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error('No se pudo instalar Kokoro: ' + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (hash(bytes) !== expected) throw new Error('El modelo no coincide con la versión verificada: ' + name);
  await writeFile(target, bytes);
}
console.log('Kokoro: modelo local verificado; sin descarga durante la narración.');
