from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.models import Todo, User
from app.schemas.schemas import TodoCreate, TodoUpdate

def create_todo(db: Session, todo: TodoCreate, user: User) -> Todo:
    db_todo = Todo(
        title=todo.title,
        description=todo.description,
        deadline=todo.deadline,
        owner_id=user.id
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def get_todos(db: Session, user: User, skip: int = 0, limit: int = 100) -> List[Todo]:
    return db.query(Todo).filter(Todo.owner_id == user.id).offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int, user: User) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == user.id).first()

def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate, user: User) -> Optional[Todo]:
    db_todo = get_todo(db=db, todo_id=todo_id, user=user)
    if not db_todo:
        return None
    
    for field, value in todo_update.dict(exclude_unset=True).items():
        setattr(db_todo, field, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int, user: User) -> bool:
    db_todo = get_todo(db=db, todo_id=todo_id, user=user)
    if not db_todo:
        return False
    
    db.delete(db_todo)
    db.commit()
    return True