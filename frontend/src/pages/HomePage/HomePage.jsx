import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // IMPORT ROUTER HOOK
import MatrixRain from "../../components/MatrixRain/MatrixRain";

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [typed, setTyped] = useState("");
  const fullText = "Detecting threats. Explaining decisions. Protecting humans.";

  // Typewriter Effect
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(fullText.slice(0, i++));
      if (i > fullText.length) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, [fullText]);

  const stats = [
    { label: "Threats Detected", value: "2.4M+",  icon: "⚡", color: "var(--accent2)" },
    { label: "Accuracy Rate",    value: "99.2%",  icon: "🎯", color: "var(--accent)"  },
    { label: "Avg Response",     value: "<80ms",  icon: "⏱",  color: "var(--warn)"   },
    { label: "Zero-Day Caught",  value: "14.8K",  icon: "🔴", color: "var(--danger)" },
  ];

  const features = [
    { title: "Real-Time Detection",  desc: "ML classifiers analyse URLs and SMS in under 80ms for instant threat assessment.", icon: "⚡" },
    { title: "Explainable AI (XAI)", desc: "Every decision broken down into human-readable risk factors — no black boxes.", icon: "🧠" },
    { title: "Zero-Day Protection",  desc: "Structural & semantic analysis catches novel phishing patterns never seen before.", icon: "🛡" },
    { title: "Digital Literacy",     desc: "Educates users with transparent reasoning to build security awareness.", icon: "📚" },
  ];

  return (
    <div className="page-wrap grid-bg">
      <MatrixRain />

      {/* ── HERO SECTION ── */}
      <section style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "calc(100vh - var(--nav-h))",
        textAlign: "center",
        padding: "56px var(--page-px) 48px",
      }}>
        
        {/* Radar rings (Decorative) */}
        <div aria-hidden="true" style={{
          position: "absolute",
          width: "min(520px, 88vw)", height: "min(520px, 88vw)",
          opacity: 0.05, pointerEvents: "none",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }}>
          {[1, 0.67, 0.36].map((s, i) => (
            <div key={i} style={{
              position: "absolute",
              inset: `${(1 - s) * 50}%`,
              border: "1px solid var(--accent)", borderRadius: "50%",
            }} />
          ))}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "conic-gradient(from 0deg, transparent 0%, rgba(0,245,212,0.55) 10%, transparent 22%)",
            animation: "radar 4s linear infinite",
          }} />
        </div>

        <div className="fade-up mono" style={{
          color: "var(--accent)", fontSize: 10, letterSpacing: 4,
          marginBottom: 16, opacity: 0.8,
        }}>
          [ SYSTEM ACTIVE ] — THREAT INTELLIGENCE ONLINE
        </div>

        <h1 className="orbitron glitch-text fade-up" style={{
          fontSize: "clamp(38px, 9vw, 88px)",
          fontWeight: 900, lineHeight: 1.05,
          color: "white", marginBottom: 22,
        }}>
          CYBER<br />
          <span style={{ color: "var(--accent)" }}>SENTINEL</span>
          <span style={{ color: "var(--accent2)" }}> AI</span>
        </h1>

        {/* Accessibility Fix: Screen readers read the aria-label immediately, ignoring the typing animation */}
        <p 
          className="mono fade-up" 
          aria-label={fullText}
          style={{
            fontSize: "clamp(11px, 2.2vw, 14px)",
            color: "var(--text)", maxWidth: 500,
            lineHeight: 2, marginBottom: 36, minHeight: 44,
          }}
        >
          <span aria-hidden="true">{typed}</span>
          <span aria-hidden="true" style={{ animation: "blink 1s infinite" }}>|</span>
        </p>

        {/* Upgraded Routing Buttons */}
        <div className="hero-btns fade-up" style={{
          display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        }}>
          <button className="btn-primary" onClick={() => navigate("/url-scanner")}>Scan URL</button>
          <button className="btn-secondary" onClick={() => navigate("/sms-scanner")}>Analyse SMS</button>
          <button className="btn-secondary" onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>

        {/* Threat alert banner */}
        <div className="hero-alert fade-up" role="alert" style={{
          marginTop: 48, display: "flex", alignItems: "center", gap: 10,
          flexWrap: "wrap", justifyContent: "center",
          background: "rgba(255,51,102,0.06)", border: "1px solid rgba(255,51,102,0.25)",
          padding: "11px 18px", borderRadius: 7, maxWidth: 540,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--danger)", animation: "blink 1s infinite", flexShrink: 0,
          }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--danger)" }}>GLOBAL THREAT LEVEL: ELEVATED</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>— 347 new phishing domains today</span>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section style={{ position: "relative", zIndex: 1 }}>
        <div className="page-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16, marginBottom: 28,
          }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: "center" }}>
                <div aria-hidden="true" style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                <div className="orbitron" style={{
                  fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, color: s.color, marginBottom: 5,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section style={{ position: "relative", zIndex: 1 }}>
        <div className="page-container" style={{ paddingTop: 0 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--accent)", letterSpacing: 4, marginBottom: 8 }}>
            // capabilities
          </div>
          <h2 className="orbitron" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "white", marginBottom: 24 }}>
            Core Modules
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16,
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "22px 18px", transition: "all 0.28s",
                position: "relative", overflow: "hidden",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--border-bright)";
                  e.currentTarget.style.transform   = "translateY(-4px)";
                  e.currentTarget.style.boxShadow   = "0 12px 32px rgba(0,0,0,0.4), 0 0 16px rgba(0,245,212,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform   = "";
                  e.currentTarget.style.boxShadow   = "";
                }}
              >
                <div aria-hidden="true" style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                <h3 className="orbitron" style={{ fontSize: 11, color: "var(--accent)", marginBottom: 8, letterSpacing: 1.5, margin: 0, paddingBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;