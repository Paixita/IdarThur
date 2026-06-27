"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { categories, products } from '../../data/tienda';
import UnifiedSearchBar from '../../components/UnifiedSearchBar';
import { trackTikTokEvent } from '../../utils/tiktok';

export default function TiendaClient() {
  const [activeCategory, setActiveCategory] = useState("todos");
  
  // Track page view event in TikTok
  useEffect(() => {
    trackTikTokEvent('ViewContent', {
      content_type: 'product_group',
      content_name: 'Tienda de Viajes IdarThur',
      currency: 'USD',
      value: 0
    });
  }, []);

  const handleProductClick = (product) => {
    const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 10.0;
    
    // Enviar evento de añadir al carrito
    trackTikTokEvent('AddToCart', {
      contents: [
        {
          content_id: String(product.id),
          content_type: 'product',
          content_name: product.name,
          quantity: 1,
          price: numericPrice
        }
      ],
      value: numericPrice,
      currency: 'USD'
    });
    
    // Enviar evento de iniciar checkout
    trackTikTokEvent('InitiateCheckout', {
      contents: [
        {
          content_id: String(product.id),
          content_type: 'product',
          content_name: product.name,
          quantity: 1,
          price: numericPrice
        }
      ],
      value: numericPrice,
      currency: 'USD'
    });

    // Enviar evento de compra simulada (afiliado)
    trackTikTokEvent('Purchase', {
      contents: [
        {
          content_id: String(product.id),
          content_type: 'product',
          content_name: product.name,
          quantity: 1,
          price: numericPrice
        }
      ],
      value: numericPrice,
      currency: 'USD'
    });
  };

  // Configuración del Slider de Productos Destacados
  const featuredIds = [5, 1, 10, 8, 11];
  const featuredProducts = products.filter(p => featuredIds.includes(p.id));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, featuredProducts.length]);

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

      {/* BUSCADOR UNIFICADO Y ASESORÍA */}
      <div style={{ marginBottom: '50px' }}>
        <UnifiedSearchBar />
      </div>

      {/* SLIDER DE PRODUCTOS DESTACADOS */}
      <div 
        className="glass" 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ 
          position: 'relative', 
          height: '420px', 
          borderRadius: '30px', 
          overflow: 'hidden', 
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}
      >
        {/* Slides Container */}
        <div style={{ 
          display: 'flex', 
          width: `${featuredProducts.length * 100}%`, 
          height: '100%',
          transform: `translateX(-${(currentSlide * 100) / featuredProducts.length}%)`,
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {featuredProducts.map(prod => (
            <div key={prod.id} style={{ 
              width: `${100 / featuredProducts.length}%`, 
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              padding: '40px 60px',
              boxSizing: 'border-box',
              gap: '40px',
              position: 'relative'
            }}>
              {/* Left Side: Info */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <span style={{ 
                  background: 'linear-gradient(45deg, var(--primary), var(--accent))', 
                  color: 'white', 
                  padding: '5px 15px', 
                  borderRadius: '20px', 
                  fontWeight: 'bold', 
                  fontSize: '0.8rem',
                  alignSelf: 'flex-start',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)'
                }}>
                  ⭐ RECOMENDACIÓN VIP
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '15px', color: 'white', lineHeight: '1.2' }}>
                  {prod.name}
                </h2>
                <p style={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {prod.copy}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginTop: '10px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00d4ff' }}>
                    {prod.price}
                  </span>
                  <a 
                    href={prod.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => handleProductClick(prod)}
                    className="btn-amazon-slider"
                    style={{ 
                      padding: '12px 30px', 
                      borderRadius: '15px', 
                      background: '#ff9900', 
                      color: '#111', 
                      fontWeight: 'bold', 
                      textDecoration: 'none',
                      fontSize: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.3s'
                    }}
                  >
                    Comprar en Amazon 🛒
                  </a>
                </div>
              </div>

              {/* Right Side: Image */}
              <div style={{ flex: 0.8, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: '320px', 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img src={prod.img} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
          style={{
            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white',
            width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', zIndex: 10
          }}
          className="slider-arrow"
        >
          ⟨
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => (prev + 1) % featuredProducts.length)}
          style={{
            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white',
            width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', zIndex: 10
          }}
          className="slider-arrow"
        >
          ⟩
        </button>

        {/* Dots Navigation */}
        <div style={{
          position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '10px', zIndex: 10
        }}>
          {featuredProducts.map((_, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '25px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentSlide === idx ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
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
            
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => handleProductClick(product)}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
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
        .btn-amazon-slider:hover {
          background: #ffb84d !important;
          box-shadow: 0 0 15px rgba(255, 153, 0, 0.4);
          transform: scale(1.03);
        }
        .slider-arrow:hover {
          background: var(--primary) !important;
          border-color: var(--primary) !important;
          transform: translateY(-50%) scale(1.1);
        }
        @media (max-width: 768px) {
          .glass[onMouseEnter] {
            height: auto !important;
          }
          .glass[onMouseEnter] > div {
            flex-direction: column !important;
            padding: 30px 20px !important;
            height: auto !important;
            gap: 20px !important;
          }
          .glass[onMouseEnter] > div > div {
            width: 100% !important;
            height: auto !important;
            flex: none !important;
          }
        }
      `}</style>
    </main>
  );
}
