import React from 'react';
import { FlatList, View } from 'react-native';
import ProjectItem from './ProjectsItem';

export default function ProjectList({ projects, onEdit, onDelete }: any) {
  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <ProjectItem
          project={item}
          onEdit={onEdit}
          onDelete={onDelete}
          animationDelay={index * 100}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}