import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './Firebase';

export const ProjectServices = async () => {
  const userId = await AsyncStorage.getItem('userId');

  if (!userId) {
    throw new Error('UserId not found');
  }

  try {
    const projectsref = query(collection(db, `users/${userId}/projects`));
    const projectsSnap = await getDocs(projectsref);

    return projectsSnap.size;
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};
