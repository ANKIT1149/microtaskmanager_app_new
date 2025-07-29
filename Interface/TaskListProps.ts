export interface TaskListProps {
  tasks: {
    id: string;
    name: string;
    description?: string;
    project_id: string;
    project_name: string;
    due_date?: Date;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
  }[];
  onEdit: (task: TaskListProps['tasks'][0]) => void;
  onDelete: (taskId: string, projectId: string) => Promise<void>;
}