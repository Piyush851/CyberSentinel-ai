const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #010b12;
      --surface: #04111d;
      --surface2: #071826;
      --border: #0d2d44;
      --border-bright: #1a4d6e;
      --accent: #00f5d4;
      --accent2: #0099ff;
      --danger: #ff3366;
      --warn: #ffaa00;
      --safe: #00f5d4;
      --text: #c8e6f5;
      --muted: #4a7a99;
      --nav-h: 64px;
      --max-w: 1160px;
      --page-px: clamp(16px, 4vw, 48px);
    }

    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Rajdhani', sans-serif;
      overflow-x: hidden;
    }

    /* ── CENTERING SYSTEM ── */
    .page-wrap {
      width: 100%;
      min-height: 100vh;
      padding-top: var(--nav-h);
    }
    .page-container {
      max-width: var(--max-w);
      margin: 0 auto;
      padding: 40px var(--page-px) 80px;
      width: 100%;
    }
    .page-container-sm {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px var(--page-px) 80px;
      width: 100%;
    }

    /* ── KEYFRAMES ── */
    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes fadeUp {
      from { opacity:0; transform: translateY(28px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @keyframes glitch {
      0%  { text-shadow: 3px 0 var(--danger), -3px 0 var(--accent2); }
      20% { text-shadow: -3px 0 var(--danger), 3px 0 var(--accent2); }
      60% { text-shadow: 3px 3px var(--danger), -3px -3px var(--accent2); }
      80% { text-shadow: -1px 0 var(--danger), 1px 0 var(--accent2); }
      100%{ text-shadow: none; }
    }
    @keyframes spin  { to { transform: rotate(360deg); } }
    @keyframes radar { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes matrix-fall {
      0%   { transform: translateY(-100%); opacity: 0.7; }
      100% { transform: translateY(100vh);  opacity: 0;   }
    }
    @keyframes bar-grow { from { width: 0; } }
    @keyframes glow-pulse {
      0%,100% { box-shadow: 0 0 8px rgba(0,245,212,0.2); }
      50%      { box-shadow: 0 0 24px rgba(0,245,212,0.5); }
    }
    @keyframes slide-in {
      from { opacity:0; transform: translateX(-12px); }
      to   { opacity:1; transform: translateX(0); }
    }

    /* ── UTILITY ── */
    .scanline {
      position: fixed; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(transparent, var(--accent), transparent);
      opacity: 0.1; pointer-events: none; z-index: 9999;
      animation: scanline 8s linear infinite;
    }
    .glitch-text { animation: glitch 4s infinite; }
    .fade-up     { animation: fadeUp 0.7s ease forwards; }
    .mono        { font-family: 'Share Tech Mono', monospace; }
    .orbitron    { font-family: 'Orbitron', monospace; }

    .grid-bg {
      background-image:
        linear-gradient(rgba(0,245,212,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,245,212,0.025) 1px, transparent 1px);
      background-size: 44px 44px;
    }

    /* ── INPUTS ── */
    input, textarea {
      background: rgba(4,17,29,0.95);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: 'Share Tech Mono', monospace;
      font-size: 14px;
      padding: 14px 16px;
      width: 100%;
      outline: none;
      border-radius: 6px;
      transition: border-color 0.25s, box-shadow 0.25s;
      -webkit-appearance: none;
    }
    input:focus, textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(0,245,212,0.07), 0 0 16px rgba(0,245,212,0.13);
    }
    input::placeholder, textarea::placeholder { color: var(--muted); opacity: 0.6; }

    /* ── BUTTONS ── */
    .btn-primary {
      background: linear-gradient(135deg, rgba(0,245,212,0.13), rgba(0,153,255,0.08));
      border: 1px solid var(--accent);
      color: var(--accent);
      font-family: 'Orbitron', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2.5px;
      padding: 14px 32px;
      cursor: pointer;
      transition: all 0.25s;
      clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
      text-transform: uppercase;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(0,245,212,0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.45s;
    }
    .btn-primary:hover::after { transform: translateX(100%); }
    .btn-primary:hover {
      background: linear-gradient(135deg, rgba(0,245,212,0.25), rgba(0,153,255,0.15));
      box-shadow: 0 0 28px rgba(0,245,212,0.28), 0 4px 20px rgba(0,0,0,0.5);
      transform: translateY(-2px);
    }
    .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      font-family: 'Rajdhani', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      cursor: pointer;
      transition: all 0.25s;
      border-radius: 5px;
      letter-spacing: 1px;
      white-space: nowrap;
    }
    .btn-secondary:hover { border-color: var(--accent2); color: var(--accent2); background: rgba(0,153,255,0.04); }
    .btn-secondary.active { border-color: var(--accent); color: var(--accent); background: rgba(0,245,212,0.05); }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    /* ── RISK BAR ── */
    .risk-bar {
      height: 7px; border-radius: 4px;
      background: linear-gradient(90deg, var(--safe), var(--warn), var(--danger));
      position: relative;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.4);
    }
    .risk-indicator {
      position: absolute; top: -5px; width: 17px; height: 17px;
      border-radius: 50%; border: 2px solid white;
      transform: translateX(-50%);
      transition: left 1.2s cubic-bezier(.34,1.56,.64,1);
      box-shadow: 0 0 10px rgba(255,255,255,0.35);
    }

    /* ── NAV ── */
    .nav-link {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600; font-size: 12px; letter-spacing: 2px;
      color: var(--muted); cursor: pointer;
      padding: 6px 0; border-bottom: 2px solid transparent;
      transition: all 0.25s; text-transform: uppercase;
      background: none; border-top: none; border-left: none; border-right: none;
    }
    .nav-link:hover { color: var(--accent); }
    .nav-link.active { color: var(--accent); border-bottom-color: var(--accent); }

    .mobile-nav-link {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600; font-size: 16px; letter-spacing: 2px;
      color: var(--muted); cursor: pointer;
      padding: 14px 0; border-bottom: 1px solid var(--border);
      transition: color 0.25s; text-transform: uppercase;
      display: block; width: 100%;
      background: none; border-top: none; border-left: none; border-right: none; text-align: left;
    }
    .mobile-nav-link:hover, .mobile-nav-link.active { color: var(--accent); }

    /* ── CARDS ── */
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 22px 16px;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      border-color: #1a4d6e;
      box-shadow: 0 12px 36px rgba(0,0,0,0.45), 0 0 20px rgba(0,245,212,0.07);
    }
    .stat-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--accent2), var(--accent));
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 22px 20px;
      position: relative;
    }
    .panel-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px; color: var(--muted);
      letter-spacing: 3px; text-transform: uppercase;
      margin-bottom: 16px;
    }

    /* ── THREAT ITEMS ── */
    .threat-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 7px;
      padding: 12px 14px;
      display: flex; align-items: center; gap: 10px;
      transition: all 0.22s; cursor: pointer;
    }
    .threat-item:hover {
      border-color: rgba(255,51,102,0.45);
      background: rgba(255,51,102,0.04);
      transform: translateX(4px);
    }

    /* ── XAI TAGS ── */
    .xai-tag {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,51,102,0.08);
      border: 1px solid rgba(255,51,102,0.35);
      color: var(--danger);
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px; padding: 5px 10px; border-radius: 4px;
      transition: background 0.2s;
    }
    .xai-tag:hover { background: rgba(255,51,102,0.14); }
    .xai-tag.warn { background: rgba(255,170,0,0.08); border-color: rgba(255,170,0,0.35); color: var(--warn); }
    .xai-tag.warn:hover { background: rgba(255,170,0,0.14); }
    .xai-tag.safe { background: rgba(0,245,212,0.08); border-color: rgba(0,245,212,0.35); color: var(--safe); }
    .xai-tag.safe:hover { background: rgba(0,245,212,0.14); }

    /* ── LOADING ── */
    .loading-ring {
      width: 56px; height: 56px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-right-color: rgba(0,245,212,0.3);
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    /* ── MATRIX ── */
    .matrix-char {
      position: absolute; color: var(--accent);
      font-family: 'Share Tech Mono', monospace;
      opacity: 0.16;
      pointer-events: none;
      animation: matrix-fall linear infinite;
    }

    /* ── HAMBURGER ── */
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      cursor: pointer; padding: 4px; background: none; border: none;
    }
    .hamburger span {
      display: block; width: 22px; height: 2px;
      background: var(--accent); border-radius: 2px; transition: all 0.3s;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .hamburger        { display: flex; }
      .desktop-nav      { display: none !important; }
      .desktop-clock    { display: none !important; }
      .hero-btns        { flex-direction: column !important; width: 100%; max-width: 320px; }
      .hero-btns button { width: 100%; text-align: center; }
      .dashboard-charts { grid-template-columns: 1fr !important; }
      .result-header    { flex-direction: column !important; gap: 14px !important; }
      .threat-time      { display: none !important; }
    }
    @media (max-width: 480px) {
      :root { --nav-h: 56px; }
      .stat-card   { padding: 14px 12px; }
      .btn-primary { padding: 12px 20px; font-size: 10px; }
      .hero-alert  { flex-direction: column !important; text-align: center; }
      input, textarea { font-size: 13px; padding: 12px 14px; }
      .reason-label { display: none; }
      .page-container, .page-container-sm { padding-top: 24px; padding-bottom: 56px; }
    }
    @media (min-width: 769px) {
      .mobile-menu-panel { display: none !important; }
    }
  `}</style>
);

export default GlobalStyles;