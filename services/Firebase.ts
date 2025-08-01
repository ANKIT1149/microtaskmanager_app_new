import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetSecretKey } from '@/utils/GetSecretKey';

let firebaseConfig = {};
(async () => {
  const keys = await GetSecretKey();
  try {
    firebaseConfig = {
      apiKey: keys.FIREBASE_API_KEY,
      authDomain: keys.FIREBASE_AUTH_DOMAIN,
      projectId:  keys.FIREBASE_PROJECT_ID,
      storageBucket: keys.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: keys.FIREBASE_SENDER_ID,
      appId: keys.FIREBASE_APP_ID,
      measurementId: keys.FIREBASE_MEASUREMENT_APP_ID,
    };
  } catch (error) {
    console.error('Failed to fetch Firebase keys:', error);
  }
})();

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
