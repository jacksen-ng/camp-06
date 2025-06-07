from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User
from services.auth import get_current_user  
from schemas.user import UsernameRequest, IconUpdateRequest, UserMeResponse

router = APIRouter(prefix="/user", tags=["User"])

@router.patch("/")
def change_user_name(
    req: UsernameRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    existing = db.query(User).filter(User.user_name == req.user_name).first()
    if existing and existing.id != current_user.id:
        raise HTTPException(status_code=400, detail="Username already taken")

    user_to_update = db.query(User).filter(User.id == current_user.id).first()
    user_to_update.user_name = req.user_name
    db.commit()
    db.refresh(user_to_update)
    return {"message": "Username changed successfully"}

@router.patch("/icon")
def update_icon_base64(
    req: IconUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not req.icon_url.startswith("data:image/"):
        raise HTTPException(status_code=400, detail="Invalid image format")

    if len(req.icon_url) > 2_000_000:
        raise HTTPException(status_code=400, detail="Image too large")

    user_to_update = db.query(User).filter(User.id == current_user.id).first()
    user_to_update.icon_url = req.icon_url
    db.commit()
    return {"message": "Icon updated successfully"}

@router.get("/", response_model=UserMeResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "user_name": current_user.user_name,
        "icon": current_user.icon_url
    }