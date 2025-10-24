import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type ProjectDetailsRouteProp = RouteProp<RootStackParamList, 'ProjectDetails'>;

const ProjectDetailsScreen = () => {
  const route = useRoute<ProjectDetailsRouteProp>();
  const { projectId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Détails Projet/Chantier</Text>
      <Text variant="bodyMedium">ID: {projectId}</Text>
      <Text variant="bodyMedium">(Détails à implémenter)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ProjectDetailsScreen;
