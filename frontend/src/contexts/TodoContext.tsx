'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Todo, TodoCreate, TodoUpdate, TodoState } from '@/types/todo';
import { api } from '@/utils/api';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  createTodo: (todo: TodoCreate) => Promise<void>;
  updateTodo: (id: number, todo: TodoUpdate) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshTodos = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await api.get('/todos');
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshTodos();
    }
  }, [isAuthenticated]);

  const createTodo = async (todo: TodoCreate) => {
    try {
      await api.post('/todos', todo);
      await refreshTodos();
    } catch (err) {
      setError('Failed to create todo');
      throw err;
    }
  };

  const updateTodo = async (id: number, todo: TodoUpdate) => {
    try {
      await api.patch(`/todos/${id}`, todo);
      await refreshTodos();
    } catch (err) {
      setError('Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
      await refreshTodos();
    } catch (err) {
      setError('Failed to delete todo');
      throw err;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        createTodo,
        updateTodo,
        deleteTodo,
        refreshTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
