import { useState } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import URLScanner from "./pages/URLScanner/URLScanner";
import SMSScanner from "./pages/SMSScanner/SMSScanner";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <GlobalStyles />
      <div className="scanline" />
      <Navbar page={page} setPage={setPage} />
      {page === "home"        && <HomePage    setPage={setPage} />}
      {page === "url-scanner" && <URLScanner />}
      {page === "sms-scanner" && <SMSScanner />}
      {page === "dashboard"   && <Dashboard />}
    </div>
  );
}