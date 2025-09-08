export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;

  projectId: string;
  sectionId: string;

  status: TaskStatus;
  priority?: Priority;

  startDate?: string;
  dueDate?: string;
  completedAt?: string;

  tags?: string[];
  subtasks?: Subtask[];
  attachments?: string[];

  createdAt: string;
  updatedAt: string;
  position: number;   // for drag-and-drop ordering
}
export interface Update {
  user: string;
  action: string;
  updatedAt: string; // keep it as string (ISO format)
}


export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;             // Use 'title' consistently, not 'name'
  description?: string;

  projectId: string;
  sectionId: string;

  status: TaskStatus;
  priority?: Priority;       // Correct casing and type

  startDate?: string;
  dueDate?: string;          // instead of 'deadline', keep property consistent
  completedAt?: string;
  completed?: boolean;       // Add completed boolean if your app uses it

  tags?: string[];
  subtasks?: Subtask[];
  attachments?: string[];

  createdAt: string;
  updatedAt: string;
  position: number;          // for drag-and-drop ordering
}

