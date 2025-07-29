import { CreatePojectSchema } from '@/schema/CreateProjectServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './Firebase';

export const UpdateProjectService = async (
  projectId: string,
  updates: Partial<{
    name: string;
    description: string;
    clientId: string;
    clientName: string;
    due_date: Date;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    hourly_rate: number;
  }>
) => {
  if (!projectId || Object.keys(updates).length === 0) {
    throw new Error('Project ID and at least one field to update are required');
  }

  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User Not Authenticated');
  }

  try {
    const validation = CreatePojectSchema.partial().safeParse({ updates });
    if (validation.error) {
      throw new Error(validation.error.message);
    }

    const projectref = doc(db, `users/${userId}/projects`, projectId);

    const projectData = {
      name: updates.name ?? undefined,
      description: updates.description ?? undefined,
      clientId: updates.clientId ?? undefined,
      clientName: updates.clientName ?? undefined,
      due_date: updates.due_date ? updates.due_date.toISOString() : undefined,
      status: updates.status ?? undefined,
      priority: updates.priority ?? undefined,
      hourly_rate: updates.hourly_rate ?? undefined,
      updated_at: new Date().toISOString(),
      };
      
      const filterData = Object.fromEntries(
          Object.entries(projectData).filter(([_, v]) => v !== undefined)
      )

      await updateDoc(projectref, filterData)
      
      return {projectId, ...filterData}
  } catch (error) {
    console.log('Error in Updating Project Services', error);
    throw new Error('Error in Updating Project Services');
  }
};
