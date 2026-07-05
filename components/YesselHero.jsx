"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { playAlvaroAudio, stopAlvaroAudio, isAlvaroSpeaking } from "@/utils/playAlvaro";

export default function YesselHero() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsPlaying(true);
    const handleEnd = () => setIsPlaying(false);

    window.addEventListener("alvaro-tts-start", handleStart);
    window.addEventListener("alvaro-tts-end", handleEnd);

    return () => {
      window.removeEventListener("alvaro-tts-start", handleStart);
      window.removeEventListener("alvaro-tts-end", handleEnd);
    };
  }, []);

  const toggleWelcomeSpeech = () => {
    if (isPlaying) {
      stopAlvaroAudio();
      setIsPlaying(false);
    } else {
      const speech = "¡Hola! Qué gusto saludarte. Soy Yessel, tu asistente de ciberseguridad y viajes en IdarThur.com. Te doy la bienvenida a nuestro espacio exclusivo, diseñado para que viajes con total tranquilidad y estilo. Permíteme guiarte en un recorrido rápido. En la barra superior, puedes planificar tu próximo vuelo o reservar tu hotel ideal al mejor precio del mercado. ¿Viajas con tus mejores amigos? Si tienes perrito o gatito, explora nuestra sección Pet-Friendly; allí te ayudamos a asegurar su viaje y equiparlos con collares GPS de nuestra tienda. Y si necesitas moverte libremente, haz clic en Autos para encontrar el vehículo perfecto a tu llegada. ¿No vas a viajar hoy? No te preocupes: nuestra Tienda tiene lo último en tecnología y cuidado personal, y de la entrega física y segura se encarga cien por ciento Amazon directo a tu puerta. Explora con confianza. Tus datos están completamente protegidos por nuestros sistemas de ciberseguridad. Si tienes cualquier duda o emergencia de primeros auxilios, haz clic en mi chat en la esquina inferior y hablemos. IdarThur no es solo una plataforma... es la comodidad que tanto estabas buscando. ¡Buen viaje!";
      playAlvaroAudio(speech);
      setIsPlaying(true);
    }
  };

  return (
    <section className="container" style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
      <div className="glass" style={{ borderRadius: '30px', padding: '50px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', background: 'linear-gradient(135deg, rgba(69,243,255,0.05) 0%, rgba(255,0,128,0.05) 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Avatar Section */}
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
          <div onClick={() => window.dispatchEvent(new Event('openCandyChat'))} style={{ width: '250px', height: '250px', borderRadius: '50%', overflow: 'hidden', background: 'var(--glass-bg)', border: '4px solid rgba(69, 243, 255, 0.3)', marginBottom: '30px', transition: 'transform 0.4s, box-shadow 0.4s', cursor: 'pointer' }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'scale(1.05) translateY(-10px)';
                 e.currentTarget.style.boxShadow = '0 20px 40px rgba(69, 243, 255, 0.4)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'scale(1) translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
               }}
          >
             <img src="/yessel_avatar.png" alt="Yessel VIP Concierge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Text Section */}
        <div style={{ flex: '2 1 500px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>
            Conoce a <span className="text-gradient">Yessel</span>,<br/>Tu Conserje VIP Online.
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#a0aab5', lineHeight: '1.7', marginBottom: '30px' }}>
            Yessel no solo organiza tus vuelos y hoteles, sino que también cuida de cada detalle de tu viaje. Con acceso a tarifas no publicadas y conexión directa con navieras y aerolíneas, Yessel garantiza que siempre consigas el trato de un cliente VIP.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              onClick={() => window.dispatchEvent(new Event('openCandyChat'))}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <span>💬</span> Hablar con Yessel
            </button>
            <button
              onClick={toggleWelcomeSpeech}
              className="btn-secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                background: isPlaying ? 'rgba(255, 42, 95, 0.2)' : 'rgba(255,255,255,0.05)',
                border: isPlaying ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                animation: isPlaying ? 'pulseGlow 2s infinite' : 'none'
              }}
            >
              <span>{isPlaying ? '⏹️' : '🎧'}</span> {isPlaying ? 'Detener Guía' : 'Escuchar Guía Turística'}
            </button>
            <Link href="/agentes" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🛡️</span> Equipo
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 5px rgba(255, 42, 95, 0.2); }
            50% { box-shadow: 0 0 20px rgba(255, 42, 95, 0.6); }
            100% { box-shadow: 0 0 5px rgba(255, 42, 95, 0.2); }
          }
        `}</style>
      </div>
    </section>
  );
}
