"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: 'video',
      src: '/video-hero.mp4',
      title: 'Tu viaje ideal empieza aquí',
      subtitle: 'Descubre el mundo con IdarThur. La forma más inteligente y económica de volar y alojarte.',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Explora destinos inolvidables',
      subtitle: 'Reservas con los mejores afiliados internacionales de forma segura.',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10500); // Darle tiempo al video (10s) para que se reproduzca por completo antes de cambiar
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: 0
          }}
        >
          {slide.type === 'video' ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%' // Adjust focal point slightly higher to keep logo visible
                }}
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            </div>
          ) : (
            <img 
              src={slide.src} 
              alt="Background" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
          {/* Dark Overlay for better text readability */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}></div>
        </div>
      ))}

      {/* Main Content inside the Slider */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px', maxWidth: '800px' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.1', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
          {slides[currentSlide].title.split(' ').map((word, i, arr) => 
            i === arr.length - 1 ? <span key={i} className="text-gradient"> {word}</span> : <span key={i}>{word} </span>
          )}
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#e5e7eb', marginBottom: '40px', lineHeight: '1.6', textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>
          {slides[currentSlide].subtitle}
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.open('https://wayaway.io/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '30px', fontWeight: 'bold' }}>
            ✈️ Vuelos con Cashback
          </button>
          <button onClick={() => window.open('https://search.hotellook.com/?marker=729418', '_blank')} className="btn-secondary glass" style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '30px', fontWeight: 'bold', background: 'rgba(0,212,255,0.2)', border: '1px solid #00d4ff', color: 'white' }}>
            🛳️ Cruceros de Lujo
          </button>
          <button onClick={() => window.open('https://sp.booking.com/genius.es.html?label=affnetTP_399989189573503', '_blank')} className="btn-secondary glass" style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '30px', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
            🏨 Ofertas Booking
          </button>
        </div>
      </div>

      {/* Slider Indicators */}
      <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '15px', zIndex: 1 }}>
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: currentSlide === index ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
