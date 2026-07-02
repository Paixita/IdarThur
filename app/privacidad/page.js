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
          IdarThur actúa como una plataforma de redirección para socios afiliados (Booking.com, DiscoverCars, WayAway, Amazon, etc.). No almacenamos información financiera ni tarjetas de crédito. Toda transacción, reserva de hotel, crucero o alquiler de vehículos se realiza en los portales seguros de nuestros socios. 
          <br /><br />
          <strong>Logística y Envíos de E-commerce:</strong> Específicamente para los productos exhibidos en la tienda, IdarThur actúa exclusivamente bajo un modelo de afiliación. Toda la logística de almacenamiento físico, embalaje, despacho, envío, seguimiento de entregas y soporte de garantía postventa es responsabilidad única y exclusiva de <strong>Amazon.com, Inc.</strong> y sus respectivos vendedores. IdarThur no asume ningún compromiso ni responsabilidad sobre los envíos o el estado de los paquetes. Para más detalles sobre nuestra exención de responsabilidad, consulte nuestros <a href="/terminos" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Términos y Condiciones</a>.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>2. Descargo de Responsabilidad de Inteligencia Artificial (Yessel AI / Candy AI)</h2>
        <p style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 100, 100, 0.1)', borderLeft: '4px solid #ff4444', borderRadius: '5px' }}>
          <strong>Aviso Importante:</strong> Nuestra plataforma utiliza Inteligencia Artificial (como el agente de ciberseguridad, conserjería y salud "Yessel") para interactuar con los usuarios, sugerir destinos, dar consejos informativos y guiar en compras. Debido a la naturaleza generativa de la Inteligencia Artificial, <strong>la IA se puede equivocar</strong>, generar información inexacta (alucinaciones) o dar datos desactualizados sobre regulaciones migratorias, visados, estado de vuelos o recomendaciones de salud.
          <br /><br />
          Las respuestas médicas e informativas de "Dr. Yessel" son únicamente sugerencias orientativas y preventivas de primeros auxilios y no constituyen bajo ningún concepto diagnósticos médicos, recetas ni reemplazo de la atención médica profesional presencial. Asimismo, las recomendaciones de productos no garantizan precios ni stock físico. Toda información debe ser verificada de manera independiente por el usuario. IdarThur no se hace responsable por inconvenientes derivados del uso de la información de la IA.
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
