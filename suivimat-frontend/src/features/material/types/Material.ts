export interface Material {
    id?: number;
    name: string;
    reference?: string;
    serialNumber?: string;
    description?: string;
    status?: MaterialStatus | string;
    purchaseId?: string;
    createdAt?: string;
    updatedAt?: string;
    currentCondition?: MaterialCondition | string;
}

export type MaterialStatus = "AVAILABLE" | "IN_USE" | "UNDER_MAINTENANCE" | "LOST" | "RETIRED";
export type MaterialCondition = "GOOD" | "DAMAGED" | "BROKEN" | "IN_REPAIR";

export const modelMaterialInitValue: Material = {
    name: '',
    reference: '',
    serialNumber: '',
    description: '',
    status: 'AVAILABLE',
    purchaseId: '',
    createdAt: '',
    currentCondition:  'GOOD'
}