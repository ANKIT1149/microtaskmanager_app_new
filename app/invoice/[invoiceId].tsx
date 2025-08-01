import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import Toast from 'react-native-toast-message';
import { GetInvoiceDownloadUrl } from '@/services/GetUploadB2Services';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const InvoiceDetail = () => {
  const { invoiceId }: any = useLocalSearchParams();
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const getDownloadUrl = async () => {
      try {
        const getUrl = await GetInvoiceDownloadUrl(invoiceId);
        if (getUrl) {
          setPdfUrl(getUrl);
        }

        Toast.show({
          type: 'success',
          text1: 'Invoice Url Found',
          text2: 'Displaying Invoice Pdf',
        });
      } catch (error) {
        console.log('Error in getting Download Url', error);
        Toast.show({
          type: 'error',
          text1: 'Invoice Download Failed',
          text2: 'The Url Not Get ',
        });
      }
    };

    getDownloadUrl();
  }, [invoiceId]);

  const downloadInvoice = async () => {
    if (!pdfUrl) {
      console.log('No PDF URL available');
      Toast.show({
        type: 'error',
        text1: 'No PDF URL',
        text2: 'PDF URL is not available.',
      });
      return;
    }

    console.log('Starting download for invoiceId:', invoiceId);
    console.log('PDF URL:', pdfUrl);
    console.log(
      'Target path:',
      `${FileSystem.documentDirectory}${invoiceId}.pdf`
    );

    try {
      const downloadPath = `${FileSystem.documentDirectory}${invoiceId}.pdf`;
      console.log('Sanitized download path:', downloadPath);

      const { uri } = await FileSystem.downloadAsync(pdfUrl, downloadPath);
      console.log('Download completed, URI:', uri);

      const fileInfo = await FileSystem.getInfoAsync(downloadPath);
      console.log('File info:', fileInfo);

      if (fileInfo.exists) {
        Toast.show({
          type: 'success',
          text1: 'Invoice Downloaded',
          text2: `The invoice was saved to: ${uri}`,
        });
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Media library permission denied');
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Storage permission is required to save the file.',
        });
        return;
      }

      let asset;
      try {
        asset = await MediaLibrary.createAssetAsync(uri);
        console.log('Asset created:', asset);
      } catch (assetError) {
        console.error('Error creating asset:', assetError);
        console.log('Triggering toast: Asset Creation Failed');
        Toast.show({
          type: 'error',
          text1: 'Asset Creation Failed',
          text2: 'Could not create media asset.',
          visibilityTime: 4000,
        });
        return;
      }

      const album = await MediaLibrary.getAlbumAsync('Downloads');

      if (album == null) {
        await MediaLibrary.createAlbumAsync('Downloads', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      console.log('File saved to Downloads:', asset.uri);
      Toast.show({
        type: 'success',
        text1: 'Invoice Downloaded',
        text2: 'The invoice was saved to your Downloads folder.',
      });
    } catch (error: any) {
      console.error('Download error:', error.message, error.stack);
      Toast.show({
        type: 'error',
        text1: 'Invoice Download Failed',
        text2:
          error.message || 'An error occurred while downloading the invoice.',
      });
    }
  };

  const shareInvoice = async () => {
    if (!pdfUrl) return;
    try {
      const downloadPath = FileSystem.documentDirectory + `${invoiceId}.pdf`;
      await FileSystem.downloadAsync(pdfUrl, downloadPath);
      await Sharing.shareAsync(downloadPath);
    } catch (error) {
      console.log('Error in Sharing Pdf', error);
      Toast.show({
        type: 'error',
        text1: 'Invoice Share',
        text2: 'Invoice Shared Failed',
      });
    }
  };

  const testToast = () => {
    console.log('Triggering toast: Test');
    Toast.show({
      type: 'info',
      text1: 'Test Toast',
      text2: 'This is a test toast!',
      visibilityTime: 4000, // Ensure it stays visible longer
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Invoice</Text>

      {pdfUrl ? (
        <View style={styles.webviewContainer}>
          <WebView
            source={{
              uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`,
            }}
            style={{ flex: 1, marginTop: 80, marginBottom: 80 }}
            originWhitelist={['*']}
          />
        </View>
      ) : (
        <Text style={styles.loading}>Loading PDF...</Text>
      )}

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={downloadInvoice}>
          <Ionicons name="download-outline" size={32} color="#00ffcc" />
        </TouchableOpacity>

        <TouchableOpacity onPress={shareInvoice}>
          <Ionicons name="share-social-outline" size={32} color="#00ffcc" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close-circle-outline" size={32} color="#ff6666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={testToast}>
          <Ionicons name="alert-circle-outline" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InvoiceDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f2a',
    padding: 16,
  },
  title: {
    fontSize: 22,
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 40,
  },
  webviewContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00ffcc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  loading: {
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 20,
  },
});
