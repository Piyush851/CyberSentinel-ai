from pydantic import BaseModel, Field, validator
from typing import Literal

# --- INPUT (Request) ---
class AnalysisRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000, description="URL or Text to analyze")
    content_type: Literal["URL", "SMS"] = Field(..., description="Type of content")

    @validator('content')
    def validate_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Content cannot be empty.")
        return v

# --- OUTPUT (Response) ---
class AnalysisResponse(BaseModel):
    verdict: str         # "Safe", "Phishing", "Suspicious"
    risk_score: float    # 0.0 to 100.0
    explanation: str     # Human-readable reason
    timestamp: str       # ISO format time
