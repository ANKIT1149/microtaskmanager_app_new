import React, { useState, useEffect } from 'react';
import { MotiText, MotiView } from 'moti';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';

import Toast from 'react-native-toast-message';
import { UpdateClientService } from '@/services/UpdateClientService';
import { AddClientService } from '@/services/ClientService';

export default function ClientForm({ editingClient, onClose }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email || '');
      setPhone(editingClient.phone || '');
    } else {
      setName('');
      setEmail('');
      setPhone(0);
    }
  }, [editingClient]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingClient) {
        await UpdateClientService(editingClient.id, name, email, phone);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${name} updated successfully`,
        });
      } else {
        await AddClientService(name, email, phone);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${name} added successfully`,
        });
      }
      setError('');
      setName('');
      setEmail('');
      setPhone(0);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      setError('Failed to save client');
      setIsSubmitting(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save client',
      });
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 15, delay: 200 }}
      className={`mb-6 mt-10 p-4 flex flex-col gap-5 rounded-xl ${isDark ? 'bg-gray-800/60' : 'bg-white/60'} border border-cyan-500/20 shadow-lg`}
    >
      <MotiText
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300, type: 'timing', duration: 1000 }}
        className="text-5xl font-extrabold font-serif mt-5 mb-5 text-neon-blue tracking-widest text-shadow"
        style={{
          textShadowColor: 'rgba(6, 182, 212, 0.7)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 15,
        }}
      >
        Add Clients
      </MotiText>
      <TextInput
        label="Client Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        className="mb-4 font-serif text-white"
        outlineColor={isDark ? '#9d0000' : '#d1d5db'}
        activeOutlineColor="#00ffcc"
        style={{ backgroundColor: 'transparent' }}
        textColor={isDark ? '#fff' : '#1f2937'}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        className="mb-4"
        outlineColor={isDark ? '#9d0000' : '#d1d5db'}
        activeOutlineColor="#00ffcc"
        style={{ backgroundColor: 'transparent' }}
        textColor={isDark ? '#e5e7eb' : '#1f2937'}
      />
      <TextInput
        label="Phone"
        value={phone.toString()}
        onChangeText={(text) => setPhone(Number(text))}
        mode="outlined"
        className="mb-4"
        outlineColor={isDark ? '#4b5563' : '#d1d5db'}
        activeOutlineColor="#00ffcc"
        style={{ backgroundColor: 'transparent' }}
        textColor={isDark ? '#e5e7eb' : '#1f2937'}
      />
      {error ? (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <HelperText type="error">{error}</HelperText>
        </MotiView>
      ) : null}
      <MotiView
        animate={{ scale: isSubmitting ? 0.95 : 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <Button
          mode="contained"
          buttonColor="#00ffcc"
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="mb-2 font-serif italic text-white text-[30px]"
          rippleColor="rgba(0, 255, 204, 0.2)"
          loading={isSubmitting}
        >
          {editingClient ? 'Update Client' : 'Add Client'}
        </Button>
      </MotiView>
      {editingClient ? (
        <MotiView
          animate={{ scale: isSubmitting ? 0.95 : 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Button
            mode="outlined"
            textColor="#fff"
            className='font-serif text-white'
            onPress={onClose}
            disabled={isSubmitting}
            rippleColor="rgba(255, 102, 102, 0.2)"
          >
            Cancel
          </Button>
        </MotiView>
      ) : null}
    </MotiView>
  );
}
