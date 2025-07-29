import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { logError } from './ErrorService';

export const EndTaskService = async (
  projectId: string,
  taskId: string,
  elapsedTime: number,
  status: 'In Progress' | 'Completed'
) => {
  if (!projectId || !taskId || !elapsedTime || !status) {
    throw new Error('All fields are required');
  }

  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('UserId is Required');
  }

  try {
    const taskRef = doc(
      db,
      `users/${userId}/projects/${projectId}/tasks/${taskId}`
    );
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      throw new Error('No Task Found');
    }

    const taskData = taskSnap.data();

    if (!taskData.start_time) {
      throw new Error('No active timer for task');
    }
    let totalElapsedTime = taskData.time_taken || 0;

    const startTime = new Date(taskData.start_time).getTime();
    const getTime = new Date().getTime();
    const serverElapsedTime = Math.floor((getTime - startTime) / 1000);
      totalElapsedTime += serverElapsedTime;

    await setDoc(
      taskRef,
      {
        time_taken: totalElapsedTime,
        start_time: status === 'In Progress' ? taskData.start_time : null,
        status,
      },
      {
        merge: true,
      }
    );

    console.log(
      `Timer ended for task ${taskId}: time_taken=${totalElapsedTime}s, status=${status}`
    );
    return {
      success: true,
      message: `Task ${status.toLowerCase()} successfully`,
      time_taken: totalElapsedTime,
    };
  } catch (error: any) {
    console.log('Error in ending timer', error);
    const errorMessage = error.message;

    await logError(userId, 'EndService', errorMessage);
    throw new Error('Error in ending timer');
  }
};
