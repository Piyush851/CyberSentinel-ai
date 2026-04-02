const Dashboard = () => {
    const threats = [
      { time: "14:32:11", type: "URL", verdict: "PHISHING",   target: "paypal-secure.xyz",           score: 94 },
      { time: "14:28:05", type: "SMS", verdict: "PHISHING",   target: "URGENT: Account suspended...", score: 89 },
      { time: "14:15:33", type: "URL", verdict: "SAFE",       target: "github.com",                  score: 2  },
      { time: "14:09:48", type: "SMS", verdict: "SUSPICIOUS", target: "Claim your reward now...",     score: 61 },
      { time: "13:55:22", type: "URL", verdict: "PHISHING",   target: "amazon-login-verify.net",      score: 97 },
      { time: "13:41:17", type: "URL", verdict: "SAFE",       target: "stackoverflow.com",            score: 1  },
    ];
    const reasons = [
      { label: "Suspicious TLD",      count: 847, pct: 85 },
      { label: "Brand Impersonation", count: 712, pct: 71 },
      { label: "Urgency Language",    count: 634, pct: 63 },
      { label: "No HTTPS",            count: 521, pct: 52 },
      { label: "High URL Entropy",    count: 398, pct: 40 },
      { label: "Embedded Redirect",   count: 287, pct: 29 },
    ];
    const daily  = [62, 48, 74, 89, 55, 71, 93, 67, 82, 78, 91, 85, 69, 73];
    const maxV   = Math.max(...daily);
  
    const verdictColor = (v) =>
      v === "PHISHING" ? "var(--danger)" : v === "SUSPICIOUS" ? "var(--warn)" : "var(--safe)";
    const verdictBg    = (v) =>
      v === "PHISHING" ? "rgba(255,51,102,0.08)" : v === "SUSPICIOUS" ? "rgba(255,170,0,0.08)" : "rgba(0,245,212,0.08)";
    const verdictBorder = (v) =>
      v === "PHISHING" ? "rgba(255,51,102,0.35)" : v === "SUSPICIOUS" ? "rgba(255,170,0,0.35)" : "rgba(0,245,212,0.35)";
  
    return (
      <div className="page-wrap grid-bg">
        <div className="page-container">
  
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div className="mono" style={{ fontSize: 9, color: "var(--accent)", letterSpacing: 4, marginBottom: 6 }}>
              // THREAT INTELLIGENCE DASHBOARD
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
              <h1 className="orbitron" style={{ fontSize: "clamp(22px,5vw,30px)", color: "white" }}>Dashboard</h1>
              <div className="mono" style={{ fontSize: 10, color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
                Last updated:&nbsp;<span style={{ color: "var(--accent)" }}>LIVE</span>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--accent)", display: "inline-block",
                  animation: "blink 1s infinite",
                  boxShadow: "0 0 8px rgba(0,245,212,0.7)",
                }} />
              </div>
            </div>
          </div>
  
          {/* Stat cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 14, marginBottom: 22,
          }}>
            {[
              { label: "Total Scanned",   value: "12,847", color: "var(--accent2)", icon: "🔍" },
              { label: "Threats Blocked", value: "1,293",  color: "var(--danger)",  icon: "🚫" },
              { label: "Suspicious",      value: "342",    color: "var(--warn)",    icon: "⚠️" },
              { label: "Safe",            value: "11,212", color: "var(--safe)",    icon: "✅" },
              { label: "Zero-Day Found",  value: "47",     color: "var(--danger)",  icon: "🔴" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div className="orbitron" style={{
                  fontSize: "clamp(16px, 3.5vw, 22px)",
                  fontWeight: 700, color: s.color, marginBottom: 4,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
  
          {/* Charts row */}
          <div className="dashboard-charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
  
            {/* Bar chart */}
            <div className="panel">
              <div className="panel-label">// THREAT ACTIVITY (14 DAYS)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 110 }}>
                {daily.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%" }}>
                    <div style={{
                      width: "100%",
                      height: `${(v / maxV) * 100}px`,
                      background: v > 80
                        ? "linear-gradient(to top, var(--danger), rgba(255,51,102,0.5))"
                        : v > 60
                          ? "linear-gradient(to top, var(--warn), rgba(255,170,0,0.5))"
                          : "linear-gradient(to top, var(--accent), rgba(0,245,212,0.4))",
                      borderRadius: "3px 3px 0 0",
                      opacity: 0.8, transition: "all 0.3s", cursor: "pointer",
                      boxShadow: v > 80 ? "0 0 8px rgba(255,51,102,0.3)" : v > 60 ? "0 0 8px rgba(255,170,0,0.2)" : "0 0 8px rgba(0,245,212,0.2)",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scaleY(1.04)"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = ""; }}
                      title={`Day ${i + 1}: ${v} threats`}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--muted)" }}>14d ago</span>
                <span className="mono" style={{ fontSize: 9, color: "var(--muted)" }}>Today</span>
              </div>
            </div>
  
            {/* Donut chart */}
            <div className="panel">
              <div className="panel-label">// VERDICT BREAKDOWN</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <svg viewBox="0 0 100 100" width="min(130px,30vw)" height="min(130px,30vw)" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--danger)" strokeWidth="14" strokeDasharray="23.9 238.8" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--warn)"   strokeWidth="14" strokeDasharray="8.1 238.8"  strokeDashoffset="-23.9" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--safe)"   strokeWidth="14" strokeDasharray="83.1 238.8" strokeDashoffset="-32" />
                </svg>
              </div>
              {[
                { label: "PHISHING",   pct: "10%",   color: "var(--danger)" },
                { label: "SUSPICIOUS", pct: "2.7%",  color: "var(--warn)"   },
                { label: "SAFE",       pct: "87.3%", color: "var(--safe)"   },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 2,
                    background: item.color, flexShrink: 0,
                    boxShadow: `0 0 6px ${item.color}88`,
                  }} />
                  <span style={{ fontSize: 12, color: "var(--text)", flex: 1 }}>{item.label}</span>
                  <span className="mono" style={{ fontSize: 12, color: item.color, fontWeight: 700 }}>{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
  
          {/* XAI Detection Reasons */}
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-label">// TOP XAI DETECTION REASONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {reasons.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="mono" style={{ fontSize: 9, color: "var(--muted)", width: 22, flexShrink: 0 }}>#{i + 1}</div>
                  <div className="reason-label" style={{ width: 160, fontSize: 12, color: "var(--text)", flexShrink: 0 }}>
                    {r.label}
                  </div>
                  <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden", minWidth: 30 }}>
                    <div style={{
                      width: `${r.pct}%`, height: "100%", borderRadius: 3,
                      background: "linear-gradient(90deg, var(--accent2), var(--accent))",
                      boxShadow: "0 0 8px rgba(0,245,212,0.35)",
                      animation: "bar-grow 1s ease",
                    }} />
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--muted)", width: 40, textAlign: "right", flexShrink: 0 }}>
                    {r.count.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Recent scan log */}
          <div className="panel">
            <div className="panel-label">// RECENT SCAN LOG</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {threats.map((t, i) => (
                <div key={i} className="threat-item">
                  <span className="threat-time mono" style={{ fontSize: 9, color: "var(--muted)", width: 64, flexShrink: 0 }}>
                    {t.time}
                  </span>
                  <span style={{
                    fontSize: 9,
                    color: t.type === "URL" ? "var(--accent2)" : "var(--warn)",
                    fontFamily: "Share Tech Mono",
                    border: "1px solid",
                    borderColor: t.type === "URL" ? "var(--accent2)" : "var(--warn)",
                    padding: "2px 6px", borderRadius: 3,
                    width: 34, textAlign: "center", flexShrink: 0,
                  }}>
                    {t.type}
                  </span>
                  <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
                    <span className="mono" style={{
                      fontSize: 10, color: "var(--text)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block",
                    }}>
                      {t.target}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: 9, color: "var(--muted)", flexShrink: 0 }}>
                    {t.score}%
                  </span>
                  <span style={{
                    fontSize: 9, padding: "3px 8px", borderRadius: 4,
                    fontFamily: "Share Tech Mono", flexShrink: 0,
                    color: verdictColor(t.verdict),
                    background: verdictBg(t.verdict),
                    border: `1px solid ${verdictBorder(t.verdict)}`,
                  }}>
                    {t.verdict}
                  </span>
                </div>
              ))}
            </div>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default Dashboard;