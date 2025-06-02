from pydantic import BaseModel
from typing import List

class RecipeBase(BaseModel):
    title: str
    country: str 
    ingredients: List[str]  # 材料をリストで受け取る
    instructions: str

class RecipeCreate(RecipeBase):
    pass

class RecipeRead(RecipeBase):
    id: int

    class Config:
        orm_mode = True