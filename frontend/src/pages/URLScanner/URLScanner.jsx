import { useState } from "react";
import ResultPanel from "../../components/ResultPanel/ResultPanel";
import { mockPhishing, mockSafe, isPhishingURL } from "../../data/mockData";

const URLScanner = () => {
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [history, setHistory] = useState([
    { url: "http://secure-paypal-login.xyz/verify", verdict: "PHISHING", score: 94 },
    { url: "https://google.com",                    verdict: "SAFE",     score: 2  },
    { url: "http://amaz0n-offers.net/claim",         verdict: "PHISHING", score: 87 },
  ]);

  const scan = () => {
    if (!url.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const r = isPhishingURL(url) ? mockPhishing : mockSafe;
      setResult(r);
      setHistory(p => [{ url, verdict: r.verdict, score: r.riskScore }, ...p.slice(0, 4)]);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="page-wrap grid-bg">
      <div className="page-container-sm">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--accent)", letterSpacing: 4, marginBottom: 6 }}>
            // MODULE: URL ANALYSIS ENGINE
          </div>
          <h1 className="orbitron" style={{ fontSize: "clamp(22px,5vw,30px)", color: "white", marginBottom: 8 }}>
            URL Scanner
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            Paste any URL to analyse structural and semantic phishing indicators in real-time.
          </p>
        </div>

        {/* Input panel */}
        <div className="panel" style={{ marginBottom: 8 }}>
          {/* Decorative corners */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "2px solid var(--accent2)", borderRight: "2px solid var(--accent2)" }} />

          <div className="mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3, marginBottom: 12 }}>TARGET URL</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && scan()}
                placeholder="https://example.com/path"
              />
            </div>
            <button className="btn-primary" onClick={scan} disabled={loading} style={{ flexShrink: 0 }}>
              {loading ? "SCANNING..." : "ANALYSE"}
            </button>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--muted)" }}>Try:</span>
            {["http://secure-paypal.xyz/verify", "https://google.com"].map(u => (
              <span key={u} onClick={() => setUrl(u)} style={{
                fontSize: 9, color: "var(--accent2)", cursor: "pointer",
                fontFamily: "Share Tech Mono", textDecoration: "underline",
                opacity: 0.75, wordBreak: "break-all",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0.75"}
              >
                {u}
              </span>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "44px 0" }}>
            <div className="loading-ring" style={{ margin: "0 auto 16px" }} />
            <div className="mono" style={{ fontSize: 12, color: "var(--accent)", letterSpacing: 1 }}>
              Analysing URL structure... running ML classifiers...
            </div>
          </div>
        )}

        {/* Result */}
        <ResultPanel result={result} />

        {/* Scan history */}
        <div style={{ marginTop: 36 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3, marginBottom: 14 }}>
            // RECENT SCANS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((h, i) => (
              <div key={i} className="threat-item" onClick={() => setUrl(h.url)}>
                <div style={{
                  width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
                  background: h.verdict === "PHISHING" ? "var(--danger)" : "var(--safe)",
                  boxShadow: h.verdict === "PHISHING"
                    ? "0 0 7px rgba(255,51,102,0.6)"
                    : "0 0 7px rgba(0,245,212,0.6)",
                }} />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div className="mono" style={{
                    fontSize: 10, color: "var(--text)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {h.url}
                  </div>
                </div>
                <span style={{
                  fontSize: 9, fontFamily: "Share Tech Mono",
                  padding: "3px 8px", borderRadius: 4, flexShrink: 0,
                  color: h.verdict === "PHISHING" ? "var(--danger)" : "var(--safe)",
                  border: `1px solid ${h.verdict === "PHISHING" ? "rgba(255,51,102,0.4)" : "rgba(0,245,212,0.4)"}`,
                  background: h.verdict === "PHISHING" ? "rgba(255,51,102,0.07)" : "rgba(0,245,212,0.07)",
                }}>
                  {h.verdict}
                </span>
                <span className="mono" style={{ fontSize: 9, color: "var(--muted)", flexShrink: 0 }}>{h.score}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default URLScanner;