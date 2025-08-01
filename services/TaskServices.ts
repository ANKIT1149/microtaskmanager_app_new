import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from './Firebase';
import { Task } from '@/Interface/TaskProps';

export const FetchtaskSize = async (): Promise<number> => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('UserId not found');
  }

  let completedTasks = 0;

  try {
    const projectRef = query(collection(db, `users/${userId}/projects`));
    const projecSnap = await getDocs(projectRef);

    for (const projectDoc of projecSnap.docs) {
      const projectId = projectDoc.id;
      const taskQuery = query(
        collection(db, `users/${userId}/projects/${projectId}/tasks`),
        where('status', '==', 'Completed')
      );

      const taskSize = await getDocs(taskQuery);
      completedTasks += taskSize.size;
    }

    return completedTasks;
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};

export const GetTaskProgressServices = async (): Promise<Task[]> => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('UserId not found');
  }

  let tasks: Task[] = [];

  try {
    const projectRef = query(collection(db, `users/${userId}/projects`));
    const projecSnap = await getDocs(projectRef);

    for (const projectDoc of projecSnap.docs) {
      const projectId = projectDoc.id;
      const taskQuery = query(
        collection(db, `users/${userId}/projects/${projectId}/tasks`),
        where('status', '==', 'In Progress'),
        limit(3)
      );

      const taskSize = await getDocs(taskQuery);
      taskSize.forEach((taskDoc) => {
        tasks.push({
          id: taskDoc.id,
          project_id: projectId,
          name: taskDoc.data().name,
          project_name: taskDoc.data().project_name,
          status: taskDoc.data().status,
        });
      });
    }

    return tasks;
  } catch (error) {
    console.log('Error in getting userId', error);
    throw new Error('Error in getting userId');
  }
};
