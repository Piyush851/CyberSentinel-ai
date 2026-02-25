import os
import joblib
import re
import numpy as np

# Import the new feature extractor we just built for URLs
from feature_extractor import extract_url_features

class ThreatEngine:
    def __init__(self):
        # Text/SMS Pipeline
        self.text_model = None
        self.vectorizer = None
        
        # URL Pipeline
        self.url_model = None
        
        self.load_models()

    def load_models(self):
        """
        Loads all three ML components securely. Falls back gracefully if missing.
        """
        base_dir = os.path.dirname(__file__)
        models_dir = os.path.join(base_dir, "models")
        
        text_model_path = os.path.join(models_dir, "phishing_model.pkl")
        vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
        url_model_path = os.path.join(models_dir, "url_model.pkl")

        # 1. Load Text Models (Kunal & Piyush's Work)
        try:
            if os.path.exists(text_model_path) and os.path.exists(vectorizer_path):
                self.text_model = joblib.load(text_model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                print("✅ [SYSTEM] Text ML Models (TF-IDF + LR) loaded successfully.")
            else:
                print("⚠️ [SYSTEM] Text ML Models missing. SMS will use Heuristics.")
        except Exception as e:
            print(f"❌ [ERROR] Text Model load failed: {e}")

        # 2. Load URL Model (Kumkum's Work)
        try:
            if os.path.exists(url_model_path):
                self.url_model = joblib.load(url_model_path)
                print("✅ [SYSTEM] URL ML Model (Random Forest) loaded successfully.")
            else:
                print("⚠️ [SYSTEM] URL ML Model missing. URLs will use Heuristics.")
        except Exception as e:
            print(f"❌ [ERROR] URL Model load failed: {e}")

    def predict(self, content: str, content_type: str) -> dict:
        """
        The Traffic Cop: Routes the request to the correct ML pipeline.
        """
        if content_type.upper() == "URL":
            if self.url_model:
                return self._ml_predict_url(content)
        elif content_type.upper() == "SMS":
            if self.text_model and self.vectorizer:
                return self._ml_predict_text(content)
                
        # Fallback if models are missing or type is unknown
        return self._heuristic_predict(content, content_type)

    def _ml_predict_url(self, url: str) -> dict:
        """
        Handles URL predictions using Kumkum's Random Forest.
        """
        # 1. Extract the 9 features
        features = extract_url_features(url)
        
        # 2. Predict
        prob = self.url_model.predict_proba(features)[0][1]
        is_phishing = prob > 0.5
        
        # 3. Explainability (XAI) - MVP Level
        reasons = []
        feat_list = features[0]
        if is_phishing:
            if feat_list[0] > 75: reasons.append("URL is abnormally long")
            if feat_list[2] == 1: reasons.append("Uses a raw IP address instead of a domain name")
            if feat_list[3] > 2:  reasons.append("Contains excessive subdomains")
            if feat_list[8] == 0: reasons.append("Missing secure HTTPS protocol")
            
        explanation = " | ".join(reasons) if reasons else f"AI Confidence Score: {prob*100:.1f}%"
        if not is_phishing:
            explanation = "URL structure appears standard and safe."

        return {
            "verdict": "Phishing" if is_phishing else "Safe",
            "risk_score": round(prob * 100, 2),
            "explanation": explanation
        }

    def _ml_predict_text(self, text: str) -> dict:
        """
        Handles SMS/Email predictions using Kunal's NLP pipeline.
        """
        # 1. Vectorize
        features = self.vectorizer.transform([text])
        
        # 2. Predict
        prob = self.text_model.predict_proba(features)[0][1]
        is_phishing = prob > 0.5
        
        # 3. Explainability (XAI) - MVP Level
        # For MVP, we check the text against known high-risk keyword categories
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
        """
        Defensive Fallback: Runs if ML files are accidentally deleted.
        """
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

# Singleton instance
engine = ThreatEngine()
