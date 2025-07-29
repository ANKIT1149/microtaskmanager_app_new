import { collection, getDocs } from "firebase/firestore"
import {db} from "./Firebase"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getClientServices = async() => {
     try {
         const user = await AsyncStorage.getItem("userId");
         if (!user) {
             throw new Error("User Not authenticated")
         }

         const querySnap = await getDocs(collection(db, `users/${user}/clients`))
         
         return querySnap.docs.map(doc => ({id: doc.id, ...doc.data()}))
     } catch (error) {
         console.log("Error in getting client services", error)
         throw new Error("Error in getting Client Service")
     }
}