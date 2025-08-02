import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';

export const StoreAIFreemium = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User id not exsists');
    }

    const ai_data = {
      ai_count: 0,
      email_count: 0,
      isSubscribed: false,
      month: new Date().toISOString().slice(0, 7),
    };

    const userDocRef = doc(db, 'users', userId);
    const quotaDocRef = doc(userDocRef, 'quota', 'usage');

    await setDoc(quotaDocRef, ai_data);

    return { id: quotaDocRef.id, ...ai_data };
  } catch (error) {
    console.log('Error in storing ai data', error);
    throw new Error('Error in storing ai data');
  }
};
