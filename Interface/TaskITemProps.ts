export interface TaskItemProps {
  task: {
    id: string;
    name: string;
    description?: string;
    project_id: string;
    project_name: string;
    due_date?: Date;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    time_taken?: number
  };
  onEdit: (task: TaskItemProps['task']) => void;
  onDelete: (taskId: string, projectId: string) => Promise<void>;
  animationDelay?: number;
}