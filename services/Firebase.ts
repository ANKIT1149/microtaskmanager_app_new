import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDCbkhS8qKDueG2VLjPYFbpsp3glp6SoTc',
  authDomain: 'microtasker-df05b.firebaseapp.com',
  projectId: 'microtasker-df05b',
  storageBucket: 'microtasker-df05b.firebasestorage.app',
  messagingSenderId: '202282189120',
  appId: '1:202282189120:web:ed48450dd5970c1891faa5',
  measurementId: 'G-0JEGJ8L02H',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
