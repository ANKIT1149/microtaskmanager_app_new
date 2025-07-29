import React, { useState } from 'react';
import { MotiView, MotiText } from 'moti';
import { Card, Button, Text } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';
import { deleteClient } from '@/services/DeleteDocService';
import { useRouter } from 'expo-router';

export default function ClientItem({
  client,
  onEdit,
  onDelete,
  animationDelay,
}: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();
  
  const handleDelete = async () => {
    try {
      await deleteClient(client.id);
      onDelete();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${client.name} deleted`,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete client',
      });
    }
  };

    const handleAddProject = () => {
    router.push({
      pathname: '/project',
      params: { clientId: client.id, clientName: client.name },
    });
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: isPressed ? 0.98 : 1 }}
      transition={{ type: 'spring', damping: 15, delay: animationDelay }}
      className={`mb-4 mt-8 rounded-xl ${isDark ? 'bg-gray-800/60' : 'bg-white/60'} border border-gray-200/20 dark:border-cyan-500/20 shadow-lg`}
      style={{ transform: [{ perspective: 1000 }], elevation: 5 }}
    >
      <Card
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <Card.Content>
          <MotiText
            className="text-2xl font-serif font-bold text-cyan-400"
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              type: 'timing',
              duration: 300,
              delay: animationDelay + 100,
            }}
          >
            {client.name}
          </MotiText>
          {client.email ? (
            <MotiText
              className="text-lg font-serif font-normal mt-2  text-black"
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'timing',
                duration: 300,
                delay: animationDelay + 100,
              }}
            >
              Email: {client.email}
            </MotiText>
          ) : null}
          {client.phone ? (
            <MotiText
              className="text-lg font-serif font-normal mt-2  text-black"
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'timing',
                duration: 300,
                delay: animationDelay + 100,
              }}
            >
              Phone: {client.phone}
            </MotiText>
          ) : null}
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            buttonColor="#00ffcc"
            textColor="#1a1f3a"
            onPress={handleAddProject}
            style={{ marginRight: 8 }}
            rippleColor="rgba(0, 255, 204, 0.2)"
          >
            Add Projects
          </Button>
          <Button
            mode="elevated"
            buttonColor="#00ffcc"
            textColor="#1a1f3a"
            onPress={() => onEdit(client)}
            style={{ marginRight: 8 }}
            rippleColor="rgba(0, 255, 204, 0.2)"
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            textColor="#ff6666"
            onPress={handleDelete}
            rippleColor="rgba(255, 102, 102, 0.2)"
          >
            Delete
          </Button>
        </Card.Actions>
      </Card>
    </MotiView>
  );
}
