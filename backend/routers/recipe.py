from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.recipe import get_recipes, get_recipe, create_recipe
from schemas.recipe import RecipeRead, RecipeCreate
from db.database import get_db
from typing import List

router = APIRouter(prefix="/recipes", tags=["recipe"])

@router.post("/", response_model=RecipeRead)
def save_recipe(recipe: RecipeCreate, db: Session = Depends(get_db)):
    """
    レシピを保存するエンドポイント。
    Parameters:
        recipe: RecipeCreate（title, country, ingredients, instructions）
        db: DBセッション（自動依存注入）
    Returns:
        RecipeRead（保存されたレシピの詳細）
    Raises:
        HTTPException 400: レシピの保存に失敗した場合
        HTTPException 500: サーバーエラー
    """
    return create_recipe(db, recipe)

@router.get("/", response_model=List[RecipeRead])
def read_recipes(db: Session = Depends(get_db)):
    """
    すべてのレシピを取得するエンドポイント。
    Parameters:
        db: DBセッション（自動依存注入）
    Returns:
        List[RecipeRead]（レシピのリスト）
    Raises:
        HTTPException 500: サーバーエラー
    """
    recipes = get_recipes(db)
    for r in recipes:
        r.ingredients = r.ingredients.split(",")
    return recipes

@router.get("/{recipe_id}", response_model=RecipeRead)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """
    特定のレシピをIDで取得するエンドポイント。
    Parameters:
        recipe_id: int（レシピのID）
        db: DBセッション（自動依存注入）
    Returns:
        RecipeRead（レシピの詳細）
    Raises:
        HTTPException 404: レシピが見つからない場合
    """
    recipe = get_recipe(db, recipe_id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="レシピが見つかりません")
    recipe.ingredients = recipe.ingredients.split(",")
    return recipe