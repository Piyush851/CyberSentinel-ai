from fastapi import APIRouter, HTTPException
from datetime import datetime
from schemas import AnalysisRequest, AnalysisResponse
from model_loader import engine

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_content(request: AnalysisRequest):
    try:
        # Get result from the engine
        result = engine.predict(request.content, request.content_type)
        
        return AnalysisResponse(
            verdict=result["verdict"],
            risk_score=result["risk_score"],
            explanation=result["explanation"],
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")