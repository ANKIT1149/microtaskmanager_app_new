import { UserData } from "@/Interface/UserInfoProps"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { doc, getDoc } from "firebase/firestore"
import { db } from "./Firebase"

export const GetUserServices = async (): Promise<UserData> => {
    const userId = await AsyncStorage.getItem("userId")
    if (!userId) {
        throw new Error("UserId not found")
    }

    try {
        const userRef =  doc(db, `users/${userId}`)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
            throw new Error("No User Found")
        }

        const data = userSnap.data()
        
        const userData = {
            username: data.username,
            email: data.email
        }

        return userData

    } catch (error) {
        
        
    }
}