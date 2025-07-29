export interface TaskFormProps {
  editingTask?: {
    id: string;
    name: string;
    description?: string;
    project_id: string;
    project_name: string;
    due_date?: Date;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
  };
  onSubmit: (task: {
    name: string;
    description?: string;
    project_id: string;
    project_name: string;
    due_date?: Date;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
  }) => Promise<void>;
  onClose: () => void;
  projects: { id: string; name: string }[];
}
