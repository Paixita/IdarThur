import test from 'node:test';
import assert from 'node:assert/strict';
import { browserEvidence, publicSourceUrl, researchTravel, groundedFacts } from '../utils/travelResearch.mjs';

test('Las fuentes proceden de herramientas ejecutadas y no de enlaces inventados en la respuesta', () => {
 const e = browserEvidence({ content:'Dato【1†L0-L2】 https://inventado.example', executed_tools:[
 { output:'L0: \nL1: URL: https://www.jal.co.jp/jp/en/', search_results:{results:[{url:'https://www.jal.co.jp/jp/en/',title:'JAL'},{url:'javascript:alert(1)'}]} },
 { output:'L1: URL: https://exa.ai/search?q=tokyo' }
 ] });
 assert.equal(e.sources.length,1); assert.equal(e.sources[0].url,'https://www.jal.co.jp/jp/en/');
 assert.equal(e.openedCount,1); assert.doesNotMatch(e.text,/【/);
});
test('Se rechazan enlaces internos, credenciales y protocolos inseguros', () => {
 for (const u of ['http://example.com','https://localhost','https://10.0.0.1','https://172.16.1.1','https://192.168.1.1','https://[::1]','https://a:b@example.com','https://app.local']) assert.equal(publicSourceUrl(u),null,u);
 assert.equal(publicSourceUrl('https://www.kenya-airways.com/'),'https://www.kenya-airways.com/');
});
test('La investigación usa navegación real y omite contactos de la consulta', async () => {
 let body, calls = 0;
 const result = await researchTravel('Tokyo a Osaka 2027-02-15, viajero test@example.com teléfono +57 300 123 4567', {apiKey:'fake',fetchImpl:async (_,init) => {
 const current=JSON.parse(init.body); calls++; if(calls === 1) { body=current; return {ok:true,json:async()=>({choices:[{message:{content:'Información de JAL.',executed_tools:[{output:'L1: URL: https://www.jal.co.jp/\nL2: JAL opera vuelos domésticos en Japón.'}]}}]})}; } return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({facts:[{statement:'JAL opera vuelos domésticos en Japón.',quote:'JAL opera vuelos domésticos en Japón.',url:'https://www.jal.co.jp/'}],questions:['¿En qué fecha viajas?']})}}]})};
 }});
 assert.equal(body.tools[0].type,'browser_search'); assert.equal(body.tool_choice,'required');
 assert.doesNotMatch(body.messages[1].content,/test@example|300 123/); assert.match(body.messages[1].content,/2027-02-15/);
 assert.equal(result.fareStatus,'public_information_not_revalidated_inventory'); assert.ok(result.checkedAt);
});
test('Un fallo del proveedor o una respuesta sin evidencia no simulan investigación', async () => {
 await assert.rejects(researchTravel('Lima vuelos',{fetchImpl:async()=>({ok:false})}));
 await assert.rejects(researchTravel('Lima vuelos',{fetchImpl:async()=>({ok:true,json:async()=>({choices:[{message:{content:'Hay cupos.'}}]})})}));
});


test('Se descartan citas inexistentes y datos que no proceden de páginas realmente abiertas', () => {
 const pages=[{url:'https://www.ana.co.jp/',text:'Tottori to Tokyo Haneda. Flights operated by ANA.'}];
 const facts=groundedFacts([
 {statement:'Conexión con Haneda.',quote:'Tottori to Tokyo Haneda.',url:pages[0].url},
 {statement:'Vuelo directo a Osaka.',quote:'Tottori to Osaka.',url:pages[0].url},
 {statement:'Tarifa confirmada.',quote:'Tottori to Tokyo Haneda.',url:'https://inventado.example'}
 ],pages);
 assert.equal(facts.length,1); assert.equal(facts[0].statement,'Conexión con Haneda.');
});
