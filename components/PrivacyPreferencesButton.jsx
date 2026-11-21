"use client";
export default function PrivacyPreferencesButton(){return <button type="button" onClick={()=>window.dispatchEvent(new Event('idarthur:privacy:open'))} style={{background:'none',border:0,color:'inherit',cursor:'pointer',padding:0,textAlign:'left',font:'inherit'}}>Preferencias de cookies</button>;}
