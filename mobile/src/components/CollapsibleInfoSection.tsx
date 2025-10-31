/**
 * Composant réutilisable pour afficher des sections dépliables
 * d'informations dans les écrans de détail
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, Divider, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { hapticService } from '../services/haptic.service';

export interface InfoField {
  label: string;
  value: string | number | boolean | undefined;
  format?: 'text' | 'currency' | 'percent' | 'boolean' | 'date';
  icon?: string;
}

interface CollapsibleInfoSectionProps {
  title: string;
  icon: string;
  iconColor?: string;
  fields: InfoField[];
  isExpanded: boolean;
  onToggle: () => void;
  renderExtra?: () => ReactNode; // Pour ajouter du contenu custom après les champs
}

export const CollapsibleInfoSection: React.FC<CollapsibleInfoSectionProps> = ({
  title,
  icon,
  iconColor = '#6200ee',
  fields,
  isExpanded,
  onToggle,
  renderExtra,
}) => {
  // Compter combien de champs ont une valeur
  const filledFieldsCount = fields.filter(f => f.value !== undefined && f.value !== null && f.value !== '').length;

  // Ne pas afficher la section si aucun champ n'a de valeur
  if (filledFieldsCount === 0) {
    return null;
  }

  const handleToggle = async () => {
    await hapticService.light();
    onToggle();
  };

  const formatValue = (field: InfoField): string => {
    if (field.value === undefined || field.value === null) return '-';

    switch (field.format) {
      case 'currency':
        return `${Number(field.value).toFixed(2)} €`;
      case 'percent':
        return `${Number(field.value)}%`;
      case 'boolean':
        return field.value ? 'Oui' : 'Non';
      case 'date':
        try {
          return new Date(field.value as string).toLocaleDateString('fr-FR');
        } catch {
          return String(field.value);
        }
      case 'text':
      default:
        return String(field.value);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={title}
        left={(props) => <Ionicons name={icon as any} size={24} color={iconColor} />}
        right={(props) => (
          <Button
            mode="text"
            onPress={handleToggle}
            icon={isExpanded ? 'chevron-up' : 'chevron-down'}
            compact
          >
            {isExpanded ? 'Masquer' : `Voir (${filledFieldsCount})`}
          </Button>
        )}
      />
      {isExpanded && (
        <Card.Content>
          {fields.map((field, index) => {
            // Ne pas afficher les champs sans valeur
            if (field.value === undefined || field.value === null || field.value === '') {
              return null;
            }

            return (
              <View key={index}>
                {index > 0 && <Divider style={styles.divider} />}
                <View style={styles.infoRow}>
                  {field.icon && (
                    <Ionicons name={field.icon as any} size={16} color="#757575" style={styles.fieldIcon} />
                  )}
                  <Text variant="labelMedium" style={styles.label}>
                    {field.label}:
                  </Text>
                  <Text variant="bodyMedium" style={styles.value}>
                    {formatValue(field)}
                  </Text>
                </View>
              </View>
            );
          })}
          {renderExtra && renderExtra()}
        </Card.Content>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  fieldIcon: {
    marginRight: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 120,
  },
  value: {
    flex: 1,
    color: '#424242',
  },
  divider: {
    marginVertical: 12,
  },
});
