import os
import joblib
import re
import logging
import urllib.parse
from feature_extractor import extract_url_features


# Standardize logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class ThreatEngine:
    def __init__(self):
        self.text_model = None
        self.vectorizer = None
        self.url_model = None     
        self.load_models()

    def load_models(self):
        """Loads ML components securely. Falls back gracefully if missing."""
        base_dir = os.path.dirname(__file__)
        models_dir = os.path.join(base_dir, "models")    
        
        text_model_path = os.path.join(models_dir, "phishing_model.pkl")
        vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
        url_model_path = os.path.join(models_dir, "url_model.pkl")

        # 1. Load Text Models
        try:
            if os.path.exists(text_model_path) and os.path.exists(vectorizer_path):
                self.text_model = joblib.load(text_model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                logger.info("✅ Text ML Models (TF-IDF + LR) loaded successfully.")
            else:
                logger.warning("⚠️ Text ML Models missing. SMS will use Heuristics.")
        except Exception as e:
            logger.error(f"❌ Text Model load failed. Ensure scikit-learn version matches training env: {e}")

        # 2. Load URL Model
        try:
            if os.path.exists(url_model_path):
                self.url_model = joblib.load(url_model_path)
                logger.info("✅ URL ML Model (Random Forest) loaded successfully.")
            else:
                logger.warning("⚠️ URL ML Model missing. URLs will use Heuristics.")
        except Exception as e:
            logger.error(f"❌ URL Model load failed: {e}")

    def predict(self, content: str, content_type: str) -> dict:
        """Routes the request, but runs a Pre-Flight Security Check first."""
        
        # --- PRE-FLIGHT INJECTION CHECK ---
        # Catch XSS and SQL Injection before ML processing
        lower_content = content.lower()
        injection_patterns = ["<script", "javascript:", "drop table", "select * from", "union all"]
        if any(pattern in lower_content for pattern in injection_patterns):
            return {
                "verdict": "Phishing", # Categorized broadly as malicious
                "risk_score": 99.9,
                "explanation": "Critical: Malicious code injection payload detected (XSS/SQLi)."
            }

        try:
            if content_type.upper() == "URL" and self.url_model:
                return self._ml_predict_url(content)
            elif content_type.upper() == "SMS" and self.text_model and self.vectorizer:
                return self._ml_predict_text(content)
        except Exception as e:
            logger.critical(f"ML Pipeline crashed: {e}. Falling back to Heuristics.", exc_info=True)
            
        return self._heuristic_predict(content, content_type)

    def _ml_predict_url(self, url: str) -> dict:
        features = extract_url_features(url)
        feat_list = features[0]  
        
        prob = self.url_model.predict_proba(features)[0][1]    
        
        # --- ENHANCED HYBRID OVERRIDE ---
        is_ip = feat_list[2] == 1
        is_suspiciously_long = feat_list[0] > 75
        has_excessive_subdomains = feat_list[3] > 2
        
        # Robust extension check: strip query params (?id=1) and check the end of the base URL
        clean_url = url.split('?')[0].lower()
        dangerous_extensions = ('.exe', '.apk', '.bat', '.cmd', '.scr', '.vbs', '.zip', '.rar', '.msi')
        has_dangerous_ext = any(clean_url.endswith(ext) for ext in dangerous_extensions)
        
        # Force risk scores based on severity of the structural anomaly
        if has_excessive_subdomains:
            prob = max(prob, 0.85) # High risk
        if is_ip or has_dangerous_ext:
            prob = max(prob, 0.95) # Critical risk
        
        is_phishing = prob > 0.5  
        
        # --- EXPLAINABILITY (XAI) ---
        reasons = []
        if is_phishing:
            if is_suspiciously_long: reasons.append("URL is abnormally long")
            if is_ip: reasons.append("Uses a raw IP address instead of a domain name")
            if has_dangerous_ext: reasons.append("Links directly to a potentially dangerous executable/archive file")
            if has_excessive_subdomains: reasons.append("Contains excessive subdomains to mask identity")
            if feat_list[8] == 0: reasons.append("Missing secure HTTPS protocol")   
            if not reasons:
                reasons.append("AI Model classified structure as malicious")
                
        explanation = " | ".join(reasons) if reasons else f"AI Confidence Score: {prob*100:.1f}%"   
        if not is_phishing:
            explanation = "URL structure appears standard and safe."
            
        return {
            "verdict": "Phishing" if is_phishing else "Safe",
            "risk_score": round(prob * 100, 2),
            "explanation": explanation
        }

    def _ml_predict_text(self, text: str) -> dict:
        features = self.vectorizer.transform([text])
        prob = self.text_model.predict_proba(features)[0][1]
        is_phishing = prob > 0.5  
        
        # XAI MVP
        reasons = []
        text_lower = text.lower()
        if is_phishing:
            if any(w in text_lower for w in ["urgent", "immediate", "act now"]):
                reasons.append("High urgency language detected")
            if any(w in text_lower for w in ["bank", "verify", "account", "login", "password"]):
                reasons.append("Requests sensitive financial/account information")
            if any(w in text_lower for w in ["winner", "lottery", "prize", "free"]):
                reasons.append("Contains classic scam/reward bait")
                
        explanation = " | ".join(reasons) if reasons else f"AI Confidence Score: {prob*100:.1f}%"
        if not is_phishing:
            explanation = "Message semantics appear normal."
            
        return {
            "verdict": "Phishing" if is_phishing else "Safe",
            "risk_score": round(prob * 100, 2),
            "explanation": explanation
        }

    def _heuristic_predict(self, content: str, content_type: str) -> dict:
        score = 0
        reasons = ["⚠️ System running in Heuristic Fallback Mode"]   
        
        if re.search(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', content):
            score += 80
            reasons.append("Contains IP address.") 
            
        bad_words = ["urgent", "verify", "login", "bank", "update"]
        if any(w in content.lower() for w in bad_words):
            score += 30
            reasons.append("Contains scam keywords.")
            
        final_score = min(score, 99)
        verdict = "Phishing" if final_score > 60 else "Safe"
        
        return {
            "verdict": verdict,
            "risk_score": float(final_score),
            "explanation": " | ".join(reasons)
        }

engine = ThreatEngine()