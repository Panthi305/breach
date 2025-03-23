# from fastapi import APIRouter, HTTPException
# from ..services.bureau_service import fetch_credit_scores

# router = APIRouter(prefix="/credit", tags=["Credit"])

# @router.get("/bureaus/{user_id}")
# def get_credit_scores_from_bureaus(user_id: int):
#     """Fetches credit scores from multiple bureaus."""
#     scores = fetch_credit_scores(user_id)

#     if "error" in scores:
#         raise HTTPException(status_code=500, detail=scores["error"])

#     return scores
# from ..services.bureau_service import normalize_credit_scores

# @router.get("/bureaus/unified/{user_id}")
# def get_unified_credit_score(user_id: int):
#     """Fetches and normalizes credit scores into a single unified score."""
#     result = normalize_credit_scores(user_id)

#     if "error" in result:
#         raise HTTPException(status_code=500, detail=result["error"])

#     return result
# from ..services.scoring import assess_risk
# from ..services.bureau_service import normalize_credit_scores

# @router.get("/bureaus/risk/{user_id}")
# def get_risk_assessment(user_id: int):
#     """Fetches credit scores and assigns a risk category."""
#     result = normalize_credit_scores(user_id)

#     if "error" in result:
#         raise HTTPException(status_code=500, detail=result["error"])

#     risk_level = assess_risk(result["unified_score"])
#     result["risk_assessment"] = risk_level

#     return result
# from fastapi import APIRouter, Depends
# from app.routers.auth import get_current_user

# router = APIRouter(prefix="/credit", tags=["Credit"])

# @router.get("/protected-route")
# def protected_route(user: dict = Depends(get_current_user)):
#     return {"message": f"Hello, {user['username']}. You have access to this protected route!"}
import random
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/credit", tags=["Credit"])

# Function to generate random credit scores
def generate_random_credit_scores():
    return {
        "experian": random.randint(450, 800),
        "equifax": random.randint(450, 800),
        "transunion": random.randint(450, 800)
    }

# Function to calculate a unified score
def normalize_credit_scores(scores):
    return {"unified_score": round(sum(scores.values()) / len(scores))}

# Function to assess risk based on unified score
def assess_risk(unified_score):
    if unified_score >= 750:
        return "Low Risk"
    elif unified_score >= 650:
        return "Medium Risk"
    else:
        return "High Risk"

@router.get("/bureaus/{pan_no}")
def get_credit_scores_from_bureaus(pan_no: str):
    """Fetches random credit scores instead of using a database."""
    print(f"🔍 Generating random credit scores for {pan_no}")
    scores = generate_random_credit_scores()
    return {"scores": scores}

@router.get("/bureaus/unified/{pan_no}")
def get_unified_credit_score(pan_no: str):
    """Fetches and normalizes random credit scores."""
    scores = generate_random_credit_scores()
    result = normalize_credit_scores(scores)
    return result

@router.get("/bureaus/risk/{pan_no}")
def get_risk_assessment(pan_no: str):
    """Fetches credit scores and assigns a risk category."""
    scores = generate_random_credit_scores()
    unified_score = normalize_credit_scores(scores)["unified_score"]
    risk_level = assess_risk(unified_score)
    return {"unified_score": unified_score, "risk_assessment": risk_level}
