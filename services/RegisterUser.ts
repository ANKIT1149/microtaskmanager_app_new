import { RegisterUserSchema } from '@/schema/RegisterSchema';
import { Alert } from 'react-native';
import { auth, db } from './Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreAIFreemium } from './StoreAiFreemium';

export const registerUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('All fields are required');
  }

  const validation = RegisterUserSchema.safeParse({
    email,
    password,
  });

  if (validation.error) {
    Alert.alert('Validation Error', validation.error.message);
    throw new Error(validation.error.message);
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const registerDoc = await setDoc(
      doc(db, 'users', userCredential.user.uid),
      {
        email: email,
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
      }
    );

    await AsyncStorage.setItem("userId", userCredential.user.uid);
    await AsyncStorage.setItem("email", email);

    await StoreAIFreemium(userCredential.user.uid)

    Alert.alert('Registration Successful', 'You have successfully registered!');

    return registerDoc
  } catch (error: any) {
    Alert.alert('Registration Error', error);
    throw new Error('Registration Failed', error);
  }
};
