import { addDoc, collection } from "firebase/firestore"
import { db } from "./Firebase"

export const StoreAIFreemium = async (userId: string) => {
    try {
        if (!userId) {
            throw new Error('User id not exsists')
        }

        const ai_data = {
            ai_count: 0,
            email_count: 0,
            isSubscribed: false,
            month: new Date().toISOString().slice(0, 7)
        }

        const aiData = await addDoc(collection(db, `users/${userId}/qouta/usage`), ai_data)
        
        return {id: aiData.id, ...ai_data}
    } catch (error) {
        console.log('Error in storing ai data', error)
        throw new Error('Error in storing ai data')
    }
}