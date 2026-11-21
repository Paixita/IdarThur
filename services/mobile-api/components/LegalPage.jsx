import documents from '@/data/legal/documents.json';
export default function LegalPage({id}){
 const doc=documents.find(d=>d.id===id);
 return <main className="container" style={{paddingTop:120,paddingBottom:70,maxWidth:900}}>
 <h1 style={{fontSize:'clamp(2rem,5vw,3rem)',fontWeight:800}}>{doc.title}</h1>
 <p style={{color:'#a0aab5',margin:'18px 0'}}>Web y aplicación Android · Actualizado: 20 de noviembre de 2026</p>
 <article className="glass" style={{padding:'clamp(20px,5vw,40px)',borderRadius:22,lineHeight:1.8}}>
 {doc.sections.map(([title,text])=><section key={title} style={{marginBottom:28}}><h2 style={{fontSize:22,marginBottom:10}}>{title}</h2><p>{text}</p></section>)}
 </article></main>;
}
