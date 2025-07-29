import { deleteDoc, doc } from "firebase/firestore";
import {db } from "./Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const deleteProjectClient = async (id: string) => {
  const user = await AsyncStorage.getItem('userId');

  if (!user) throw new Error('User not authenticated');

  await deleteDoc(doc(db, `users/${user}/projects`, id));

};