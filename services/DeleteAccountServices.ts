import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser, getAuth } from 'firebase/auth';

export const DeleteAccountServices = async () => {
  const userId: any = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const auth = getAuth();
  const user: any = auth.currentUser;

  try {
    await deleteUser(user);
    await AsyncStorage.removeItem('userId');
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};
