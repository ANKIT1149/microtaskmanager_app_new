import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { FAB, Text, Button } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { GetProjectService } from '@/services/GetProjectServices';
import { getTaskService } from '@/services/GetTaskServices';
import { UpdateTaskService } from '@/services/UpdateTaskServices';
import { CreateTaskService } from '@/services/CreateTaskServices';
import { DeleteTaskService } from '@/services/DeleteTaskServices';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

type Project = {
  id: string;
  name: string;
};

const TaskPage = () => {
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
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    fetchProjects();
    if (projectId) {
      fetchTasks();
    }
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

  const fetchTasks = async (overrideProjectId?: string) => {
    try {
      setIsLoading(true);
      const projectIds = overrideProjectId || projectId || selectedProjectId;
      if (!projectIds) return;
      
      console.log('Fetching tasks for project ID:', projectIds);
      const taskData = await getTaskService([projectIds]);
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
         console.log('editingTask:', editingTask);
        console.log('Updating task...');
        console.log("tasks", task, task.id)
        await UpdateTaskService(editingTask.id, task.project_id, task);
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

  const handleProjectSelectSubmit = () => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    }
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
        
        {!projectId && (
          <View style={styles.projectSelectContainer}>
            <Text style={styles.selectLabel}>Select a Project</Text>
            <Picker
              selectedValue={selectedProjectId}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedProjectId(itemValue)}
            >
              <Picker.Item label="Select a project" value="" />
              {projects.map((project) => (
                <Picker.Item key={project.id} label={project.name} value={project.id} />
              ))}
            </Picker>
            <Button
              mode="contained"
              onPress={handleProjectSelectSubmit}
              disabled={!selectedProjectId || isLoading}
              style={styles.submitButton}
            >
              View Tasks
            </Button>
          </View>
        )}

          {isFormVisible ? (
          <ScrollView>
            <TouchableOpacity onPress={() => setIsFormVisible(false)}>
              <Ionicons name="close-circle-outline" size={32} color="#ff6666" className='absolute right-5 bottom-5'/>
            </TouchableOpacity>
            <TaskForm
              editingTask={editingTask}
              onSubmit={handleSubmit}
              onClose={handleCloseForm}
              projects={projects}
            />
          </ScrollView>
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
  projectSelectContainer: {
    padding: 16,
    backgroundColor: '#2a2f4a',
    borderRadius: 8,
    margin: 16,
  },
  selectLabel: {
    color: '#00ffcc',
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#00ffcc',
    color: '#1a1f3a',
  },
});

export default TaskPage