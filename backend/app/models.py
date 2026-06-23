from pydantic import BaseModel, EmailStr
from typing import Optional

class TextRequest(BaseModel):
    text: str

class AuthRegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class AuthLoginRequest(BaseModel):
    email: str
    password: str

class HistoryCreateRequest(BaseModel):
    input_text: str
    output_text: str
