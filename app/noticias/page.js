"use client";

import { useState } from "react";

export default function Noticias() {
  const [activeTab, setActiveTab] = useState("todos");

  const newsData = [
    {
      id: 1,
      category: "clima",
      agent: "Agente Alpha 🌤️",
      title: "Alerta de Huracanes en el Caribe",
      desc: "Se recomienda precaución para vuelos hacia las antillas menores durante las próximas 48 horas.",
      date: "2 Junio, 2026",
      severity: "alta"
    },
    {
      id: 2,
      category: "eventos",
      agent: "Agente Beta 🎉",
      title: "Apertura del Festival de Verano en París",
      desc: "Las calles de París se llenan de música. Excelente momento para reservar hoteles con anticipación.",
      date: "1 Junio, 2026",
      severity: "baja"
    },
    {
      id: 3,
      category: "geopolitica",
      agent: "Agente Alpha 🛂",
      title: "Actualización de Visados ETIAS en Europa",
      desc: "Recuerde que a partir del próximo mes, los viajeros latinoamericanos necesitarán la autorización ETIAS para ingresar al espacio Schengen.",
      date: "30 Mayo, 2026",
      severity: "media"
    },
    {
      id: 4,
      category: "clima",
      agent: "Agente Beta 🏔️",
      title: "Temporada de Esquí Perfecta en los Alpes",
      desc: "Las condiciones de nieve en Suiza y Austria son las mejores de los últimos 5 años.",
      date: "28 Mayo, 2026",
      severity: "baja"
    }
  ];

  const filteredNews = activeTab === "todos" ? newsData : newsData.filter(n => n.category === activeTab);

  return (
    <main style={{ minHeight: '100vh', padding: '120px 20px 50px', background: 'var(--background)', color: 'white' }}>
      <div className="container">
        
        {/* Candy AI Manager Header */}
        <div className="glass" style={{ padding: '40px', borderRadius: '30px', marginBottom: '50px', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap', border: '1px solid rgba(69, 243, 255, 0.2)' }}>
          <img src="/candy_avatar.png" alt="Candy AI Manager" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', filter: 'drop-shadow(0 0 15px rgba(69,243,255,0.4))' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Centro de Mando: <span className="text-gradient">Noticias Globales</span></h1>
            <p style={{ color: '#a0aab5', fontSize: '1.2rem' }}>
              "Hola, soy Candy. Mis subagentes Alpha y Beta están monitoreando constantemente el clima, eventos y restricciones fronterizas para que planifiques tu viaje de forma segura. Aquí está su reporte en vivo."
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setActiveTab("todos")} className="btn-primary" style={{ background: activeTab === 'todos' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'todos' ? '#0b1120' : 'white', border: '1px solid var(--primary)' }}>Todos los Reportes</button>
          <button onClick={() => setActiveTab("clima")} className="btn-primary" style={{ background: activeTab === 'clima' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'clima' ? '#0b1120' : 'white', border: '1px solid var(--primary)' }}>🌤️ Clima</button>
          <button onClick={() => setActiveTab("eventos")} className="btn-primary" style={{ background: activeTab === 'eventos' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'eventos' ? '#0b1120' : 'white', border: '1px solid var(--primary)' }}>🎉 Eventos</button>
          <button onClick={() => setActiveTab("geopolitica")} className="btn-primary" style={{ background: activeTab === 'geopolitica' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeTab === 'geopolitica' ? '#0b1120' : 'white', border: '1px solid var(--primary)' }}>🛂 Visas / Fronteras</button>
        </div>

        {/* Noticias Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {filteredNews.map(news => (
            <div key={news.id} className="glass" style={{ padding: '30px', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
              {/* Severity Indicator */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: news.severity === 'alta' ? '#ff4d4d' : news.severity === 'media' ? '#ffcc00' : '#45f3ff' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#a0aab5', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Reporte de: {news.agent}</span>
                <span>{news.date}</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{news.title}</h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '20px' }}>{news.desc}</p>
              
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', width: '100%', background: 'transparent', border: '1px solid rgba(69,243,255,0.5)', color: 'white' }}>
                Leer Reporte Completo
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
