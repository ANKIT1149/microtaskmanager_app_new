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

        if (!qoutaSnap.exists()) {
            throw new Error("Qouta Snap Exsists")
        }

        const data = qoutaSnap.data()

        const qoutaData = {
            ai_count: data.ai_count,
            email_count: data.email_count,
            isSubscribed: data.isSubscribed
        }

        return qoutaData
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};
