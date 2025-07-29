import { B2_ACCOUNT_ID, B2_API_URL, B2_APPLICATION_KEY, B2_BUCKET_NAME } from '@env'
import axios from 'axios'
import RNFS from 'react-native-fs'
import { base64 } from 'zod'
import { StoreInvoiceUrl } from './StoreInvoiceUrl'

export const UploadPdfServices = async (filepath: string, invoiceId: string, projectId: string, taskId: string) => {
    try {
        const authorize = await axios.get(`${B2_API_URL}/b2_authorize_account`, {
            headers: { username: B2_ACCOUNT_ID, password: B2_APPLICATION_KEY },
        })
            
        const { authorizationToken, apiUrl, downloadUrl } = authorize.data

        const file = await RNFS.readFile(filepath, base64)
        const filename = `${invoiceId}.pdf`

        const uploadResponse = await axios.post(
            `${apiUrl}/b2api/v2/b2_get_upload_url`,
            { bucketId: authorize.data.allowed.bucketId },
            {headers: {Authorization: authorizationToken}}
        )

        const { uploadUrl, uploadAuthorizationToken } = uploadResponse.data
        
        await axios.post(uploadUrl, file, {
            headers: {
                Authorization: uploadAuthorizationToken,
                'X-Bz-File-Name': filename,
                'Content-Type': 'application/pdf',
                'X-Bz-Content-Sha1': 'do_not_verify',
            }
        })

        const url = `${downloadUrl}/file/${B2_BUCKET_NAME}/${filename}`
        if (!url) {
            throw new Error("Failed to get the file URL")
        }

        const data = await StoreInvoiceUrl(url, projectId, taskId, invoiceId)

        return data
    } catch (error) {
        console.log('Error in UploadPdfServices:', error);
        throw new Error("Failed to upload pdf")
    }
}