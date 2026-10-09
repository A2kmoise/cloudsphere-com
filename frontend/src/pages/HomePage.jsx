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
            <p className="eyebrow">🇷🇼 Rwanda · Integer RWF</p>
            <h1>Premium Tech Accessories</h1>
            <p>Discover high-quality cables and accessories designed for modern professionals. Gold members enjoy free shipping, and bulk orders get automatic discounts.</p>
            <div className="hero-actions">
              <a className="btn btn-on-hero" href="#catalogue">Explore Products</a>
              <Link className="btn btn-ghost-hero" to="/cart">View Cart</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <h3>💎 Gold Membership</h3>
              <p>Free shipping on all orders and exclusive early access to new products.</p>
            </div>
            <div className="hero-card">
              <h3>📦 Fast Delivery</h3>
              <p>Same-day processing with reliable tracking. Your order ships within 24 hours.</p>
            </div>
            <div className="hero-card">
              <h3>💰 Best Prices</h3>
              <p>10% off when you buy 5 or more items from the same product line.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="benefits">
        <div className="wrap benefits-grid">
          <div>
            <strong>Free shipping</strong>
            <p>Gold members, or baskets of 50,000 RWF and above.</p>
          </div>
          <div>
            <strong>Bulk discount</strong>
            <p>10% off any line when you add five or more.</p>
          </div>
          <div>
            <strong>Pay locally</strong>
            <p>MTN MoMo or card, with prices in whole francs.</p>
          </div>
          <div>
            <strong>Saved lists</strong>
            <p>Wishlist stays with your account across sessions.</p>
          </div>
        </div>
      </section>
      <section className="section" id="catalogue">
        <div className="wrap">
          <div className="section-head">
            <h2>Catalogue</h2>
            <span className="muted">{visible.length} published items</span>
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
          {visible.length === 0 ? <div className="empty">No products match that search.</div> : null}
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
                      Add to cart
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
