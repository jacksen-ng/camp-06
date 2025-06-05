from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from schemas.gemini import IngredientsRequest

#開発環境の時使うテスト（Geminiへの接続のテスト）
try:
    from services.gemini import generate_recipe
    HAS_GEMINI = True
except (ValueError, ImportError):
    HAS_GEMINI = False

from db.database import Base, engine


router = APIRouter(prefix="/gemini", tags=["gemini"])


@router.post("/generate-recipe")
async def generate_recipe_endpoint(req: IngredientsRequest):
    if not HAS_GEMINI:
        raise HTTPException(status_code=503, detail="Gemini API not configured")
    
    try:
        # レシピと画像を生成
        recipe_data = await generate_recipe(req.ingredients)
        
        return {
            "recipe": recipe_data["recipe"],
            "image_description": recipe_data["image_description"],
            "suggested_images": [],  # 簡略化のため空の配列
            "has_image": recipe_data["has_image"],
            "image_url": recipe_data["image_url"],
            "dish_name": recipe_data.get("dish_name", "不明"),
            "country_name": recipe_data.get("country_name", "不明"),
            "ingredients_name": recipe_data.get("ingredients_name", "不明")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"レシピ生成エラー: {str(e)}")