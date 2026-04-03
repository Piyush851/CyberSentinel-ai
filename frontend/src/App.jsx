import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import URLScanner from "./pages/URLScanner/URLScanner";
import SMSScanner from "./pages/SMSScanner/SMSScanner";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  return (
    <Router>
      {/* Moved inline styles to standard Tailwind/CSS logic where possible, 
        maintaining your custom CSS variables.
      */}
      <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
        <GlobalStyles />
        
        {/* Decorative scanline overlay (ensure this has pointer-events: none in CSS) */}
        <div className="scanline" />
        
        {/* Navbar no longer needs state, it will use React Router's <Link> */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/url-scanner" element={<URLScanner />} />
            <Route path="/sms-scanner" element={<SMSScanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Catch-all route for 404s */}
            <Route path="*" element={
              <div className="text-center text-red-500 mt-20">
                <h2>404 - Breach Detected (Page Not Found)</h2>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}