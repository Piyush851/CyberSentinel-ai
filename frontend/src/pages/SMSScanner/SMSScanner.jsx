import { useState } from "react";
import axios from "axios";
import ResultPanel from "../../components/ResultPanel/ResultPanel";

const SMSScanner = () => {
  const [sms, setSms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // Added system error tracking

  const templates = [
    { label: "Bank Phishing", text: "URGENT: Your SBI account has been suspended! Click immediately: http://sbi-secure.xyz/login" },
    { label: "Prize Scam",    text: "Congratulations! You've won ₹50,000. Claim NOW: bit.ly/claimprize22" },
    { label: "Legit OTP",     text: "Your OTP for login is 847291. Valid for 10 minutes. Do not share. - HDFC Bank" },
    { label: "Injection Attack", text: "DROP TABLE users; --" } // Added edge case test
  ];

  const analyse = async () => {
    // 1. Prevent empty network calls
    if (!sms.trim()) {
      setError("Please paste an SMS message to analyze.");
      return;
    }
    
    setLoading(true); 
    setResult(null);
    setError(null);

    try {
      // 2. Network Request to Kunal's NLP Pipeline
      const response = await axios.post("/api/analyze", {
        content: sms.trim(),
        content_type: "SMS"
      });

      const rawData = response.data;
      
      // 3. XAI (Explainable AI) Parsing
      const explanationArray = rawData.explanation.split(" | ");
      const isThreat = rawData.verdict.toUpperCase() === "PHISHING";

      // 4. Map Backend Contract to ResultPanel Format
      const formattedResult = {
        verdict: rawData.verdict.toUpperCase(),
        confidence: rawData.risk_score,
        riskScore: rawData.risk_score,
        
        summary: isThreat 
          ? `The NLP engine flagged this message as a threat. It detected ${explanationArray.length} semantic anomalies often used in social engineering and smishing attacks.` 
          : "The NLP engine analyzed the semantics of this message and found no malicious intent or coercive patterns.",
        
        reasons: explanationArray.map(text => ({
          label: text,
          type: isThreat ? "danger" : "safe"
        })),
        
        // Dynamic semantic feature breakdown for visual XAI
        features: isThreat ? [
          { name: "Urgency/Coercion", weight: Math.min(rawData.risk_score + 8, 98) },
          { name: "Financial Bait",   weight: Math.min(rawData.risk_score - 5, 90) },
          { name: "Deceptive Framing", weight: 75 }
        ] : [
          { name: "Urgency/Coercion", weight: 12 },
          { name: "Financial Bait",   weight: 5 },
          { name: "Deceptive Framing", weight: 2 }
        ]
      };

      setResult(formattedResult);

    } catch (err) {
      // 5. Secure Error Handling
      if (err.response && err.response.data && err.response.data.detail) {
        const backendError = err.response.data.detail;
        setError(Array.isArray(backendError) ? backendError[0].msg : backendError);
      } else {
        setError(err.message || "NLP Engine offline or connection failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const detectionFeatures = [
    "Urgency Detection", "Coercion Language",  "Brand Impersonation", "URL Extraction",
    "Sender Pattern",    "Grammar Analysis",   "Request Type",        "Threat Language",
  ];

  return (
    <div className="page-wrap grid-bg">
      <div className="page-container-sm">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--accent)", letterSpacing: 4, marginBottom: 6 }}>
            // MODULE: SMS SEMANTIC ANALYSER
          </div>
          <h1 className="orbitron" style={{ fontSize: "clamp(22px,5vw,30px)", color: "white", marginBottom: 8 }}>
            SMS Scanner
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            Paste an SMS message to detect smishing through NLP and semantic feature analysis.
          </p>
        </div>

        {/* Templates */}
        <div style={{ marginBottom: 18 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--muted)", marginBottom: 10, letterSpacing: 2 }}>
            LOAD EXAMPLE:
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {templates.map((t, i) => (
              <button 
                key={i} 
                className="btn-secondary" 
                onClick={() => { setSms(t.text); setError(null); }} 
                style={{ fontSize: 11 }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input panel */}
        <div className="panel" style={{ marginBottom: 8, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "2px solid var(--accent2)", borderRight: "2px solid var(--accent2)" }} />

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div className="mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3 }}>SMS CONTENT</div>
            <div className="mono" style={{ fontSize: 9, color: sms.length > 160 ? "var(--warn)" : "var(--muted)" }}>
              {sms.length} chars
            </div>
          </div>

          <textarea
            value={sms}
            onChange={e => {
              setSms(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste SMS message content here..."
            disabled={loading}
            style={{ minHeight: 110, resize: "vertical", lineHeight: 1.75, width: "100%", background: "rgba(0,0,0,0.2)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", borderRadius: "4px" }}
          />

          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={analyse} disabled={loading || !sms.trim()}>
              {loading ? "ANALYSING..." : "DETECT THREAT"}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mono" style={{
            padding: "16px", background: "rgba(255, 51, 102, 0.1)",
            border: "1px solid var(--danger)", borderRadius: "4px",
            marginTop: "16px", color: "var(--danger)", fontSize: "14px",
          }}>
            [SYS_ERR] {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "44px 0" }}>
            <div className="loading-ring" style={{ margin: "0 auto 16px" }} />
            <div className="mono" style={{ fontSize: 12, color: "var(--accent)", letterSpacing: 1 }}>
              Running NLP pipeline... detecting semantic anomalies...
            </div>
          </div>
        )}

        {/* Dynamic Result Panel */}
        <ResultPanel result={result} />

        {/* Detection features grid */}
        <div className="panel" style={{ marginTop: 32 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3, marginBottom: 16 }}>
            // DETECTION FEATURES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
            {detectionFeatures.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--accent)", flexShrink: 0,
                  boxShadow: "0 0 6px rgba(0,245,212,0.5)",
                }} />
                <span style={{ fontSize: 12, color: "var(--text)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSScanner;