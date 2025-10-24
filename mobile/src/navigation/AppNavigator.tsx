/**
 * Navigation principale de l'application
 * Utilise React Navigation v7 avec Bottom Tabs
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import { ScrollableTabBar } from '../components/ScrollableTabBar';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import PlanningScreen from '../screens/Planning/PlanningScreen';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import TasksScreen from '../screens/Tasks/TasksScreen';
import InterventionsScreen from '../screens/Interventions/InterventionsScreen';
import InterventionDetailsScreen from '../screens/Interventions/InterventionDetailsScreen';
import CustomersScreen from '../screens/Customers/CustomersScreen';
import CustomerDetailsScreen from '../screens/Customers/CustomerDetailsScreen';
import ProjectsScreen from '../screens/Projects/ProjectsScreen';
import ProjectDetailsScreen from '../screens/Projects/ProjectDetailsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// Stores
import { useAuthStore } from '../stores/authStore';

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  InterventionDetails: { interventionId: string };
  CustomerDetails: { customerId: string };
  ProjectDetails: { projectId: number };
};

export type BottomTabParamList = {
  Planning: undefined;
  Calendar: undefined;
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
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Planning':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar-sharp' : 'calendar-outline';
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
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5, // Respecte la safe area
          paddingTop: 5,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0), // Ajuste la hauteur
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
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Calendrier' }}
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
  const { isAuthenticated, isLoading } = useAuthStore();

  // Afficher un loader pendant la vérification de l'auth
  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Non authentifié : écran de login
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // Authentifié : écrans de l'app
          <>
            <Stack.Screen
              name="MainTabs"
              component={BottomTabsNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InterventionDetails"
              component={InterventionDetailsScreen}
              options={{ title: 'Détail intervention', headerShown: true }}
            />
            <Stack.Screen
              name="CustomerDetails"
              component={CustomerDetailsScreen}
              options={{ title: 'Détail client', headerShown: true }}
            />
            <Stack.Screen
              name="ProjectDetails"
              component={ProjectDetailsScreen}
              options={{ title: 'Détail projet', headerShown: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * Loading Screen - Pendant la vérification de l'auth
 */
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
    <ActivityIndicator size="large" color="#6200ee" />
    <Text style={{ marginTop: 16, color: '#757575' }}>Chargement...</Text>
  </View>
);

// Import React Native components for LoadingScreen
import { View, Text, ActivityIndicator } from 'react-native';

export default AppNavigator;
