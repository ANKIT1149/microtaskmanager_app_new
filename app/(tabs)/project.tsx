import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Text, FAB } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import ParticleBackground from '@/components/ParticleBackground';
import Toast from 'react-native-toast-message';
import { GetProjectService } from '@/services/GetProjectServices';
import ProjectForm from '@/components/ProjectForm';
import ProjectList from '@/components/ProjectList';

type Project = {
  id: string;
};

export default function Projects() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectData = await GetProjectService();
      setProjects(projectData);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load projects',
      });
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsFormVisible(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingProject(null);
    fetchProjects();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1a1f3a', '#2a2f5a', '#3a3f7a'] : ['#e0f7ff', '#b0e7ff', '#80d7ff']}
        style={StyleSheet.absoluteFill}
      >
        <ParticleBackground />
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <Text
            variant="headlineMedium"
            style={[styles.headerText, isDark ? styles.headerTextDark : styles.headerTextLight]}
            className='mt-10'
          >
            Projects
          </Text>
        </MotiView>
        {isFormVisible ? (
          <ProjectForm editingProject={editingProject} onClose={handleCloseForm} />
        ) : (
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={fetchProjects}
          />
        )}
        {!isFormVisible && (
          <FAB
            icon="plus"
            style={[styles.fab, isDark ? styles.fabDark : styles.fabLight]}
            onPress={handleAddProject}
            rippleColor="rgba(0, 255, 204, 0.2)"
          />
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, alignItems: 'center' },
  headerText: { fontWeight: 'bold', textShadowColor: 'rgba(0, 255, 204, 0.5)', textShadowRadius: 8 },
  headerTextDark: { color: '#00ffcc' },
  headerTextLight: { color: '#1a1f3a' },
  scrollContent: { padding: 16, paddingBottom: 80 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  fabDark: { backgroundColor: '#00ffcc', borderColor: '#00ccff', borderWidth: 1 },
  fabLight: { backgroundColor: '#00ccff', borderColor: '#00ffcc', borderWidth: 1 },
});