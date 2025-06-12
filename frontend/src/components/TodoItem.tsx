'use client';

import { Todo, TodoState } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onUpdate: (todo: Todo) => void;
  onArchive: (todo: Todo) => void;
  columnType: TodoState;
}

export default function TodoItem({ todo, onDragStart, onUpdate, onArchive, columnType }: TodoItemProps) {
  const getBorderHoverColor = (columnType: TodoState) => {
    switch (columnType) {
      case 'TODO':
        return 'hover:border-blue-400';
      case 'DOING':
        return 'hover:border-yellow-400';
      case 'DONE':
        return 'hover:border-green-400';
      default:
        return 'hover:border-gray-400';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, todo)}
      className={`group bg-gray-50 p-3 rounded border border-gray-200 cursor-move ${getBorderHoverColor(columnType)} transition-colors`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{todo.title}</h3>
          {todo.description && (
            <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
          )}
          {todo.deadline && (
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(todo.deadline).toLocaleString()}
            </div>
          )}
        </div>
        <div className="ml-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onUpdate(todo)}
            className="p-1 text-gray-600 hover:text-indigo-600"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onArchive(todo)}
            className="p-1 text-gray-600 hover:text-red-600"
            title="Archive task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
