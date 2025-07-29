import React from 'react';
import { ScrollView,StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import TaskItem from './TaskItem';
import { Card } from 'react-native-paper';
import { TaskListProps } from '@/Interface/TaskListProps';

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tasks.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No tasks found. Add a task to get started!</Text>
            </Card.Content>
          </Card>
        ) : (
          tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              animationDelay={index * 100}
            />
          ))
        )}
      </ScrollView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  emptyCard: {
    margin: 16,
    backgroundColor: 'rgba(30, 30, 50, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 204, 0.2)',
    shadowColor: '#00ffcc',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyText: {
    color: '#e5e7eb',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
});