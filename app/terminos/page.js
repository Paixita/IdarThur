export const metadata = {
  title: "Términos y Condiciones del Servicio | IdarThur",
  description: "Revisa los términos y condiciones de uso de IdarThur Global, descargo de responsabilidad sobre servicios de terceros, navieras y alquiler de vehículos.",
  robots: { index: false }
};

export default function Terminos() {
  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '40px', fontWeight: 'bold' }}>Términos y Condiciones</h1>
      
      <div className="glass" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8', color: '#e5e7eb' }}>
        <p style={{ marginBottom: '20px' }}>
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>1. Naturaleza del Servicio y Rol de Intermediario</h2>
        <p style={{ marginBottom: '20px' }}>
          IdarThur Global opera única y exclusivamente como un <strong>portal de intermediación, vocero y recomendación (afiliación)</strong>. No somos una agencia de viajes directa ni operadores turísticos. No poseemos, administramos ni operamos aerolíneas, líneas de cruceros (navieras), hoteles, flotas de vehículos de alquiler ni centros de almacenamiento de productos de consumo. Proveemos enlaces hacia proveedores externos independientes (Booking.com, DiscoverCars, Amazon, etc.).
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '30px', marginBottom: '15px' }}>2. Exención de Responsabilidad Completa sobre Servicios de Terceros</h2>
        <p style={{ marginBottom: '20px' }}>
          Cualquier reserva de viaje o adquisición de productos físicos realizada tras hacer clic en nuestros enlaces se celebra <strong>exclusivamente entre usted y el proveedor final (ej. aerolínea, naviera, hotel, rentadora o Amazon)</strong>. 
          <br /><br />
          IdarThur no asume responsabilidad alguna por:
          <br />
          • Cancelaciones, retrasos, pérdida de equipaje o sobreventas (overbooking) de aerolíneas o navieras de cruceros.
          <br />
          • Problemas, incidentes de seguridad, accidentes, lesiones o mal comportamiento del personal en hoteles o a bordo de transportes de terceros.
          <br />
          • Fallos de entrega, retrasos en la distribución, productos defectuosos, reclamaciones de garantía, devoluciones o reembolsos asociados con productos comprados en la tienda a través del sistema de afiliación de Amazon.
          <br /><br />
          Cualquier reclamación, solicitud de reembolso o disputa legal debe dirigirse directa y exclusivamente al proveedor responsable de dicho servicio o producto, eximiendo por completo a IdarThur de cualquier reclamación civil, comercial o penal.
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
