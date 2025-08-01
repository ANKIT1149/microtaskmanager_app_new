import { doc, getDoc } from "firebase/firestore"
import { db } from "./Firebase"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const GetInvoiceIdServices = async(projectId: string, taskId: string) => {
    if (!projectId || !taskId) {
        throw new Error('All fields are required')
    }

    const userId = await AsyncStorage.getItem("userId")
    if (!userId) {
        throw new Error("User Id is required")
    }

    try {
        const getInvoiceRef = doc(db, `users/${userId}/projects/${projectId}/tasks`, taskId)
        const getInvoiceSnap = await getDoc(getInvoiceRef)

        if (!getInvoiceSnap.exists()) {
            throw new Error("Get invoice not exsists")
        }

        const getInvoiceData = getInvoiceSnap.data()

        const invoice_id = getInvoiceData.invoice_id

        return invoice_id
    } catch (error) {
        console.log('error in getting invoice Id', error)
        throw new Error('error in getting invoice Id')
    }
}