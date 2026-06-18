"use client";

import { useState, useEffect } from "react";

export default function NoticiasClient() {
  const [activeTab, setActiveTab] = useState("todos");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/noticias');
        const json = await res.json();
        if (json.success) {
          setNewsData(json.data);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const filteredNews = activeTab === "todos" ? newsData : newsData.filter(n => n.category === activeTab);

  return (
    <main style={{ minHeight: '100vh', padding: '120px 20px 50px', background: 'var(--background)', color: 'white' }}>
      <div className="container">
        
        {/* Yessel Manager Header */}
        <div className="glass" style={{ padding: '40px', borderRadius: '30px', marginBottom: '50px', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap', border: '1px solid rgba(69, 243, 255, 0.2)' }}>
          <img src="/yessel_avatar.png" alt="Yessel Manager" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', filter: 'drop-shadow(0 0 15px rgba(69,243,255,0.4))' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Centro de Mando: <span className="text-gradient">Noticias Globales</span></h1>
            <p style={{ color: '#a0aab5', fontSize: '1.2rem' }}>
              "Hola, soy Yessel. Mis subagentes Alpha y Beta están monitoreando la red mundial en tiempo real. Extraen reportes sobre clima, vuelos y cruceros para mantenerte seguro e informado."
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setActiveTab("todos")} className="btn-primary" style={{ background: activeTab === 'todos' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'todos' ? '#0b1120' : 'white', border: '1px solid var(--primary)' }}>Todos los Reportes</button>
          <button onClick={() => setActiveTab("clima")} className="btn-primary" style={{ background: activeTab === 'clima' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'clima' ? '#0b1120' : 'white', border: '1px solid var(--primary)' }}>🌤️ Clima / Vuelos</button>
          <button onClick={() => setActiveTab("eventos")} className="btn-primary" style={{ background: activeTab === 'eventos' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'eventos' ? '#0b1120' : 'white', border: '1px solid var(--primary)' }}>🛳️ Turismo / Cruceros</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--primary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px', animation: 'spin 2s linear infinite' }}>⚙️</div>
            <h2>Los Agentes Alpha y Beta están escaneando la red global...</h2>
            <p>Conectando con satélites y fuentes de noticias internacionales.</p>
            <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {filteredNews.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#a0aab5' }}>
                No se encontraron reportes en esta categoría.
              </div>
            ) : (
              filteredNews.map(news => (
                <div key={news.id} className="glass" style={{ padding: '30px', borderRadius: '20px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Severity Indicator */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: news.severity === 'alta' ? '#ff4d4d' : news.severity === 'media' ? '#ffcc00' : '#45f3ff' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#a0aab5', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Reporte de: {news.agent}</span>
                    <span>{news.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', minHeight: '60px' }}>{news.title}</h3>
                  <p style={{ color: '#d1d5db', lineHeight: '1.5', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1 }}>{news.desc}</p>
                  
                  <button onClick={() => window.open(news.link, '_blank')} className="btn-primary" style={{ padding: '10px', fontSize: '0.9rem', width: '100%', background: 'transparent', border: '1px solid rgba(69,243,255,0.5)', color: 'white' }}>
                    Leer Fuente Original
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </main>
  );
}
