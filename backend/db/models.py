from sqlalchemy import Column, Integer, String, Text
from db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    country = Column(String, nullable=False) #国名
    ingredients = Column(String, nullable=False) #材料
    instructions = Column(String, nullable=False) #作り方
    image_url = Column(String, nullable=True)
    image_description = Column(String, nullable=True)