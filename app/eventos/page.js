import EventosClient from './EventosClient';

export const metadata = {
  title: "Eventos Globales y Festivales Turísticos - IdarThur",
  description: "Descubre las ferias, festivales de música y eventos tradicionales más importantes del mundo. Reserva tus vuelos y hoteles directamente con cashback.",
  keywords: "festivales mundiales, carnaval de barranquilla, feria de las flores medellin, tomorrowland belgica, la tomatina valencia, turismo de eventos"
};

export default function EventosPage() {
  return <EventosClient />;
}
