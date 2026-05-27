import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0a0f19', color: '#a0aab5', padding: '60px 20px 30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        {/* Marca */}
        <div>
          <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>IdarThur</h3>
          <p style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
            La plataforma #1 impulsada por IA para descubrir el mundo, reservar tus viajes y conseguir el mejor equipamiento, de la manera más inteligente.
          </p>
        </div>

        {/* Enlaces Rápidos */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '20px', fontWeight: '600' }}>Explorar</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link href="/" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Inicio</Link></li>
            <li><Link href="/hoteles" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Hoteles y Cruceros</Link></li>
            <li><Link href="/tienda" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Tienda y Accesorios</Link></li>
            <li><Link href="/eventos" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Eventos Mundiales</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '20px', fontWeight: '600' }}>Legal & Transparencia</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link href="/privacidad" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Política de Privacidad</Link></li>
            <li><Link href="/terminos" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Términos y Condiciones</Link></li>
            <li><Link href="/cookies" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Política de Cookies</Link></li>
            <li><Link href="/tienda" style={{ color: '#a0aab5', textDecoration: 'none', transition: 'color 0.3s' }}>Aviso de Afiliados</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} IdarThur Global. Todos los derechos reservados.</p>
        <p style={{ marginTop: '5px', fontSize: '0.75rem', opacity: 0.6 }}>IdarThur actúa como socio afiliado de WayAway, Booking.com y Amazon Associates.</p>
      </div>
    </footer>
  );
}
