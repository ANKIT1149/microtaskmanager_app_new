import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { MotiView } from 'moti';
import { TextInput, Button, HelperText, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateTaskSchema } from '@/schema/CreateTaskSchema';
import { TaskFormProps } from '@/Interface/TaskFormProps';

export default function TaskForm({
  editingTask,
  onSubmit,
  onClose,
  projects,
}: TaskFormProps) {
  const { projectId = '', projectName = '' } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formProjectId, setFormProjectId] = useState(projectId || '');
  const [formProjectName, setFormProjectName] = useState(projectName || '');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>(
    'Pending'
  );
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name || '');
      setDescription(editingTask.description || '');
      setFormProjectId(editingTask.project_id || '');
      setFormProjectName(editingTask.project_name || '');
      setStatus(editingTask.status || 'Pending');
      setPriority(editingTask.priority || 'Low');
      setDueDate(
        editingTask.due_date ? new Date(editingTask.due_date) : undefined
      );
    } else {
      setName('');
      setDescription('');
      setFormProjectId(projectId || '');
      setFormProjectName(projectName || '');
      setStatus('Pending');
      setPriority('Low');
      setDueDate(undefined);
    }
  }, [editingTask, projectId, projectName]);

  const handleSubmit = async () => {
    try {
      // Client-side validation
      if (!name.trim()) {
        setError('Task name is required');
        return;
      }
      if (!formProjectId) {
        setError('Project selection is required');
        return;
      }
      if (!formProjectName) {
        setError('Project name is required');
        return;
      }

      const taskData = {
        name,
        description: description || '',
        project_id: formProjectId,
        project_name: formProjectName,
        due_date: dueDate,
        status,
        priority,
      };

      const validatedData = CreateTaskSchema.safeParse(taskData);
      if (!validatedData.success) {
        setError(validatedData.error.message || 'Invalid task data');
        return;
      }

      console.log('Submitting task data:', validatedData.data);

      setIsSubmitting(true);
      await onSubmit(validatedData.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${name} ${editingTask ? 'updated' : 'created'} successfully`,
      });

      // Reset form
      setName('');
      setDescription('');
      setFormProjectId('');
      setFormProjectName('');
      setStatus('Pending');
      setPriority('Low');
      setDueDate(undefined);
      setError('');
      setIsSubmitting(false);
      onClose();
    } catch (error: any) {
      console.error('Task submit error:', error);
      setError(error.message || 'Failed to save task');
      setIsSubmitting(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save task: ' + (error.message || 'Unknown error'),
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
         Add Task
        </Text>
      </MotiView>
      <TextInput
        label="Task Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        outlineColor="#4b5563"
        activeOutlineColor="#00ffcc"
        textColor="#fff"
        maxLength={100}
        placeholder="Enter task name"
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
        maxLength={500}
        placeholder="Describe the task"
      />
      <Picker
        selectedValue={formProjectId}
        onValueChange={(value: string) => {
          setFormProjectId(value);
          setFormProjectName(projects.find((p) => p.id === value)?.name || '');
        }}
        style={styles.picker}
        enabled={!projectId}
      >
        <Picker.Item label={formProjectName || 'Select Project'} value="" />
        {projects.map((project) => (
          <Picker.Item
            key={project.id}
            label={project.name}
            value={project.id}
          />
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
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
        textColor="#00ffcc"
        disabled={isSubmitting}
      >
        Due Date: {dueDate ? dueDate.toLocaleDateString() : 'Not set'}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
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
          rippleColor="rgba(0, 255,204, 0.2)"
          loading={isSubmitting}
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
      </MotiView>
      {editingTask ? (
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
    </MotiView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    margin: 16,
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
    backgroundColor: 'rgba(255, 255,255, 0.1)',
    color: '#e5e7eb',
    borderRadius: 10,
    padding: 8,
  },
  dateButton: {
    marginBottom: 16,
    borderColor: '#00ffcc',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 8,
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
