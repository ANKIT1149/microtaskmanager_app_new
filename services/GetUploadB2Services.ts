import { GetSecretKey } from '@/utils/GetSecretKey';
import axios from 'axios';
const bucketId = 'b5a3ab48d19a522191800d14';

export const GetInvoiceDownloadUrl = async (
  invoiceId: string
): Promise<string> => {
  const keys = await GetSecretKey()
  try {
    const authString = btoa(`${keys.B2_APPLICATION_KEY_ID}:${keys.B2_APPLICATION_KEY}`);
    const authRes = await axios.get(
      'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
      {
        headers: { Authorization: `Basic ${authString}` },
      }
    );

    const { authorizationToken, apiUrl } = authRes.data;

    const fileName = `${invoiceId}.pdf`;
    const fileNamePrefix = fileName;

    console.log(`filenameprefix: ${fileNamePrefix}`)

    const validDurationInSeconds = 60 * 60;

    console.log('Getting download auth for:', {
      bucketId,
      fileName,
      apiUrl,
      authorizationToken,
    });
    const downloadAuthRes = await axios.post(
      `${apiUrl}/b2api/v2/b2_get_download_authorization`,
      {
        bucketId,
        fileNamePrefix: fileNamePrefix,
        validDurationInSeconds,
      },
      {
        headers: {
          Authorization: authorizationToken,
        },
      }
    );

    const authToken = downloadAuthRes.data.authorizationToken;
    console.log(authToken)

    const url = `${keys.BASE_DOWNLOAD_URL}/${invoiceId}.pdf?Authorization=${authToken}`;
    return url;
  } catch (error: any) {
    console.error('Error generating download URL:', error.response.data || error.message);
    throw new Error('Failed to generate download URL');
  }
};
