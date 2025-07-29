import { CreateTaskSchema } from '@/schema/CreateTaskSchema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from './Firebase';

export const CreateTaskService = async (task: {
  name: string;
  description: string;
  project_id: string;
  project_name: string;
  due_date?: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  ai_suggested?: boolean;
}) => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User Not Authenticated');
  }

  const validation = CreateTaskSchema.safeParse(task);
  if (validation.error) {
    throw new Error(validation.error.message);
  }

  try {
    const querySnap = doc(db, `users/${userId}/projects`, task.project_id);
    const projectRef = await getDoc(querySnap);

    if (!projectRef.exists()) {
      throw new Error('Project does not exist');
    }

    const taskdata = {
      ...validation.data,
      due_date: task.due_date
        ? task.due_date.toISOString()
        : projectRef.data().due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const taskref = await addDoc(
      collection(db, `users/${userId}/projects/${task.project_id}/tasks`),
      taskdata
    );

    return { id: taskref.id, ...taskdata };
  } catch (error) {
    console.log('Error in Creating Task', error);
    throw new Error('Error in Creating Task');
  }
};
