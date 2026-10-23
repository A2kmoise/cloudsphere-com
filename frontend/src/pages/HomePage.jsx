import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { money } from "../api";
import { Media } from "../shell";
import { useStore } from "../store";

export function HomePage() {
  const { products, categories, query, refreshCatalog, addToCart, notify } = useStore();
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const t = setTimeout(() => refreshCatalog(query).catch(() => { }), 180);
    return () => clearTimeout(t);
  }, [query, refreshCatalog]);

  const visible = useMemo(() => {
    const filtered = categoryId
      ? products.filter((p) => p.categoryId === categoryId)
      : products;
    return [...filtered].sort((a, b) => Number(b.stockBadge === "IN_STOCK") - Number(a.stockBadge === "IN_STOCK"));
  }, [products, categoryId]);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-content">
            <p className="eyebrow">🇩🇪 German Engineering · Premium Automobiles</p>
            <h1>Luxury German Cars</h1>
            <p>Experience the finest German automotive engineering. From BMW to Porsche, Mercedes-Benz to Audi - discover premium vehicles that combine performance, luxury, and innovation.</p>
            <div className="hero-actions">
              <a className="btn btn-on-hero" href="#catalogue">Browse Inventory</a>
              <Link className="btn btn-ghost-hero" to="/cart">View Selections</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <h3>🏆 Premium Selection</h3>
              <p>Hand-picked vehicles from Germany's most prestigious manufacturers.</p>
            </div>
            <div className="hero-card">
              <h3>✅ Certified Quality</h3>
              <p>Every vehicle undergoes rigorous inspection to ensure peak performance.</p>
            </div>
            <div className="hero-card">
              <h3>🔧 Full Service</h3>
              <p>Complete documentation and after-sales support included with every purchase.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="benefits">
        <div className="wrap benefits-grid">
          <div>
            <strong>Financing Available</strong>
            <p>Flexible payment plans for gold members and qualified buyers.</p>
          </div>
          <div>
            <strong>Trade-In Program</strong>
            <p>Get the best value for your current vehicle towards your new purchase.</p>
          </div>
          <div>
            <strong>Delivery Service</strong>
            <p>Professional vehicle delivery anywhere in Rwanda.</p>
          </div>
          <div>
            <strong>Warranty Included</strong>
            <p>Comprehensive coverage with all certified pre-owned vehicles.</p>
          </div>
        </div>
      </section>
      <section className="section" id="catalogue">
        <div className="wrap">
          <div className="section-head">
            <h2>Vehicle Inventory</h2>
            <span className="muted">{visible.length} vehicles available</span>
          </div>
          <div className="chips">
            <button type="button" className={`chip ${categoryId === "" ? "active" : ""}`} onClick={() => setCategoryId("")}>
              <span>All</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip ${categoryId === c.id ? "active" : ""}`}
                onClick={() => setCategoryId(c.id)}
              >
                <span>{c.name}</span>
              </button>
            ))}
          </div>
          {visible.length === 0 ? <div className="empty">No vehicles match your search.</div> : null}
          <div className="product-grid">
            {visible.map((p) => {
              const inStock = p.stockBadge === "IN_STOCK";
              return (
                <article key={p.id} className="product-card">
                  <Link to={`/product/${p.id}`}>
                    <Media name={p.name} sku={p.sku} imageUrl={p.imageUrl} />
                    <div className="product-body">
                      <div className="sku">{p.sku}</div>
                      <h3>{p.name}</h3>
                      <div className="price">{money(p.priceRwf)}</div>
                      <div className={`stock ${inStock ? "in" : "out"}`}>
                        {inStock ? `${p.stockQty} in stock` : "Out of stock"}
                      </div>
                    </div>
                  </Link>
                  <div className="product-body" style={{ paddingTop: 0 }}>
                    <button
                      className="btn btn-primary btn-block"
                      disabled={!inStock}
                      type="button"
                      onClick={async () => {
                        try {
                          await addToCart(p.id, 1);
                        } catch (e) {
                          notify(e.message);
                        }
                      }}
                    >
                      Reserve Vehicle
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
