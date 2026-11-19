import { readFile, writeFile, mkdir, access, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from '@babel/parser';
import { prepareSpeechText } from '../utils/speechText.mjs';
const config = JSON.parse(await readFile('data/config.json', 'utf8'));
const sourceFiles = ['components/Hero.jsx', 'components/VoicePlayer.jsx', 'components/YesselFloating.jsx', 'app/agentes/AgentesClient.js', 'app/autos/AutosClient.js', 'app/hoteles/HotelesClient.js', 'app/historias/HistoriasClient.js'];
const texts = new Set();
const add = (value) => { const text = prepareSpeechText(value); if (text) texts.add(text); };
function literal(node) {
  if (node?.type === 'StringLiteral') return node.value;
  if (node?.type !== 'TemplateLiteral') return null;
  let text = node.quasis[0].value.cooked;
  for (let i = 0; i < node.expressions.length; i += 1) {
    const e = node.expressions[i];
    if (e.type !== 'MemberExpression' || e.object.name !== 'config' || e.property.name !== 'brandName') return null;
    text += config.brandName + node.quasis[i + 1].value.cooked;
  }
  return text;
}
function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'CallExpression' && node.callee.name === 'playAlvaroAudio') add(literal(node.arguments[0]));
  if (node.type === 'ObjectProperty' && ['greeting', 'content', 'text'].includes(node.key.name)) add(literal(node.value));
  if (node.type === 'VariableDeclarator' && node.id.name === 'speech') add(literal(node.init));
  for (const v of Object.values(node)) {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') walk(v);
  }
}
for (const file of sourceFiles) walk(parse(await readFile(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] }));
for (const story of JSON.parse(await readFile('data/historias/stories.json', 'utf8'))) add(story.narrativa);
await mkdir('public/audio/narraciones', { recursive: true });
const exists = async (file) => { try { await access(file); return true; } catch { return false; } };
const manifest = {};
let engine;
for (const text of texts) {
  const id = createHash('sha256').update('continuous-v3:' + text).digest('hex').slice(0, 24);
  const stem = 'public/audio/narraciones/' + id;
  let extension = await exists(stem + '.mp3') ? '.mp3' : '.wav';
  if (!await exists(stem + extension)) {
    engine ??= await import('../utils/kokoroEngine.mjs');
    const { wav } = await engine.synthesizeSpeech(text);
    await writeFile(stem + '.wav', wav);
    const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', stem + '.wav', '-codec:a', 'libmp3lame', '-b:a', '96k', stem + '.mp3']);
    if (result.status === 0) { extension = '.mp3'; await unlink(stem + '.wav'); }
    console.log('Narración preparada:', id, text.length, 'caracteres.');
  }
  manifest[text] = '/audio/narraciones/' + id + extension;
}
await mkdir('data/audio', { recursive: true });
await writeFile('data/audio/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Narraciones completas y listas para CDN:', Object.keys(manifest).length);
