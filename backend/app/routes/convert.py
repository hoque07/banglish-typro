from fastapi import APIRouter
from app.models import TextRequest
from app.services.converter import convert_text, get_suggestions, get_word_guide, generate_sentences

router = APIRouter(tags=["Writing Engine"])

@router.post("/convert")
def convert(req: TextRequest):
    return {"input": req.text, "output": convert_text(req.text)}

@router.post("/suggest")
def suggest(req: TextRequest):
    return {"suggestions": get_suggestions(req.text)}

@router.post("/guide")
def guide(req: TextRequest):
    return {"guide": get_word_guide(req.text)}

@router.post("/sentence")
def sentence(req: TextRequest):
    return {"sentences": generate_sentences(req.text)}
