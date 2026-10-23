import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { hueFrom, initials } from "./api";
import { useStore } from "./store";

export function Mark() {
  return <span className="mark">CS</span>;
}

export function Media({ name, sku, imageUrl, className = "product-media" }) {
  if (imageUrl) {
    return (
      <div className={`${className} product-photo`}>
        <img src={imageUrl} alt={name} />
      </div>
    );
  }
  const hue = hueFrom(sku || name);
  return (
    <div
      className={className}
      style={{ background: `linear-gradient(150deg, hsl(${hue} 85% 52%), hsl(199 100% 47%))` }}
    >
      {initials(name)}
    </div>
  );
}

function Icon({ d, stroke = 1.8 }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function Shell() {
  const { cart, user, logout, theme, setTheme, isAdmin, query, setQuery, refreshCatalog } = useStore();
  const qty = cart?.items?.reduce((n, i) => n + i.qty, 0) ?? 0;
  const navigate = useNavigate();

  return (
    <div className="site">
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="brand" to="/">
            <Mark />
            German Auto Select
          </Link>
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              refreshCatalog(query);
              navigate("/");
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vehicles, models…"
              aria-label="Search vehicles"
            />
          </form>
          <nav className="header-actions">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Inventory</NavLink>
            {user ? <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Purchases</NavLink> : null}
            {user ? <NavLink to="/wishlist" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Favorites</NavLink> : null}
            {isAdmin ? <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Admin</NavLink> : null}
            <Link to="/cart" className="icon-btn" aria-label="Cart" title="Cart">
              <Icon d="M6 7h15l-1.5 9h-12zM6 7 5 4H2" />
              {qty > 0 ? <span className="badge">{qty}</span> : null}
            </Link>
            <button
              className="icon-btn"
              title="Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark")}
            >
              <Icon d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" />
            </button>
            {user ? (
              <button className="icon-btn" title={`Sign out ${user.email}`} onClick={() => { logout(); navigate("/"); }}>
                <span className="mark" style={{ width: 28, height: 28, fontSize: 13 }}>{initials(user.email)}</span>
              </button>
            ) : (
              <Link to="/login" className="nav-link">Sign in</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 8 }}>
              <Mark />
              German Auto Select
            </div>
            <p>Premium German vehicles in Rwanda. All prices in RWF. Financing available for qualified buyers.</p>
          </div>
          <div>
            <h3>Browse</h3>
            <Link to="/">Vehicle Inventory</Link>
            <Link to="/cart">Selected Vehicles</Link>
            <Link to="/wishlist">Favorites</Link>
          </div>
          <div>
            <h3>Account</h3>
            {user ? <Link to="/orders">My Purchases</Link> : <Link to="/login">Sign in</Link>}
            {user ? <button type="button" className="linkish" onClick={() => { logout(); navigate("/"); }}>Sign out</button> : <Link to="/register">Create account</Link>}
          </div>
          <div>
            <h3>Services</h3>
            <p>Professional delivery available. Trade-in programs and financing options for gold members. Contact us for details.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
