import {products} from '@/data/tienda';
import stories from '@/data/historias/stories.json';
export async function GET(request){
 const {searchParams:p}=new URL(request.url);
 const query=(p.get('q')||'').slice(0,300);const type=p.get('type')||'todos';
 if(!['todos','producto','historia','noticia'].includes(type))return Response.json({error:'Tipo de búsqueda inválido.'},{status:400});
 if(process.env.MEILISEARCH_HOST&&process.env.MEILISEARCH_MASTER_KEY){
  try{
   const response=await fetch(process.env.MEILISEARCH_HOST+'/indexes/idarthur_unificado/search',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+process.env.MEILISEARCH_MASTER_KEY},body:JSON.stringify({q:query,limit:15,...(type==='todos'?{}:{filter:'type = '+JSON.stringify(type)})}),signal:AbortSignal.timeout(2500)});
   if(response.ok){const data=await response.json();return Response.json({success:true,hits:data.hits,source:'search_service'});}
  }catch{}
 }
 const entries=[...products.map(p=>({id:'producto_'+p.id,type:'producto',title:p.name,description:p.copy,image:p.img,link:'/tienda',subtitle:p.price,content:p.copy,url:'/tienda',price:p.price})),...stories.map(s=>({id:'historia_'+s.id,type:'historia',title:s.titulo,description:s.resumen||s.subtitulo||'',image:s.imagen,link:'/historias/'+s.id,content:s.resumen||s.subtitulo||'',subtitle:s.ano||'',url:'/historias/'+s.id}))];
 const words=query.toLocaleLowerCase('es').split(/\s+/).filter(Boolean);
 const hits=entries.filter(e=>(type==='todos'||type===e.type)&&words.every(w=>(e.title+' '+e.description).toLocaleLowerCase('es').includes(w))).slice(0,15);
 return Response.json({success:true,hits,source:'local_catalog',notice:'Catálogo e historias. Las noticias recientes están en la sección Noticias.'});
}
