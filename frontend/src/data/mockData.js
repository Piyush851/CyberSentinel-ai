export const mockPhishing = {
  verdict: "PHISHING", confidence: 97, riskScore: 94,
  reasons: [
    { type: "danger", label: "Suspicious TLD (.xyz)" },
    { type: "danger", label: "Brand impersonation" },
    { type: "danger", label: "Non-HTTPS protocol" },
    { type: "warn",   label: "Urgent language" },
    { type: "warn",   label: "High URL entropy" },
  ],
  summary: "This URL exhibits multiple high-confidence phishing indicators. The domain mimics PayPal using a deceptive subdomain structure with a low-reputation TLD. The absence of HTTPS combined with a /verify path strongly suggests a credential harvesting page.",
  features: [
    { name: "URL Length",      weight: 72 },
    { name: "Domain Entropy",  weight: 85 },
    { name: "TLD Risk",        weight: 91 },
    { name: "HTTPS Status",    weight: 95 },
    { name: "Brand Similarity",weight: 88 },
  ],
};

export const mockSafe = {
  verdict: "SAFE", confidence: 99, riskScore: 3,
  reasons: [
    { type: "safe", label: "Valid HTTPS certificate" },
    { type: "safe", label: "Known trusted domain" },
    { type: "safe", label: "Low URL entropy" },
    { type: "safe", label: "No suspicious patterns" },
  ],
  summary: "This URL passes all security checks. The domain is registered to a well-known trusted entity with a valid SSL certificate. No suspicious patterns, unusual subdomains, or deceptive characters detected.",
  features: [
    { name: "URL Length",      weight: 5 },
    { name: "Domain Entropy",  weight: 8 },
    { name: "TLD Risk",        weight: 2 },
    { name: "HTTPS Status",    weight: 1 },
    { name: "Brand Similarity",weight: 4 },
  ],
};

export const isPhishingURL = (u) =>
  /xyz|http:\/\/|login\.|verify|amaz0n|\.net\//.test(u);