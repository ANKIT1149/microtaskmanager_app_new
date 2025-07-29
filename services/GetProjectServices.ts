import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export const GetProjectService = async () => {

    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
        throw new Error("User not authenticated")
    }

    try {
        const querySnap = await getDocs(collection(db, `users/${userId}/projects`));

        return querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        console.log("Error in getting project service", error);
        throw new Error("Error in getting project service");
    }
}