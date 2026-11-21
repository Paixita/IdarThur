"use client";
import {useEffect,useState,useSyncExternalStore} from 'react';
import Script from 'next/script';
const KEY='idarthur:privacy:v1';
const subscribe=fn=>{window.addEventListener('idarthur:privacy',fn);window.addEventListener('storage',fn);return()=>{window.removeEventListener('idarthur:privacy',fn);window.removeEventListener('storage',fn);};};
const snapshot=()=>{try{return localStorage.getItem(KEY);}catch{return null;}};
export default function CookiePreferences(){
 const choice=useSyncExternalStore(subscribe,snapshot,()=>null);
 const [editing,setEditing]=useState(false);
 useEffect(()=>{const show=()=>setEditing(true);window.addEventListener('idarthur:privacy:open',show);return()=>window.removeEventListener('idarthur:privacy:open',show);},[]);
 const choose=value=>{
  const revoke=choice==='marketing'&&value==='necessary';
  try{localStorage.setItem(KEY,value);}catch{}
  window.dispatchEvent(new Event('idarthur:privacy'));setEditing(false);
  if(revoke){window.ttq?.revokeConsent?.();window.location.reload();}
 };
 return <>{choice==='marketing'&&<Script id="tiktok-pixel" strategy="afterInteractive">{"\n            !function (w, d, t) {\n              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=[\"page\",\"track\",\"identify\",\"instances\",\"debug\",\"on\",\"off\",\"once\",\"ready\",\"alias\",\"group\",\"enableCookie\",\"disableCookie\",\"holdConsent\",\"revokeConsent\",\"grantConsent\"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(\n            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r=\"https://analytics.tiktok.com/i18n/pixel/events.js\",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement(\"script\")\n            ;n.type=\"text/javascript\",n.async=!0,n.src=r+\"?sdkid=\"+e+\"&lib=\"+t;e=document.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(n,e)};\n\n              ttq.load('D904FQRC77U4L9S4V6UG');\n              ttq.page();\n            }(window, document, 'ttq');\n          "}</Script>}
 {(!choice||editing)&&<aside aria-label="Preferencias de cookies" style={{position:'fixed',bottom:16,left:16,right:16,maxWidth:600,zIndex:4000,padding:22,background:'#10202b',border:'1px solid #4bd7bd',borderRadius:18,boxShadow:'0 8px 40px #0008'}}>
 <strong>Tu privacidad, tu elección</strong><p style={{fontSize:14,lineHeight:1.6,margin:'10px 0'}}>Usamos almacenamiento necesario para preferencias. La publicidad y medición de TikTok son opcionales. Puedes usar la plataforma sin aceptarlas. <a href="/cookies" style={{textDecoration:'underline'}}>Leer política</a></p>
 <div style={{display:'flex',gap:12,flexWrap:'wrap'}}><button className="btn-primary" onClick={()=>choose('necessary')} style={{padding:'12px 18px'}}>Solo necesarias</button><button className="btn-primary" onClick={()=>choose('marketing')} style={{padding:'12px 18px'}}>Aceptar publicidad</button></div>
 </aside>}</>;
}
