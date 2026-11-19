// Preparación exclusiva de audio: nunca modifica el texto visible ni los prompts.
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  laquo: '"', raquo: '"', ldquo: '"', rdquo: '"', lsquo: "'", rsquo: "'",
  ndash: '–', mdash: '—', hellip: '…', bull: ' ',
};

export function prepareSpeechText(value, lang = 'es') {
  return String(value ?? '')
    .normalize('NFC')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
      if (code.startsWith('#')) {
        const point = code[1].toLowerCase() === 'x'
          ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : ' ';
      }
      return ENTITIES[code.toLowerCase()] ?? ' ';
    })
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/[^\s<>]+/gi, ' ')
    .replace(/(^|\n)\s*(?:[-*•]|\d+[.)])\s+/g, '$1')
    .replace(/[*_`#>|]/g, '')
    .replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D]/gu, '')
    .replace(/["“”«»„‟]/g, '')
    .replace(/&/g, lang === 'en' ? ' and ' : ' y ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const SPEECH_CHUNK_CHARS = 360;

export function splitSpeechText(value, limit = SPEECH_CHUNK_CHARS) {
  if (!Number.isInteger(limit) || limit < 2) throw new RangeError('Límite de audio inválido');
  const sentences = String(value ?? '').trim().split(/(?<=[.!?…])\s+/).filter(Boolean);
  const chunks = [];
  for (const sentence of sentences) {
    let rest = sentence;
    while (rest.length > limit) {
      let cut = rest.lastIndexOf(' ', limit);
      if (cut < limit / 3) cut = limit;
      chunks.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) chunks.push(rest);
  }
  return chunks;
}

// Mantener varias frases juntas evita una petición nueva en cada punto.
export function packSpeechText(value, limit = SPEECH_CHUNK_CHARS) {
  const result = [];
  for (const sentence of splitSpeechText(value, limit)) {
    const last = result.length - 1;
    if (last >= 0 && result[last].length + sentence.length + 1 <= limit) result[last] += ' ' + sentence;
    else result.push(sentence);
  }
  return result;
}
