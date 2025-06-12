import pytest
from datetime import datetime, timedelta
from fastapi import status

def test_create_todo_unauthorized(client):
    response = client.post(
        "/api/v1/todos/",
        json={
            "title": "Test Todo",
            "description": "Test Description"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def get_token(client, test_user):
    response = client.post(
        "/api/v1/auth/token",
        data={
            "username": test_user["username"],
            "password": test_user["password"]
        }
    )
    return response.json()["access_token"]

@pytest.fixture
def auth_headers(client, test_user):
    token = get_token(client, test_user)
    return {"Authorization": f"Bearer {token}"}

def test_create_todo(client, auth_headers):
    todo_data = {
        "title": "Test Todo",
        "description": "Test Description",
        "deadline": (datetime.utcnow() + timedelta(days=1)).isoformat()
    }
    response = client.post(
        "/api/v1/todos/",
        json=todo_data,
        headers=auth_headers
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == todo_data["title"]
    assert data["description"] == todo_data["description"]
    assert data["state"] == "TODO"

def test_list_todos(client, auth_headers):
    # Create a todo first
    todo_data = {"title": "Test Todo", "description": "Test Description"}
    client.post("/api/v1/todos/", json=todo_data, headers=auth_headers)
    
    response = client.get("/api/v1/todos/", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == todo_data["title"]

def test_get_todo(client, auth_headers):
    # Create a todo first
    todo_data = {"title": "Test Todo", "description": "Test Description"}
    create_response = client.post("/api/v1/todos/", json=todo_data, headers=auth_headers)
    todo_id = create_response.json()["id"]
    
    response = client.get(f"/api/v1/todos/{todo_id}", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == todo_id
    assert data["title"] == todo_data["title"]

def test_update_todo(client, auth_headers):
    # Create a todo first
    todo_data = {"title": "Test Todo", "description": "Test Description"}
    create_response = client.post("/api/v1/todos/", json=todo_data, headers=auth_headers)
    todo_id = create_response.json()["id"]
    
    update_data = {
        "title": "Updated Todo",
        "description": "Updated Description",
        "state": "DOING"
    }
    response = client.patch(
        f"/api/v1/todos/{todo_id}",
        json=update_data,
        headers=auth_headers
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["state"] == update_data["state"]

def test_delete_todo(client, auth_headers):
    # Create a todo first
    todo_data = {"title": "Test Todo", "description": "Test Description"}
    create_response = client.post("/api/v1/todos/", json=todo_data, headers=auth_headers)
    todo_id = create_response.json()["id"]
    
    response = client.delete(f"/api/v1/todos/{todo_id}", headers=auth_headers)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify the todo is deleted
    get_response = client.get(f"/api/v1/todos/{todo_id}", headers=auth_headers)
    assert get_response.status_code == status.HTTP_404_NOT_FOUND

def test_get_nonexistent_todo(client, auth_headers):
    response = client.get("/api/v1/todos/999999", headers=auth_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_update_nonexistent_todo(client, auth_headers):
    update_data = {"title": "Updated Todo"}
    response = client.patch(
        "/api/v1/todos/999999",
        json=update_data,
        headers=auth_headers
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_delete_nonexistent_todo(client, auth_headers):
    response = client.delete("/api/v1/todos/999999", headers=auth_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
