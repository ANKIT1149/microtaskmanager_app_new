import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./Firebase";

export const DeleteTaskService = async (projectId: string, taskId: string) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('User Not Authenticated');
    }

    await deleteDoc(doc(db, `users/${userId}/projects/${projectId}/tasks`, taskId));
  } catch (error) {
    console.error('Error in deleting task:', error);
    throw new Error('Error in deleting task');
  }
};