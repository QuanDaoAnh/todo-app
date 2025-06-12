'use client';

import { useState } from 'react';
import { Todo, TodoState } from '@/types/todo';

interface TodoDialogProps {
  type: 'create' | 'update' | 'archive';
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { title: string; description?: string; deadline?: string; state: TodoState }) => Promise<void>;
}

export default function TodoDialog({ type, todo, isOpen, onClose, onConfirm }: TodoDialogProps) {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [state, setState] = useState<TodoState>(todo?.state || 'TODO');
  const [deadline, setDeadline] = useState(todo?.deadline || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm({ 
      title, 
      description: description || undefined,
      deadline: deadline || undefined,
      state: type === 'archive' ? 'ARCHIVED' as TodoState : state 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          {type === 'create' ? 'Create New Task' : type === 'update' ? 'Update Task' : 'Archive Task'}
        </h2>

        {type === 'create' || type === 'update' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 px-4 py-2.5 text-gray-900 shadow-sm transition-colors duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                placeholder="Enter task title..."
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 px-4 py-3 text-gray-900 shadow-sm transition-colors duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                placeholder="Enter task description..."
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Deadline (optional)
              </label>
              <input
                type="datetime-local"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value as TodoState)}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-white/50 px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 sm:text-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat"
              >
                <option value="TODO" className="bg-yellow-50 text-yellow-700">TO DO</option>
                <option value="DOING" className="bg-blue-50 text-blue-700">DOING</option>
                <option value="DONE" className="bg-green-50 text-green-700">DONE</option>
              </select>
              <style jsx>{`
                select option[value="TODO"] {
                  background-color: #fefce8;
                  color: #854d0e;
                }
                select option[value="DOING"] {
                  background-color: #eff6ff;
                  color: #1d4ed8;
                }
                select option[value="DONE"] {
                  background-color: #f0fdf4;
                  color: #15803d;
                }
              `}</style>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to archive this task? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Archive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
