"use client";
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AutosPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1a', color: 'white' }}>
      <Navbar />
      <div style={{ paddingTop: '120px', paddingBottom: '60px', width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
          Alquiler de <span className="text-gradient">Vehículos</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', marginBottom: '50px' }}>
          Muévete con total libertad. Los mejores precios garantizados en más de 150 países.
        </p>

        <div className="glass" style={{ padding: '50px', textAlign: 'center', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Encuentra tu auto ideal</h2>
          <p style={{ color: '#a0aab5', marginBottom: '30px' }}>Estamos integrando el motor de búsqueda global. Por ahora, puedes reservar directamente con nuestro proveedor oficial.</p>
          
          {/* Aquí irá el link de afiliado de DiscoverCars / Rentalcars */}
          <button 
            onClick={() => window.open('https://www.discovercars.com/?a_aid=IdarThur', '_blank')}
            className="btn-primary" 
            style={{ padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Buscar Autos Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
