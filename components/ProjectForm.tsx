import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { TextInput, Button, HelperText, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import TaskSuggestionCard from './TaskSuggestionCard';
import { getClientServices } from '@/services/GetClientServices';
import { AIProjectSuggestionServices } from '@/services/AIProjectSuggestionServices';
import { UpdateProjectService } from '@/services/UpdateProjectServices';
import { CreateProjectService } from '@/services/CreateProjectServices';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ProjectCreating {
  name: string;
  description: string;
  client_id: string;
  client_name: string;
  due_date: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  hourly_rate: number;
}

export default function ProjectForm({ editingProject, onClose }: any) {
  const { clientId = '', clientName = '' } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formClientId, setFormClientId] = useState(clientId || '');
  const [formClientName, setFormClientName] = useState(clientName || '');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [hourlyRate, setHourlyRate] = useState(''); // Store as string for TextInput
  const [dueDate, setDueDate] = useState(new Date());
  type Client = { id: string; name: string };
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await getClientServices();
        setClients(
          Array.isArray(clientData)
            ? clientData.map((client: any) => ({
                id: client.id || '',
                name: client.name || '',
              }))
            : []
        );
      } catch (error) {
        console.error('Fetch clients error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load clients',
        });
        setClients([]);
      }
    };
    fetchClients();

    if (editingProject) {
      setName(editingProject.name || '');
      setDescription(editingProject.description || '');
      setFormClientId(editingProject.client_id || editingProject.clientId || '');
      setFormClientName(editingProject.client_name || editingProject.clientName || '');
      setStatus(editingProject.status || 'Pending');
      setPriority(editingProject.priority || 'Low');
      setHourlyRate(editingProject.hourly_rate?.toString() || '');
      setDueDate(editingProject.due_date ? new Date(editingProject.due_date) : new Date());
    } else {
      setName('');
      setDescription('');
      setFormClientId(clientId || '');
      setFormClientName(clientName || '');
      setStatus('Pending');
      setPriority('Low');
      setHourlyRate('');
      setDueDate(new Date());
      setTasks([]);
    }
  }, [editingProject, clientId, clientName]);

  const handleSuggestTasks = async () => {
    if (!name.trim()) {
      setError('Project name is required for task suggestions');
      return;
    }
    setIsFetchingTasks(true);
    try {
      const suggestedTasks = await AIProjectSuggestionServices({ name, description });
      setTasks(Array.isArray(suggestedTasks) ? suggestedTasks : []);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Task suggestions generated',
      });
    } catch (error: any) {
      console.error('Suggest tasks error:', error);
      setError('Failed to generate task suggestions');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate tasks',
      });
    } finally {
      setIsFetchingTasks(false);
    }
  };

  const handleAddTask = (task: any) => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: `Task "${task}" will be added in the task page`,
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!name.trim()) {
        setError('Project name is required');
        return;
      }
      if (!formClientId) {
        setError('Client selection is required');
        return;
      }

      // Prepare project data
      const projectData: ProjectCreating = {
        name,
        description: description || '',
        client_id: formClientId,
        client_name: formClientName || clients.find((c) => c.id === formClientId)?.name || '',
        due_date: dueDate,
        status,
        priority,
        hourly_rate: parseFloat(hourlyRate) || 0,
      };

      // Log for debugging
      console.log('Submitting project data:', projectData);

      setIsSubmitting(true);
      if (editingProject) {
        await UpdateProjectService(editingProject.id, projectData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${name} updated successfully`,
        });
      } else {
        await CreateProjectService(projectData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${name} created successfully`,
        });
      }

      // Reset form
      setName('');
      setDescription('');
      setFormClientId('');
      setFormClientName('');
      setStatus('Pending');
      setPriority('Low');
      setHourlyRate('');
      setDueDate(new Date());
      setTasks([]);
      setError('');
      setIsSubmitting(false);
      onClose();
    } catch (error: any) {
      console.error('Project submit error:', error);
      setError(error.message || 'Failed to save project');
      setIsSubmitting(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save project: ' + (error.message || 'Unknown error'),
      });
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 15, delay: 200 }}
      style={styles.formContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          label="Project Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          outlineColor="#4b5563"
          activeOutlineColor="#00ffcc"
          textColor="#fff"
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          outlineColor="#4b5563"
          activeOutlineColor="#00ffcc"
          textColor="#e5e7eb"
        />
        <Picker
          selectedValue={formClientId}
          onValueChange={(value: any) => {
            setFormClientId(value);
            setFormClientName(clients.find((c) => c.id === value)?.name || '');
          }}
          style={styles.picker}
          enabled={!clientId}
        >
          <Picker.Item label={formClientName || 'Select Client'} value="" />
          {clients.map((client) => (
            <Picker.Item key={client.id} label={client.name} value={client.id} />
          ))}
        </Picker>
        <Picker
          selectedValue={status}
          onValueChange={setStatus}
          style={styles.picker}
        >
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="In Progress" value="In Progress" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>
        <Picker
          selectedValue={priority}
          onValueChange={setPriority}
          style={styles.picker}
        >
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="High" value="High" />
        </Picker>
        <TextInput
          label="Hourly Rate ($)"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          outlineColor="#4b5563"
          activeOutlineColor="#00ffcc"
          textColor="#e5e7eb"
        />
        <Button
          mode="outlined"
          onPress={() => {
            try {
              setShowDatePicker(true);
            } catch (error) {
              console.error('DatePicker error:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to open date picker',
              });
            }
          }}
          style={styles.dateButton}
          textColor="#00ffcc"
        >
          Select Due Date: {dueDate.toLocaleDateString()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
            minimumDate={new Date()}
            textColor="#e5e7eb"
          />
        )}
        <Button
          mode="contained"
          buttonColor="#00ffcc"
          textColor="#1a1f3a"
          onPress={handleSuggestTasks}
          disabled={isFetchingTasks || isSubmitting}
          style={styles.button}
          loading={isFetchingTasks}
          rippleColor="rgba(0, 255, 204, 0.2)"
        >
          Suggest Tasks
        </Button>
        {tasks.length > 0 && (
          <View style={styles.taskContainer}>
            <Text style={[styles.taskHeader, styles.textDark]}>
              Suggested Tasks:
            </Text>
            {tasks.map((task, index) => (
              <TaskSuggestionCard
                key={index}
                task={task}
                onAdd={() => handleAddTask(task)}
                animationDelay={index * 100}
              />
            ))}
          </View>
        )}
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
            textColor="#1a1f3a"
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.button}
            rippleColor="rgba(0, 255, 204, 0.2)"
            loading={isSubmitting}
          >
            {editingProject ? 'Update Project' : 'Add Project'}
          </Button>
        </MotiView>
        {editingProject ? (
          <MotiView
            animate={{ scale: isSubmitting ? 0.95 : 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <Button
              mode="outlined"
              textColor="#ff6666"
              onPress={onClose}
              disabled={isSubmitting}
              style={styles.button}
              rippleColor="rgba(255, 102, 102, 0.2)"
            >
              Cancel
            </Button>
          </MotiView>
        ) : null}
      </ScrollView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 30, 50, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 204, 0.2)',
    shadowColor: '#00ffcc',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    color: 'white',
    borderRadius: 20,
  },
  picker: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e5e7eb',
    borderRadius: 20,
    padding: 8,
  },
  dateButton: { marginBottom: 16, borderColor: '#00ffcc' },
  button: { marginBottom: 8 },
  scrollContent: { paddingBottom: 16 },
  taskContainer: { marginBottom: 16 },
  taskHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  textDark: { color: '#e5e7eb' },
  textLight: { color: '#1f2937' },
});