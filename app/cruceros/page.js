export const metadata = {
  title: 'Cruceros desde Colombia | IdarThur',
  description: 'Compara salidas desde Cartagena, escalas y puertos de desembarque.'
};

const catalogo = 'https://www.royalcaribbean.com/lac/es/cruises?country=COL&currency=USD&search=departurePort%3ACTG';
const viajes = [
  {
    fecha: '24 de enero de 2027',
    titulo: 'Santa Marta y las islas del Caribe',
    ruta: 'Saliendo de Cartagena, la primera escala es Santa Marta. Después de un día en alta mar, el barco visita Willemstad, Oranjestad y Colón. Regresa a Cartagena el 31 de enero.',
    noches: 7,
    fuente: 'https://www.royalcaribbean.com/usa/es/itinerary/7-night-southern-caribbean-holiday-cruise-from-cartagena-on-grandeur-GR7IP223?sailDate=2027-01-24'
  },
  {
    fecha: '14 de febrero de 2027',
    titulo: 'Aruba y Bonaire',
    ruta: 'Embarca en Cartagena, recorre Oranjestad y Kralendijk y visita Colón antes de regresar al puerto colombiano.',
    noches: 7
  },
  {
    fecha: '18 de abril de 2027',
    titulo: 'De Cartagena a Panamá',
    ruta: 'El barco pasa por Aruba y Curazao y termina en Colón, Panamá. Si vuelves a Colombia, planifica el trayecto de regreso desde Panamá.',
    noches: 6
  }
];

export default function Cruceros() {
  return (
    <main className="container" style={{paddingTop: 132, paddingBottom: 80}}>
      <header style={{padding: 'clamp(24px, 6vw, 76px)', borderRadius: 24, background: 'linear-gradient(90deg, #031817f5, #061717aa), url(/cruceros/crucero-1.jpg) center / cover'}}>
        <h1 style={{fontSize: 'clamp(2.2rem, 6vw, 4rem)'}}>Cruceros desde Colombia</h1>
        <p>Salidas desde Cartagena a bordo del Grandeur of the Seas de Royal Caribbean.</p>
      </header>
      <section aria-label="Salidas programadas" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 265px), 1fr))', gap: 20, margin: '28px 0'}}>
        {viajes.map(viaje => (
          <article className="glass" key={viaje.fecha} style={{padding: 24, borderRadius: 20, display: 'grid', gap: 14, alignContent: 'start'}}>
            <strong style={{color: '#6ee7b7'}}>{viaje.fecha} · {viaje.noches} noches</strong>
            <h2>{viaje.titulo}</h2>
            <p>{viaje.ruta}</p>
            <a href={viaje.fuente || catalogo} style={{textDecoration: 'underline'}}>Consultar salida en Royal Caribbean →</a>
          </article>
        ))}
      </section>
      <p>Itinerarios consultados el 20 de noviembre de 2026. Confirma fechas, escalas, camarotes y precio final con la naviera. <a href={catalogo} style={{textDecoration: 'underline'}}>Ver calendario desde Cartagena</a></p>
    </main>
  );
}
