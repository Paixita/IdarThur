"use client";
import Link from 'next/link';

export default function DestinationsSlider() {
  const destinations = [
    {
      id: 1,
      title: "Dubái, EAU",
      subtitle: "Vuelos de Lujo",
      img: "/destinos/slider_dubai.png",
      link: "https://search.hotellook.com/?marker=729418", // Enlace de Travelpayouts / Aviasales
    },
    {
      id: 2,
      title: "París, Francia",
      subtitle: "Escapada Romántica",
      img: "/destinos/slider_paris.png",
      link: "https://search.hotellook.com/?marker=729418",
    },
    {
      id: 3,
      title: "San Andrés, Colombia",
      subtitle: "Paraíso Tropical",
      img: "/destinos/slider_sanandres.png",
      link: "https://search.hotellook.com/?marker=729418",
    },
    {
      id: 4,
      title: "Santa Marta, Colombia",
      subtitle: "Magia del Caribe",
      img: "/destinos/slider_santamarta.png",
      link: "https://search.hotellook.com/?marker=729418",
    },
    {
      id: 5,
      title: "Cruceros de Lujo",
      subtitle: "Experiencias en Alta Mar",
      img: "/destinos/slider_crucero.png",
      link: "https://search.hotellook.com/?marker=729418",
    }
  ];

  // Duplicamos el array para el efecto de scroll infinito
  const sliderItems = [...destinations, ...destinations];

  return (
    <section style={{ padding: '60px 0', background: '#0a0f1a', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Vuela Lejos, Sueña en Grande
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 'bold', marginTop: '10px' }}>
          Destinos <span className="text-gradient">Populares</span>
        </h2>
        <p style={{ color: '#a0aab5', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          Encuentra los vuelos más económicos y los cruceros más espectaculares. Haz clic en tu destino favorito para ver promociones exclusivas.
        </p>
      </div>

      {/* Contenedor del Slider Infinito */}
      <div className="slider-container" style={{ position: 'relative', width: '100%', padding: '20px 0' }}>
        <div className="slider-track" style={{ display: 'flex', gap: '30px', width: 'max-content' }}>
          {sliderItems.map((dest, idx) => (
            <a 
              key={`${dest.id}-${idx}`} 
              href={dest.link}
              target="_blank"
              rel="noopener noreferrer"
              className="slider-item"
              style={{
                display: 'block',
                position: 'relative',
                width: '350px',
                height: '450px',
                borderRadius: '30px',
                overflow: 'hidden',
                textDecoration: 'none',
                flexShrink: 0,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <img 
                src={dest.img} 
                alt={dest.title} 
                className="slider-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              />
              {/* Gradiente oscuro para el texto */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)', zIndex: 1 }}></div>
              
              {/* Texto sobre la imagen */}
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 2 }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '5px' }}>
                  {dest.subtitle}
                </span>
                <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {dest.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        /* Animación infinita */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-350px * 5 - 30px * 5)); }
        }

        .slider-track {
          animation: scroll 30s linear infinite;
        }

        /* Pausar la animación cuando el mouse pasa por encima */
        .slider-container:hover .slider-track {
          animation-play-state: paused;
        }

        /* Efecto de "agarre" y zoom en la imagen (hover) */
        .slider-item {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .slider-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(69, 243, 255, 0.3);
          border: 1px solid rgba(69, 243, 255, 0.5);
        }

        .slider-item:hover .slider-image {
          transform: scale(1.1); /* Agranda la imagen */
        }
      `}</style>
    </section>
  );
}
