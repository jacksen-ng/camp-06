from pydantic import BaseModel
from typing import Optional, List

class RecipeBase(BaseModel):
    title: str
    country: str 
    ingredients: List[str]
    instructions: str
    image_url: Optional[str] = None
    image_description: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeRead(RecipeBase):
    id: int

    class Config:
        from_attributes = True