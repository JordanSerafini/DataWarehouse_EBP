import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const InterventionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Interventions</Text>
      <Text variant="bodyMedium">Liste complète des interventions (à implémenter)</Text>
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

export default InterventionsScreen;
