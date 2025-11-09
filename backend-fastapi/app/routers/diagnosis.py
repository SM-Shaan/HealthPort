"""
AI Diagnosis Router - Integrates with AI Service
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from pydantic import BaseModel
from typing import List
import httpx
import os

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])

# AI Service URL - set in environment variables
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8000")

class DiagnoseRequest(BaseModel):
    symptoms: str

class DiagnoseResponse(BaseModel):
    symptoms: str
    possible_diseases: List[str]
    recommended_departments: List[str]

@router.post("/symptom-check", response_model=DiagnoseResponse)
async def diagnose_symptoms(request: DiagnoseRequest):
    """
    AI-powered symptom diagnosis

    Calls the AI service to detect diseases and recommend departments
    """
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            # Step 1: Detect diseases from symptoms
            disease_response = await client.post(
                f"{AI_SERVICE_URL}/detect_disease",
                params={"query": request.symptoms}
            )

            if disease_response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail=f"Disease detection failed: {disease_response.text}"
                )

            diseases = disease_response.json()["diseases"]

            # Step 2: Get department recommendations
            dept_response = await client.post(
                f"{AI_SERVICE_URL}/detect_dept",
                json=diseases
            )

            if dept_response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail=f"Department detection failed: {dept_response.text}"
                )

            departments = dept_response.json()["departments"]

            return DiagnoseResponse(
                symptoms=request.symptoms,
                possible_diseases=diseases,
                recommended_departments=departments
            )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="AI service timeout - please try again"
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI service unavailable: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Diagnosis failed: {str(e)}"
        )

@router.get("/ai-health")
async def check_ai_service():
    """
    Check if AI service is reachable
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{AI_SERVICE_URL}/")
            return {
                "ai_service_status": "online",
                "ai_service_url": AI_SERVICE_URL,
                "response": response.json()
            }
    except Exception as e:
        return {
            "ai_service_status": "offline",
            "ai_service_url": AI_SERVICE_URL,
            "error": str(e)
        }
