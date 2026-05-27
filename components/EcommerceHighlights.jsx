"use client";
import Link from 'next/link';

export default function EcommerceHighlights() {
  const products = [
    { id: 1, name: "Cámara de Seguridad", price: "$44.99", img: "/store_camera.png", category: "Tecnología", affiliateLink: "https://amzn.to/4ulMw3w" },
    { id: 2, name: "Chaqueta para Hombre", price: "$119.99", img: "/store_jacket.png", category: "Ropa", affiliateLink: "https://amzn.to/42MlRJi" },
    { id: 3, name: "Chaqueta para Mujer", price: "$62.03", img: "/store_jacket_woman.png", category: "Ropa", affiliateLink: "https://amzn.to/3RkMt9l" },
    { id: 4, name: "Botiquín de Viaje", price: "$29.99", img: "/store_firstaid.png", category: "Salud", affiliateLink: "https://amzn.to/4nDwNu2" },
    { id: 5, name: "Mochila Antirrobo Unisex", price: "$51.98", img: "/store_backpack.png", category: "Accesorios", affiliateLink: "https://amzn.to/4uSoHA8" }
  ];

  return (
    <section id="tienda" className="container" style={{ margin: '100px auto', paddingBottom: '100px' }}>
      <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '60px' }}>
        Equípate con <span className="text-gradient">IdarThur</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
        {products.map(p => (
          <div key={p.id} className="glass product-card" style={{ padding: '30px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div className="icon-glow" style={{ marginBottom: '20px' }}>
               <img src={p.img} alt={p.name} style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))', borderRadius: '10px' }} />
            </div>
            <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>{p.name}</h3>
            <p style={{ color: '#a0aab5', marginBottom: '15px' }}>{p.category}</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{p.price}</p>
            <a href={p.affiliateLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '12px', textDecoration: 'none', display: 'inline-block' }} onClick={(e) => {
              if (p.affiliateLink === '#tienda') {
                e.preventDefault();
                alert(`Simulación de Afiliado: Aquí irá tu link real para ganar comisión por el producto: ${p.name}`);
              }
            }}>Ver Oferta</a>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
         <Link href="/tienda" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', background: 'transparent', border: '1px solid var(--primary)', color: 'white', padding: '12px 30px', borderRadius: '30px', fontSize: '1.1rem' }}>
           Explorar Catálogo Completo →
         </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 15px 35px rgba(0, 136, 255, 0.2);
          border-color: rgba(69, 243, 255, 0.3);
        }
      `}} />
    </section>
  )
}
