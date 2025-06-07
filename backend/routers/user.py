from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User
from services.auth import get_current_user  
from pydantic import BaseModel

router = APIRouter(prefix="/user", tags=["User"])

class UsernameRequest(BaseModel):
    user_name: str


@router.put("/")
def change_user_name(req: UsernameRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(User).filter(User.user_name == req.user_name).first()
    if existing and existing.id != current_user.id:
        raise HTTPException(status_code=400, detail="Username already taken")

    current_user.user_name = req.user_name
    db.commit()
    return {"message": "Username changed successfully"}
