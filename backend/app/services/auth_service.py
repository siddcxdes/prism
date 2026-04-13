from passlib.context import CryptContext
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from fastapi import HTTPException

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password : str):
    return pwd_context.hash(password[:72])

def verify_password(plain_password : str, hashed_password : str):
    return pwd_context.verify(plain_password[:72], hashed_password)

def create_access_token(data : dict):
    token_data = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
    token_data["exp"] = expire
    encoded_jwt = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token : str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
