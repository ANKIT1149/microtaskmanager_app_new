import React, { useEffect, useState } from 'react';
import {Text, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { TextInput } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';
import { getClientServices } from '@/services/GetClientServices';
import { ClientService } from '@/Interface/ClientServiceProps';
import ClientItem from './ClientItem';

export default function ClientList({ onEdit }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [clients, setClients] = useState<ClientService[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientService[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientData = await getClientServices();
        setClients(clientData);
        setFilteredClients(clientData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch clients',
        });
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    setFilteredClients(
      clients.filter(client =>
        client?.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15, delay: 400 }}
    >
      <Text className="text-2xl text-cyan-400 mb-4 font-bold">Your Clients</Text>
      <TextInput
        label="Search Clients"
        value={search}
        onChangeText={setSearch}
        mode="outlined"
        className="mb-6 flex justify-center items-center"
        outlineColor={isDark ? '#4b5563' : '#d1d5db'}
        activeOutlineColor="#00ffcc"
        left={<TextInput.Icon icon="magnify" color="#00ffcc" />}
      />
      {loading ? (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500 }}
          className="items-center"
        >
          <ActivityIndicator size="large" color="#00ffcc" />
        </MotiView>
      ) : filteredClients.length === 0 ? (
        <Text className="text-gray-300 dark:text-gray-400 text-center">
          No clients found. Add a new client to get started!
        </Text>
      ) : (
        filteredClients.map((client, index) => (
          <ClientItem
            key={client.id}
            client={client}
            onEdit={onEdit}
            onDelete={() => {
              setClients(clients.filter(c => c.id !== client.id));
              setFilteredClients(filteredClients.filter(c => c.id !== client.id));
            }}
            animationDelay={index * 100}
          />
        ))
      )}
    </MotiView>
  );
}