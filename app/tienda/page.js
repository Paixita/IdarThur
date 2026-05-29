"use client";
import Link from 'next/link';
import { useState } from 'react';
import { categories, products } from '../../data/tienda';

export default function TiendaPage() {
  const [activeCategory, setActiveCategory] = useState("todos");

  const filteredProducts = activeCategory === "todos" 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }} className="container">
      
      {/* HEADER DE LA TIENDA */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '15px' }}>
          La Gran Tienda <span className="text-gradient">IdarThur</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#a0aab5', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Todo lo que necesitas para tu próxima aventura, probado en batalla y garantizado por las reseñas de miles de viajeros. Compra directo y seguro en Amazon.
        </p>
      </div>

      {/* MENÚ DE CATEGORÍAS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginBottom: '50px' }}>
        <button 
          onClick={() => setActiveCategory("todos")}
          style={{
            padding: '12px 25px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s',
            background: activeCategory === "todos" ? '#00d4ff' : 'rgba(255,255,255,0.05)',
            color: activeCategory === "todos" ? '#0b1120' : 'white',
            border: activeCategory === "todos" ? 'none' : '1px solid rgba(255,255,255,0.1)'
          }}
        >
          🌟 Todos
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '12px 25px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s',
              background: activeCategory === cat.id ? '#00d4ff' : 'rgba(255,255,255,0.05)',
              color: activeCategory === cat.id ? '#0b1120' : 'white',
              border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
        {filteredProducts.map(product => (
          <div key={product.id} className="glass product-card" style={{ borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s' }}>
            
            <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
                <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="product-img" />
                {product.bestseller && (
                  <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff0055', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', zIndex: 10 }}>
                    🔥 Más Vendido
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', color: '#00d4ff', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1.2rem', zIndex: 10 }}>
                  {product.price}
                </div>
              </div>
              
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ color: '#a0aab5', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {categories.find(c => c.id === product.categoryId)?.icon} {categories.find(c => c.id === product.categoryId)?.name}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px', lineHeight: '1.3' }}>{product.name}</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
                  {product.copy}
                </p>
                
                <div className="btn-amazon" style={{ padding: '12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1rem', background: '#ff9900', color: '#111', textAlign: 'center', transition: 'background 0.3s' }}>
                  Comprar en Amazon 🛒
                </div>
              </div>
            </a>

          </div>
        ))}
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 212, 255, 0.15);
        }
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
        .product-card:hover .btn-amazon {
          background: #ffb84d !important;
        }
      `}</style>
    </main>
  );
}
