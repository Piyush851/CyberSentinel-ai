import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);

  // Live Clock Effect
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Scroll Blur Effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Updated to use actual URL paths
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/url-scanner", label: "URL Scanner" },
    { path: "/sms-scanner", label: "SMS Scanner" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(1,11,18,0.98)" : "rgba(1,11,18,0.92)",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "rgba(13,45,68,0.5)"}`,
        backdropFilter: "blur(20px)",
        height: "var(--nav-h)",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        {/* Inner container */}
        <div style={{
          maxWidth: "var(--max-w)",
          margin: "0 auto",
          padding: "0 var(--page-px)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          
          {/* Logo - Now a Router <Link> instead of a <button> */}
          <Link 
            to="/" 
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}
          >
            <svg viewBox="0 0 36 36" fill="none" style={{ width: 32, height: 32, flexShrink: 0 }}>
              <polygon
                points="18,2 34,10 34,26 18,34 2,26 2,10"
                stroke="var(--accent)" strokeWidth="1.5"
                fill="rgba(0,245,212,0.06)"
              />
              <circle cx="18" cy="18" r="5.5" fill="var(--accent)" opacity="0.9" />
              <circle cx="18" cy="18" r="10"  stroke="var(--accent2)" strokeWidth="0.6" fill="none" opacity="0.7"/>
              <circle cx="18" cy="18" r="14"  stroke="var(--accent)"  strokeWidth="0.3" fill="none" opacity="0.3"/>
            </svg>
            <div style={{ minWidth: 0, textAlign: "left" }}>
              <div className="orbitron" style={{ fontSize: 13, fontWeight: 900, color: "var(--accent)", letterSpacing: 1.5, lineHeight: 1.1, whiteSpace: "nowrap" }}>
                CYBER<span style={{ color: "var(--accent2)" }}>SENTINEL</span>
              </div>
              <div className="mono" style={{ fontSize: 8, color: "var(--muted)", letterSpacing: 1.5 }}>AI THREAT DETECTION</div>
            </div>
          </Link>

          {/* Desktop Nav - Using <NavLink> for automatic active state detection */}
          <div className="desktop-nav" style={{ display: "flex", gap: 30 }}>
            {navItems.map(n => (
              <NavLink
                key={n.path}
                to={n.path}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                style={{ textDecoration: "none", background: "none", border: "none", cursor: "pointer" }}
              >
                {n.label}
              </NavLink>
            ))}
          </div>

          {/* Live clock */}
          <div className="desktop-clock mono" style={{ fontSize: 10, color: "var(--muted)", textAlign: "right", flexShrink: 0 }}>
            <div style={{ color: "var(--accent)", letterSpacing: 1 }}>{time.toLocaleTimeString()}</div>
            <div style={{ fontSize: 9, marginTop: 1 }}>{time.toLocaleDateString()}</div>
          </div>

          {/* Hamburger (Mobile) */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-down menu */}
      <div className="mobile-menu-panel" style={{
        position: "fixed", top: "var(--nav-h)", left: 0, right: 0, zIndex: 999,
        background: "rgba(1,11,18,0.98)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        maxHeight: menuOpen ? "300px" : "0",
        overflow: "hidden",
        transition: "max-height 0.32s ease",
        padding: menuOpen ? "12px 20px 20px" : "0 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {navItems.map(n => (
          <NavLink
            key={n.path}
            to={n.path}
            className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none" }}
          >
            {n.label}
          </NavLink>
        ))}
        <div className="mono" style={{ fontSize: 11, color: "var(--muted)", paddingTop: 14 }}>
          <span style={{ color: "var(--accent)" }}>{time.toLocaleTimeString()}</span>
          {" — "}{time.toLocaleDateString()}
        </div>
      </div>
    </>
  );
};

export default Navbar;