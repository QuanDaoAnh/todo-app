from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.models import TaskState

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    state: Optional[TaskState] = None

class Todo(TodoBase):
    id: int
    state: TaskState
    created_at: datetime
    updated_at: datetime
    owner_id: int

    model_config = {
        "from_attributes": True
    }

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
