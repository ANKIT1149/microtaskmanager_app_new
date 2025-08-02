// components/ReloadWrapper.tsx
import { PageWrapperProps } from '@/Interface/PageWrapperProps';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const ReloadWrapper = ({ children, scrollable = false }: PageWrapperProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Toast.show({ type: 'success', text1: 'Page reloaded' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Refresh failed' });
    } finally {
      setRefreshing(false);
    }
  };

  if (scrollable) {
    return (
      <ScrollView
        scrollEnabled={scrollable}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00ffcc"
            colors={['#00ffcc']}
          />
        }
      >
        {children}
      </ScrollView>
    );
  }

  return <View>{children}</View>;
};

export default ReloadWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 0, // Remove or adjust if needed
  },
});
