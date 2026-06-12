import TiendaClient from './TiendaClient';

export const metadata = {
  title: "La Gran Tienda del Viajero | Maletas, Ropa y Accesorios - IdarThur",
  description: "Compra el mejor equipamiento para tu viaje en Amazon con recomendaciones inteligentes de nuestra IA: maletas, abrigos, cámaras y artículos para mascotas.",
  keywords: "tienda de viajes, maletas de viaje, ropa comoda de viaje, rastreador gps mascotas, accesorios de viaje amazon, idarthur tienda"
};

export default function TiendaPage() {
  return <TiendaClient />;
}
