import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from './Firebase';

export const StartTaskServices = async (taskId: string, projectId: string) => {
  if (!taskId || !projectId) {
    throw new Error('Task ID and Project ID are required');
  }

  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User Not Authenticated');
  }

  try {
    const tasksnapshot = await getDocs(
      query(
        collection(db, `users/${userId}/projects/${projectId}/tasks`),
        where('start_time', '!=', null)
      )
    );

    if (!tasksnapshot.empty) {
      throw new Error(
        'Another task is already active. Please end it before starting a new timer.'
      );
    }

    const taskref = doc(
      db,
      `users/${userId}/projects/${projectId}/tasks/${taskId}`
    );
    await setDoc(
      taskref,
      { start_time: new Date().toISOString() },
      { merge: true }
    );

    console.log(`Timer started for task ${taskId} in project ${projectId}`);
    return { success: true, message: 'Timer started successfully' };
  } catch (error) {
    console.log('Error in starting task', error);
    throw new Error('Error in starting task');
  }
};
