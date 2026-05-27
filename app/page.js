import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import CandyAI from "@/components/CandyAI";
import EcommerceHighlights from "@/components/EcommerceHighlights";
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* Banner Escuadrón IA */}
      <div style={{ background: 'linear-gradient(90deg, #0a0f19, #1a2235)', padding: '20px 40px', borderRadius: '20px', border: '1px solid rgba(69, 243, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src="/candy_avatar.png" alt="Candy AI" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>¿Conoces a nuestro Escuadrón de IA?</h3>
              <p style={{ color: '#a0aab5', fontSize: '1rem', marginTop: '5px' }}>Médicos, expertos en Amazon y agentes de ciberseguridad protegiendo tu viaje.</p>
            </div>
          </div>
          <Link href="/agentes" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 25px', borderRadius: '20px', fontWeight: 'bold', background: 'linear-gradient(45deg, #45f3ff, #00d4ff)' }}>
            Ver Escuadrón IA
          </Link>
        </div>

      <Benefits />
      <CandyAI />
      <EcommerceHighlights />
    </main>
  );
}
