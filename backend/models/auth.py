from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr # 新規登録用メールアドレス
    password: str   # 登録用パスワード

class UserLogin(BaseModel):
    email: EmailStr # ログイン用メールアドレス
    password: str   # ログイン用パスワード

class Token(BaseModel):
    access_token: str # JWTアクセストークン
    token_type: str   # トークン種別。通常は "bearer"。HTTPヘッダー Authorization: Bearer <token> で使用。
