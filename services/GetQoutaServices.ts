import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { QoutaData } from '@/Interface/QoutaProps';

export const GetQoutaServices = async (): Promise<QoutaData> => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('UserId not found');
  }

    try {
        const qoutaRef = doc(db, `users/${userId}/qouta`, 'usage')
        const qoutaSnap = await getDoc(qoutaRef)

        const qoutaData = {
            ai_count: qoutaSnap.data()?.ai_count,
            email_count: qoutaSnap.data()?.email_count,
            isSubscribed: qoutaSnap.data()?.isSubscribed
        }

        return qoutaData
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};
