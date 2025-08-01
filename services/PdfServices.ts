import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'

export const PdfServices = async (filename: string, html: string): Promise<string> => {
    console.log(`recive html: ${html}`)
    const { uri } = await Print.printToFileAsync({html})
    
    const newPath = `${FileSystem.documentDirectory}${filename}.pdf`

    await FileSystem.moveAsync({
        from: uri,
        to: newPath
    })

    return newPath

}