from sqlalchemy.orm import Session
from db.models import Recipe, User
from schemas.recipe import RecipeCreate, RecipeRead


def get_recipes(db):
    # レシピとユーザーをJOIN
    results = (
        db.query(Recipe, User)
        .join(User, Recipe.email == User.email)
        .all()
    )
    recipes = []
    for recipe, user in results:
        # ingredientsはカンマ区切りの場合は分割
        ingredients = recipe.ingredients.split(",") if isinstance(recipe.ingredients, str) else recipe.ingredients
        recipes.append(
            RecipeRead(
                id=recipe.id,
                title=recipe.title,
                country=recipe.country,
                ingredients=ingredients,
                instructions=recipe.instructions,
                image_url=recipe.image_url,
                image_description=recipe.image_description,
                user_name=user.user_name,
                user_icon_url=user.icon_url,
            )
        )
    return recipes

def get_recipe(db: Session, recipe_id: int):
    result = db.query(Recipe, User).join(User, Recipe.email == User.email).filter(Recipe.id == recipe_id).first()
    if result:
        db_recipe, user = result
        recipe_dict = {
            "id": db_recipe.id,
            "title": db_recipe.title,
            "country": db_recipe.country,
            "ingredients": db_recipe.ingredients.split(",") if db_recipe.ingredients else [],
            "instructions": db_recipe.instructions,
            "image_url": db_recipe.image_url,
            "image_description": db_recipe.image_description,
            "user_name": user.user_name,
            "user_icon_url": user.icon_url,  # 追加
        }
        return RecipeRead(**recipe_dict)
    return None

def create_recipe(db: Session, recipe: RecipeCreate, user: User):
    db_recipe = Recipe(
        email=user.email,
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
    
    recipe_dict = {
        "id": db_recipe.id,
        "email": db_recipe.email,
        "title": db_recipe.title,
        "country": db_recipe.country,
        "ingredients": db_recipe.ingredients.split(",") if db_recipe.ingredients else [],
        "instructions": db_recipe.instructions,
        "image_url": db_recipe.image_url,
        "image_description": db_recipe.image_description,
        "user_name": user.user_name,
        "user_icon_url": user.icon_url,  # 追加
    }
    return RecipeRead(**recipe_dict)

def delete_recipe_id(db: Session, recipe_id: int):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe:
        db.delete(recipe)
        db.commit()
    return