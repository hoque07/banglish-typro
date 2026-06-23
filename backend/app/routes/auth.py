from fastapi import APIRouter, Depends
from app.models import AuthRegisterRequest, AuthLoginRequest
from app.services.auth_service import create_user, login_user, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(req: AuthRegisterRequest):
    return create_user(req.name, req.email, req.password)

@router.post("/login")
def login(req: AuthLoginRequest):
    return login_user(req.email, req.password)

@router.get("/me")
def me(user = Depends(get_current_user)):
    return {"user": user}
