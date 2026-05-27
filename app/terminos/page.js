export default function Terminos() {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: 'bold' }}>Términos y Condiciones</h1>
      
      <div className="glass" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8', color: '#e5e7eb' }}>
        <p style={{ marginBottom: '20px' }}>
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>1. Naturaleza del Servicio</h2>
        <p style={{ marginBottom: '20px' }}>
          IdarThur Global opera como un portal de descubrimiento y redirección de viajes. No somos una agencia de viajes directa ni una aerolínea. Proveemos enlaces de afiliación hacia proveedores terceros (Booking.com, WayAway, Amazon, etc.).
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>2. Exención de Responsabilidad de Terceros</h2>
        <p style={{ marginBottom: '20px' }}>
          Cualquier reserva, compra o contrato de servicio realizado tras hacer clic en los enlaces de IdarThur se celebra exclusivamente entre usted y el proveedor final (ej. Booking.com o la aerolínea correspondiente). IdarThur no asume responsabilidad alguna por cancelaciones de vuelos, problemas en hoteles, calidad de los productos de Amazon, o cualquier disputa financiera o de servicio al cliente.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>3. Precios y Disponibilidad</h2>
        <p style={{ marginBottom: '20px' }}>
          Los precios mostrados o sugeridos en IdarThur (incluyendo sugerencias generadas por Inteligencia Artificial) son puramente informativos. El precio final y la disponibilidad siempre serán los mostrados en la página oficial del proveedor al momento del pago.
        </p>
      </div>
    </div>
  );
}
