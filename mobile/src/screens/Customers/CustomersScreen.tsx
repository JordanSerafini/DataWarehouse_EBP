import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const CustomersScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Clients</Text>
      <Text variant="bodyMedium">Liste des clients (à implémenter)</Text>
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

export default CustomersScreen;
