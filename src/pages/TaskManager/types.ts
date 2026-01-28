export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description?: string; 
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  gardenId?: number; 
  garden?: {        
    name: string;
  };
}