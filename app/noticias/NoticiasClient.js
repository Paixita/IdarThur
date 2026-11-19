"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
const formatDate = (value) => new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' });
export default function NoticiasClient() {
  const [activeTab, setActiveTab] = useState('todos');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedAt, setCheckedAt] = useState(null);
  const [error, setError] = useState('');
  const [partial, setPartial] = useState(false);
  const controller = useRef(null);
  const refresh = useCallback(async (force = false) => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    try {
      const response = await fetch('/api/noticias' + (force ? '?refresh=1' : ''), { signal: current.signal, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudieron consultar las noticias.');
      setNewsData(result.data);
      setCheckedAt(result.checkedAt);
      setPartial(result.partial);
      setError('');
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message);
    } finally {
      if (!current.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const initial = setTimeout(() => refresh(), 0);
    const interval = setInterval(() => { if (!document.hidden) refresh(); }, 300000);
    const visible = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', visible);
    return () => { clearTimeout(initial); clearInterval(interval); controller.current?.abort(); document.removeEventListener('visibilitychange', visible); };
  }, [refresh]);
  const filtered = activeTab === 'todos' ? newsData : newsData.filter((n) => n.category === activeTab);
  return <main className="container news-page">
    <header className="glass news-header">
      <img src="/yessel_avatar.png" alt="Yessel Manager" width="100" height="100" />
      <div><span className="news-eyebrow">ALPHA + BETA · ACTUALIDAD DEL VIAJERO</span>
        <h1>Noticias de vuelos <span className="text-gradient">y aeropuertos</span></h1>
        <p>&quot;Hola, soy Yessel. Mis subagentes Alpha y Beta están monitoreando la red mundial en tiempo real. Extraen reportes sobre clima, vuelos y cruceros para mantenerte seguro e informado.&quot;</p>
      </div>
    </header>
    <div className="news-status" aria-live="polite">
      <div><strong>Actualización automática cada 5 minutos</strong><br /><span>{checkedAt ? 'Última consulta: ' + formatDate(checkedAt) + ' · hora de Colombia' : 'Consultando fuentes periodísticas…'}</span></div>
      <button type="button" className="btn-primary" disabled={loading} onClick={() => { setLoading(true); refresh(true); }}>{loading ? 'Actualizando…' : 'Actualizar noticias ↻'}</button>
    </div>
    {error && <p role="alert" className="news-notice">{error} {newsData.length ? 'Se conservan los últimos reportes recibidos; revisa sus fechas.' : ''}</p>}
    {partial && <p className="news-notice">Una fuente no respondió. Las demás siguen disponibles.</p>}
    <div className="news-tabs">{[['todos', 'Todos'], ['clima', 'Vuelos y aeropuertos'], ['peru', 'Perú'], ['eventos', 'Turismo y cruceros']].map(([id, label]) => <button key={id} onClick={() => setActiveTab(id)} aria-pressed={activeTab === id} className={activeTab === id ? 'selected' : ''}>{label}</button>)}</div>
    {loading && !newsData.length ? <p role="status">Alpha y Beta están consultando los últimos reportes…</p> : <div className="news-grid">{filtered.length ? filtered.map((news) => <article key={news.id} className="glass news-card">
      <div className="news-card-meta"><span>{news.agent}</span><span className={'news-priority ' + news.severity}>{news.severity === 'alta' ? 'Incidencia reportada' : 'Actualidad'}</span></div>
      <h2>{news.title}</h2><p>{news.desc}</p>
      <footer><strong>{news.publisher}</strong><time dateTime={news.publishedAt}>Publicado: {formatDate(news.publishedAt)}</time><a href={news.link} target="_blank" rel="noopener noreferrer">Leer noticia ↗</a></footer>
    </article>) : <p>No hay reportes de las últimas 72 horas en esta categoría. Puedes actualizar o consultar las otras secciones.</p>}</div>}
    <p className="news-footnote">Las noticias se ordenan por fecha de publicación. Para la salida, retraso o cancelación de un vuelo concreto, consulta siempre a tu aerolínea o aeropuerto.</p>
    <style>{`
      .news-page{padding-top:155px;padding-bottom:70px}.news-header{padding:32px;border-radius:28px;display:flex;align-items:center;gap:26px}.news-header img{border-radius:50%;object-fit:cover;border:2px solid #34d399}.news-header h1{font-size:clamp(2rem,4vw,3.2rem);line-height:1.15;margin:12px 0}.news-header p{color:#b8c5cc;font-size:1.1rem;line-height:1.7}.news-eyebrow{color:#6ee7b7;font-size:.8rem;font-weight:800;letter-spacing:.12em}.news-status{display:flex;gap:20px;align-items:center;justify-content:space-between;margin:28px 0}.news-status span{color:#a0aab5;font-size:.9rem}.news-status button:disabled{opacity:.6;cursor:wait}.news-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0}.news-tabs button{border:1px solid #35433e;border-radius:24px;padding:12px 20px;background:#12201c;color:white;cursor:pointer;font-family:inherit;font-size:1rem;font-weight:700}.news-tabs button.selected{background:#34d399;color:#04231a}.news-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:22px}.news-card{padding:25px;border-radius:22px;display:flex;flex-direction:column;border-top:3px solid #34d399}.news-card-meta{display:flex;gap:12px;justify-content:space-between;align-items:center;color:#6ee7b7;font-size:.78rem}.news-priority{color:#c7d2d0}.news-priority.alta{color:#fda4af}.news-card h2{font-size:1.25rem;line-height:1.45;margin:20px 0 12px}.news-card>p{color:#aebcc6;line-height:1.6;flex:1}.news-card footer{display:flex;flex-direction:column;gap:9px;margin-top:22px}.news-card time{color:#99a8b6;font-size:.82rem}.news-card a{color:#6ee7b7;font-weight:800;margin-top:8px}.news-notice{padding:16px;background:#3a2c18;border-radius:12px;color:#ffdf99}.news-footnote{color:#99a8b6;line-height:1.6;margin-top:30px;font-size:.9rem}@media(max-width:700px){.news-page{padding-top:125px}.news-header{padding:24px;align-items:flex-start;flex-direction:column}.news-status{align-items:stretch;flex-direction:column}}
    `}</style>
  </main>;
}
