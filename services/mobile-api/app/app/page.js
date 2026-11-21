import release from '@/mobile/channel.json';
export const metadata={title:'Descarga IdarThur para Android',description:'Vuelos, hoteles, autos, compras y Yessel en tu aplicación Android.'};
export default function DownloadApp(){return <main className="container" style={{paddingTop:120,paddingBottom:80,maxWidth:950}}>
 <p style={{color:'#6ee7b7',fontWeight:800}}>IDARTHUR EN TU BOLSILLO</p><h1 style={{fontSize:'clamp(2.4rem,6vw,4.4rem)',fontWeight:900,margin:'18px 0'}}>Tu próximo viaje comienza aquí.</h1>
 <p style={{fontSize:19,lineHeight:1.7,color:'#b5c8cf'}}>Vuelos a Perú y al mundo, hoteles, autos, tienda Amazon y tu conversación con Yessel. Una app Android con contenido guardado para seguir explorando.</p>
 <section className="glass" style={{padding:30,borderRadius:24,margin:'28px 0'}}>
 <h2 style={{fontSize:26}}>IdarThur {release.versionName}</h2>
 {release.ready?<><a href="/downloads/idarthur.apk" download="IdarThur.apk" className="btn-primary" style={{display:'inline-block',padding:'16px 24px',margin:'20px 0'}}>Descargar APK para Android</a><p>APK firmado · {Math.ceil(release.sizeBytes/1000000)} MB · Android 7 o posterior.</p><details style={{marginTop:16}}><summary>Verificar descarga</summary><p style={{overflowWrap:'anywhere',fontSize:13}}>SHA-256: {release.sha256}</p></details></>:<p>Estamos preparando la descarga firmada. Vuelve a esta dirección cuando termine la publicación.</p>}
 </section><h2 style={{fontSize:25}}>Una descarga estable y actualizaciones claras</h2><p style={{lineHeight:1.8,margin:'16px 0'}}>Guarda esta página. El catálogo y las historias pueden actualizarse sin reinstalar. Si hay una nueva versión del código, la app mostrará un aviso; revisa el cambio y pulsa Actualizar. Android pedirá permiso para instalar. No se instalan APKs silenciosamente ni se promete compatibilidad eterna.</p>
 <p style={{lineHeight:1.8}}>La app abre contenido guardado sin conexión. Las noticias recientes, la IA, voces remotas y las reservas necesitan internet y servicios disponibles. Las compras y reservas se completan con proveedores externos.</p>
 <p style={{marginTop:20}}>Antes de usarla, revisa <a href="/privacidad">Privacidad</a>, <a href="/terminos">Términos</a>, <a href="/afiliados">Afiliados</a> y <a href="/ia">Uso de IA</a>.</p>
 </main>;}
