import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "./Firebase"

export const logError = async (userId: string, service: string, message: string) => {
    if (!userId) return
    
    try {
        const logRef = doc(collection(db, `users/${userId}/logs`))

        await setDoc(logRef, {
            service,
            message,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.log('Failed to log error', error)
    }
}
