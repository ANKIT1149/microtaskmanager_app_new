import { UpdateTaskSchema } from '@/schema/CreateTaskSchema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './Firebase';

export const UpdateTaskService = async (
  taskId: string,
  projectId: string,
  task: Partial<{
    name: string;
    description: string;
    project_id: string;
    project_name: string;
    due_date?: Date;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    ai_suggested?: boolean;
  }>
) => {
  if (!projectId || !taskId) {
    throw new Error('All field are required');
  }

  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not Authenticated');
  }

  try {
    const validation = UpdateTaskSchema.safeParse(task);
    if (validation.error) {
      throw new Error(validation.error.message);
    }

    const taskdata = {
      ...validation.data,
      due_date: task.due_date ? task.due_date.toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    await updateDoc(
      doc(db, `users/${userId}/projects/${projectId}/tasks`, taskId),
      taskdata
    );

    return { id: taskId, ...taskdata };
  } catch (error) {
    console.log('Error in Updating Task Service', error);
    throw new Error('Error in Updating Task Service');
  }
};
