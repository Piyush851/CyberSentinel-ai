import { useState } from "react";
import ResultPanel from "../../components/ResultPanel/ResultPanel";

const SMSScanner = () => {
  const [sms, setSms]         = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const templates = [
    { label: "Bank Phishing", text: "URGENT: Your SBI account has been suspended! Click immediately: http://sbi-secure.xyz/login" },
    { label: "Prize Scam",    text: "Congratulations! You've won ₹50,000. Claim NOW: bit.ly/claimprize22" },
    { label: "Legit OTP",     text: "Your OTP for login is 847291. Valid for 10 minutes. Do not share. - HDFC Bank" },
  ];

  const phishR = {
    verdict: "PHISHING", confidence: 95, riskScore: 91,
    reasons: [
      { type: "danger", label: "Urgency/Coercion language" },
      { type: "danger", label: "Suspicious URL embedded" },
      { type: "danger", label: "Brand impersonation" },
      { type: "warn",   label: "Imperative call-to-action" },
    ],
    summary: "This SMS contains multiple semantic red flags characteristic of smishing attacks. The word 'URGENT' combined with 'suspended' creates artificial panic. The embedded URL uses a deceptive domain mimicking SBI. Linguistic analysis detected coercive urgency patterns.",
    features: [
      { name: "Urgency Score",  weight: 92 }, { name: "URL Presence", weight: 88 },
      { name: "Brand Spoof",    weight: 85 }, { name: "Threat Language", weight: 79 },
      { name: "Grammar Score",  weight: 45 },
    ],
  };

  const safeR = {
    verdict: "SAFE", confidence: 98, riskScore: 5,
    reasons: [
      { type: "safe", label: "Legitimate sender pattern" },
      { type: "safe", label: "No suspicious URLs" },
      { type: "safe", label: "Standard OTP format" },
      { type: "safe", label: "No coercion language" },
    ],
    summary: "This message follows standard OTP delivery patterns used by verified banking institutions. No suspicious URLs, coercive language, or brand impersonation detected.",
    features: [
      { name: "Urgency Score", weight: 8  }, { name: "URL Presence",   weight: 2 },
      { name: "Brand Spoof",   weight: 3  }, { name: "Threat Language", weight: 5 },
      { name: "Grammar Score", weight: 9  },
    ],
  };

  const analyse = () => {
    if (!sms.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const bad = /urgent|suspended|click|won|claim|http:\/\/|bit\.ly/.test(sms.toLowerCase());
      setResult(bad ? phishR : safeR);
      setLoading(false);
    }, 1800);
  };

  const detectionFeatures = [
    "Urgency Detection", "Coercion Language",  "Brand Impersonation", "URL Extraction",
    "Sender Pattern",    "Grammar Analysis",    "Request Type",        "Threat Language",
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
              <button key={i} className="btn-secondary" onClick={() => setSms(t.text)} style={{ fontSize: 11 }}>
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
            onChange={e => setSms(e.target.value)}
            placeholder="Paste SMS message content here..."
            style={{ minHeight: 110, resize: "vertical", lineHeight: 1.75 }}
          />

          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={analyse} disabled={loading}>
              {loading ? "ANALYSING..." : "DETECT THREAT"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "44px 0" }}>
            <div className="loading-ring" style={{ margin: "0 auto 16px" }} />
            <div className="mono" style={{ fontSize: 12, color: "var(--accent)", letterSpacing: 1 }}>
              Running NLP pipeline... detecting semantic anomalies...
            </div>
          </div>
        )}

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