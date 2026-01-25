import { DeclarationStatus, MovementStatus, MaterialCondition } from './enums';

export interface Declaration {
  id: number;
  declarationType: 'OUTGOING' | 'RETURN';
  declarationDate: string;
  declaredBy: string;
  validateBy: string | null;
  status: DeclarationStatus;
  note: string | null;
  additionalInfo?: string;
}

export interface OutgoingDeclaration extends Declaration {
  declarationType: 'OUTGOING';
  usagePurpose: string;
  validatedBy: string | null;
  movements: MaterialMovement[];
}

export interface ReturnDeclaration extends Declaration {
  declarationType: 'RETURN';
  returnConditionNote: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  movements: MaterialMovement[];
}

export interface MaterialMovement {
  id: number;
  material: number | null;
  materialName?: string;
  quantity: number;
  condition: MaterialCondition;
  status: MovementStatus;
  createdAt: string;
  createdBy: string;
  validatedAt: string | null;
  validatedBy: string | null;
  verifiedBy: string | null;
  movementDate: string | null;
  outgoingDeclaration: number | null;
  returnDeclaration: number | null;
  note?: string | null;
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
