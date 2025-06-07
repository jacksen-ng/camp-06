from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User
from services.auth import get_current_user  
from schemas.user import UsernameRequest, IconUpdateRequest, UserMeResponse

router = APIRouter(prefix="/user", tags=["User"])


@router.put("/")
def change_user_name(req: UsernameRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(User).filter(User.user_name == req.user_name).first()
    if existing and existing.id != current_user.id:
        raise HTTPException(status_code=400, detail="Username already taken")

    current_user.user_name = req.user_name
    db.commit()
    return {"message": "Username changed successfully"}


@router.put("/icon")
def update_icon_base64(req: IconUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 簡易バリデーション（長すぎる場合など）
    if len(req.icon_url) > 2_000_000:  # 約2MB
        return {"error": "Base64 data is too large"}
    
    current_user.icon_url = req.icon_url
    db.commit()
    return {"message": "Icon updated"}


@router.get("/", response_model=UserMeResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "user_name": current_user.user_name,
        "icon": current_user.icon_url
    }
