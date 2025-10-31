/**
 * Types relatifs aux interventions
 */

export enum InterventionStatus {
  SCHEDULED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  PENDING = 4,
}

export enum InterventionType {
  INSTALLATION = 1,
  MAINTENANCE = 2,
  REPAIR = 3,
  INSPECTION = 4,
  TRAINING = 5,
  CONSULTATION = 6,
  OTHER = 99,
}

export enum InterventionPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
}

export interface Intervention {
  id: string;
  reference: string;
  title: string;
  description?: string;

  // Dates
  scheduledDate: string;
  scheduledEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;

  // Statut et type
  status: InterventionStatus;
  statusLabel: string;
  type: InterventionType;
  typeLabel: string;
  priority: InterventionPriority;

  // Relations
  customerId?: string;
  customerName?: string;
  projectId?: number;
  projectName?: string;
  technicianId?: string;
  technicianName?: string;

  // Localisation
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;

  // Informations additionnelles
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  notes?: string;

  // Métadonnées
  createdAt: string;
  updatedAt?: string;
}

export interface InterventionNote {
  id: string;
  interventionId: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface InterventionPhoto {
  id: string;
  interventionId: string;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  latitude?: number;
  longitude?: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface InterventionSignature {
  id: string;
  interventionId: string;
  filename: string;
  filePath: string;
  fileUrl: string;
  signerName: string;
  signerRole?: string;
  signedBy: string;
  signedAt: string;
}

export interface StartInterventionDto {
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface CompleteInterventionDto {
  report: string;
  timeSpentHours: number;
  travelDuration?: number;
  latitude?: number;
  longitude?: number;
  success?: boolean;
}

export interface NearbyIntervention extends Intervention {
  distanceKm: number;
}

export interface QueryInterventionsDto {
  dateFrom?: string;
  dateTo?: string;
  statuses?: InterventionStatus[];
  types?: InterventionType[];
  priorities?: InterventionPriority[];
  customerId?: string;
  projectId?: number;
  limit?: number;
  offset?: number;
}
