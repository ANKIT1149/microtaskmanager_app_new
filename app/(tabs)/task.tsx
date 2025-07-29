import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { FAB, Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { GetProjectService } from '@/services/GetProjectServices';
import { getTaskService } from '@/services/GetTaskServices';
import { UpdateTaskService } from '@/services/UpdateTaskServices';
import { CreateTaskService } from '@/services/CreateTaskServices';
import { DeleteTaskService } from '@/services/DeleteTaskServices';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

type Project = {
  id: string;
  name: string;
};

export default function TaskPage() {
  const { projectId = '', projectName = '' } = useLocalSearchParams();
  type Task = {
    id: string;
    name: string;
    description: string;
    project_id: string;
    project_name: string;
    due_date?: Date;
    status: string;
    priority: string;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      const projectData = await GetProjectService();
      setProjects(
        Array.isArray(projectData)
          ? projectData.map((project: any) => ({
              id: project.id || '',
              name: project.name || '',
            }))
          : []
      );
    } catch (error) {
      console.error('Fetch project error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load projects',
      });
    }
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const projectIds = projectId ? [projectId] : projects.map(p => p.id);
      console.log('Fetching tasks for project IDs:', projectIds);
      
      const taskData = await getTaskService(projectIds);
      setTasks(
        Array.isArray(taskData)
          ? taskData.map((task: any) => ({
              id: task.id,
              name: task.name,
              description: task.description,
              project_id: task.project_id,
              project_name: task.project_name,
              due_date: task.due_date ? new Date(task.due_date) : undefined,
              status: task.status,
              priority: task.priority,
            }))
          : []
      );
    } catch (error) {
      console.error('Fetch tasks error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load tasks',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (task: any) => {
    try {
      if (editingTask) {
        await UpdateTaskService(task.project_id, editingTask?.id, task);
      } else {
        await CreateTaskService(task);
      }
      await fetchTasks();
    } catch (error) {
      console.error('Task submit error:', error);
      throw error;
    }
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const handleDelete = async (taskId: any, projectId: any) => {
    try {
      await DeleteTaskService(projectId, taskId);
      await fetchTasks();
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingTask(null);
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        style={styles.content}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <Text
            variant="headlineMedium"
            style={[styles.headerText, styles.headerTextDark]}
            className="mt-10"
          >
            Tasks
          </Text>
        </MotiView>
        {isFormVisible ? (
          <TaskForm
            editingTask={editingTask}
            onSubmit={handleSubmit}
            onClose={handleCloseForm}
            projects={projects}
          />
        ) : (
          <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        {!isFormVisible && (
          <FAB
            style={styles.fab}
            icon="plus"
            color="#1a1f3a"
            onPress={() => setIsFormVisible(true)}
            disabled={isLoading}
            rippleColor="rgba(0, 255, 204, 0.2)"
          />
        )}
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f3a',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#00ffcc',
    borderRadius: 28,
  },
  headerText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 255, 204, 0.5)',
    textShadowRadius: 8,
  },
  headerTextDark: { color: '#00ffcc' },
  headerTextLight: { color: '#1a1f3a' },
  header: { padding: 16, alignItems: 'center' },
});
