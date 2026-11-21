import test from 'node:test';
import assert from 'node:assert/strict';
import { researchSecurity, sanitizeSecurityQuery, trustedSecurityUrl } from '../utils/securityResearch.mjs';
import { buildCyberguardSystem } from '../utils/cyberguardKnowledge.mjs';
import { generateChatWithFallback } from '../utils/chatGeneration.mjs';
import { getAgentVoiceGender } from '../utils/agentVoice.mjs';
test('La búsqueda de seguridad omite secretos y enlaces sospechosos',()=>{
 const query=sanitizeSecurityQuery('phishing https://bad.example/secret?token=abc usuario@example.com password=privada gsk_abcdefghijklmnopqrst https://www.cisa.gov/advice?token=privado');
 assert.doesNotMatch(query,/bad.example|usuario@|privada|abcdefghijkl|token=privado/);
 assert.match(query,/https:\/\/www.cisa.gov\/advice/);
 assert.equal(trustedSecurityUrl('https://cisa.gov.attacker.example/advice'),null);
 assert.equal(trustedSecurityUrl('http://www.cisa.gov/advice'),null);
 assert.equal(trustedSecurityUrl('https://www.cisa.gov/advice'),'https://www.cisa.gov/advice');
});
test('Natalia tiene perfil propio y orientación técnica sin prometer acciones inexistentes',()=>{
 const prompt=buildCyberguardSystem('IdarThur','es');
 for(const term of ['OAuth','SAML','SSRF','OWASP','incidentes','investigarSeguridadWeb'])assert.match(prompt,new RegExp(term,'i'));
 assert.match(prompt,/No tienes conexión para auditar/);
 assert.equal(getAgentVoiceGender('cyberguard'),'female');
 for(const id of ['nicolas','altamar','cronista','vitalis',undefined])assert.equal(getAgentVoiceGender(id),'male');
});
test('Solo se devuelven hechos con citas exactas de páginas oficiales abiertas',async()=>{
 const official='https://www.cisa.gov/advice';
 const calls=[];
 const result=await researchSecurity('Proteger sesiones y cuentas',{apiKey:'example',fetchImpl:async(_,init)=>{
  const body=JSON.parse(init.body);calls.push(body);
  if(calls.length===1)return {ok:true,json:async()=>({choices:[{message:{content:'Respuesta no comprobada',executed_tools:[
   {output:'URL: '+official+'\nUse phishing-resistant MFA to protect accounts.'},
   {output:'URL: https://blog.example/article\nFake version 99.'}
  ]}}]})};
  return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({facts:[
   {statement:'Usa MFA resistente al phishing.',quote:'Use phishing-resistant MFA to protect accounts.',url:official},
   {statement:'La versión 99 es segura.',quote:'Fake version 99.',url:'https://blog.example/article'},
   {statement:'Una afirmación inventada.',quote:'This quote does not exist.',url:official}
  ]})}}]})};
 }});
 assert.equal(result.facts.length,1);
 assert.equal(result.sources[0].url,official);
 assert.doesNotMatch(result.text,/versión 99|inventada|Respuesta no comprobada/);
 assert.doesNotMatch(JSON.stringify(calls[1]),/blog.example/);
});
test('Una búsqueda sin documentación oficial no inventa una respuesta verificada',async()=>{
 await assert.rejects(researchSecurity('Último aviso',{fetchImpl:async()=>({ok:true,json:async()=>({choices:[{message:{content:'Un consejo sin fuentes',executed_tools:[]}}]})})}),/páginas oficiales/);
});

test('Los identificadores CVE se conservan y un límite temporal activa el modelo de respaldo',async()=>{
 assert.match(sanitizeSecurityQuery('Consultar CVE-2026-1234567 con el fabricante'),/CVE-2026-1234567/);
 const calls=[];
 const result=await generateChatWithFallback(async options=>{
  calls.push(options);
  if(calls.length===1)throw Object.assign(new Error('Rate limit'),{statusCode:429});
  return {text:'Respuesta disponible'};
 },{model:'principal',system:'Mantener el idioma y el rol',messages:[{role:'user',content:'Consulta'}],tools:{ejemplo:{}}},'respaldo');
 assert.equal(result.text,'Respuesta disponible');
 assert.equal(calls[1].model,'respaldo');
 assert.deepEqual(calls[1].messages,calls[0].messages);
 assert.deepEqual(calls[1].tools,calls[0].tools);
 await assert.rejects(generateChatWithFallback(async()=>{throw Object.assign(new Error('Unauthorized'),{statusCode:401});},{},'respaldo'),/Unauthorized/);
});
