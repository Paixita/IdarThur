import { normalizeReplyLinks, splitLinkPunctuation } from './travelLinks.mjs';
export function safeChatHref(value) {
  const text = String(value || '').trim();
  if (!text || /[\u0000-\u0020\\]/.test(text)) return null;
  if (text.startsWith('/') && !text.startsWith('//')) return text;
  if (text.startsWith('#')) return text;
  try { const url = new URL(text); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
}
export function chatMessageParts(value) {
  const text = normalizeReplyLinks(value);
  const parts = [];
  const tokens = /\[([^\]\n]+)\]\(([^\s)]+)\)|(https?:\/\/[^\s<>]+)|\*\*([^*\n]+)\*\*/g;
  let start = 0;
  for (const match of text.matchAll(tokens)) {
    if (match.index > start) parts.push({ type: 'text', text: text.slice(start, match.index) });
    if (match[1]) {
      const href = safeChatHref(match[2]);
      parts.push({ type: href ? 'link' : 'text', text: match[1], ...(href ? { href } : {}) });
    } else if (match[3]) {
      const [url, suffix] = splitLinkPunctuation(match[3]);
      const href = safeChatHref(url);
      parts.push({ type: href ? 'link' : 'text', text: url, ...(href ? { href } : {}) });
      if (suffix) parts.push({ type: 'text', text: suffix });
    } else parts.push({ type: 'strong', text: match[4] });
    start = match.index + match[0].length;
  }
  if (start < text.length) parts.push({ type: 'text', text: text.slice(start) });
  return parts;
}
export function buildConversation(message, messages) {
  const history = Array.isArray(messages) ? messages.filter((m) =>
    m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.trim()
  ).slice(-12).map(({ role, content }) => ({ role, content: content.slice(0, 10000) })) : [];
  if (history.at(-1)?.role !== 'user' || history.at(-1)?.content !== message) history.push({ role: 'user', content: message });
  let budget = 7000;
  const bounded = [];
  for (let i = history.length - 1; i >= 0 && budget > 0; i--) {
    const item = history[i];
    const content = item.content.slice(0, budget);
    bounded.unshift({ role: item.role, content });
    budget -= content.length;
  }
  return bounded;
}
