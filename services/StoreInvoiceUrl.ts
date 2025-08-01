import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { InvoiceData } from '@/Interface/InvoiceDataProps';

export const StoreInvoiceUrl = async (
  url: string,
  projectId: string,
  taskId: string,
  invoiceId: string,
  invoiceData: Omit<
    InvoiceData,
    'url' | 'created_at' | 'updated_at' | 'invoice_id'
  >
): Promise<InvoiceData & { id: string }> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in Asyncstorage');
    }

    const querySnap = doc(
      db,
      `users/${userId}/projects/${projectId}/tasks`,
      taskId
    );
    const taskRef = await getDoc(querySnap);

    if (!taskRef.exists()) {
      throw new Error('Task does not exist');
    }

    const taskData = taskRef.data();
    if (!taskData) {
      throw new Error('Project not exsist');
    }

    const invoice_data: InvoiceData = {
      ...invoiceData,
      invoice_id: invoiceId,
      url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const invoicedata = await addDoc(
      collection(
        db,
        `users/${userId}/projects/${projectId}/tasks/${taskId}/invoices`
      ),
      invoice_data
    );

    console.log(`Invoice stored for task ${taskId}: ${invoiceId}`);
    return { id: invoicedata.id, ...invoice_data };
  } catch (error) {
    console.log('Error in storing invoices', error);
    throw new Error('Error in storing invoices');
  }
};
