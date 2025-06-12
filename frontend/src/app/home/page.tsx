'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTodo } from '@/contexts/TodoContext';
import { Todo, TodoState } from '@/types/todo';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TodoDialog from '@/components/TodoDialog';
import TodoItem from '@/components/TodoItem';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  const { todos, isLoading: isTodosLoading, updateTodo, createTodo } = useTodo();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'update' | 'archive' | null>(null);

  const todosByState = (state: TodoState) => {
    return todos.filter(todo => todo.state === state);
  };

  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    e.dataTransfer.setData('todoId', todo.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newState: TodoState) => {
    e.preventDefault();
    const todoId = parseInt(e.dataTransfer.getData('todoId'));
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    
    await updateTodo(todoId, {
      title: todo.title,
      description: todo.description,
      state: newState
    });
  };

  if (isLoading || isTodosLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Todo List
          </h1>
          <button
            onClick={() => setDialogType('create')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            ADD NEW TASK
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* TODO Column */}
          <div
            className="bg-white rounded-lg shadow p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'TODO')}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">TO DO</h2>
            <div className="space-y-3">
              {todosByState('TODO').map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  columnType="TODO"
                  onDragStart={handleDragStart}
                  onUpdate={(todo) => {
                    setSelectedTodo(todo);
                    setDialogType('update');
                  }}
                  onArchive={(todo) => {
                    setSelectedTodo(todo);
                    setDialogType('archive');
                  }}
                />
              ))}
            </div>
          </div>

          {/* DOING Column */}
          <div
            className="bg-white rounded-lg shadow p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'DOING')}
          >
            <h2 className="text-lg font-semibold mb-4 text-yellow-600">DOING</h2>
            <div className="space-y-3">
              {todosByState('DOING').map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  columnType="DOING"
                  onDragStart={handleDragStart}
                  onUpdate={(todo) => {
                    setSelectedTodo(todo);
                    setDialogType('update');
                  }}
                  onArchive={(todo) => {
                    setSelectedTodo(todo);
                    setDialogType('archive');
                  }}
                />
              ))}
            </div>
          </div>

          {/* DONE Column */}
          <div
            className="bg-white rounded-lg shadow p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'DONE')}
          >
            <h2 className="text-lg font-semibold mb-4 text-green-600">DONE</h2>
            <div className="space-y-3">
              {todosByState('DONE').map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  columnType="DONE"
                  onDragStart={handleDragStart}
                  onUpdate={(todo) => {
                    setSelectedTodo(todo);
                    setDialogType('update');
                  }}
                  onArchive={(todo) => {
                    setSelectedTodo(todo);
                    setDialogType('archive');
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {dialogType && (
        <TodoDialog
          type={dialogType}
          todo={selectedTodo}
          isOpen={true}
          onClose={() => {
            setSelectedTodo(null);
            setDialogType(null);
          }}
          onConfirm={async (data) => {
            if (dialogType === 'create') {
              await createTodo(data);
            } else if (selectedTodo) {
              await updateTodo(selectedTodo.id, data);
            }
            setSelectedTodo(null);
            setDialogType(null);
          }}
        />
      )}
    </div>
  );
}
