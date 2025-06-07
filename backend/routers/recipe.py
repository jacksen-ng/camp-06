from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.recipe import get_recipes, get_recipe, create_recipe, delete_recipe_id
from schemas.recipe import RecipeRead, RecipeCreate
from services.auth import get_db, get_current_user
from db.models import User
from typing import List

router = APIRouter(prefix="/recipes", tags=["recipe"])

@router.post("/", response_model=RecipeRead)
def save_recipe(recipe: RecipeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    レシピを保存するエンドポイント。
    Parameters:
        recipe: RecipeCreate（title, country, ingredients, instructions）
        db: DBセッション（自動依存注入）
        current_user: User（ユーザー情報）
    Returns:
        RecipeRead（保存されたレシピの詳細）
    Raises:
        HTTPException 400: レシピの保存に失敗した場合
        HTTPException 500: サーバーエラー
    """
    return create_recipe(db, recipe)

@router.get("/", response_model=List[RecipeRead])
def read_recipes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    すべてのレシピを取得するエンドポイント。
    Parameters:
        db: DBセッション（自動依存注入）
        current_user: User（ユーザー情報）
    Returns:
        List[RecipeRead]（レシピのリスト）
    Raises:
        HTTPException 500: サーバーエラー
    """
    recipes = get_recipes(db)
    return recipes

@router.get("/{recipe_id}", response_model=RecipeRead)
def read_recipe(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    特定のレシピをIDで取得するエンドポイント。
    Parameters:
        recipe_id: int（レシピのID）
        db: DBセッション（自動依存注入）
        current_user: User（ユーザー情報）
    Returns:
        RecipeRead（レシピの詳細）
    Raises:
        HTTPException 404: レシピが見つからない場合
    """
    recipe = get_recipe(db, recipe_id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="レシピが見つかりません")
    return recipe

@router.delete("/{recipe_id}", status_code=204)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    指定されたレシピを削除するエンドポイント。
    """
    delete_recipe_id(db, recipe_id)
    return