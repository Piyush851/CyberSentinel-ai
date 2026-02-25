from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import the router we just made
from routes import prediction

app = FastAPI(title="CyberSentinel AI Backend")

# --- CORS (Allow Frontend to talk to us) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routes ---
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])

@app.get("/")
def home():
    return {"message": "CyberSentinel AI Backend is Running"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
    