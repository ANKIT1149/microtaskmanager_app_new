import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { StoreInvoiceUrl } from './StoreInvoiceUrl';
import { InvoiceData } from '@/Interface/InvoiceDataProps';
import * as sha1 from 'js-sha1'
import { GetSecretKey } from '@/utils/GetSecretKey';

if (typeof atob === 'undefined') {
  global.atob = (input) => Buffer.from(input, 'base64').toString('binary');
}

export const UploadPdfServices = async (
  filepath: string,
  invoiceId: string,
  projectId: string,
  taskId: string,
  invoiceData: Omit<
    InvoiceData,
    'url' | 'created_at' | 'updated_at' | 'invoice_id'
  >
): Promise<InvoiceData & { id: string }> => {
  const bucketId = 'b5a3ab48d19a522191800d14';
  
  const keys = await GetSecretKey();
  const fileread = await FileSystem.getInfoAsync(filepath);
  if (!fileread.exists) throw new Error(`File not found: ${filepath}`);

  try {
    const authString = btoa(`${keys.B2_APPLICATION_KEY_ID}:${keys.B2_APPLICATION_KEY}`);
    const authorize = await axios.get(
      'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
      {
        headers: {
          Authorization: `Basic ${authString}`,
        },
      }
    );
    const { authorizationToken, apiUrl, downloadUrl } = authorize.data;

    const base64File = await FileSystem.readAsStringAsync(filepath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const binaryString = atob(base64File);
    const byteArray = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

    const Sha1Hash = sha1.sha1(byteArray);

    const filename = `${invoiceId}.pdf`;

    const uploadRes = await axios.post(
      `${apiUrl}/b2api/v2/b2_get_upload_url`,
      { bucketId },
      { headers: { Authorization: authorizationToken } }
    );
    const { uploadUrl, authorizationToken: uploadAuthToken } = uploadRes.data;

    try {
      await axios.post(uploadUrl, byteArray, {
        headers: {
          Authorization: uploadAuthToken,
          'X-Bz-File-Name': encodeURIComponent(filename),
          'Content-Type': 'application/pdf',
          'X-Bz-Content-Sha1': Sha1Hash,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    } catch (uploadError: any) {
      if (uploadError.response) {
        console.log('Upload failed:', uploadError.response.data);
      }
      throw uploadError;
    }

    const url = `${downloadUrl}/file/${keys.B2_BUCKET_NAME}/${filename}`;
    if (!url) throw new Error('Failed to get the file URL');

    const data = await StoreInvoiceUrl(
      url,
      projectId,
      taskId,
      invoiceId,
      invoiceData
    );
    return data;
  } catch (error: any) {
    console.log('Error in UploadPdfServices:', error);
    if (error.response) {
      console.log('B2 error data:', error.response.data);
    }
    throw new Error('Failed to upload pdf');
  }
};
