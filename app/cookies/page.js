export const metadata = {
  title: "Política de Cookies | IdarThur",
  description: "Conoce el uso de cookies y seguimiento de enlaces de afiliados en nuestra plataforma IdarThur. Transparencia total en tus búsquedas de viajes.",
  robots: { index: false }
};

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
          En IdarThur utilizamos cookies principalmente para el seguimiento de afiliación (Affiliate Tracking). Cuando usted hace clic en uno de nuestros enlaces de reserva (Booking.com, WayAway) o de compra (Amazon), se coloca una cookie temporal en su navegador para que el proveedor correspondiente sepa que usted fue referido desde nuestra web. Esto es fundamental para que dichos proveedores nos otorguen la comisión de afiliación que mantiene nuestra web gratuita para usted.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>Cookies de Terceros y Deslinde Legal</h2>
        <p style={{ marginBottom: '20px' }}>
          Tenga en cuenta que al ser redirigido a las páginas web de nuestros socios comerciales (como Amazon, Booking, DiscoverCars, etc.), dichos portales instalarán sus propias cookies de rendimiento, rastreo y marketing. Esas cookies se rigen estrictamente por las políticas de cookies y privacidad de esos proveedores terceros. IdarThur no tiene control sobre la instalación ni el tratamiento de los datos recolectados por esas cookies de terceros y queda exento de cualquier responsabilidad respecto a las mismas.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>Control de Cookies</h2>
        <p style={{ marginBottom: '20px' }}>
          Puede controlar, bloquear o borrar las cookies en cualquier momento a través de la configuración de su navegador de internet. Tenga en cuenta que si bloquea o elimina las cookies, es posible que los enlaces de redirección a las ofertas y productos de viajes de afiliación no funcionen correctamente.
        </p>
      </div>
    </div>
  );
}
