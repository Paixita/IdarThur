import test from 'node:test';
import assert from 'node:assert/strict';
import {requestGate} from '../utils/requestGate.mjs';
import {adminAuthorized} from '../utils/adminAccess.mjs';
import {readFileSync} from 'node:fs';
test('Límites de solicitudes y tamaño sin ejecutar el proveedor',()=>{
 const request=new Request('https://www.idarthur.com/api/chat',{headers:{'x-forwarded-for':'test-client'}});
 assert.equal(requestGate(request,{scope:'test',limit:2,now:1000}),null);
 assert.equal(requestGate(request,{scope:'test',limit:2,now:1001}),null);
 assert.equal(requestGate(request,{scope:'test',limit:2,now:1002}).status,429);
 assert.equal(requestGate(request,{scope:'test',limit:2,now:62000}),null);
 assert.equal(requestGate(new Request('https://www.idarthur.com/',{headers:{'content-length':'70000'}})).status,413);
});
test('Los diagnósticos no quedan abiertos si no hay clave administrativa',()=>{
 const old=process.env.IDARTHUR_ADMIN_TOKEN;delete process.env.IDARTHUR_ADMIN_TOKEN;
 assert.equal(adminAuthorized(new Request('https://www.idarthur.com/')),false);
 process.env.IDARTHUR_ADMIN_TOKEN='test-only-token';
 assert.equal(adminAuthorized(new Request('https://www.idarthur.com/',{headers:{Authorization:'Bearer test-only-token'}})),true);
 assert.equal(adminAuthorized(new Request('https://www.idarthur.com/',{headers:{Authorization:'Bearer invalid'}})),false);
 if(old===undefined)delete process.env.IDARTHUR_ADMIN_TOKEN;else process.env.IDARTHUR_ADMIN_TOKEN=old;
});
test('El catálogo móvil no incluye credenciales y conserva destinos y relato actual',()=>{
 const content=JSON.parse(readFileSync(new URL('../data/mobile-content.json',import.meta.url),'utf8'));
 assert.equal(content.schemaVersion,1);assert.equal(content.products.length,18);
 assert.ok(content.stories.some(s=>s.id==='la-noche-en-que-el-cielo-guardo-silencio'));
 assert.ok(content.legal.some(d=>d.id==='ia'));
 assert.doesNotMatch(JSON.stringify(content),/gsk_[A-Za-z0-9]{20}|GROQ_API_KEY/);
});
