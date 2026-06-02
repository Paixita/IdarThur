import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import CandyAI from "@/components/CandyAI";
import EcommerceHighlights from "@/components/EcommerceHighlights";
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* NUEVA VITRINA DE VENTAS (EMBUDO A AMAZON) */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(180deg, #0b1120 0%, #111a2e 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Imprescindibles del Viajero
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 'bold', marginBottom: '20px', marginTop: '10px' }}>
            Los Más Vendidos <span style={{ color: '#ff9900' }}>de Amazon</span>
          </h2>
          <p style={{ color: '#a0aab5', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 50px auto' }}>
            Equípate con los artículos que miles de nómadas digitales, aventureros y familias ya están usando. Seleccionados por nuestra Inteligencia Artificial para garantizar tu comodidad y seguridad.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'left' }}>
            
            {/* Tarjeta 1 - Chaqueta Hombre */}
            <div className="glass showcase-card" style={{ padding: '25px', borderRadius: '25px', position: 'relative', overflow: 'hidden' }}>
              <img src="/tienda/chaqueta_hombre.jpg" alt="Chaqueta Cotrasen Hombre" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '15px', marginBottom: '20px' }} />
              <div style={{ position: 'absolute', top: '35px', right: '35px', background: '#ff9900', color: '#0b1120', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>🔥 Top Ventas</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>Chaqueta Cotrasen Térmica</h3>
              <p style={{ color: '#a0aab5', marginBottom: '20px', fontSize: '0.95rem' }}>Diseño impermeable de lona de pato con forro sherpa. La protección definitiva para aventuras bajo cero.</p>
              <Link href="/tienda" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '15px', fontWeight: 'bold' }}>
                Ver en la Tienda →
              </Link>
            </div>

            {/* Tarjeta 2 - Chaqueta Mujer */}
            <div className="glass showcase-card" style={{ padding: '25px', borderRadius: '25px', position: 'relative', overflow: 'hidden' }}>
              <img src="/tienda/chaqueta_mujer.jpg" alt="Abrigo MAGCOMSEN Mujer" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '15px', marginBottom: '20px' }} />
              <div style={{ position: 'absolute', top: '35px', right: '35px', background: '#00d4ff', color: '#0b1120', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>⭐ Premium</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>Abrigo MAGCOMSEN 3 en 1</h3>
              <p style={{ color: '#a0aab5', marginBottom: '20px', fontSize: '0.95rem' }}>Chaqueta de esquí impermeable y cortavientos. Elegancia y calor extremo garantizado en un solo diseño.</p>
              <Link href="/tienda" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '15px', fontWeight: 'bold' }}>
                Ver en la Tienda →
              </Link>
            </div>

            {/* Tarjeta 3 - Camara Blink */}
            <div className="glass showcase-card" style={{ padding: '25px', borderRadius: '25px', position: 'relative', overflow: 'hidden' }}>
              <img src="/tienda/camara_seguridad.jpg" alt="Cámara Blink Mini" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '15px', marginBottom: '20px' }} />
              <div style={{ position: 'absolute', top: '35px', right: '35px', background: '#ff0055', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>🚀 Esencial</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>Cámara Blink Mini 2K+</h3>
              <p style={{ color: '#a0aab5', marginBottom: '20px', fontSize: '0.95rem' }}>Vigila tu hogar y a tus mascotas en resolución 2K desde tu celular mientras disfrutas tu viaje tranquilo.</p>
              <Link href="/tienda" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '15px', fontWeight: 'bold' }}>
                Ver en la Tienda →
              </Link>
            </div>

          </div>

          <div style={{ marginTop: '50px' }}>
            <a href="https://amzn.to/4376cfJ" target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #00d4ff', paddingBottom: '5px' }}>
              Explorar el catálogo completo de Amazon 🛒
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .showcase-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .showcase-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 212, 255, 0.1);
        }
      `}</style>

      <Benefits />
      <CandyAI />
      <EcommerceHighlights />
    </main>
  );
}
