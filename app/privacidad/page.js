export const metadata = {
  title: "Política de Privacidad y Descargo IA | IdarThur",
  description: "Consulta las políticas de privacidad y protección de datos de IdarThur Global, incluyendo descargo de responsabilidad por el uso de Inteligencia Artificial.",
  robots: { index: false }
};

export default function Privacidad() {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: 'bold' }}>Política de Privacidad</h1>
      
      <div className="glass" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8', color: '#e5e7eb' }}>
        <p style={{ marginBottom: '20px' }}>
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>1. Información que recopilamos y Rol de Terceros</h2>
        <p style={{ marginBottom: '20px' }}>
          IdarThur actúa como una plataforma de redirección para socios afiliados (Booking.com, DiscoverCars, WayAway, Amazon, etc.). No almacenamos información financiera ni tarjetas de crédito. Toda transacción, reserva de hotel o alquiler de vehículos se realiza en los portales seguros de nuestros socios. Para más detalles sobre nuestra exención de responsabilidad sobre el servicio de estos terceros, consulte nuestros <a href="/terminos" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Términos y Condiciones</a>.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>2. Descargo de Responsabilidad de Inteligencia Artificial (Candy AI)</h2>
        <p style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 100, 100, 0.1)', borderLeft: '4px solid #ff4444', borderRadius: '5px' }}>
          <strong>Aviso Importante:</strong> Nuestra plataforma utiliza Inteligencia Artificial (conocida como "Candy AI") para interactuar con los usuarios, sugerir destinos y proporcionar información. Debido a la naturaleza generativa y experimental de la Inteligencia Artificial, <strong>Candy AI se puede equivocar</strong>, generar información inexacta (alucinaciones) o dar recomendaciones desactualizadas sobre visas, precios o rutas. 
          <br /><br />
          Toda la información proporcionada por Candy AI debe ser verificada independientemente por el usuario antes de realizar cualquier compra o viaje. IdarThur no se hace responsable por daños, pérdidas o inconvenientes derivados de decisiones basadas en la información proporcionada por nuestra IA.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>3. Cookies y Seguimiento de Afiliados</h2>
        <p style={{ marginBottom: '20px' }}>
          Utilizamos cookies propias y de terceros estrictamente necesarias para el correcto funcionamiento de nuestros enlaces de afiliados. Esto garantiza que las compras realizadas a través de nuestros botones nos generen la comisión correspondiente sin costo adicional para usted.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>4. Cambios en la Política</h2>
        <p>
          Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en este sitio web.
        </p>
      </div>
    </div>
  );
}
