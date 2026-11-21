"use client";
import {useState} from 'react';
import {buildFlightLink,buildHotelLink} from '@/utils/travelLinks.mjs';
const cities=[['Lima','LIM','Gastronomía, costa y conexiones por Perú.','/renovacion/lima.webp'],['Cusco','CUZ','Valle Sagrado y acceso a Machu Picchu.','/renovacion/cusco.webp'],['Arequipa','AQP','Arquitectura y paisajes del sur peruano.',null],['Iquitos','IQT','Amazonía y experiencias en el río.',null]];
export default function PeruClient(){
 const [origin,setOrigin]=useState('MDE');
 const valid=/^[A-Z]{3}$/.test(origin);
 return <main className="container" style={{paddingTop:120,paddingBottom:70}}>
 <p style={{color:'#6ee7b7',fontWeight:800}}>DESCUBRE PERÚ</p><h1 style={{fontSize:'clamp(2.4rem,6vw,4.6rem)',fontWeight:900,margin:'14px 0'}}>Tu próximo viaje a Perú</h1>
 <p style={{maxWidth:760,fontSize:18,lineHeight:1.7,color:'#b3c8cf'}}>Compara vuelos a Lima, Cusco, Arequipa e Iquitos. Ajusta tu aeropuerto de origen y confirma fechas, escalas, equipaje y precio en el proveedor. Yessel puede ayudarte a preparar un presupuesto orientativo.</p>
 <label style={{display:'block',margin:'24px 0'}}>Aeropuerto de origen (código IATA)<input aria-label="Aeropuerto de origen" value={origin} maxLength={3} onChange={e=>setOrigin(e.target.value.toUpperCase().replace(/[^A-Z]/g,''))} style={{display:'block',background:'#12232b',border:'1px solid #6ee7b7',padding:14,borderRadius:12,color:'white',fontSize:20,marginTop:8,width:180}}/></label>
 {!valid&&<p role="status">Escribe tres letras, por ejemplo MDE, BOG o MAD.</p>}
 <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',gap:22,marginTop:28}}>
 {cities.map(([name,code,copy,image])=><article className="glass" key={code} style={{borderRadius:22,overflow:'hidden'}}>
 {image?<img src={image} alt={name+' en Perú'} style={{width:'100%',height:190,objectFit:'cover'}}/>:<div style={{height:190,display:'grid',placeItems:'center',fontSize:72,background:'linear-gradient(120deg,#183f46,#172938)'}} aria-hidden="true">{code==='AQP'?'🏔️':'🌿'}</div>}
 <div style={{padding:22}}><h2 style={{fontSize:26,fontWeight:800}}>{name} · {code}</h2><p style={{lineHeight:1.6,margin:'12px 0',color:'#bfd1d8'}}>{copy}</p>
 <a aria-disabled={!valid} href={valid?buildFlightLink(name,origin):undefined} className="btn-primary" target="_blank" rel="noopener noreferrer sponsored" style={{display:'inline-block',padding:'12px 18px'}}>Comparar vuelos a {name}</a>
 <p style={{marginTop:16}}><a href={buildHotelLink(name)} target="_blank" rel="noopener noreferrer sponsored" style={{textDecoration:'underline'}}>Buscar hoteles en {name}</a></p></div></article>)}
 </section><aside className="glass" style={{padding:26,borderRadius:20,marginTop:28,lineHeight:1.8}}>
 <h2 style={{fontSize:22}}>Antes de reservar</h2><p>Las rutas y horarios dependen de las fechas. No se confirma aquí un vuelo directo ni disponibilidad. Los requisitos de entrada dependen de la nacionalidad, residencia y escalas del viajero: revísalos en fuentes oficiales antes de comprar.</p>
 <p>Las reservas y pagos se completan con el proveedor externo; consulta sus condiciones y canales de reclamación. <a href="/terminos" style={{textDecoration:'underline'}}>Cómo funciona IdarThur</a>.</p>
 <a href="/agentes" className="btn-primary" style={{display:'inline-block',padding:'12px 18px',marginTop:12}}>Organizar mi viaje con Yessel</a>
 </aside></main>;
}
