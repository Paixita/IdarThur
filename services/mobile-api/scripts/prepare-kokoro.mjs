// Instalar y verificar las voces multilingües omitidas por kokoro-js 1.2.1.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
const require = createRequire(import.meta.url);
const folder = resolve(dirname(require.resolve('kokoro-js')), '../voices');
const voices = {
 ef_dora:'f66ec66bd295acb18372e37008533a9a3228483ccd294e7538d5d9294ac9a532',
 if_sara:'409b69248798fcdc2542330c76953d230710f19b057e59cb82fdc3c4cf71265c',
 pf_dora:'3da7b5b2d91847ebf5646f57631af6ececae3c29a89cd300f06edf9aa6cfe9ee',
 em_alex:'27809e9eafdcbcfff90a3016c697568676531de2a2c39cee29c96c7bd6b83e95',
 ff_siwis:'a35f5675ad08948e326ae75fd0ea16ba5d0042e4f76b5f3d1df77d0a48c54861',
 im_nicola:'bc578e510d52a96d6940d46f12e96d7b3df00905dbea075113226d100e6e1ab0',
 pm_alex:'0175c753f59c54e7fd5a995bedef0c5ff2fb67e0043dd3dcb2ae74ec2acbeb2a',
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir(folder, {recursive:true});
for (const [voice,expected] of Object.entries(voices)) {
 const target=resolve(folder,voice+'.bin');
 let bytes;
 try { bytes=await readFile(target); } catch { /* Primera instalación. */ }
 if (!bytes || hash(bytes)!==expected) {
  const response=await fetch('https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/voices/'+voice+'.bin', {signal:AbortSignal.timeout(60000)});
  if (!response.ok) throw new Error('No se pudo instalar la voz '+voice+': '+response.status);
  bytes=Buffer.from(await response.arrayBuffer());
  if(hash(bytes)!==expected)throw new Error('La voz '+voice+' no coincide con la versión verificada.');
  await writeFile(target,bytes);
 }
}
console.log('Kokoro: voces ES, FR, IT y PT instaladas y verificadas; EN incluido en el paquete.');
