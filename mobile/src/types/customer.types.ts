/**
 * Types relatifs aux clients
 */

export enum CustomerType {
  INDIVIDUAL = 0,
  COMPANY = 1,
}

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  typeLabel: string;

  // Coordonnées
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;

  // Adresse
  address?: string;
  addressComplement?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;

  // Informations commerciales
  siret?: string;
  vatNumber?: string;
  accountingCode?: string;

  // Métadonnées
  isActive: boolean;
  createdAt: string;
  modifiedAt?: string;
}

export interface CustomerContact {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface NearbyCustomer extends Customer {
  distanceKm: number;
}

export interface QueryCustomersDto {
  searchTerm?: string;
  type?: CustomerType;
  city?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}
