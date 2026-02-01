// Corresponds to MaterialState.MaterialStatus in backend
export enum MaterialStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  LOST = 'LOST',
  RETIRED = 'RETIRED'
}

// Corresponds to Material.MaterialCondition in backend
export enum MaterialCondition {
  GOOD = 'GOOD',
  DAMAGED = 'DAMAGED',
  BROKEN = 'BROKEN',
  IN_REPAIR = 'IN_REPAIR'
}

// Corresponds to Declaration.DeclarationStatus in backend
export enum DeclarationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Corresponds to MaterialMovement.MovementStatus in backend
export enum MovementStatus {
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATED = 'VALIDATED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

// Corresponds to Maintenance.MaintenanceStatus in backend
export enum MaintenanceStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
