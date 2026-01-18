import { DeclarationStatus, MovementStatus } from './enums';

export interface Declaration {
  id: number;
  declarationType: 'OUTGOING' | 'RETURN';
  declarationDate: string;
  declaredBy: string;
  status: DeclarationStatus;
  note: string;
  additionalInfo: string;
  validatedBy?: string;
  movements: MaterialMovement[];
}

export interface OutgoingDeclaration extends Declaration {
  usagePurpose: string;
  expectedReturnDate?: string;
}

export interface ReturnDeclaration extends Declaration {
  returnConditionNote: string;
  verifiedBy: string;
  verifiedAt?: string;
}

export interface MaterialMovement {
  id: number;
  material: number;
  materialName?: string;
  quantity: number;
  condition: string;
  status: MovementStatus;
  createdAt: string;
  createdBy: string;
  validatedAt?: string;
  validatedBy?: string;
  verifiedBy?: string;
  outgoingDeclaration?: number;
  returnDeclaration?: number;
  note?: string;
}
