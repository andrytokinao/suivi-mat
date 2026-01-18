import { MaterialStatus, MaterialCondition } from './enums';
import {MaterialCategory} from './category';

export interface Material {
  id: number;
  name: string;
  category: number;
  categoryObj?: MaterialCategory;
  serialNumber: string;
  reference: string;
  status: MaterialStatus;
  currentCondition: MaterialCondition;
  description: string;
  purchaseId: string;
  createdAt: string;
  updatedAt?: string;
  quantifiable: boolean;
  quantity?: number;
}

export interface MaterialState {
  id: number;
  material: number;
  state: MaterialCondition;
  description: string;
  date: string;
  updatedBy: string;
}
