import React, { useState } from 'react';
import { MotiView, MotiText } from 'moti';
import { Card, Button, Chip, Text } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';
import { deleteProjectClient } from '@/services/DeleteProjectServices';
import { useRouter } from 'expo-router';

export default function ProjectItem({
  project,
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
      await deleteProjectClient(project.id);
      onDelete();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${project.name} deleted`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete project',
      });
    }
  };

  const handleAddProject = () => {
    router.push({
      pathname: '/task',
      params: { projectId: project.id, projectName: project.name },
    });
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: isPressed ? 0.98 : 1 }}
      transition={{ type: 'spring', damping: 15, delay: animationDelay }}
      style={{
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: isDark
          ? 'rgba(30, 30, 50, 0.7)'
          : 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        borderColor: isDark
          ? 'rgba(0, 255, 204, 0.2)'
          : 'rgba(0, 204, 255, 0.2)',
        shadowColor: '#00ffcc',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      }}
      className="p-5 rounded-2xl w-full"
    >
      <Card
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={{ backgroundColor: 'transparent', borderRadius: 16 }}
      >
        <Card.Content>
          <MotiText
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#00ffcc',
              marginBottom: 8,
            }}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              type: 'timing',
              duration: 300,
              delay: animationDelay + 100,
            }}
            className="font-serif mt-4 mb-5 px-5 text-center border-b-2 border-red-900"
          >
            {project.name}
          </MotiText>
          <Text
            style={{
              color: isDark ? '#e5e7eb' : '#4b5563',
              fontFamily: 'serif',
            }}
            className="font-serif ml-5 mb-3 mt-3 text-xl"
          >
            Client: {project.client_name}
          </Text>
          <Text
            style={{ color: isDark ? '#e5e7eb' : '#4b5563' }}
            className="font-serif ml-5 mb-3 mt-3 text-xl"
          >
            Due_Date: {new Date(project.due_date).toLocaleDateString()}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 8,
              justifyContent: 'space-between',
              marginLeft: '5px',
              marginRight: '5px',
            }}
          >
            <Chip
              style={{
                backgroundColor:
                  project.status === 'Completed'
                    ? '#22c55e'
                    : project.status === 'In Progress'
                      ? '#eab308'
                      : '#ef4444',
                marginRight: 8,
              }}
              textStyle={{ color: '#fff' }}
            >
              Status: {project.status}
            </Chip>
            <Chip
              style={{
                backgroundColor:
                  project.priority === 'High'
                    ? '#dc2626'
                    : project.priority === 'Medium'
                      ? '#f59e0b'
                      : '#3b82f6',
              }}
              textStyle={{ color: '#fff' }}
            >
              Prority: {project.priority}
            </Chip>
          </View>
          <Text
            style={{ color: isDark ? '#e5e7eb' : '#4b5563', marginTop: 15 }}
            className="font-serif ml-5 mb-3 mt-8 text-xl"
          >
            Rate: ${project.hourly_rate}/hr
          </Text>
          {project.description && (
            <Text
              style={{ color: isDark ? '#e5e7eb' : '#4b5563', marginTop: 8 }}
              className="font-serif ml-5 mb-3 mt-3 text-lg italic mr-5 capitalize"
            >
              Description: {project.description}
            </Text>
          )}
        </Card.Content>
        <Card.Actions className="mb-8 flex justify-between">
          <Button
            mode="contained"
            buttonColor="#00ffcc"
            textColor="#1a1f3a"
            onPress={() => onEdit(project)}
            rippleColor="rgba(0, 255, 204, 0.2)"
            className="mr-[100px] w-[100px] font-serif font-bold text-black"
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            textColor="#ff6666"
            onPress={handleDelete}
            rippleColor="rgba(255, 102, 102, 0.2)"
            className="mr-[20px]"
          >
            Delete
          </Button>
        </Card.Actions>
        <Card.Actions className="mb-8 flex justify-between">
          <Button
            mode="elevated"
            buttonColor="#00ffcc"
            textColor="#1a1f3a"
            onPress={handleAddProject}
            rippleColor="rgba(0, 255, 204, 0.2)"
            className="w-[300px] mr-[100px] font-serif font-bold text-black"
          >
            Add Task
          </Button>
        </Card.Actions>
      </Card>
    </MotiView>
  );
}
