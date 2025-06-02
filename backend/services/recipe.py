from sqlalchemy.orm import Session
from db.models import Recipe
from schemas.recipe import RecipeCreate, RecipeRead

def get_recipes(db: Session):
    return db.query(Recipe).all()

def get_recipe(db: Session, recipe_id: int):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

def create_recipe(db: Session, recipe: RecipeCreate):
    db_recipe = Recipe(
        title=recipe.title,
        country=recipe.country,
        ingredients=", ".join(recipe.ingredients),  # リストをカンマ区切りの文字列に変換
        instructions=recipe.instructions
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe