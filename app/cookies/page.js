export default function Cookies() {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: 'bold' }}>Política de Cookies</h1>
      
      <div className="glass" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8', color: '#e5e7eb' }}>
        <p style={{ marginBottom: '20px' }}>
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>¿Qué son las cookies?</h2>
        <p style={{ marginBottom: '20px' }}>
          Una cookie es un pequeño archivo de texto que un sitio web guarda en su ordenador o dispositivo móvil cuando lo visita. Permite al sitio web recordar sus acciones y preferencias durante un período de tiempo.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>Cómo usamos las cookies</h2>
        <p style={{ marginBottom: '20px' }}>
          En IdarThur utilizamos cookies principalmente para el seguimiento de afiliación (Affiliate Tracking). Cuando usted hace clic en uno de nuestros enlaces de reserva (Booking.com, WayAway) o compra (Amazon), se coloca una cookie temporal para que el proveedor sepa que usted fue referido por nosotros. Esto es fundamental para mantener nuestro servicio gratuito.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>Control de Cookies</h2>
        <p style={{ marginBottom: '20px' }}>
          Puede controlar o borrar las cookies en cualquier momento a través de la configuración de su navegador web. Sin embargo, bloquear las cookies puede afectar el correcto funcionamiento de los redireccionamientos de ofertas de viaje.
        </p>
      </div>
    </div>
  );
}
