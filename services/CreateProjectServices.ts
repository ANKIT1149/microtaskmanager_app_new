import { CreatePojectSchema } from '@/schema/CreateProjectServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './Firebase';

export const CreateProjectService = async (projects: {
  name: string;
  description: string;
  client_id: string;
  client_name: string;
  due_date: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  hourly_rate: number;
}) => {
  if (Object.keys(projects).length === 0) {
    throw new Error('All fields are required');
  }

  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User Not Authenticated');
  }

  try {
    console.log('CreateProjectService received:', projects);

    const validation = CreatePojectSchema.safeParse({
      ...projects,
      due_date: projects.due_date,
    });

    if (!validation.success) {
      console.error('Validation error:', validation.error);
      throw new Error(`Validation failed: ${validation.error.message}`);
    }

    // Prepare Firestore data
    const projectData = {
      ...validation.data,
      due_date: projects.due_date.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const projectref = await addDoc(
      collection(db, `users/${userId}/projects`),
      projectData
    );

    return { id: projectref.id, ...projectData };
  } catch (error) {
    console.log('Error in creating project service', error);
    throw new Error('Error in creating project service');
  }
};
