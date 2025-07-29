import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase';

export const getTaskService = async (projectId: string) => {
  if (!projectId) {
    throw new Error('Project ID is Required');
  }

  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not Authenticated');
  }

  try {
    const querySnap = await getDocs(
      collection(db, `users/${userId}/projects/${projectId}/tasks`)
    );
    return querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log('Error in getting task service', error);
    throw new Error('Error in getting task service');
  }
};
