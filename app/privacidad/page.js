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

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>2. Descargo de Responsabilidad e Interacción con Inteligencia Artificial (Yessel AI / Candy AI)</h2>
        <p style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 100, 100, 0.1)', borderLeft: '4px solid #ff4444', borderRadius: '5px' }}>
          <strong>Aviso Importante (EU AI Act):</strong> Nuestra plataforma cuenta con sistemas de Inteligencia Artificial ("Yessel AI") para brindar atención inmediata. En cumplimiento con los estándares del <strong>Reglamento de IA de la Unión Europea</strong>, le informamos que:
          <br /><br />
          • <strong>Tratamiento de Datos de Chat:</strong> Las conversaciones entabladas con Yessel AI son procesadas de manera anónima a través de pasarelas de API seguras (tales como Groq, OpenAI o similares) para la generación de respuestas. No solicitamos ni almacenamos datos personales confidenciales (como contraseñas, números de identificación o tarjetas de crédito) a través del chat. Le exhortamos a no introducir información confidencial.
          <br />
          • <strong>Margen de Error de la IA:</strong> Al ser un sistema generativo, <strong>la IA puede cometer errores o alucinar datos</strong>. Toda recomendación sobre destinos, stock de productos, vuelos o pautas médicas/primeros auxilios de "Dr. Yessel" es meramente orientativa y de divulgación. No constituye un diagnóstico clínico, receta, ni asesoría vinculante. El usuario debe corroborar toda la información directamente en fuentes oficiales antes de tomar cualquier decisión de salud, viaje o compra.
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
