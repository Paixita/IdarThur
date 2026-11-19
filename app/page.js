import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import YesselHero from "@/components/YesselHero";
import EcommerceHighlights from "@/components/EcommerceHighlights";
import DestinationsSlider from "@/components/DestinationsSlider";
import UnifiedSearchBar from "@/components/UnifiedSearchBar";
import SectionsMarquee from "@/components/SectionsMarquee";
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Hero />
      
      <DestinationsSlider />
      
      {/* Mini Banner Hacia la Tienda */}
      <section style={{ padding: '56px 20px', background: 'linear-gradient(135deg, #34d399 0%, #10b981 45%, #059669 100%)', textAlign: 'center', color: '#04231a' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: '800', marginBottom: '15px' }}>¿Necesitas equipo para tu viaje?</h2>
          <p style={{ fontSize: '1.12rem', marginBottom: '24px', maxWidth: '640px', margin: '0 auto 24px auto', fontWeight: '500' }}>
            Descubre los mejores accesorios, equipaje y tecnología de Amazon seleccionados por nuestra IA.
          </p>
          <a href="https://amzn.to/4376cfJ" target="_blank" rel="noopener noreferrer" className="btn-amazon-banner" style={{ display: 'inline-block', background: '#04231a', color: 'white', padding: '16px 34px', borderRadius: '30px', fontWeight: '800', textDecoration: 'none', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 10px 26px rgba(4, 35, 26, 0.35)' }}>
            Explorar Tienda del Viajero 🛒
          </a>
          <style>{`
            .btn-amazon-banner:hover {
              transform: scale(1.05) !important;
            }
          `}</style>
        </div>
      </section>

      <SectionsMarquee />

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
      <UnifiedSearchBar />
      <EcommerceHighlights />
    </main>
  );
}
