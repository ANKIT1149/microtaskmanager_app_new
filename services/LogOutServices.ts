import AsyncStorage from "@react-native-async-storage/async-storage"
import { getAuth, signOut } from "firebase/auth"

export const LogOutServices = async () => {
    const getauth = getAuth()
    const userId = await AsyncStorage.getItem("userId")
    if (!userId) {
        throw new Error("UserId not found")
    }

    try {
        await signOut(getauth)
        await AsyncStorage.removeItem("userId")
    } catch (error) {
        console.log("Error in getting Logout", error)
        throw new Error("Error in getting Logout")
    }

}