import { DeclarationStatus, MovementStatus, MaterialCondition } from './enums';

// Base Declaration interface matching DeclarationDTO
export interface Declaration {
  id: number;
  declarationType: 'SORTIE' | 'RETOUR';
  declarationDate: string;
  declaredBy: string;
  validateBy: string | null;
  status: DeclarationStatus;
  note: string | null;
}

// OutgoingDeclaration matching OutgoingDeclarationDTO
export interface OutgoingDeclaration extends Declaration {
  declarationType: 'SORTIE';
  usagePurpose: string;
  validatedBy: string | null;
  movementIds: number[];
  movements?: MaterialMovement[]; // Optional, populated when fetched separately
}

// ReturnDeclaration matching ReturnDeclarationDTO
export interface ReturnDeclaration extends Declaration {
  declarationType: 'RETOUR';
  returnConditionNote: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  movementIds: number[];
  movements?: MaterialMovement[]; // Optional, populated when fetched separately
}

// MaterialMovement matching MaterialMovementDTO
export interface MaterialMovement {
  id: number;
  materialId: number | null;
  materialName: string | null;
  materialSerialNumber: string | null;
  quantity: number;
  condition: MaterialCondition;
  status: MovementStatus;
  createdAt: string;
  createdBy: string;
  validatedAt: string | null;
  validatedBy: string | null;
  verifiedBy: string | null;
  movementDate: string | null;
  outgoingDeclarationId: number | null;
  returnDeclarationId: number | null;
}

export interface OutgoingDeclarationFormData {
  declaredBy: string;
  usagePurpose: string;
  note: string | null;
  movements: MaterialMovementFormData[];
}

export interface ReturnDeclarationFormData {
  declaredBy: string;
  returnConditionNote: string;
  verifiedBy: string;
  note: string | null;
  movements: MaterialMovementFormData[];
}

export interface MaterialMovementFormData {
  material: number;
  quantity: number;
  condition: MaterialCondition;
  note?: string | null;
}
