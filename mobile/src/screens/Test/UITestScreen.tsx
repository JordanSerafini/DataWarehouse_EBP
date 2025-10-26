/**
 * UITestScreen - Test des composants UI avec NativeWind
 * Screen de test pour valider Button, Card, Input et les stores v2
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, Card, CardHeader, CardContent, CardActions, Input, PasswordInput, SearchInput } from '../../components/ui';

// Test des stores v2
import { useAuthStore, authSelectors } from '../../stores/authStore.v2';
import { useSyncStore, syncSelectors, useTimeSinceLastSync } from '../../stores/syncStore.v2';

export default function UITestScreen() {
  // State local pour les inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Test authStore v2
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const authError = useAuthStore(authSelectors.error);

  // Test syncStore v2
  const isSyncing = useSyncStore(syncSelectors.isSyncing);
  const syncProgress = useSyncStore(syncSelectors.syncProgress);
  const syncMessage = useSyncStore(syncSelectors.syncMessage);
  const timeSince = useTimeSinceLastSync();

  // Actions
  const startSync = useSyncStore((state) => state.startSync);
  const updateProgress = useSyncStore((state) => state.updateProgress);
  const completeSuccess = useSyncStore((state) => state.completeSuccess);

  // Test sync simulation
  const handleTestSync = () => {
    startSync();

    // Simuler progression
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateProgress(progress, `Synchronisation... ${progress}%`);

      if (progress >= 100) {
        clearInterval(interval);
        completeSuccess({
          interventions: 42,
          customers: 128,
          projects: 15,
        });
        Alert.alert('Succès', 'Synchronisation terminée !');
      }
    }, 300);
  };

  const handleTestButton = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Test', 'Button fonctionne !');
    }, 2000);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-primary">
            UI Test Screen
          </Text>
          <Text className="text-sm text-text-secondary mt-1">
            Test des composants NativeWind et stores v2
          </Text>
        </View>

        {/* Section: Stores v2 Status */}
        <Card variant="outlined" padding="md">
          <CardHeader title="Stores v2 Status" subtitle="État des stores Zustand" />
          <CardContent className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Auth:</Text>
              <Text className={`font-semibold ${isAuthenticated ? 'text-green-600' : 'text-error'}`}>
                {isAuthenticated ? '✓ Connecté' : '✗ Déconnecté'}
              </Text>
            </View>
            {user && (
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">User:</Text>
                <Text className="font-medium">{user.fullName || user.email}</Text>
              </View>
            )}
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Sync:</Text>
              <Text className={`font-semibold ${isSyncing ? 'text-primary' : 'text-text-primary'}`}>
                {isSyncing ? `⟳ ${syncProgress}%` : timeSince || 'Jamais'}
              </Text>
            </View>
            {syncMessage && (
              <Text className="text-xs text-text-secondary italic mt-1">
                {syncMessage}
              </Text>
            )}
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              size="sm"
              onPress={handleTestSync}
              disabled={isSyncing}
            >
              Tester Sync
            </Button>
          </CardActions>
        </Card>

        {/* Section: Buttons */}
        <Card variant="elevated">
          <CardHeader title="Buttons" subtitle="Différents variants et tailles" />
          <CardContent className="gap-3">
            <Button variant="filled" onPress={handleTestButton} loading={loading}>
              Filled Button
            </Button>
            <Button variant="outlined" onPress={handleTestButton}>
              Outlined Button
            </Button>
            <Button variant="text" onPress={handleTestButton}>
              Text Button
            </Button>
            <Button variant="elevated" size="lg" onPress={handleTestButton}>
              Elevated Large
            </Button>
            <Button variant="filled" size="sm" disabled>
              Disabled Small
            </Button>
          </CardContent>
        </Card>

        {/* Section: Inputs */}
        <Card variant="filled">
          <CardHeader title="Inputs" subtitle="Champs de saisie avec validation" />
          <CardContent className="gap-4">
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              helperText="Votre adresse email professionnelle"
            />
            <PasswordInput
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={password && password.length < 6 ? 'Minimum 6 caractères' : undefined}
            />
            <SearchInput
              placeholder="Rechercher..."
              value={search}
              onChangeText={setSearch}
              onClear={() => setSearch('')}
            />
          </CardContent>
        </Card>

        {/* Section: Cards Variants */}
        <View className="gap-3">
          <Card variant="elevated" onPress={() => Alert.alert('Card', 'Elevated card cliquée!')}>
            <Text className="text-base font-medium">Elevated Card (cliquable)</Text>
            <Text className="text-sm text-text-secondary mt-1">
              Appuyez pour tester l'interaction
            </Text>
          </Card>

          <Card variant="outlined" padding="sm">
            <Text className="text-base font-medium">Outlined Card (padding sm)</Text>
          </Card>

          <Card variant="filled" padding="lg">
            <Text className="text-base font-medium">Filled Card (padding lg)</Text>
          </Card>
        </View>

        {/* Section: Complete Card Example */}
        <Card variant="elevated">
          <CardHeader
            title="Intervention #12345"
            subtitle="Client: ACME Corporation"
            action={
              <Text className="text-primary font-semibold">En cours</Text>
            }
          />
          <CardContent>
            <Text className="text-text-secondary mb-2">
              Maintenance préventive du système de climatisation
            </Text>
            <View className="flex-row gap-4">
              <View>
                <Text className="text-xs text-text-secondary">Date</Text>
                <Text className="text-sm font-medium">26/10/2025</Text>
              </View>
              <View>
                <Text className="text-xs text-text-secondary">Durée</Text>
                <Text className="text-sm font-medium">2h estimées</Text>
              </View>
              <View>
                <Text className="text-xs text-text-secondary">Technicien</Text>
                <Text className="text-sm font-medium">Jean Dupont</Text>
              </View>
            </View>
          </CardContent>
          <CardActions align="right">
            <Button variant="text" size="sm">
              Voir détails
            </Button>
            <Button variant="filled" size="sm">
              Démarrer
            </Button>
          </CardActions>
        </Card>

        {/* Section: Typography Test */}
        <Card variant="outlined">
          <CardHeader title="Typography" subtitle="Échelle de texte Material Design" />
          <CardContent className="gap-2">
            <Text className="text-3xl font-bold text-primary">Headline Large (3xl)</Text>
            <Text className="text-2xl font-bold text-text-primary">Headline Medium (2xl)</Text>
            <Text className="text-xl font-semibold text-text-primary">Headline Small (xl)</Text>
            <Text className="text-lg font-medium text-text-primary">Title Large (lg)</Text>
            <Text className="text-base font-medium text-text-primary">Title Medium (base)</Text>
            <Text className="text-sm font-medium text-text-primary">Title Small (sm)</Text>
            <Text className="text-base text-text-primary">Body Large (base)</Text>
            <Text className="text-sm text-text-secondary">Body Medium (sm)</Text>
            <Text className="text-xs text-text-secondary">Label Small (xs)</Text>
          </CardContent>
        </Card>

        {/* Section: Colors */}
        <Card variant="elevated">
          <CardHeader title="Colors" subtitle="Palette Material Design 3" />
          <CardContent className="gap-3">
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-primary w-16 h-16 rounded" />
              <View className="bg-secondary w-16 h-16 rounded" />
              <View className="bg-tertiary w-16 h-16 rounded" />
              <View className="bg-error w-16 h-16 rounded" />
              <View className="bg-background w-16 h-16 rounded border border-gray-300" />
              <View className="bg-surface w-16 h-16 rounded shadow-elevation-2" />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-secondary">Primary</Text>
              <Text className="text-xs text-text-secondary">Secondary</Text>
              <Text className="text-xs text-text-secondary">Tertiary</Text>
              <Text className="text-xs text-text-secondary">Error</Text>
              <Text className="text-xs text-text-secondary">BG</Text>
              <Text className="text-xs text-text-secondary">Surface</Text>
            </View>
          </CardContent>
        </Card>

        {/* Spacer */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
