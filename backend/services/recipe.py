from sqlalchemy.orm import Session
from db.models import Recipe
from schemas.recipe import RecipeCreate, RecipeRead

def get_recipes(db: Session):
    db_recipes = db.query(Recipe).all()
    # 将ingredients字符串转换回数组
    recipes = []
    for db_recipe in db_recipes:
        recipe_dict = {
            "id": db_recipe.id,
            "title": db_recipe.title,
            "country": db_recipe.country,
            "ingredients": db_recipe.ingredients.split(",") if db_recipe.ingredients else [],
            "instructions": db_recipe.instructions,
            "image_url": db_recipe.image_url,
            "image_description": db_recipe.image_description
        }
        recipes.append(RecipeRead(**recipe_dict))
    return recipes

def get_recipe(db: Session, recipe_id: int):
    db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if db_recipe:
        recipe_dict = {
            "id": db_recipe.id,
            "title": db_recipe.title,
            "country": db_recipe.country,
            "ingredients": db_recipe.ingredients.split(",") if db_recipe.ingredients else [],
            "instructions": db_recipe.instructions,
            "image_url": db_recipe.image_url,
            "image_description": db_recipe.image_description
        }
        return RecipeRead(**recipe_dict)
    return None

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
    
    # 返回时也要转换格式
    recipe_dict = {
        "id": db_recipe.id,
        "title": db_recipe.title,
        "country": db_recipe.country,
        "ingredients": db_recipe.ingredients.split(",") if db_recipe.ingredients else [],
        "instructions": db_recipe.instructions,
        "image_url": db_recipe.image_url,
        "image_description": db_recipe.image_description
    }
    return RecipeRead(**recipe_dict)

def delete_recipe_id(db: Session, recipe_id: int):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe:
        db.delete(recipe)
        db.commit()
    return