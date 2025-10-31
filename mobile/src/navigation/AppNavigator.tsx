/**
 * Navigation principale de l'application
 * Utilise React Navigation v7 avec Bottom Tabs
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
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
import InterventionDetailsScreen from '../screens/Interventions/InterventionDetailsScreen.v2'; // Version API-first
import TicketsScreen from '../screens/Tickets/TicketsScreen';
import TicketDetailsScreen from '../screens/Tickets/TicketDetailsScreen';
import CustomersScreen from '../screens/Customers/CustomersScreen';
import CustomerDetailsScreen from '../screens/Customers/CustomerDetailsScreen';
import ProjectsScreen from '../screens/Projects/ProjectsScreen';
import ProjectDetailsScreen from '../screens/Projects/ProjectDetailsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AdminUsersScreen from '../screens/Admin/AdminUsersScreen';
import UserFormScreen from '../screens/Admin/UserFormScreen';
import UITestScreen from '../screens/Test/UITestScreen';

// Stores
import { useAuthStore, authSelectors } from '../stores/authStore.v2';

// Navigation types
export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  MainTabs: undefined;
  InterventionDetails: { interventionId: string };
  TicketDetails: { ticketId: number };
  CustomerDetails: { customerId: string };
  ProjectDetails: { projectId: number };
  UserForm: { userId?: string };
};

export type BottomTabParamList = {
  Planning: undefined;
  Calendar: undefined;
  Tasks: undefined;
  Interventions: undefined;
  Tickets: undefined;
  Customers: undefined;
  Projects: undefined;
  Admin: undefined;
  Profile: undefined;
  UITest: undefined; // Dev only
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Loading Screen - Pendant la vérification de l'auth
 */
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
    <ActivityIndicator size="large" color="#6200ee" />
    <Text style={{ marginTop: 16, color: '#757575' }}>Chargement...</Text>
  </View>
);

/**
 * Bottom Tabs Navigator
 */
const BottomTabsNavigator = () => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(authSelectors.user);
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <Tab.Navigator
      tabBar={(props) => <ScrollableTabBar {...props} />}
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
            case 'Tickets':
              iconName = focused ? 'ticket' : 'ticket-outline';
              break;
            case 'Customers':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Projects':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'Admin':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'UITest':
              iconName = focused ? 'flask' : 'flask-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="Planning"
        component={PlanningScreen}
        options={{ title: 'Planning', headerShown: false  }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Calendrier', headerShown: false  }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ title: 'Tâches du jour', headerShown: false  }}
      />
      <Tab.Screen
        name="Interventions"
        component={InterventionsScreen}
        options={{ title: 'Interventions', headerShown: false }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{ title: 'Tickets RMM', headerShown: false  }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomersScreen}
        options={{ title: 'Clients', headerShown: false  }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ title: 'Projets', headerShown: false  }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminUsersScreen}
          options={{ title: 'Administration', headerShown: false  }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', headerShown: false  }}
      />
      {__DEV__ && (
        <Tab.Screen
          name="UITest"
          component={UITestScreen}
          options={{
            title: 'UI Test',
            tabBarBadge: 'DEV'
          }}
        />
      )}
    </Tab.Navigator>
  );
};

/**
 * Root Stack Navigator
 */
const AppNavigator = () => {
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isLoading = useAuthStore(authSelectors.isLoading);

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
              options={{ title: 'Détail intervention', headerShown: false }}
            />
            <Stack.Screen
              name="TicketDetails"
              component={TicketDetailsScreen}
              options={{ title: 'Détail ticket', headerShown: false }}
            />
            <Stack.Screen
              name="CustomerDetails"
              component={CustomerDetailsScreen}
              options={{ title: 'Détail client', headerShown: false }}
            />
            <Stack.Screen
              name="ProjectDetails"
              component={ProjectDetailsScreen}
              options={{ title: 'Détail projet', headerShown: false }}
            />
            <Stack.Screen
              name="UserForm"
              component={UserFormScreen}
              options={{ title: 'Utilisateur', headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
