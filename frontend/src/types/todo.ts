export type TodoState = 'TODO' | 'DOING' | 'DONE' | 'ARCHIVED';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  state: TodoState;
  deadline?: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface TodoCreate {
  title: string;
  description?: string;
  deadline?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  deadline?: string;
  state?: TodoState;
}
