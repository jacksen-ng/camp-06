from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

#開発環境の時使うテスト（Geminiへの接続のテスト）
try:
    from services.gemini import generate_recipe
    HAS_GEMINI = True
except (ValueError, ImportError):
    HAS_GEMINI = False

from db.database import Base, engine
from routers import auth, gemini, recipe, user, comment

Base.metadata.create_all(bind=engine)

app = FastAPI()

#CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recipe.router)
app.include_router(gemini.router)
app.include_router(user.router)
app.include_router(comment.router)

#ここから下別ファイルに移動させたい
class IngredientsRequest(BaseModel):
    ingredients: list[str]  

@app.get("/")
async def read_main():
    return {"msg":"Hello World"}
