from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import Todo, TodoCreate, TodoUpdate
from app.services.todo import create_todo, get_todos, get_todo, update_todo, delete_todo
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_todo_api(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_todo(db=db, todo=todo, user=current_user)

@router.get("/", response_model=List[Todo])
def list_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_todos(db=db, user=current_user, skip=skip, limit=limit)

@router.get("/{todo_id}", response_model=Todo)
def get_todo_api(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_todo = get_todo(db=db, todo_id=todo_id, user=current_user)
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return db_todo

@router.patch("/{todo_id}", response_model=Todo)
def update_todo_api(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_todo = update_todo(db=db, todo_id=todo_id, todo_update=todo_update, user=current_user)
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return db_todo

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo_api(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = delete_todo(db=db, todo_id=todo_id, user=current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return None