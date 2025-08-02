import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';
import ClientList from '@/components/ClientList';
import ClientForm from '@/components/ClientForm';
import ReloadWrapper from '@/components/ReloadWrapper';

export default function ClientPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [editingClient, setEditingClient] = useState(null);

  return (
    <ReloadWrapper scrollable>
      <View className="flex-1">
        <LinearGradient
          colors={
            isDark
              ? ['#0d1b2a', '#1b263b', '#2a3a5a']
              : ['#e5e7eb', '#d1d5db', '#f1f5f9']
          }
          className="absolute inset-0"
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
          <ClientForm
            editingClient={editingClient}
            onClose={() => setEditingClient(null)}
          />
          <ClientList onEdit={setEditingClient} />
        </ScrollView>
        <Toast />
      </View>
    </ReloadWrapper>
  );
}
