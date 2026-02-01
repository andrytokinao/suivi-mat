import { MaterialStatus, MaterialCondition, MaintenanceStatus } from './enums';
import { MaterialCategory } from './category';
import { MaterialMovement } from './declaration';

// Material interface matching MaterialDTO
export interface Material {
  id: number;
  name: string;
  reference: string | null;
  serialNumber: string | null;
  description: string | null;
  status: MaterialStatus;
  categoryId: number | null;
  categoryName: string | null;
  purchaseId: string | null;
  createdAt: string;
  updatedAt: string | null;
  currentCondition: MaterialCondition | null;
  availableQuantity: number; // Sum of movement quantities (positive = available stock)
}

// MaterialCreateDTO - for creating new materials
export interface MaterialCreateData {
  name: string;
  categoryId: number | null;
  currentCondition: MaterialCondition | null;
  purchaseId: string | null;
  description: string | null;
}

// MaterialFormData - alias for MaterialCreateData
export interface MaterialFormData extends MaterialCreateData {}

// MaterialFullDetailDTO - full details with related entities
export interface MaterialFullDetail {
  id: number;
  name: string;
  reference: string | null;
  serialNumber: string | null;
  description: string | null;
  status: MaterialStatus;
  purchaseId: string | null;
  createdAt: string;
  updatedAt: string | null;
  currentCondition: MaterialCondition | null;
  availableQuantity: number; // Sum of movement quantities
  category: MaterialCategory | null;
  movements: MaterialMovement[];
  states: MaterialState[];
  maintenances: Maintenance[];
}

// MaterialState interface matching MaterialStateDTO
export interface MaterialState {
  id: number;
  materialId: number | null;
  materialName: string | null;
  state: MaterialCondition;
  description: string | null;
  updatedBy: string | null;
  date: string;
}

export interface MaterialStateFormData {
  state: MaterialCondition;
  description: string | null;
  updatedBy: string;
}

// Maintenance interface matching MaintenanceDTO
export interface Maintenance {
  id: number;
  materialId: number | null;
  materialName: string | null;
  materialSerialNumber: string | null;
  maintenanceType: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  cost: number | null;
  linkedToCharge: boolean;
  chargeId: string | null;
  performedBy: string | null;
  status: MaintenanceStatus;
}

export interface MaintenanceFormData {
  materialId: number;
  maintenanceType: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  cost: number | null;
  linkedToCharge: boolean;
  chargeId: string | null;
  performedBy: string | null;
  status: MaintenanceStatus;
}

