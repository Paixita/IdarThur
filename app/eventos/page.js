"use client";
import Link from 'next/link';

export default function EventosPage() {
  return (
    <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          Eventos <span className="text-gradient">Globales</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Vive las mejores festividades del mundo. Reserva ahora vuelos y alojamiento con nuestros aliados oficiales.
        </p>
      </div>

      {/* Promoción de Cruceros */}
      <div className="glass" style={{ borderRadius: '30px', padding: '40px', marginBottom: '60px', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'linear-gradient(135deg, rgba(10,15,25,0.95) 0%, rgba(255, 215, 0, 0.05) 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>Promoción <span style={{ color: '#ffd700' }}>Cruceros de Lujo</span></h2>
          <p style={{ color: '#a0aab5', fontSize: '1.1rem', marginTop: '10px' }}>Descubre la experiencia IdarThur sobre el mar. (Asegúrate de encender el sonido 🔊)</p>
        </div>
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '2px solid rgba(255, 215, 0, 0.2)' }}>
          <video 
            src="/video_crucero.mp4" 
            controls 
            autoPlay 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button onClick={() => window.open('https://search.hotellook.com/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px', background: 'linear-gradient(45deg, #d4af37, #ffd700)', color: 'black', fontWeight: 'bold' }}>
            🛳️ Cotizar Crucero Ahora
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        
        {/* Feria de las Flores */}
        <div className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ height: '250px', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Feria de las Flores, Medellín" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary)', color: 'black', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Agosto</div>
          </div>
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Feria de las Flores</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>📍 Medellín, Colombia</p>
            <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
              La fiesta cultural más importante de Antioquia. Disfruta del desfile de silleteros, trovas, conciertos y la eterna primavera paisa.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button onClick={() => window.open('https://wayaway.io/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem' }}>✈️ Vuelos a Medellín</button>
              <button onClick={() => window.open('https://sp.booking.com/genius.es.html?label=affnetTP_399989189573503', '_blank')} style={{ padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>🏨 Hoteles Cerca</button>
            </div>
          </div>
        </div>

        {/* Carnaval de Barranquilla */}
        <div className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ height: '250px', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Carnaval de Barranquilla" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary)', color: 'black', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Febrero / Marzo</div>
          </div>
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Carnaval de Barranquilla</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>📍 Barranquilla, Colombia</p>
            <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
              Quien lo vive, es quien lo goza. Sumérgete en el segundo carnaval más grande del mundo lleno de color, cumbia y alegría caribeña.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button onClick={() => window.open('https://wayaway.io/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem' }}>✈️ Vuelos a Barranquilla</button>
              <button onClick={() => window.open('https://sp.booking.com/genius.es.html?label=affnetTP_399989189573503', '_blank')} style={{ padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>🏨 Hoteles Cerca</button>
            </div>
          </div>
        </div>

        {/* Festival Sakura */}
        <div className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ height: '250px', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sakura en Japón" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary)', color: 'black', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Marzo / Abril</div>
          </div>
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Sakura (Cerezos)</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>📍 Tokio / Kioto, Japón</p>
            <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
              El espectáculo natural más hermoso de Asia. Viaja a Japón durante el florecimiento de los cerezos para una experiencia mágica e inolvidable.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button onClick={() => window.open('https://wayaway.io/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem' }}>✈️ Vuelos a Japón</button>
              <button onClick={() => window.open('https://sp.booking.com/genius.es.html?label=affnetTP_399989189573503', '_blank')} style={{ padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>🏨 Hoteles Cerca</button>
            </div>
          </div>
        </div>

        {/* Tomorrowland */}
        <div className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ height: '250px', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Tomorrowland Bélgica" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary)', color: 'black', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Julio</div>
          </div>
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Tomorrowland</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>📍 Boom, Bélgica</p>
            <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
              El festival de música electrónica más grande y famoso del mundo. Una experiencia visual y sonora que cambia la vida.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button onClick={() => window.open('https://wayaway.io/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem' }}>✈️ Vuelos a Bélgica</button>
              <button onClick={() => window.open('https://sp.booking.com/genius.es.html?label=affnetTP_399989189573503', '_blank')} style={{ padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>🏨 Hoteles Cerca</button>
            </div>
          </div>
        </div>

        {/* La Tomatina */}
        <div className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ height: '250px', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="La Tomatina España" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary)', color: 'black', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Agosto</div>
          </div>
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>La Tomatina</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>📍 Buñol, España</p>
            <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
              La batalla de comida más grande y épica de Europa. Toneladas de tomates y pura diversión en las calles de Valencia.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button onClick={() => window.open('https://wayaway.io/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem' }}>✈️ Vuelos a España</button>
              <button onClick={() => window.open('https://sp.booking.com/genius.es.html?label=affnetTP_399989189573503', '_blank')} style={{ padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>🏨 Hoteles Cerca</button>
            </div>
          </div>
        </div>

        {/* Inti Raymi */}
        <div className="glass" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ height: '250px', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Inti Raymi Perú" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary)', color: 'black', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Junio</div>
          </div>
          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Festival Inti Raymi</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>📍 Cusco, Perú</p>
            <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
              La antigua ceremonia religiosa inca en honor al sol. Disfruta de la magia ancestral en las ruinas de Sacsayhuamán.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button onClick={() => window.open('https://wayaway.io/?marker=729418', '_blank')} className="btn-primary" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem' }}>✈️ Vuelos a Perú</button>
              <button onClick={() => window.open('https://sp.booking.com/genius.es.html?label=affnetTP_399989189573503', '_blank')} style={{ padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>🏨 Hoteles Cerca</button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
