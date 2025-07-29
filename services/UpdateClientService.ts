import { ClientServiceSchema } from '@/schema/ClientService';
import { db } from './Firebase';
import { doc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UpdateClientService = async (
  id: string,
  name: string,
  email: string,
  phone: number,
  
) => {
  if (!id || !email || !phone || !name) {
    throw new Error('All fields are required');
  }

  const user = await AsyncStorage.getItem("userId");
  if (!user) {
    throw new Error('User Not Authenticated');
  }

  const validation = ClientServiceSchema.safeParse({ name, phone, email });
  if (validation.error) {
    throw new Error(validation.error.message);
  }

  try {
    const clientRef = doc(db, `users/${user}/clients`, id);

    const updateData = {
      name: name,
      email: email,
      phone: phone,
      update_at: new Date().toISOString(),
    };

    const filterData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    await updateDoc(clientRef, filterData);

    return { id, ...filterData };
  } catch (error) {
    console.log('Error in Updating Client Services', error);
    throw new Error('Error in Updatin Services');
  }
};
