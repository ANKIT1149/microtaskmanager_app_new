import { ClientServiceSchema } from "@/schema/ClientService";
import {db } from "./Firebase";
import { addDoc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AddClientService = async (name: string, email: string, phone: number) => { 
    if(!name || !email || !phone) {
        throw new Error('All fields are required');
    }

    const validation = ClientServiceSchema.safeParse({
        name,
        email,
        phone
    })

    if (validation.error) {
        throw new Error(validation.error.message)
    }

    try {
        const user = await AsyncStorage.getItem("userId");

        if (!user) {
            throw new Error('User not Authenticated')
        }

        const clientData = {
            name: name,
            email: email,
            phone: phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        const storeData = await addDoc(collection(db, `users/${user}/clients`), clientData)

        return {id: storeData.id, ...clientData}
    } catch (error) {
        console.log("Error in adding client", error)
        throw new Error("Error in adding client")
    }
}