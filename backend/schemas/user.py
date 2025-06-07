from pydantic import BaseModel

class UsernameRequest(BaseModel):
    user_name: str

class IconUpdateRequest(BaseModel):
    icon_url: str

class UserMeResponse(BaseModel):
    email: str
    user_name: str
    icon: str | None