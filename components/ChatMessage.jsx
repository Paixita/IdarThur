 'use client';
import { useSyncExternalStore } from 'react';
import { chatMessageParts } from '@/utils/chatMessage.mjs';
import { prepareSpeechText } from '@/utils/speechText.mjs';
import { detectLanguage } from '@/utils/languageDetection.mjs';
import { normalizeLanguage, languageCopy } from '@/utils/languageConfig.mjs';
import { playAlvaroAudio, stopAlvaroAudio, subscribeToAlvaro, getAlvaroSnapshot, getAlvaroServerSnapshot } from '@/utils/playAlvaro';

export default function ChatMessage({ text, assistant = false, language }) {
  const lang = normalizeLanguage(language) || detectLanguage(text, 'es');
  const copy = languageCopy(lang);
  const audio = useSyncExternalStore(subscribeToAlvaro, getAlvaroSnapshot, getAlvaroServerSnapshot);
  const mine = audio.text === prepareSpeechText(text, lang) && audio.language === lang;
  const active = mine && ['loading', 'playing'].includes(audio.status);
  return <span lang={lang} dir={lang === 'ar' ? 'rtl' : 'auto'}>
    <span style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{chatMessageParts(text).map((part, i) => {
      if (part.type === 'strong') return <strong key={i}>{part.text}</strong>;
      if (part.type === 'link') return <a key={i} href={part.href} target={part.href.startsWith('https:') ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: '#6ee7b7', textDecoration: 'underline', fontWeight: 700 }}>{part.text}</a>;
      return part.text;
    })}</span>
    {assistant && <span style={{ display:'block', marginTop:10 }}>
      <button type="button" onClick={() => active ? stopAlvaroAudio() : playAlvaroAudio(text, {language:lang})} aria-label={active ? copy.stop : copy.listen} aria-pressed={active} style={{ cursor:'pointer', border:'1px solid #6ee7b7', borderRadius:20, padding:'7px 12px', color:'#d1fae5', background:'#163b35', fontSize:13, minHeight:36 }}>
        <span aria-hidden="true">{active ? '■' : '▶'}</span> {active ? audio.status === 'loading' ? copy.preparing + ' ' + copy.stop : copy.stop : copy.listen}
      </button>
      {mine && audio.status === 'error' && <span role="status" style={{ display:'block', fontSize:12, marginTop:6 }}>{audio.error}</span>}
    </span>}
  </span>;
}
