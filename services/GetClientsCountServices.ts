import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './Firebase';

export const getClientCountServices = async () => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('UserId not found');
  }

  try {
    const clientRef = query(collection(db, `users/${userId}/clients`));
    const clientSnap = await getDocs(clientRef);

    return clientSnap.size;
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};
