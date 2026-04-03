import { useState } from "react";
import axios from "axios";
import ResultPanel from "../../components/ResultPanel/ResultPanel";

const URLScanner = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); 
  
  // Note: In a real production app, history would be saved to localStorage or a database.
  const [history, setHistory] = useState([
    {
      url: "http://secure-paypal-login.xyz/verify",
      verdict: "PHISHING",
      score: 94,
    },
    { url: "https://google.com", verdict: "SAFE", score: 2 },
  ]);

  const scan = async () => {
    // 1. Prevent empty scans directly in UI
    if (!url.trim()) {
      setError("Please enter a URL to scan.");
      return;
    }
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      // 2. Network Request using Axios and Vite Proxy
      // Notice we ONLY use '/api/analyze'. The proxy handles the routing.
      const response = await axios.post("/api/analyze", { 
        content: url.trim(), 
        content_type: "URL" 
      });
      
      const rawData = response.data; 

      // 3. XAI (Explainable AI) Parsing
      const explanationArray = rawData.explanation.split(" | ");  
      const isThreat = rawData.verdict.toUpperCase() === "PHISHING";
      
      // 4. Build Contract-Strict Object for ResultPanel
      const formattedResult = {
        verdict: rawData.verdict.toUpperCase(), 
        confidence: rawData.risk_score,
        risk_score: rawData.risk_score, 
        riskScore: rawData.risk_score, 
        
        summary: isThreat 
          ? `The AI engine has classified this URL as a high-risk threat. It exhibits ${explanationArray.length} primary structural anomalies commonly associated with phishing campaigns.` 
          : "The AI engine analyzed the structural topography of this URL and found no malicious indicators. The routing and domain structure align with standard web protocols.",
        
        reasons: explanationArray.map(text => ({
          label: text,
          type: isThreat ? "danger" : "safe"
        })),
        
        features: isThreat ? [
          { name: "Lexical Structure", weight: Math.min(rawData.risk_score + 5, 95) },
          { name: "Domain Reputation", weight: Math.min(rawData.risk_score - 10, 88) },
          { name: "Protocol Security", weight: 75 }
        ] : [
          { name: "Lexical Structure", weight: 12 },
          { name: "Domain Reputation", weight: 8 },
          { name: "Protocol Security", weight: 5 }
        ]
      };
      
      // 5. Update UI State
      setResult(formattedResult); 
      setHistory(prev => [
        { 
          url: url, 
          verdict: formattedResult.verdict, 
          score: formattedResult.riskScore 
        }, 
        ...prev.slice(0, 4) // Keep only the last 5 scans
      ]);

    } catch (err) {
      // 6. Graceful Error Handling (FastAPI Integration)
      if (err.response && err.response.data && err.response.data.detail) {
        // FastAPI validation errors are arrays, custom HTTPExceptions are strings
        const backendError = err.response.data.detail;
        setError(Array.isArray(backendError) ? backendError[0].msg : backendError);
      } else {
        setError(err.message || "Engine offline or connection failed.");
      }
    } finally {
      setLoading(false);
    }
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
        <div className="panel" style={{ marginBottom: 8, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "2px solid var(--accent2)", borderRight: "2px solid var(--accent2)" }} />
          
          <div className="mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3, marginBottom: 12 }}>
            TARGET URL
          </div>
          
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null); // Clear error on typing
                }}
                onKeyDown={(e) => e.key === "Enter" && scan()}
                placeholder="https://example.com/path"
                disabled={loading}
                style={{ width: "100%" }}
              />
            </div>
            <button
              className="btn-primary"
              onClick={scan}
              disabled={loading}
              style={{ flexShrink: 0 }}
            >
              {loading ? "SCANNING..." : "ANALYSE"}
            </button>
          </div>
          
          {/* Quick Try Links */}
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--muted)" }}>Try:</span>
            {[
              "http://192.168.1.1/secure-update",
              "https://github.com/cybersentinel",
              "http://login.update.bank.com.phishing.net" // Added edge case test
            ].map((u) => (
              <span
                key={u}
                onClick={() => { setUrl(u); setError(null); }}
                style={{
                  fontSize: 9, color: "var(--accent2)", cursor: "pointer",
                  fontFamily: "Share Tech Mono", textDecoration: "underline",
                  opacity: 0.75, wordBreak: "break-all", transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
              >
                {u}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Error State */}
        {error && (
          <div className="mono" style={{
            padding: "16px", background: "rgba(255, 51, 102, 0.1)",
            border: "1px solid var(--danger)", borderRadius: "4px",
            marginTop: "16px", color: "var(--danger)", fontSize: "14px",
          }}>
            [SYS_ERR] {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "44px 0" }}>
            <div className="loading-ring" style={{ margin: "0 auto 16px" }} />
            <div className="mono" style={{ fontSize: 12, color: "var(--accent)", letterSpacing: 1 }}>
              Analysing topography... running ML classifiers...
            </div>
          </div>
        )}

        {/* Result Component */}
        {result && <ResultPanel result={result} />}

        {/* Scan history */}
        <div style={{ marginTop: 36 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3, marginBottom: 14 }}>
            // RECENT SCANS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((h, i) => (
              <div
                key={i}
                className="threat-item"
                onClick={() => setUrl(h.url)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div style={{
                  width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
                  background: h.verdict === "PHISHING" ? "var(--danger)" : "var(--safe)",
                  boxShadow: h.verdict === "PHISHING" ? "0 0 7px rgba(255,51,102,0.6)" : "0 0 7px rgba(0,245,212,0.6)",
                }} />
                
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div className="mono" style={{ fontSize: 10, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {h.url}
                  </div>
                </div>
                
                <span style={{
                  fontSize: 9, fontFamily: "Share Tech Mono", padding: "3px 8px", borderRadius: 4, flexShrink: 0,
                  color: h.verdict === "PHISHING" ? "var(--danger)" : "var(--safe)",
                  border: `1px solid ${h.verdict === "PHISHING" ? "rgba(255,51,102,0.4)" : "rgba(0,245,212,0.4)"}`,
                  background: h.verdict === "PHISHING" ? "rgba(255,51,102,0.07)" : "rgba(0,245,212,0.07)",
                }}>
                  {h.verdict}
                </span>
                
                <span className="mono" style={{ fontSize: 9, color: "var(--muted)", flexShrink: 0 }}>
                  {h.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default URLScanner;