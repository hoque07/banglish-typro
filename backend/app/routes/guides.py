from fastapi import APIRouter
from app.services.dictionary import ALPHABET_GUIDE, PUNCTUATION_GUIDE

router = APIRouter(prefix="/guides", tags=["Guides"])

@router.get("/alphabet")
def alphabet():
    return {"alphabet": ALPHABET_GUIDE}

@router.get("/punctuation")
def punctuation():
    return {"punctuation": PUNCTUATION_GUIDE}
