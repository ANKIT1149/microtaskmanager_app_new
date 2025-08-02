import axios from "axios"

export const GetSecretKey = async () => {
    try {
        const response = await axios.get(`https://microtask-backend.onrender.com/get_secret_key`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log('error in getting key', error)
        throw new Error("Error in getting key")
    }
}