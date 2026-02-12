import os
import joblib
import re
import random

class ThreatEngine:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load_models()

    def load_models(self):
        """
        Attempts to load models from 'backend/models/' (Deployment copy).
        """
        # We look for models in a local 'models' folder inside backend
        # You will copy Kumkum's files here later.
        model_path = "models/phishing_model.pkl"
        vectorizer_path = "models/tfidf_vectorizer.pkl"

        try:
            if os.path.exists(model_path) and os.path.exists(vectorizer_path):
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                print("✅ [SYSTEM] ML Models loaded successfully.")
            else:
                print("⚠️ [SYSTEM] ML Models not found. Using HEURISTIC MODE.")
        except Exception as e:
            print(f"❌ [ERROR] Model loading failed: {e}")

    def predict(self, content: str, content_type: str) -> dict:
        """
        Decides between ML prediction or Rule-Based fallback.
        """
        if self.model and self.vectorizer:
            return self._ml_predict(content)
        return self._heuristic_predict(content, content_type)

    def _ml_predict(self, content):
        # Placeholder for ML logic (Phase 3)
        features = self.vectorizer.transform([content])
        prob = self.model.predict_proba(features)[0][1]
        return {
            "verdict": "Phishing" if prob > 0.5 else "Safe",
            "risk_score": round(prob * 100, 2),
            "explanation": f"ML Model Confidence: {round(prob * 100, 2)}%"
        }

    def _heuristic_predict(self, content, content_type):
        # --- RULE BASED LOGIC (Phase 2 Demo) ---
        score = 0
        reasons = []
        
        # Rule 1: IP Address Check
        if re.search(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', content):
            score += 80
            reasons.append("Contains IP address (Suspicious).")
        
        # Rule 2: Keywords
        bad_words = ["urgent", "verify", "login", "bank", "update"]
        if any(w in content.lower() for w in bad_words):
            score += 30
            reasons.append("Contains urgency/scam keywords.")

        # Final Verdict
        final_score = min(score, 99)
        verdict = "Phishing" if final_score > 60 else "Safe"
        
        return {
            "verdict": verdict,
            "risk_score": float(final_score),
            "explanation": " | ".join(reasons) if reasons else "No threats detected."
        }

# Create a singleton instance
engine = ThreatEngine()