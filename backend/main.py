from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.gemini import generate_recipe
from db.database import Base, engine
from routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)

#ここから下別ファイルに移動させたい
class IngredientsRequest(BaseModel):
    ingredients: list[str]  

@app.get("/")
async def read_main():
    return {"msg":"Hello World"}

@app.post("/generate-recipe")
async def generate_recipe_endpoint(req: IngredientsRequest):
    recipe = await generate_recipe(req.ingredients)
    return {"recipe": recipe}