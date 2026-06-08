"use client";
import { useState } from 'react';
import { useVipAudio } from '@/hooks/useVipAudio';
import { playAlvaroAudio } from '@/utils/playAlvaro';
import PremiumAudioModal from './PremiumAudioModal';

export default function StoryAudioPlayer({ htmlText }) {
  const [isAudioPremium, setIsAudioPremium] = useVipAudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!isAudioPremium) {
      setIsModalOpen(true);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    // Limpiar etiquetas HTML para que el motor lea solo texto
    const plainText = htmlText.replace(/<[^>]+>/g, ' ');
    playAlvaroAudio(plainText);
    
    // Simular que deja de reproducir cuando termine (muy básico porque la API real es asíncrona por fragmentos)
    // Para simplificar la UI, dejamos el estado en play hasta que el usuario lo detenga manualmente, o hacemos un chequeo:
    const checkInterval = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsPlaying(false);
        clearInterval(checkInterval);
      }
    }, 1000);
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <div 
        className="glass" 
        style={{ 
          padding: '20px', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px', 
          background: 'linear-gradient(135deg, rgba(255, 0, 128, 0.05) 0%, rgba(69, 243, 255, 0.05) 100%)', 
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'box-shadow 0.3s'
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 0, 128, 0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div className="icon-glow" style={{ position: 'relative' }}>
          <img 
            src="/yessel_avatar.png" 
            alt="Yessel" 
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} 
          />
          {isPlaying && (
            <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--primary)', width: '25px', height: '25px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', border: '2px solid #0a0f19' }}>
              🔊
            </div>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 'bold' }}>
            Escuchar con Yessel VIP
          </h3>
          <p style={{ margin: 0, color: '#a0aab5', fontSize: '0.95rem' }}>
            {isAudioPremium 
              ? "Red Neuronal Activada. Procesando contexto emocional..." 
              : "Desbloquea la narración premium con inteligencia artificial emocional."}
          </p>
        </div>

        <button 
          onClick={handlePlay}
          className="btn-primary"
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.5rem',
            background: isPlaying ? 'rgba(255, 0, 128, 0.2)' : 'linear-gradient(45deg, var(--primary), var(--accent))',
            border: isPlaying ? '2px solid var(--accent)' : 'none',
            color: 'white',
            cursor: 'pointer',
            padding: 0
          }}
          title={isPlaying ? "Detener" : "Reproducir"}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <PremiumAudioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsAudioPremium(true);
          setIsModalOpen(false);
        }} 
      />
    </div>
  );
}
