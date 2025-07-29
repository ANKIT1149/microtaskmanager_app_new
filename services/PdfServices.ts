import RNHTMLtoPDF from 'react-native-html-to-pdf'

export const PdfServices = async (filename: string, html: string): Promise<string> => {
    const option = {
        html,
        filename,
        directory: 'Documents'
    }

    const file = await RNHTMLtoPDF.convert(option)
    return file.filePath
}