import { MaterialStatus, MaterialCondition } from './enums';

export interface Category {
  id: number;
  name: string;
}

export interface Material {
  id: number;
  name: string;
  category: Category | number | null;
  serialNumber: string | null;
  reference: string | null;
  status: MaterialStatus;
  currentCondition: MaterialCondition | null;
  description: string | null;
  purchaseId: string | null;
  quantifiable: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface MaterialFormData {
  name: string;
  category: number | null;
  serialNumber: string | null;
  reference: string | null;
  status: MaterialStatus;
  currentCondition: MaterialCondition | null;
  description: string | null;
  purchaseId: string | null;
}

export interface MaterialState {
  id: number;
  material: number;
  state: MaterialCondition;
  description: string | null;
  date: string;
  updatedBy: string;
}
