import PeruClient from './PeruClient';

export const metadata = {
  title: 'Vuelos de Medellín a Perú: Lima, Cusco y Arequipa | IdarThur',
  description:
    'Vuelos directos desde Medellín a Lima en ~3 horas y rutas a Cusco, Arequipa e Iquitos. Requisitos, precios de referencia y enlaces de reserva.',
  keywords:
    'vuelos Medellín Perú, vuelos a Lima, vuelos a Cusco, Machu Picchu, viajar a Perú desde Colombia',
};

export default function PeruPage() {
  return <PeruClient />;
}
