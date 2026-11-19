import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, conversationLanguage } from '../utils/languageDetection.mjs';
import { getNeuralVoice, languageCopy } from '../utils/languageConfig.mjs';
import { prepareSpeechText } from '../utils/speechText.mjs';
import { verifyTravelEvidence } from '../utils/travelResearch.mjs';

test('La detección distingue idiomas y no confunde el destino con el idioma', () => {
 for(const [text,expected]of [
 ['Hello, I want a flight to Lima.','en'],['Bonjour, je voudrais visiter la Colombie.','fr'],
 ['Quiero viajar a Londres y conocer Inglaterra.','es'],['Olá','pt'],['Gostaria de viajar para Paris.','pt'],
 ['Vorrei un volo per Lima.','it'],['Ich möchte nach Lima reisen.','de'],['こんにちは、旅行を計画しています。','ja'],
 ['请帮我安排去巴黎的旅行。','zh'],['한국에서 여행을 계획하고 있습니다.','ko'],['أريد التخطيط لرحلة إلى اليابان','ar'],
 ['Я хочу запланировать поездку в Лиму.','ru'],['Я хочу організувати подорож до Ліми.','uk'],['मुझे अपनी यात्रा की योजना बनानी है।','hi'],
 ['Merhaba, Lima için bir uçuş arıyorum.','tr'],['Xin chào, tôi muốn đi du lịch.','vi']
 ])assert.equal(detectLanguage(text),expected,text);
});
test('Una petición explícita cambia el idioma de respuesta aunque el mensaje use otro', () => {
 for(const [text,lang]of [['Please respond in French.','fr'],['Respóndeme en inglés.','en'],['Contéstame en portugués.','pt'],['Réponds en anglais.','en'],['English please','en']])assert.equal(detectLanguage(text),lang,text);
});
test('Respuestas cortas, fechas, códigos y enlaces conservan el idioma de la conversación', () => {
 const history=[{role:'assistant',content:'Quelle date préférez-vous ?',language:'fr'}];
 for(const text of ['Oui','Okay','sí','2027-02-15','MDE LIM','https://www.idarthur.com/','https://example.com/answer/inEnglish'])assert.equal(conversationLanguage(text,history,'es'), 'fr',text);
 assert.equal(conversationLanguage('Hello, I need a flight.',history,'es'),'en');
});
test('La voz neural y las etiquetas se seleccionan por idioma', () => {
 for(const [lang,voice]of [['es','em_alex'],['en','am_michael'],['fr','ff_siwis'],['pt','pm_alex'],['it','im_nicola']])assert.equal(getNeuralVoice(lang).voice,voice);
 assert.equal(getNeuralVoice('de'),null);assert.equal(languageCopy('en').listen,'Listen');
});
test('La voz omite fuentes en otros idiomas y conserva las pausas del contenido', () => {
 assert.equal(prepareSpeechText('Your trip is ready.\n\nSources checked (today UTC):\n1. [Airline](https://example.com)','en'),'Your trip is ready.');
 assert.equal(prepareSpeechText('Votre voyage.\n\nSources consultées (aujourd’hui UTC):\n1. Source','fr'),'Votre voyage.');
 assert.equal(prepareSpeechText('Vol & hôtel.','fr'),'Vol et hôtel.');
});
test('Los hechos investigados se redactan en el idioma elegido sin traducir las citas de control', async () => {
 let body;const url='https://example.com/official';
 const response=await verifyTravelEvidence('Un voyage',[{url,title:'Official',text:'El vuelo incluye impuestos.'}],{language:'fr',fetchImpl:async(_,init)=>{
 body=JSON.parse(init.body);return{ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({facts:[{statement:'Le tarif comprend les taxes.',quote:'El vuelo incluye impuestos.',url}]})}}]})};
 }});
 assert.match(body.messages[0].content,/French/);assert.match(response.text,/Voici/);assert.match(response.text,/Le tarif/);assert.doesNotMatch(response.text,/Quedan por confirmar/);
});
