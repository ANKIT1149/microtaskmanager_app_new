import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from './ErrorService';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './Firebase';

export const InvoiceCountAndEarningServices = async () => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('UserId not found');
  }

  try {
    let inVoiceCount = 0;
    let totalEarning = 0;

    const projectQuery = query(collection(db, `users/${userId}/projects`));
    const projectSnap = await getDocs(projectQuery);

    for (const projectDoc of projectSnap.docs) {
      const projectId = projectDoc.id;
      const taskQuery = query(
        collection(db, `users/${userId}/projects/${projectId}/tasks`)
      );
      const taskSnap = await getDocs(taskQuery);

      for (const taskdata of taskSnap.docs) {
        const taskId = taskdata.id;
        const invoiceQuery = query(
          collection(
            db,
            `users/${userId}/projects/${projectId}/tasks/${taskId}/invoices`
          )
        );

        const inVoiceSnap = await getDocs(invoiceQuery);

        inVoiceCount += inVoiceSnap.size;

        inVoiceSnap.forEach((invoice) => {
          const totalCost = invoice.data().total_cost;
          totalEarning += totalCost;
        });
      }
    }

    return { count: inVoiceCount, earnings: totalEarning };
  } catch (error: any) {
    await logError(userId, 'InvoiceService', error.message);
    throw error;
  }
};
