from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.models import User
from schemas.auth import UserCreate, UserLogin, Token
from services.auth import hash_password, verify_password, create_access_token, get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    ログイン処理。

    Parameters:
        user: UserLogin（email, password）
        db: DBセッション（自動依存注入）

    Returns:
        Token（access_tokenとtoken_type）
    """
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    新規ユーザー登録エンドポイント。

    Parameters:
        user: UserCreate
            - email: ユーザーのメールアドレス
            - password: パスワード
        db: Session（自動で依存注入）

    Returns:
        Token
            - access_token: ログインに使用するJWTトークン
            - token_type: "bearer"（トークンの種類）
    
    Raises:
        HTTPException 400: すでにメールアドレスが登録されている場合
    """
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    new_user = User(email=user.email, hashed_password=hashed_pw, user_name="user")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_access_token({"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}