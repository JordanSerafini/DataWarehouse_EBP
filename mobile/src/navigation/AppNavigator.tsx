/**
 * Navigation principale de l'application
 * Utilise React Navigation v7 avec Bottom Tabs
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import PlanningScreen from '../screens/Planning/PlanningScreen';
import TasksScreen from '../screens/Tasks/TasksScreen';
import InterventionsScreen from '../screens/Interventions/InterventionsScreen';
import InterventionDetailsScreen from '../screens/Interventions/InterventionDetailsScreen';
import CustomersScreen from '../screens/Customers/CustomersScreen';
import CustomerDetailsScreen from '../screens/Customers/CustomerDetailsScreen';
import ProjectsScreen from '../screens/Projects/ProjectsScreen';
import ProjectDetailsScreen from '../screens/Projects/ProjectDetailsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  InterventionDetails: { interventionId: string };
  CustomerDetails: { customerId: string };
  ProjectDetails: { projectId: number };
};

export type BottomTabParamList = {
  Planning: undefined;
  Tasks: undefined;
  Interventions: undefined;
  Customers: undefined;
  Projects: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Bottom Tabs Navigator
 */
const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Planning':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Tasks':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Interventions':
              iconName = focused ? 'construct' : 'construct-outline';
              break;
            case 'Customers':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Projects':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="Planning"
        component={PlanningScreen}
        options={{ title: 'Planning' }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ title: 'Tâches du jour' }}
      />
      <Tab.Screen
        name="Interventions"
        component={InterventionsScreen}
        options={{ title: 'Interventions' }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomersScreen}
        options={{ title: 'Clients' }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ title: 'Projets' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Stack Navigator
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={BottomTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InterventionDetails"
          component={InterventionDetailsScreen}
          options={{ title: 'Détail intervention' }}
        />
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetailsScreen}
          options={{ title: 'Détail client' }}
        />
        <Stack.Screen
          name="ProjectDetails"
          component={ProjectDetailsScreen}
          options={{ title: 'Détail projet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
