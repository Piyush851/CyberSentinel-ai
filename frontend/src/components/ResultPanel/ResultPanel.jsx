const ResultPanel = ({ result }) => {
  if (!result) return null;
  const isPhishing   = result.verdict === "PHISHING";
  const isSuspicious = result.verdict === "SUSPICIOUS";
  const color = isPhishing ? "var(--danger)" : isSuspicious ? "var(--warn)" : "var(--safe)";
  const colorRaw = isPhishing ? "#ff3366" : isSuspicious ? "#ffaa00" : "#00f5d4";
  const icon  = isPhishing ? "⚠️" : isSuspicious ? "⚡" : "✅";

  return (
    <div style={{
      marginTop: 24,
      background: "var(--surface)",
      border: `1px solid ${colorRaw}55`,
      borderRadius: 12,
      padding: "24px 22px",
      boxShadow: `0 0 40px ${colorRaw}14, 0 8px 32px rgba(0,0,0,0.4)`,
      animation: "fadeUp 0.45s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${colorRaw}, transparent)`,
      }} />

      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />

      {/* Header */}
      <div className="result-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 14 }}>
        <div>
          <div className="mono" style={{ fontSize: 9, color: "var(--muted)", marginBottom: 6, letterSpacing: 3 }}>// DETECTION RESULT</div>
          <div className="orbitron glitch-text" style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, color, lineHeight: 1 }}>
            {result.verdict}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, fontFamily: "Share Tech Mono" }}>
            Confidence: <span style={{ color }}>{result.confidence}%</span>
          </div>
        </div>
        <div style={{
          width: 64, height: 64, flexShrink: 0, borderRadius: "50%",
          border: `2px solid ${colorRaw}55`,
          background: `radial-gradient(circle, ${colorRaw}15, transparent)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 20px ${colorRaw}30`,
          fontSize: 26,
        }}>
          {icon}
        </div>
      </div>

      {/* Risk bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2 }}>RISK SCORE</span>
          <span className="mono" style={{ fontSize: 11, color, fontWeight: 700 }}>{result.riskScore} / 100</span>
        </div>
        <div className="risk-bar">
          <div className="risk-indicator" style={{ left: `${result.riskScore}%`, background: color }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span className="mono" style={{ fontSize: 8, color: "var(--safe)", opacity: 0.7 }}>SAFE</span>
          <span className="mono" style={{ fontSize: 8, color: "var(--warn)", opacity: 0.7 }}>SUSPICIOUS</span>
          <span className="mono" style={{ fontSize: 8, color: "var(--danger)", opacity: 0.7 }}>PHISHING</span>
        </div>
      </div>

      {/* XAI tags */}
      <div style={{ marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--muted)", marginBottom: 10, letterSpacing: 2 }}>// XAI EXPLANATION</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {result.reasons.map((r, i) => (
            <span key={i} className={`xai-tag ${r.type}`}>
              {r.type === "danger" ? "⚠" : r.type === "warn" ? "◆" : "✓"} {r.label}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: "rgba(1,11,18,0.7)",
        borderRadius: 8, padding: "14px 16px",
        border: "1px solid var(--border)",
        marginBottom: 20,
      }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--muted)", marginBottom: 8, letterSpacing: 2 }}>ANALYSIS SUMMARY</div>
        <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.85 }}>{result.summary}</p>
      </div>

      {/* Feature weights */}
      <div>
        <div className="mono" style={{ fontSize: 9, color: "var(--muted)", marginBottom: 12, letterSpacing: 2 }}>// FEATURE WEIGHTS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 120, fontSize: 10, color: "var(--muted)", fontFamily: "Share Tech Mono", flexShrink: 0 }}>{f.name}</div>
              <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  width: `${f.weight}%`,
                  height: "100%", borderRadius: 3,
                  background: f.weight > 70 ? "var(--danger)" : f.weight > 40 ? "var(--warn)" : "var(--safe)",
                  transition: "width 1.2s cubic-bezier(.34,1.56,.64,1)",
                  animation: "bar-grow 1s ease",
                  boxShadow: f.weight > 70 ? "0 0 8px rgba(255,51,102,0.5)" : f.weight > 40 ? "0 0 8px rgba(255,170,0,0.4)" : "0 0 8px rgba(0,245,212,0.4)",
                }} />
              </div>
              <span className="mono" style={{ fontSize: 9, color: "var(--muted)", width: 28, textAlign: "right", flexShrink: 0 }}>{f.weight}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;