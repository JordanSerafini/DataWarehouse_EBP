# Guide Safe Area - Résolution des empiètements

## Problème résolu
L'application empiétait sur les boutons natifs du téléphone (barre de navigation, notch, etc.)

## Solution appliquée

### 1. Configuration globale (✅ Fait)
- `App.tsx` : Ajout de `SafeAreaProvider`
- Composant `SafeAreaScreen` créé avec padding intelligent

### 2. Composant SafeAreaScreen

Le composant [src/components/SafeAreaScreen.tsx](src/components/SafeAreaScreen.tsx) gère automatiquement :
- ✅ Zones sûres iOS (notch, Dynamic Island, barre de gestes)
- ✅ StatusBar Android
- ✅ Padding supplémentaire personnalisable
- ✅ Support Dark Mode

### 3. Utilisation

#### Pour écrans SANS TabBar (modal, détails, login)
```tsx
import { SafeAreaScreen } from '../../components/SafeAreaScreen';

const MonEcran = () => {
  return (
    <SafeAreaScreen>
      {/* Votre contenu */}
    </SafeAreaScreen>
  );
};
```

#### Pour écrans AVEC TabBar (liste, dashboard)
```tsx
// Ne protéger que le haut (la TabBar gère le bas)
<SafeAreaScreen edges={['top']}>
  {/* Votre contenu */}
</SafeAreaScreen>
```

#### Si vous avez ENCORE des empiètements
```tsx
// Ajouter du padding supplémentaire
<SafeAreaScreen extraPaddingTop={16} extraPaddingBottom={16}>
  {/* Votre contenu */}
</SafeAreaScreen>
```

## Écrans à modifier

### ✅ Déjà fait
- [x] LoginScreen.tsx (avec padding +8px haut/bas)

### Écrans PRIORITAIRES (sans TabBar)
Ces écrans doivent avoir `edges={['top', 'bottom', 'left', 'right']}` (défaut)

- [ ] InterventionDetailsScreen.v2.tsx
- [ ] TicketDetailsScreen.tsx
- [ ] CustomerDetailsScreen.tsx
- [ ] ProjectDetailsScreen.tsx
- [ ] UserFormScreen.tsx

### Écrans avec TabBar
Ces écrans doivent avoir `edges={['top']}` uniquement

- [ ] PlanningScreen.tsx
- [ ] CalendarScreen.tsx
- [ ] TasksScreen.tsx
- [ ] InterventionsScreen.tsx
- [ ] TicketsScreen.tsx
- [ ] CustomersScreen.tsx
- [ ] ProjectsScreen.tsx
- [ ] AdminUsersScreen.tsx
- [ ] ProfileScreen.tsx
- [ ] UITestScreen.tsx

## Pattern de migration

### Avant
```tsx
const MonEcran = () => {
  return (
    <View style={styles.container}>
      <Text>Contenu</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
```

### Après
```tsx
import { SafeAreaScreen } from '../../components/SafeAreaScreen';

const MonEcran = () => {
  return (
    <SafeAreaScreen>
      <Text>Contenu</Text>
    </SafeAreaScreen>
  );
};

// Le backgroundColor est géré automatiquement par SafeAreaScreen (Dark Mode compatible)
const styles = StyleSheet.create({
  // Plus besoin de container avec flex: 1 et backgroundColor
});
```

## Commandes utiles

### Tester sur appareil physique
```bash
cd mobile
npm start
# Scannez le QR code avec Expo Go
```

### Tester sur simulateur iOS
```bash
npm run ios
```

### Tester sur émulateur Android
```bash
npm run android
```

## Configuration Android spéciale

Dans [app.json](app.json), nous avons :
```json
"android": {
  "edgeToEdgeEnabled": true
}
```

Ceci active le mode edge-to-edge sur Android, donc **SafeAreaScreen est OBLIGATOIRE** sur tous les écrans.

## Troubleshooting

### "Ça empiète encore en haut"
Augmentez `extraPaddingTop` :
```tsx
<SafeAreaScreen extraPaddingTop={20}>
```

### "Ça empiète encore en bas"
Augmentez `extraPaddingBottom` :
```tsx
<SafeAreaScreen extraPaddingBottom={20}>
```

### "Sur Android c'est OK mais pas sur iOS"
Essayez de désactiver temporairement `edgeToEdgeEnabled` dans app.json pour iOS uniquement.

### "La TabBar empiète aussi"
La TabBar de React Navigation devrait gérer automatiquement les safe areas. Vérifiez que vous n'avez pas de style `position: absolute` sur la TabBar.

## Référence SafeAreaScreen Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `children` | ReactNode | - | Contenu de l'écran |
| `style` | ViewStyle | - | Styles additionnels |
| `edges` | Array | `['top', 'bottom', 'left', 'right']` | Bords à protéger |
| `extraPaddingTop` | number | 0 | Padding supplémentaire en haut |
| `extraPaddingBottom` | number | 0 | Padding supplémentaire en bas |

## Support Dark Mode

Le composant détecte automatiquement le thème et applique le bon backgroundColor :
- Light mode : `#f5f5f5`
- Dark mode : `#121212`

Vous pouvez override avec la prop `style` :
```tsx
<SafeAreaScreen style={{ backgroundColor: 'red' }}>
```
