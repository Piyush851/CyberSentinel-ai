import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import the router
from routes import prediction

# Initialize app with proper metadata for documentation
app = FastAPI(
    title="CyberSentinel AI API",
    description="Backend API for the CyberSentinel Phishing Detection Engine",
    version="1.0.0"
)

# --- Security: CORS Hardening ---
# We explicitly define which frontends are allowed to communicate with this API.
# In development, Vite uses 5173. In production, we use environment variables.
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React/Vite local development
    "http://127.0.0.1:5173",
]

# Add production origin if defined in environment variables
prod_origin = os.getenv("FRONTEND_URL")
if prod_origin:
    ALLOWED_ORIGINS.append(prod_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Securely restricted
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], # Explicitly allowed methods (avoiding DELETE/PUT if not needed)
    allow_headers=["Authorization", "Content-Type"], # Explicitly allowed headers
)

# --- Register Routes ---
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])

# --- Health Check Route ---
@app.get("/", tags=["Health"])
def health_check():
    """
    Standard health check endpoint to verify API uptime.
    Useful for Docker/Kubernetes health probes.
    """
    return {
        "service": "CyberSentinel AI",
        "status": "operational",
        "engine_ready": True
    }

if __name__ == "__main__":
    # uvicorn app:app allows proper worker scaling in the future
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)