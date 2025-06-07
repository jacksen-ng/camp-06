from sqlalchemy import Column, Integer, String, ForeignKey, Text
from db.database import Base
from db.default_icon import DEFAULT_ICON

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    user_name = Column(String, default="user", index=True)
    icon_url = Column(String, nullable=True, default=DEFAULT_ICON)

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    email =Column(String, nullable=False)
    title = Column(String, nullable=False)
    country = Column(String, nullable=False) #国名
    ingredients = Column(String, nullable=False) #材料
    instructions = Column(String, nullable=False) #作り方
    image_url = Column(String, nullable=True)
    image_description = Column(String, nullable=True)

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    commenter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment_text = Column(Text, nullable=False)