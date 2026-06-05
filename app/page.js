import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import YesselHero from "@/components/YesselHero";
import EcommerceHighlights from "@/components/EcommerceHighlights";
import DestinationsSlider from "@/components/DestinationsSlider";
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Hero />
      
      <DestinationsSlider />
      
      {/* Mini Banner Hacia la Tienda */}
      <section style={{ padding: '40px 20px', background: 'var(--primary)', textAlign: 'center', color: '#0b1120' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '15px' }}>¿Necesitas equipo para tu viaje?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
            Descubre los mejores accesorios, equipaje y tecnología de Amazon seleccionados por nuestra IA.
          </p>
          <a href="https://amzn.to/4376cfJ" target="_blank" rel="noopener noreferrer" className="btn-amazon-banner" style={{ display: 'inline-block', background: '#0b1120', color: 'white', padding: '15px 30px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', transition: 'transform 0.3s' }}>
            Explorar Tienda del Viajero 🛒
          </a>
          <style>{`
            .btn-amazon-banner:hover {
              transform: scale(1.05) !important;
            }
          `}</style>
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
      <YesselHero />
      <EcommerceHighlights />
    </main>
  );
}
