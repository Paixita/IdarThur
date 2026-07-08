"use client";
import { useState, useEffect } from 'react';
import { playAlvaroAudio, stopAlvaroAudio } from '@/utils/playAlvaro';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTab, setSearchTab] = useState('vuelos');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [hotelDestination, setHotelDestination] = useState('');
  const [carLocation, setCarLocation] = useState('');

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
    const handleStart = () => setIsPlaying(true);
    const handleEnd = () => setIsPlaying(false);

    window.addEventListener("alvaro-tts-start", handleStart);
    window.addEventListener("alvaro-tts-end", handleEnd);

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10500);

    return () => {
      window.removeEventListener("alvaro-tts-start", handleStart);
      window.removeEventListener("alvaro-tts-end", handleEnd);
      clearInterval(timer);
    };
  }, [slides.length]);

  const toggleWelcomeSpeech = () => {
    if (isPlaying) {
      stopAlvaroAudio();
      setIsPlaying(false);
    } else {
      const speech = "Bienvenidos a IdarThur, el sitio donde podrás escoger tus viajes con aerolíneas y también tus cruceros de confianza. Reserva tus hoteles con tranquilidad para que puedas dormir tranquilo y sentirte renovado para seguir en tu tour. Además, también tenemos la opción de seleccionar y escoger automóviles dentro del plan de tu tour. No solamente tenemos eso, sino que también podemos recomendarte implementos que vas a necesitar en el transcurso del viaje, incluso para tus mascotas que tanto amas, para que te sientas cómodo, cómoda y placentero. También te encontrarás con el sitio de las noticias, por si de pronto deseas viajar a uno de esos sitios que están siempre actualizados. Y tenemos las dos últimas secciones, donde encontrarás historias de pasajeros o hasta de los mismos pilotos reales sobre lo que vivieron en sus vuelos o en el lugar de su tour. En la última sección, te encontrarás con el agente Yessel, quien está listo para guiarte si necesitas alguna sugerencia para tu salud y puedas viajar con el conocimiento de lo que necesitas para tu viaje y tu regreso. Solo entra y conocerás más cosas de las cuales están listas para ti. Gracias por visitarnos en IdarThur, tu casa segura para tus viajes.";
      playAlvaroAudio(speech);
      setIsPlaying(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTab === 'vuelos') {
      // Abrir buscador de vuelos oficial de WayAway con marker de afiliado
      const query = destination ? `vuelos a ${destination}` : '';
      window.open(`https://wayaway.io/search?marker=729418&query=${encodeURIComponent(query)}`, '_blank');
    } else if (searchTab === 'hoteles') {
      // Abrir buscador de Hotellook con marker
      window.open(`https://search.hotellook.com/?destination=${encodeURIComponent(hotelDestination)}&marker=729418`, '_blank');
    } else if (searchTab === 'autos') {
      // Abrir buscador de DiscoverCars con ID de afiliado
      window.open(`https://www.discovercars.com/?a_aid=IdarThur`, '_blank');
    }
  };

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
                  objectPosition: 'center 20%'
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
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.55)' }}></div>
        </div>
      ))}

      {/* Main Content inside the Slider */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px', maxWidth: '900px', width: '100%' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 'bold', marginBottom: '15px', lineHeight: '1.1', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
          {slides[currentSlide].title.split(' ').map((word, i, arr) => 
            i === arr.length - 1 ? <span key={i} className="text-gradient"> {word}</span> : <span key={i}>{word} </span>
          )}
        </h1>
        <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', color: '#e5e7eb', marginBottom: '30px', lineHeight: '1.5', textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>
          {slides[currentSlide].subtitle}
        </p>

        {/* BUSCADOR INTELIGENTE EN FILTRO DE CRISTAL */}
        <div className="glass" style={{ 
          padding: '25px', 
          borderRadius: '25px', 
          background: 'rgba(10, 15, 26, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          textAlign: 'left',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Pulsing Voice Guide Button inside the Card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
            <button 
              type="button"
              onClick={toggleWelcomeSpeech}
              style={{
                background: isPlaying ? 'rgba(255, 42, 95, 0.2)' : 'rgba(255,255,255,0.05)',
                border: isPlaying ? '2px solid var(--primary)' : '1px solid #45f3ff',
                color: 'white',
                borderRadius: '30px',
                padding: '10px 24px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isPlaying ? '0 0 15px rgba(255, 42, 95, 0.5)' : '0 4px 15px rgba(69,243,255,0.1)',
                transition: 'all 0.3s ease',
                animation: isPlaying ? 'glowBreathe 2s infinite ease-in-out' : 'none'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{isPlaying ? '⏹️' : '🎙️'}</span>
              <span>{isPlaying ? 'Detener Guía de Yessel' : 'Escuchar Bienvenida de Yessel'}</span>
            </button>
          </div>

          {/* Pestanas */}
          <div className="search-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSearchTab('vuelos')} 
              style={{
                background: searchTab === 'vuelos' ? 'linear-gradient(45deg, var(--primary), var(--secondary))' : 'transparent',
                color: 'white',
                border: searchTab === 'vuelos' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px',
                borderRadius: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <span>✈️</span> Vuelos
            </button>
            <button 
              onClick={() => setSearchTab('hoteles')} 
              style={{
                background: searchTab === 'hoteles' ? 'linear-gradient(45deg, var(--primary), var(--secondary))' : 'transparent',
                color: 'white',
                border: searchTab === 'hoteles' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px',
                borderRadius: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <span>🏨</span> Hoteles
            </button>
            <button 
              onClick={() => setSearchTab('autos')} 
              style={{
                background: searchTab === 'autos' ? 'linear-gradient(45deg, var(--primary), var(--secondary))' : 'transparent',
                color: 'white',
                border: searchTab === 'autos' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px',
                borderRadius: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <span>🚗</span> Autos
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSearch}>
            {searchTab === 'vuelos' && (
              <div className="search-form-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a0aab5', fontWeight: 'bold' }}>Origen</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Medellín, MDE" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a0aab5', fontWeight: 'bold' }}>Destino</label>
                  <input 
                    type="text" 
                    placeholder="Ej. París, CDG" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '15px 30px', alignSelf: 'flex-end', borderRadius: '12px', fontWeight: 'bold', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Buscar Vuelos ✈️
                </button>
              </div>
            )}

            {searchTab === 'hoteles' && (
              <div className="search-form-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a0aab5', fontWeight: 'bold' }}>Destino / Hotel</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Dubái, Emiratos Árabes" 
                    value={hotelDestination}
                    onChange={(e) => setHotelDestination(e.target.value)}
                    required
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a0aab5', fontWeight: 'bold' }}>Huéspedes</label>
                  <select style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '12px', color: 'white', outline: 'none', cursor: 'pointer' }}>
                    <option value="1" style={{ background: '#0a0f19' }}>1 Adulto</option>
                    <option value="2" style={{ background: '#0a0f19' }}>2 Adultos</option>
                    <option value="3" style={{ background: '#0a0f19' }}>3 Adultos</option>
                    <option value="4" style={{ background: '#0a0f19' }}>4 Adultos o Familia</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '15px 30px', alignSelf: 'flex-end', borderRadius: '12px', fontWeight: 'bold', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Buscar Hoteles 🏨
                </button>
              </div>
            )}

            {searchTab === 'autos' && (
              <div className="search-form-grid" style={{ gridTemplateColumns: '1.5fr auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#a0aab5', fontWeight: 'bold' }}>Lugar de Entrega</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Aeropuerto de Madrid Barajas (MAD)" 
                    value={carLocation}
                    onChange={(e) => setCarLocation(e.target.value)}
                    required
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '15px 30px', alignSelf: 'flex-end', borderRadius: '12px', fontWeight: 'bold', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Buscar Autos 🚗
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Slider Indicators */}
      <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '15px', zIndex: 1 }}>
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

      <style>{`
        @keyframes glowBreathe {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 42, 95, 0.4); }
          50% { transform: scale(1.04); box-shadow: 0 0 25px rgba(255, 42, 95, 0.8); }
          100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 42, 95, 0.4); }
        }
        .search-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 15px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .search-form-grid {
            grid-template-columns: 1fr !important;
          }
          .search-form-grid button {
            width: 100% !important;
            align-self: center !important;
          }
        }
      `}</style>
    </div>
  );
}
