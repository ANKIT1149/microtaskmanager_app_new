import { RegisterUserSchema } from "@/schema/RegisterSchema";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { Alert } from "react-native";

export const Login = async (email: string, password: string) => {
    if(!email || !password) {
        throw new Error('All fields are required');
    }

    const validation = RegisterUserSchema.safeParse({ email, password });

    if(validation.error){
        throw new Error(validation.error.message)
    }

    try {
        const loginCredential = await signInWithEmailAndPassword(auth, email, password)
        if(!loginCredential.user) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const userId = loginCredential.user.uid;

        Alert.alert('Login Successful', 'You have successfully logged in!');

        return {
            email: email,
            id: userId
        }
    } catch (error) {
        console.log("Error in Login:", error);
        return
    }
    
}