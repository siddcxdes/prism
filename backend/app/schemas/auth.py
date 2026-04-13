from pydantic import EmailStr
from pydantic import BaseModel

class RegisterRequest(BaseModel):
    name : str
    email : EmailStr
    password : str 
    invite_code : str

class LoginRequest(BaseModel):
    email : str
    password : str

class TokenResponse(BaseModel):
    access_token : str
    token_type : str

    model_config = {"from_attributes": True}

class AdminRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    org_name: str