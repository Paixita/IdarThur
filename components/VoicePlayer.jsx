"use client";
import { useState, useEffect } from 'react';
import { playAlvaroAudio, stopAlvaroAudio, isAlvaroSpeaking } from '@/utils/playAlvaro';

export default function VoicePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsPlaying(true);
    const handleEnd = () => setIsPlaying(false);

    window.addEventListener('alvaro-tts-start', handleStart);
    window.addEventListener('alvaro-tts-end', handleEnd);

    setIsPlaying(isAlvaroSpeaking());

    return () => {
      window.removeEventListener('alvaro-tts-start', handleStart);
      window.removeEventListener('alvaro-tts-end', handleEnd);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopAlvaroAudio();
    } else {
      const speech = "Bienvenidos a IdarThur, el sitio donde podrás escoger tus viajes con aerolíneas y también tus cruceros de confianza. Reserva tus hoteles con tranquilidad para que puedas dormir tranquilo y sentirte renovado para seguir en tu tour. Además, también tenemos la opción de seleccionar y escoger automóviles dentro del plan de tu tour. No solamente tenemos eso, sino que también podemos recomendarte implementos que vas a necesitar en el transcurso del viaje, incluso para tus mascotas que tanto amas, para que te sientas cómodo, cómoda y placentero. También te encontrarás con el sitio de las noticias, por si de pronto deseas viajar a uno de esos sitios que están siempre actualizados. Y tenemos las dos últimas secciones, donde encontrarás historias de pasajeros o hasta de los mismos pilotos reales sobre lo que vivieron en sus vuelos o en el lugar de su tour. En la última sección, te encontrarás con el agente Yessel, quien está listo para guiarte si necesitas alguna sugerencia para tu salud y puedas viajar con el conocimiento de lo que necesitas para tu viaje y tu regreso. Solo entra y conocerás más cosas de las cuales están listas para ti. Gracias por visitarnos en IdarThur, tu casa segura para tus viajes.";
      playAlvaroAudio(speech);
    }
  };

  return (
    <div
      onClick={togglePlay}
      style={{
        position: 'fixed',
        bottom: '120px',
        right: '35px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: isPlaying ? 'rgba(255, 42, 95, 0.25)' : 'linear-gradient(45deg, var(--primary), var(--accent))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'background 0.3s',
        zIndex: 1000,
        border: '2px solid rgba(255,255,255,0.2)'
      }}
      title={isPlaying ? 'Detener bienvenida' : 'Escuchar bienvenida'}
    >
      {isPlaying ? '⏹️' : '▶'}
    </div>
  );
}
