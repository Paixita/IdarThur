import { francAll } from 'franc-min';
import { normalizeLanguage } from './languageConfig.mjs';
const iso = {spa:'es',eng:'en',fra:'fr',por:'pt',ita:'it',deu:'de',nld:'nl',rus:'ru',ukr:'uk',arb:'ar',hin:'hi',jpn:'ja',cmn:'zh',kor:'ko',tur:'tr',pol:'pl',vie:'vi',ind:'id',swe:'sv'};
const requested = {es:'español|espanol|spanish|castellano|espagnol|spagnolo|spanisch',en:'english|inglés|ingles|anglais|inglês|inglese|englisch',fr:'french|français|francais|francés|frances',pt:'portuguese|português|portugues|portugués',it:'italian|italiano|italien',de:'german|alemán|aleman|deutsch',nl:'dutch|neerlandés|holandés|nederlands',ru:'russian|ruso|русский|русском',uk:'ukrainian|ucraniano|українською',ar:'arabic|árabe|arabe|العربية',hi:'hindi|हिन्दी|हिंदी',ja:'japanese|japonés|japones|日本語',zh:'chinese|chino|mandarin|mandarín|中文',ko:'korean|coreano|한국어',tr:'turkish|turco|türkçe',pl:'polish|polaco|polski',vi:'vietnamese|vietnamita|tiếng việt',id:'indonesian|indonesio|bahasa indonesia',sv:'swedish|sueco|svenska'};
export function requestedLanguage(value) {
  const text=String(value||'').normalize('NFC').replace(/https?:\/\/\S+/g,' ');
  let choice=null, last=-1;
  for(const [lang,names] of Object.entries(requested)) {
    const re=new RegExp('(?:resp[oó]nd(?:e(?:me)?|er|a|ez)?|reply|answer|speak|cont[eé]sta(?:me)?|habla(?:me)?|háblame|réponds?|parle(?:-moi)?|fale|parla|sprich|escribe|write|cambia|switch|traduce|translate)[^.!?\\n]{0,35}?(?:'+names+')(?![\\p{L}])','giu');
    for(const match of text.matchAll(re)) if(match.index>=last) {choice=lang;last=match.index;}
  }
  if (!choice) for (const [lang,names] of Object.entries(requested)) if (new RegExp('^(?:(?:en|in|em) )?(?:'+names+')(?: please| por favor)?[.! ]*$','iu').test(text.trim())) return lang;
  return choice;
}
export function detectLanguage(value, fallback='es') {
  const original=String(value||'').normalize('NFC');
  const explicit=requestedLanguage(original);
  if(explicit) return explicit;
  const text=original.replace(/https?:\/\/\S+|\b[\w.+-]+@[\w.-]+\b/g,' ').replace(/\b[A-Z]{3}\b/g,' ').trim();
  const stable=normalizeLanguage(fallback)||'es';
  if(/^[\d\s.,!?+→–/():-]+$/.test(text)||/^(ok(?:ay)?|yes|no|si|sí|oui|ja|sim|да|はい|是|네)[.!?\s]*$/i.test(text)||text.length<2) return stable;
  if(/[\u3040-\u30ff]/u.test(text)) return 'ja';
  if(/\p{Script=Hangul}/u.test(text)) return 'ko';
  if(/\p{Script=Han}/u.test(text)) return 'zh';
  if(/\p{Script=Devanagari}/u.test(text)) return 'hi';
  if(/\p{Script=Arabic}/u.test(text)) return 'ar';
  if(/[іїєґ]/iu.test(text)) return 'uk';
  if(/\p{Script=Cyrillic}/u.test(text)) return 'ru';
  const greetings={es:/^(hola|buenas|gracias)\b/i,en:/^(hello|hi|hey|thanks)\b/i,fr:/^(bonjour|bonsoir|merci|salut)\b/i,pt:/^(olá|ola|obrigad[oa]|bom dia)(?!\p{L})/iu,it:/^(ciao|buongiorno|grazie)\b/i,de:/^(hallo|guten tag|danke)\b/i,nl:/^(hallo allemaal|goedemorgen|dank je)\b/i,tr:/^(merhaba|teşekkür)\b/i,pl:/^(cześć|dzień dobry|dziękuję)/i,vi:/^(xin chào|cảm ơn)/i,id:/^(halo|terima kasih)/i,sv:/^(hej|tack)\b/i};
  for(const [lang,re]of Object.entries(greetings))if(re.test(text))return lang;
  const phrases={en:/\b(i want|i would|i need|can you|could you|please help|my trip|a flight)\b/i,es:/\b(quiero|necesito|puedes|quisiera|mi viaje|un vuelo)\b/i,fr:/\b(je veux|je voudrais|je souhaite|pouvez-vous|mon voyage|un vol)\b/i,pt:/\b(gostaria|preciso|você|meu voo|uma viagem)\b/i,it:/\b(vorrei|voglio|posso|mio viaggio|un volo)\b/i,de:/\b(ich möchte|ich will|können sie|mein flug|einen flug)\b/i};
  for(const [lang,re] of Object.entries(phrases))if(re.test(text))return lang;
  if((text.match(/\p{L}/gu)||[]).length<24) return stable;
  const ranked=francAll(text,{only:Object.keys(iso),minLength:24});
  if(!iso[ranked[0]?.[0]])return stable;
  const margin=(ranked[0]?.[1]||0)-(ranked[1]?.[1]||0);
  return margin>=0.08 || text.length>=100 ? iso[ranked[0][0]] : stable;
}
export function conversationLanguage(message, messages, browserLanguage='es') {
  let fallback=normalizeLanguage(browserLanguage)||'es';
  if(Array.isArray(messages))for(let i=messages.length-1;i>=0;i--) {
    const m=messages[i];
    if(m?.role==='assistant' && normalizeLanguage(m.language)){fallback=normalizeLanguage(m.language);break;}
    if(m?.role==='user' && m.content!==message){fallback=detectLanguage(m.content,fallback);break;}
  }
  return detectLanguage(message,fallback);
}
