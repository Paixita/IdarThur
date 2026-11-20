import { francAll } from 'franc-min';
import { normalizeLanguage } from './languageConfig.mjs';
const iso = {spa:'es',eng:'en',fra:'fr',por:'pt',ita:'it',deu:'de',nld:'nl',rus:'ru',ukr:'uk',arb:'ar',hin:'hi',jpn:'ja',cmn:'zh',kor:'ko',tur:'tr',pol:'pl',vie:'vi',ind:'id',swe:'sv'};
const requested = {es:'español|espanol|spanish|castellano|espagnol|spagnolo|spanisch',en:'english|inglés|ingles|anglais|inglês|inglese|englisch',fr:'french|français|francais|francés|frances',pt:'portuguese|português|portugues|portugués',it:'italian|italiano|italien',de:'german|alemán|aleman|deutsch',nl:'dutch|neerlandés|holandés|nederlands',ru:'russian|ruso|русский|русском',uk:'ukrainian|ucraniano|українською',ar:'arabic|árabe|arabe|العربية',hi:'hindi|हिन्दी|हिंदी',ja:'japanese|japonés|japones|日本語',zh:'chinese|chino|mandarin|mandarín|中文',ko:'korean|coreano|한국어',tr:'turkish|turco|türkçe',pl:'polish|polaco|polski',vi:'vietnamese|vietnamita|tiếng việt',id:'indonesian|indonesio|bahasa indonesia',sv:'swedish|sueco|svenska'};
function cleanLanguageText(value) {
  return String(value || '').normalize('NFC')
    .replace(/\x60{3}[\s\S]*?\x60{3}|\x60[^\x60]*\x60/g,' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g,' ')
    .replace(/https?:\/\/\S+|\b[\w.+-]+@[\w.-]+\b/g,' ')
    .replace(/[“"][^”"\n]+[”"]/g,' ')
    .replace(/<[^>]*>/g,' ').trim();
}
export function requestedLanguage(value) {
  const text=cleanLanguageText(value);
  let choice=null,last=-1;
  for(const [lang,names] of Object.entries(requested)) {
    // A connector immediately after the verb is intentional: "habla de un puerto francés" is not a language request.
    const re=new RegExp('(?<![\\p{L}])(?:resp[oó]nd(?:e(?:me)?|as|a|er|ez)?|reply|answer|speak|cont[eé]sta(?:me)?|habla(?:me)?|háblame|r[eé]ponds?|parle(?:-moi)?|fale|parla|sprich|escribe|write|cambia|switch|traduce|translate|mant[eé]n|contin[uú]a|sigue)\\s+(?:(?:por favor|please)\\s+)?(?:en|in|em|into|to|al|a|auf)\\s+(?:'+names+')(?![\\p{L}])','giu');
    for(const match of text.matchAll(re)) {
      const before=text.slice(Math.max(0,match.index-18),match.index);
      if(/\b(?:no|not|don't|ne)\s*$/iu.test(before)) continue;
      if(match.index>=last){choice=lang;last=match.index;}
    }
    if(!choice && new RegExp('^(?:(?:ahora|now)\\s+)?(?:en|in|em)\\s+(?:'+names+')[.! ]*$','iu').test(text))choice=lang;
    if(!choice && new RegExp('^(?:'+names+')(?: please| por favor| s’il vous plaît| s\\x27il vous plaît)[.! ]*$','iu').test(text))choice=lang;
  }
  return choice;
}
const markers = {
 es:'la de del es una un te tu se soy estoy ayuda lluvia chaqueta prenda proteger protegerte puede pueden el los las para con necesito quiero que como puedo viajar llevar ropa crucero por me mi deberia quisiera cuantos donde pasaporte equipaje configurar configuro proteger seguridad cuenta',
 en:'the need want please what how where with which would cruise travel can my flight clothes should from your you flights configure do',
 fr:'la de du qui ce cette pluie veste impermeable protegera je veux voudrais pour pourquoi comment est avec vous votre croisiere besoin souhaite des une merci bonjour le les sont voyage',
 pt:'quero preciso gostaria voce viagem bagagem cruzeiro obrigado obrigada uma seu quais sao',
 it:'vorrei voglio viaggio crociera bagaglio grazie come quale sono partenza devo vestiti volo',
 de:'ich mochte brauche welche wie kreuzfahrt gepack bitte reisen nach fur und',
 nl:'ik wil graag welke hoe reizen bagage alsjeblieft het een zijn voor naar met',
 tr:'istiyorum ihtiyacim seyahat gemi bilet nasil lutfen merhaba',
 pl:'chce potrzebuje podroz rejs bagaz prosze jak gdzie',
 vi:'toi muon can chuyen du lich vui long',
 id:'saya ingin perlu perjalanan pesiar tolong bagaimana',
 sv:'jag vill behover resa kryssning tack vilken att och ar for med till',
};
function markerScores(text) {
  const words=new Set(text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().match(/\p{L}+/gu)||[]);
  const strong={es:['quiero','necesito','quisiera'],fr:['voudrais','souhaite'],pt:['gostaria','voce','quero'],it:['vorrei','voglio'],de:['mochte','brauche']};
  return Object.entries(markers).map(([lang,list])=>[lang,list.split(' ').filter(word=>words.has(word)).length+2*(strong[lang]||[]).filter(word=>words.has(word)).length]).sort((a,b)=>b[1]-a[1]);
}
export function detectLanguage(value, fallback='es', {allowRequest=true}={}) {
  if(allowRequest){const explicit=requestedLanguage(value);if(explicit)return explicit;}
  const text=cleanLanguageText(value).replace(/\b[A-Z]{3}\b/g,' ').trim();
  const stable=normalizeLanguage(fallback)||'es';
  const letters=(text.match(/\p{L}/gu)||[]).length;
  if(letters<2 || /^(ok(?:ay)?|yes|no|si|sí|oui|ja|sim|да|はい|是|네)[.!?\s]*$/i.test(text))return stable;
  const ratio=re=>(text.match(re)||[]).length/letters;
  if(ratio(/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu)>.55 && /[\u3040-\u30ff]/u.test(text))return 'ja';
  if(ratio(/\p{Script=Hangul}/gu)>.55)return 'ko';
  if(ratio(/\p{Script=Han}/gu)>.55)return 'zh';
  if(ratio(/\p{Script=Devanagari}/gu)>.55)return 'hi';
  if(ratio(/\p{Script=Arabic}/gu)>.55)return 'ar';
  if(ratio(/\p{Script=Cyrillic}/gu)>.55)return /[іїєґ]/iu.test(text)?'uk':'ru';
  const greetings={es:/^(hola|buenas|gracias|panita|mi pana)\b/i,en:/^(hello|hi|hey|thanks)\b/i,fr:/^(bonjour|bonsoir|merci|salut)\b/i,pt:/^(olá|ola|obrigad[oa]|bom dia)(?!\p{L})/iu,it:/^(ciao|buongiorno|grazie)\b/i,de:/^(hallo|guten tag|danke)\b/i,nl:/^(hallo allemaal|goedemorgen|dank je)\b/i,tr:/^(merhaba|teşekkür)\b/i,pl:/^(cześć|dzień dobry|dziękuję)/i,vi:/^(xin chào|cảm ơn)/i,id:/^(halo|terima kasih)/i,sv:/^(hej|tack)\b/i};
  for(const [lang,re]of Object.entries(greetings))if(re.test(text))return lang;
  const scores=markerScores(text);
  if(scores[0]?.[1]>=2 && scores[0][1]>(scores[1]?.[1]||0))return scores[0][0];
  if(letters<24)return stable;
  const ranked=francAll(text,{only:Object.keys(iso),minLength:24});
  const best=iso[ranked[0]?.[0]];
  if(!best || best===stable)return stable;
  const margin=(ranked[0]?.[1]||0)-(ranked[1]?.[1]||0);
  // Proper names and long lists of ports cannot force a switch, even on long messages.
  const score=scores.find(([lang])=>lang===best)?.[1]||0;
  return margin>=.20 && score>=2 ? best : stable;
}
export function conversationLanguage(message, messages, browserLanguage='es') {
  const history=Array.isArray(messages)?messages.filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string').slice(-12):[];
  if(history.at(-1)?.role==='user' && history.at(-1)?.content===message)history.pop();
  const users=history.filter(m=>m.role==='user');
  let stable=normalizeLanguage(browserLanguage)||'es', explicitPreference=null;
  if(!users.length){const last=history.findLast(m=>m.role==='assistant'&&normalizeLanguage(m.language));if(last)stable=normalizeLanguage(last.language);}
  for(const m of users){
    const preference=requestedLanguage(m.content);
    if(preference){explicitPreference=preference;stable=preference;}
    else if(!explicitPreference)stable=detectLanguage(m.content,stable);
  }
  const current=requestedLanguage(message);
  if(current)return current;
  if(explicitPreference)return explicitPreference;
  // Acknowledgements, ports and isolated words retain the user's established language.
  if(users.length && (cleanLanguageText(message).match(/\p{L}+/gu)||[]).length<=3)return stable;
  return detectLanguage(message,stable);
}
export function replyNeedsLanguageRepair(reply, language) {
  const target=normalizeLanguage(language)||'es';
  const clean=cleanLanguageText(reply);
  return [clean,...clean.split(/\n\s*\n/)].some(part=>
    (part.match(/\p{L}+/gu)||[]).length>=6 && detectLanguage(part,target,{allowRequest:false})!==target
  );
}
