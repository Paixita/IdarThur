export default function Terminos() {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: 'bold' }}>Términos y Condiciones</h1>
      
      <div className="glass" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8', color: '#e5e7eb' }}>
        <p style={{ marginBottom: '20px' }}>
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>1. Naturaleza del Servicio y Rol de Vocero</h2>
        <p style={{ marginBottom: '20px' }}>
          IdarThur Global opera única y exclusivamente como un <strong>portal de descubrimiento, vocero y redirección de viajes (afiliación)</strong>. No somos una agencia de viajes directa, no poseemos aerolíneas, cadenas hoteleras ni flotas de vehículos. Proveemos enlaces hacia proveedores terceros (Booking.com, DiscoverCars, Amazon, etc.).
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>2. Exención de Responsabilidad de Terceros</h2>
        <p style={{ marginBottom: '20px' }}>
          Cualquier reserva o compra realizada tras hacer clic en nuestros enlaces se celebra <strong>exclusivamente entre usted y el proveedor final</strong>. IdarThur no asume responsabilidad alguna por cancelaciones, sobreventas (overbooking), problemas en hoteles, o cualquier disputa. La resolución de conflictos, quejas o solicitudes de reembolso corresponde única y exclusivamente al proveedor del servicio (ej. la agencia de alquiler o el hotel), ya que IdarThur no tiene acceso a sus sistemas de reserva ni control sobre sus políticas.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>3. Política Específica sobre Alquiler de Vehículos</h2>
        <p style={{ marginBottom: '20px' }}>
          En nuestra sección de Alquiler de Vehículos, las imágenes mostradas son ilustrativas y representan <strong>Categorías Universales (Códigos ACRISS)</strong>, no modelos específicos. La falta de disponibilidad de un vehículo, el cambio de modelo en el mostrador, o la no complacencia de la agencia de alquiler local son responsabilidad exclusiva de dicha agencia de alquiler y de la plataforma de reserva conectada (ej. DiscoverCars). IdarThur se exime de toda responsabilidad por cambios de flota en el destino.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>4. Precios y Disponibilidad</h2>
        <p style={{ marginBottom: '20px' }}>
          Los precios mostrados en IdarThur son puramente informativos. El precio final y la disponibilidad siempre serán los mostrados en la página oficial del proveedor al momento del pago.
        </p>
      </div>
    </div>
  );
}
