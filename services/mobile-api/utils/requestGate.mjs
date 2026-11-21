import {createHash,randomBytes} from 'node:crypto';
const windows=new Map();const salt=randomBytes(16).toString('hex');
export function requestGate(request,{scope='chat',limit=20,now=Date.now()}={}){
 const size=Number(request.headers.get('content-length')||0);
 if(size>60000)return Response.json({error:'Mensaje demasiado grande.'},{status:413});
 const ip=(request.headers.get('x-forwarded-for')||'local').split(',')[0].trim();
 const key=scope+':'+createHash('sha256').update(salt+ip).digest('hex');
 let entry=windows.get(key);
 if(!entry||now>=entry.until){entry={count:0,until:now+60000};windows.set(key,entry);}
 if(++entry.count>limit)return Response.json({error:'Demasiadas solicitudes. Espera un minuto.'},{status:429,headers:{'Retry-After':'60','Cache-Control':'no-store'}});
 if(windows.size>5000){for(const[k,v]of windows){if(v.until<now)windows.delete(k);if(windows.size<=4500)break;}if(windows.size>5000)windows.delete(windows.keys().next().value);}
 return null;
}
