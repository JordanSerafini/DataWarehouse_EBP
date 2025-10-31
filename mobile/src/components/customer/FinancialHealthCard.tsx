/**
 * FinancialHealthCard - Carte affichant la santé financière du client
 *
 * Visible uniquement pour : Super Admin, Admin, Patron, Commerciaux
 * Masqué pour : Techniciens, Chef de chantier
 *
 * Affiche :
 * - Encours utilisé / autorisé avec gauge
 * - CA Total
 * - Alertes si dépassement
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Customer } from '../../services/customer.service';
import { useAuthStore } from '../../stores/authStore.v2';
import { UserRole } from '../../types/user.types';

interface FinancialHealthCardProps {
  customer: Customer;
  totalRevenue: number;
}

const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({
  customer,
  totalRevenue,
}) => {
  const { user } = useAuthStore();

  // Contrôle de visibilité selon le rôle
  const canViewFinancialData = (): boolean => {
    if (!user) return false;

    const allowedRoles: UserRole[] = [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.PATRON,
      UserRole.COMMERCIAL,
    ];

    return allowedRoles.includes(user.role as UserRole);
  };

  // Si pas autorisé, ne rien afficher
  if (!canViewFinancialData()) {
    return null;
  }

  const allowedAmount = customer.allowedAmount || 0;
  const currentAmount = customer.currentAmount || 0;
  const exceedAmount = customer.exceedAmount || 0;

  // Calcul du pourcentage d'utilisation de l'encours
  const encoursUtilization =
    allowedAmount > 0 ? (currentAmount / allowedAmount) * 100 : 0;

  // Statut de l'encours
  const isExceeded = currentAmount > allowedAmount && allowedAmount > 0;
  const isWarning = encoursUtilization >= 80 && !isExceeded;

  // Couleur de la gauge
  const getGaugeColor = (): string => {
    if (isExceeded) return '#f44336'; // Rouge
    if (isWarning) return '#ff9800'; // Orange
    return '#4caf50'; // Vert
  };

  // Formater montant en euros
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Santé Financière"
        left={(props) => <Ionicons name="cash-outline" size={24} color="#6200ee" />}
      />
      <Card.Content>
        {/* Alerte dépassement */}
        {isExceeded && (
          <Chip
            icon="alert"
            mode="flat"
            style={styles.alertChip}
            textStyle={styles.alertChipText}
          >
            Dépassement d'encours: {formatCurrency(exceedAmount)}
          </Chip>
        )}

        {/* Alerte avertissement */}
        {isWarning && !isExceeded && (
          <Chip
            icon="alert-circle-outline"
            mode="flat"
            style={styles.warningChip}
            textStyle={styles.warningChipText}
          >
            Encours proche de la limite ({Math.round(encoursUtilization)}%)
          </Chip>
        )}

        {/* Encours */}
        {allowedAmount > 0 && (
          <View style={styles.encoursSection}>
            <View style={styles.encoursHeader}>
              <Text variant="labelMedium" style={styles.sectionLabel}>
                Encours Client
              </Text>
              <Text variant="bodyMedium" style={styles.encoursValue}>
                {formatCurrency(currentAmount)} / {formatCurrency(allowedAmount)}
              </Text>
            </View>

            <ProgressBar
              progress={Math.min(encoursUtilization / 100, 1)}
              color={getGaugeColor()}
              style={styles.progressBar}
            />

            <Text variant="bodySmall" style={styles.encoursPercentage}>
              {Math.round(encoursUtilization)}% utilisé
            </Text>
          </View>
        )}

        {/* CA Total */}
        <View style={styles.revenueSection}>
          <View style={styles.revenueRow}>
            <Ionicons name="trending-up" size={20} color="#4caf50" />
            <View style={styles.revenueInfo}>
              <Text variant="labelMedium" style={styles.sectionLabel}>
                Chiffre d'Affaires Total
              </Text>
              <Text variant="titleLarge" style={styles.revenueValue}>
                {formatCurrency(totalRevenue)}
              </Text>
            </View>
          </View>
        </View>

        {/* Info complémentaire si encours négatif */}
        {currentAmount < 0 && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color="#2196f3" />
            <Text variant="bodySmall" style={styles.infoText}>
              Le client a un crédit de {formatCurrency(Math.abs(currentAmount))}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 12,
    elevation: 2,
  },
  alertChip: {
    backgroundColor: '#ffebee',
    marginBottom: 16,
  },
  alertChipText: {
    color: '#f44336',
    fontSize: 12,
  },
  warningChip: {
    backgroundColor: '#fff3e0',
    marginBottom: 16,
  },
  warningChipText: {
    color: '#ff9800',
    fontSize: 12,
  },
  encoursSection: {
    marginBottom: 20,
  },
  encoursHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    color: '#757575',
  },
  encoursValue: {
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  encoursPercentage: {
    color: '#9e9e9e',
    textAlign: 'right',
  },
  revenueSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  revenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  revenueInfo: {
    flex: 1,
  },
  revenueValue: {
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoText: {
    color: '#1976d2',
    flex: 1,
  },
});

export default FinancialHealthCard;
