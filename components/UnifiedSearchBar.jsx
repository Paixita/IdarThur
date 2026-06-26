"use client";
import { useState, useEffect, useRef } from "react";

export default function UnifiedSearchBar() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("todos"); // 'todos', 'noticia', 'producto', 'historia'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results on query or tab change
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${activeTab}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.hits);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getTabLabel = (type) => {
    switch (type) {
      case "noticia":
        return "📰 Reporte";
      case "historia":
        return "🎒 Historia";
      case "producto":
        return "🛒 Tienda";
      default:
        return "🔍 Resultado";
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: "700px", margin: "0 auto" }}>
      {/* Search Input Container */}
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(10, 15, 26, 0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(69, 243, 255, 0.2)",
          borderRadius: "20px",
          padding: "5px 15px",
          boxShadow: "0 0 25px rgba(69, 243, 255, 0.15), inset 0 0 15px rgba(69, 243, 255, 0.05)",
          transition: "all 0.3s ease",
          position: "relative",
          zIndex: 10
        }}
        className="search-input-wrapper"
      >
        <span style={{ fontSize: "1.3rem", marginRight: "10px", color: "var(--primary)", filter: "drop-shadow(0 0 5px rgba(69, 243, 255, 0.5))" }}>
          🛸
        </span>
        <input
          type="text"
          placeholder="Busca noticias, relatos de viaje o artículos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "1.05rem",
            padding: "12px 5px",
            outline: "none",
            fontWeight: "500"
          }}
        />
        {loading && (
          <div className="spinner" style={{
            width: "20px",
            height: "20px",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            borderTop: "2px solid var(--primary)",
            borderRadius: "50%",
            animation: "spin-loader 0.8s linear infinite"
          }}></div>
        )}
      </div>

      {/* Tabs list */}
      <div 
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "12px",
          justifyContent: "center",
          position: "relative",
          zIndex: 9
        }}
      >
        {[
          { id: "todos", name: "🪐 Todo" },
          { id: "noticia", name: "📰 Noticias" },
          { id: "producto", name: "🛍️ Tienda" },
          { id: "historia", name: "🎒 Historias" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              background: activeTab === tab.id 
                ? "linear-gradient(45deg, rgba(69, 243, 255, 0.25), rgba(236, 72, 153, 0.15))" 
                : "rgba(10, 15, 26, 0.45)",
              color: activeTab === tab.id ? "var(--primary)" : "#a0aab5",
              border: `1px solid ${activeTab === tab.id ? "var(--primary)" : "rgba(255, 255, 255, 0.05)"}`,
              padding: "6px 14px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            className="tab-btn"
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Results Dropdown */}
      {showDropdown && query.trim().length > 0 && (
        <div 
          style={{
            position: "absolute",
            top: "calc(100% + 15px)",
            left: 0,
            width: "100%",
            maxHeight: "450px",
            overflowY: "auto",
            background: "rgba(10, 15, 26, 0.95)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            boxShadow: "0 15px 45px rgba(0, 0, 0, 0.8), 0 0 35px rgba(69, 243, 255, 0.05)",
            zIndex: 100,
            padding: "10px"
          }}
          className="scrollbar-custom"
        >
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 10px", color: "#a0aab5" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}>🛸</span>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>No encontramos resultados para tu exploración.</p>
            </div>
          ) : (
            results.map((hit) => (
              <a
                key={hit.id}
                href={hit.link}
                target={hit.type === "noticia" ? "_blank" : "_self"}
                rel={hit.type === "noticia" ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex",
                  gap: "15px",
                  padding: "12px",
                  borderRadius: "15px",
                  textDecoration: "none",
                  color: "white",
                  marginBottom: "8px",
                  transition: "all 0.25s ease",
                  border: "1px solid transparent"
                }}
                className="result-item"
                onClick={() => setShowDropdown(false)}
              >
                {/* Thumbnail */}
                {hit.image && (
                  <img
                    src={hit.image}
                    alt={hit.title}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}
                  />
                )}
                
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span 
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "8px",
                        background: hit.type === "noticia" ? "rgba(69, 243, 255, 0.15)" : 
                                    hit.type === "historia" ? "rgba(236, 72, 153, 0.15)" : 
                                    "rgba(251, 191, 36, 0.15)",
                        color: hit.type === "noticia" ? "var(--primary)" : 
                               hit.type === "historia" ? "var(--secondary)" : 
                               "#fbbf24",
                        fontWeight: "700"
                      }}
                    >
                      {getTabLabel(hit.type)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {hit.subtitle}
                    </span>
                  </div>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "600", color: "#f3f4f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hit.title}
                  </h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.3" }}>
                    {hit.content}
                  </p>
                </div>
              </a>
            ))
          )}
        </div>
      )}

      {/* Global CSS Styles for details */}
      <style>{`
        .search-input-wrapper:focus-within {
          border-color: var(--primary) !important;
          box-shadow: 0 0 35px rgba(69, 243, 255, 0.35), inset 0 0 20px rgba(69, 243, 255, 0.1) !important;
          transform: translateY(-2px);
        }
        .tab-btn:hover {
          border-color: var(--primary) !important;
          color: white !important;
        }
        .result-item:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(69, 243, 255, 0.15) !important;
          transform: translateX(4px);
        }
        @keyframes spin-loader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: rgba(69, 243, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
