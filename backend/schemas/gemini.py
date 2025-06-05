from pydantic import BaseModel

class IngredientsRequest(BaseModel):
    ingredients: list[str]  