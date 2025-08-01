import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiText, MotiView } from 'moti';
import { Text, Button, Card, Menu, Provider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { TaskItemProps } from '@/Interface/TaskITemProps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/Firebase';
import { StartTaskServices } from '@/services/StartTaskServices';
import { EndTaskService } from '@/services/EndTaskService';
import { InvoiceAndMailServices } from '@/services/InvoiceAndMailServices';
import { useRouter } from 'expo-router';
import { GetInvoiceIdServices } from '@/services/GetInvoiceIdServices';

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  animationDelay = 0,
}: TaskItemProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [taskData, setTaskData] = useState(task);
  const [selectedStatus, setSelectedStatus] = useState<
    'In Progress' | 'Completed' | null
  >(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [generatePdf, setGeneratePdf] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        const taskRef = doc(
          db,
          `users/${userId}/projects/${task.project_id}/tasks/${task.id}`
        );
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          const data = taskSnap.data();
          setTaskData({ ...task, ...data });

          if (data.start_time) {
            const action = await AsyncStorage.getItem('action');
            if (action === 'Pause' && data.status === 'In Progress') {
              setIsTimerRunning(false);
            } else {
              setIsTimerRunning(true);
              const startTime = new Date(data.start_time).getTime();
              const getTime = new Date().getTime();
              const serverElapsedTime = Math.floor(
                (getTime - startTime) / 1000
              );

              let totaltime = data.time_taken || 0;
              totaltime += serverElapsedTime;

              setElapsedTime(totaltime);
            }
          } else if (data.status === 'In Progress') {
            const storedTime = await AsyncStorage.getItem(
              `task_${task.id}_elapsedTime`
            );
            const initialTime = storedTime
              ? parseInt(storedTime, 10)
              : data.time_taken || 0;
            setElapsedTime(initialTime);
            if (storedTime) {
              Toast.show({
                type: 'info',
                text1: 'Resuming Paused Timer',
                text2: `Timer resumed at ${formatTime(initialTime)}`,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch task data',
        });
      }
    };

    fetchData();
  }, []);

  const handleStartTask = async () => {
    setLoading(true);
    try {
      if (taskData.status === 'In Progress') {
        const storedTime = await AsyncStorage.getItem(
          `task_${task.id}_elapsedTime`
        );
        setElapsedTime(storedTime ? parseInt(storedTime, 10) : 0);
        setIsTimerRunning(true);
        await AsyncStorage.removeItem('action');
      } else {
        await StartTaskServices(task.id, task.project_id);
        setIsTimerRunning(true);
        setElapsedTime(0);
        setSelectedStatus(null);

        Toast.show({
          type: 'success',
          text1: 'Timer Started',
          text2: `Timer started for ${task.name}`,
        });
      }
    } catch (error) {
      console.error('Error in start task', error);
      Toast.show({
        text1: 'Error',
        type: 'error',
        text2: 'Failed to start task',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleEndTask = async () => {
    if (!selectedStatus) return;
    try {
      const result = await EndTaskService(
        task.project_id,
        task.id,
        elapsedTime,
        selectedStatus
      );

      setIsTimerRunning(false);
      setTaskData({
        ...taskData,
        status: selectedStatus,
        time_taken: result.time_taken,
      });
      setSelectedStatus(null);

      if (taskData.status === 'Completed') {
        await AsyncStorage.removeItem(`task_${task.id}_elapsedTime`);
      } else {
        await AsyncStorage.setItem(
          `task_${task.id}_elapsedTime`,
          elapsedTime.toString()
        );
      }
    } catch (error) {
      console.error('Error in end task:', error);
      Toast.show({
        text1: 'Error',
        type: 'error',
        text2: 'Failed to End Task',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (second: number) => {
    const hrs = Math.floor(second / 3600)
      .toString()
      .padStart(2, '0');
    const min = Math.floor((second % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const sec = (second % 60).toString().padStart(2, '0');

    return `${hrs}:${min}:${sec}`;
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id, task.project_id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${task.name} deleted successfully`,
      });
    } catch (error: any) {
      console.error('Delete task error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete task: ' + (error.message || 'Unknown error'),
      });
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'Completed':
        return '#10b981';
      case 'In Progress':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  useEffect(() => {
    const getDownloadUrl = async () => {
      const url = await GetInvoiceIdServices(task.project_id, task.id)
      if (url) {
        setGeneratePdf(true)
      }
    }

    getDownloadUrl();
  }, [])

  const handleGenerateInvoice = async () => {
    setLoading(true);
    try {
      const result = await InvoiceAndMailServices(task.project_id, task.id);

      const data = await GetInvoiceIdServices(
        task.project_id,
        task.id,
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: result.message,
      });

      setInvoiceId(result?.invoice_id);
      setGeneratePdf(true);

      setTimeout(() => {
        router.push(`/invoice/${data}`);
      }, 4000);
    } catch (error: any) {
      console.error('Error in generating invoice:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to generate invoice: ${error.message || 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowInvoice = async () => {
    setLoading(true);
    try {
      const data = await GetInvoiceIdServices(
        task.project_id,
        task.id,
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Show Invoice Successfully',
      });

      setTimeout(() => {
        router.push(`/invoice/${data}`);
      }, 4000);
    } catch (error: any) {
      console.error('Error in Showing invoice:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to generate invoice: ${error.message || 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, delay: animationDelay }}
        style={styles.cardContainer}
      >
        <TouchableOpacity onPress={() => onEdit(taskData)}>
          <Card style={styles.card}>
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
                {taskData.name}
              </MotiText>
              <Text
                style={[styles.project, { color: '#e5e7eb' }]}
                className="font-serif text-xl mt-8 mb-5"
              >
                Project: {taskData.project_name}
              </Text>
              <View style={styles.statusContainer}>
                <Text
                  style={[styles.status, { backgroundColor: getStatusColor() }]}
                >
                  Status: {taskData.status}
                </Text>
                <Text
                  style={[
                    styles.priority,
                    { backgroundColor: getPriorityColor() },
                  ]}
                >
                  Priority: {taskData.priority}
                </Text>
              </View>
              {isTimerRunning && (
                <MotiText
                  style={styles.timer}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'timing', duration: 300 }}
                  className="mt-5"
                >
                  Timer: {formatTime(elapsedTime)}
                </MotiText>
              )}
              {isTimerRunning && (
                <Menu
                  visible={isMenuVisible}
                  onDismiss={() => setIsMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      textColor="#00ffcc"
                      style={styles.actionButton}
                      onPress={() => setIsMenuVisible(true)}
                      className="mt-8"
                    >
                      Select Action
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={async () => {
                      setSelectedStatus('In Progress');
                      setIsMenuVisible(false);
                      await AsyncStorage.setItem(`action`, 'Pause');
                    }}
                    title="Pause"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedStatus('Completed');
                      setIsMenuVisible(false);
                    }}
                    title="Complete"
                  />
                </Menu>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                buttonColor="#00ffcc"
                textColor="#1a1f3a"
                onPress={() => onEdit(taskData)}
                style={styles.editButton}
                rippleColor="rgba(0, 255, 204, 0.2)"
                className="w-[180px] mr-[50px] mt-5"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                textColor="#ff6666"
                onPress={handleDelete}
                style={styles.editButton}
                rippleColor="rgba(255, 102, 102, 0.2)"
                className="mt-5"
              >
                Delete
              </Button>
            </Card.Actions>
            <Card.Actions>
              {(taskData.status === 'Pending' ||
                taskData.status === 'In Progress') &&
                !isTimerRunning && (
                  <Button
                    mode="contained"
                    buttonColor="#00ffcc"
                    textColor="#1a1f3a"
                    onPress={handleStartTask}
                    style={styles.actionButton}
                    rippleColor="rgba(0, 255, 204, 0.2)"
                    className={`mb-5 w-[150px]`}
                  >
                    {taskData.status === 'In Progress'
                      ? 'Resume Task'
                      : 'Start Task'}
                  </Button>
                )}

              {isTimerRunning && (
                <Button
                  mode="contained"
                  buttonColor="#f59e0b"
                  textColor="#1a1f3a"
                  onPress={handleEndTask}
                  style={styles.actionButton}
                  rippleColor="rgba(245, 158, 11, 0.2)"
                  disabled={!selectedStatus}
                >
                  {selectedStatus === 'In Progress' ? 'Pause' : 'End Task'}
                </Button>
              )}
              {taskData.status === 'Completed' &&
                (generatePdf ? (
                  <Button
                    mode="contained"
                    buttonColor="#3b82f6"
                    onPress={handleShowInvoice}
                    textColor="#ffffff"
                    style={styles.actionButton}
                    rippleColor="rgba(59, 130, 246, 0.2)"
                  >
                    {isLoading ? 'Opening Invoice...' : 'Show Invoice'}
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    buttonColor="#10b981"
                    onPress={handleGenerateInvoice}
                    textColor="#1a1f3a"
                    style={styles.actionButton}
                    rippleColor="rgba(16, 185, 129, 0.2)"
                  >
                    {isLoading ? 'Generating Invoice...' : 'Generate Invoice'}
                  </Button>
                ))}
            </Card.Actions>
          </Card>
        </TouchableOpacity>
      </MotiView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: 'rgba(30, 30, 50, 0.7)',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'rgba(0, 255, 204, 0.2)',
    shadowColor: '#00ffcc',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 10,
  },
  status: {
    fontSize: 12,
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  priority: {
    fontSize: 12,
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  project: {
    marginBottom: 10,
    fontSize: 18,
  },
  timer: {
    color: '#00ffcc',
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold',
  },

  actionButton: {
    marginBottom: 10,
  },

  editButton: {
    width: 120,
  },
});
