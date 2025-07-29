import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';


type MaterialIconName = 
  | "home"
  | "people"
  | "folder"
  | "assignment";

const tabOptions: { name: string; title: string; icon: MaterialIconName }[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'client', title: 'Client', icon: 'people' },
  { name: 'project', title: 'Projects', icon: 'folder' },
  { name: 'task', title: 'Tasks', icon: 'assignment' },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#00ffcc' : '#06b6d4', 
        tabBarInactiveTintColor: isDarkMode ? '#a3bffa' : '#64748b',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1a1f3a' : '#f1f5f9',
          borderTopWidth: 0, 
          elevation: 10,
          shadowColor: '#00ccff',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'uppercase',
        },
        headerShown: false,
      }}
    >
      {tabOptions.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} color={color} size={size} />
            ),
            tabBarAccessibilityLabel: `Navigate to ${tab.title} screen`,
          }}
        />
      ))}
    </Tabs>
  );
}