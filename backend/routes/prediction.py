import logging
import asyncio
from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone
from schemas import AnalysisRequest, AnalysisResponse
from model_loader import engine

# Initialize structured logging for observability
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

router = APIRouter(tags=["Phishing Analysis"])

@router.post(
    "/analyze", 
    response_model=AnalysisResponse, 
    status_code=status.HTTP_200_OK,
    summary="Analyze URL or SMS for malicious intent",
    description="Passes input content to the hybrid ML/XAI engine to determine phishing probability and returns a human-readable explanation."
)
async def analyze_content(request: AnalysisRequest):
    logger.info(f"Incoming analysis request. Type: {request.content_type}, Length: {len(request.content)}")

    # 1. Defensive Input Validation
    if not request.content or not request.content.strip():
        logger.warning("Rejected request: Empty content payload.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Content payload cannot be empty or solely whitespace."
        )

    try:
        # 2. Prevent Event Loop Blocking
        # Since ML inference (engine.predict) is CPU-bound and likely synchronous,
        # we offload it to a separate thread to keep the FastAPI server responsive.
        result = await asyncio.to_thread(
            engine.predict, 
            content=request.content.strip(), 
            content_type=request.content_type
        )
        
        # 3. Contract Validation (Ensure engine returns expected XAI schema)
        required_keys = {"verdict", "risk_score", "explanation"}
        if not all(k in result for k in required_keys):
            logger.error(f"Engine contract violation. Missing keys in result: {result}")
            raise RuntimeError("Internal engine response format invalid.")

        logger.info(f"Analysis complete. Verdict: {result['verdict']}, Score: {result['risk_score']}")

        # 4. Standardized UTC Timestamps
        return AnalysisResponse(
            verdict=result["verdict"],
            risk_score=result["risk_score"],
            explanation=result["explanation"],
            timestamp=datetime.now(timezone.utc).isoformat()
        )

    except ValueError as ve:
        # Handle cases where the engine explicitly rejects the input (e.g., malformed URL)
        logger.warning(f"Engine rejected input: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Invalid input for analysis: {str(ve)}"
        )
        
    except Exception as e:
        # 5. Secure Fallback for Unhandled Exceptions
        # We log the stack trace internally but DO NOT leak it to the user.
        logger.critical(f"Critical failure during ML inference: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An internal system error occurred during analysis. Our team has been notified."
        )