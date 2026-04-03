from pydantic import BaseModel, Field, field_validator
from typing import Literal

# --- INPUT (Request) ---
class AnalysisRequest(BaseModel):
    # Setting min_length=1 handles empty strings, but we still need the validator for whitespace
    content: str = Field(..., min_length=1, max_length=5000, description="URL or Text to analyze")
    content_type: Literal["URL", "SMS"] = Field(..., description="Type of content")

    @field_validator('content')
    @classmethod  # Pydantic V2 requires this decorator
    def validate_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Content cannot be empty or solely whitespace.")
        return v

# --- OUTPUT (Response) ---
class AnalysisResponse(BaseModel):
    verdict: str         # "Safe", "Phishing", "Suspicious"
    risk_score: float    # 0.0 to 100.0
    explanation: str     # Human-readable reason
    timestamp: str       # ISO format time