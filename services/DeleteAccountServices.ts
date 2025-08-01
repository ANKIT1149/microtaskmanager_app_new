import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser } from 'firebase/auth';

export const DeleteAccountServices = async () => {
  const userId: any = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('UserId not found');
  }

  try {
    await deleteUser(userId);
    await AsyncStorage.removeItem('userId');
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};
