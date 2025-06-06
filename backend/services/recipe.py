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
        ingredients=",".join(recipe.ingredients), 
        instructions=recipe.instructions,
        image_url=recipe.image_url,
        image_description=recipe.image_description
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def delete_recipe_id(db: Session, recipe_id: int):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    db.delete(recipe)
    db.commit()
    return