import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Material, MaterialState } from '../models/material';
import { MaterialStatus, MaterialCondition } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  materials: Material[] = [
    {
      id: 1,
      name: 'Laptop Dell XPS 15',
      category: 2,
      serialNumber: 'SN-DELL-001',
      reference: 'REF-LAP-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Laptop haute performance i7',
      purchaseId: 'P001',
      createdAt: '2024-01-15',
      quantifiable: false
    },
    {
      id: 2,
      name: 'Laptop HP ProBook',
      category: 2,
      serialNumber: 'SN-HP-002',
      reference: 'REF-LAP-002',
      status: MaterialStatus.IN_USE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Laptop professionnel',
      purchaseId: 'P002',
      createdAt: '2024-01-20',
      quantifiable: false
    },
    {
      id: 3,
      name: 'Souris Logitech MX',
      category: 3,
      serialNumber: 'SN-MOUSE-003',
      reference: 'REF-MOU-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.EXCELLENT,
      description: 'Souris sans fil ergonomique',
      purchaseId: 'P003',
      createdAt: '2024-02-01',
      quantifiable: true,
      quantity: 15
    },
    {
      id: 4,
      name: 'Clavier mécanique',
      category: 3,
      serialNumber: 'SN-KEY-004',
      reference: 'REF-KEY-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Clavier RGB gaming',
      purchaseId: 'P004',
      createdAt: '2024-02-05',
      quantifiable: true,
      quantity: 10
    },
    {
      id: 5,
      name: 'Écran Dell 27"',
      category: 3,
      serialNumber: 'SN-MON-005',
      reference: 'REF-MON-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.EXCELLENT,
      description: 'Moniteur 4K UHD',
      purchaseId: 'P005',
      createdAt: '2024-02-10',
      quantifiable: false
    },
    {
      id: 6,
      name: 'Switch Cisco 24 ports',
      category: 4,
      serialNumber: 'SN-SW-006',
      reference: 'REF-NET-001',
      status: MaterialStatus.IN_USE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Switch réseau manageable',
      purchaseId: 'P006',
      createdAt: '2024-01-25',
      quantifiable: false
    },
    {
      id: 7,
      name: 'Chaise ergonomique',
      category: 6,
      serialNumber: 'SN-CHAIR-007',
      reference: 'REF-CHAIR-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Chaise de bureau avec support lombaire',
      purchaseId: 'P007',
      createdAt: '2024-02-15',
      quantifiable: true,
      quantity: 20
    },
    {
      id: 8,
      name: 'Bureau ajustable',
      category: 7,
      serialNumber: 'SN-DESK-008',
      reference: 'REF-DESK-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.EXCELLENT,
      description: 'Bureau assis-debout électrique',
      purchaseId: 'P008',
      createdAt: '2024-02-20',
      quantifiable: false
    },
    {
      id: 9,
      name: 'Imprimante HP LaserJet',
      category: 3,
      serialNumber: 'SN-PRINT-009',
      reference: 'REF-PRINT-001',
      status: MaterialStatus.MAINTENANCE,
      currentCondition: MaterialCondition.FAIR,
      description: 'Imprimante laser couleur',
      purchaseId: 'P009',
      createdAt: '2024-01-30',
      quantifiable: false
    },
    {
      id: 10,
      name: 'Câbles HDMI',
      category: 3,
      serialNumber: 'SN-CABLE-010',
      reference: 'REF-CABLE-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Câbles HDMI 2.1 - 2m',
      purchaseId: 'P010',
      createdAt: '2024-02-25',
      quantifiable: true,
      quantity: 50
    }
  ];

  private materialsSubject = new BehaviorSubject<Material[]>(this.materials);
  public materials$ = this.materialsSubject.asObservable();

  constructor() {}

  getMaterials(): Observable<Material[]> {
    return this.materials$;
  }

  getMaterialById(id: number): Material | undefined {
    return this.materials.find(m => m.id === id);
  }

  getAvailableMaterials(): Material[] {
    return this.materials.filter(m =>
      m.status === MaterialStatus.AVAILABLE &&
      (!m.quantifiable || (m.quantity && m.quantity > 0))
    );
  }

  addMaterial(material: Omit<Material, 'id'>): Material {
    const newMaterial = {
      ...material,
      id: Math.max(...this.materials.map(m => m.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    this.materials.push(newMaterial);
    this.materialsSubject.next(this.materials);
    return newMaterial;
  }

  updateMaterial(id: number, material: Partial<Material>): void {
    const index = this.materials.findIndex(m => m.id === id);
    if (index !== -1) {
      this.materials[index] = {
        ...this.materials[index],
        ...material,
        updatedAt: new Date().toISOString()
      };
      this.materialsSubject.next(this.materials);
    }
  }

  deleteMaterial(id: number): void {
    this.materials = this.materials.filter(m => m.id !== id);
    this.materialsSubject.next(this.materials);
  }

  updateMaterialStatus(id: number, status: MaterialStatus): void {
    this.updateMaterial(id, { status });
  }

  updateMaterialCondition(id: number, condition: MaterialCondition): void {
    this.updateMaterial(id, { currentCondition: condition });
  }

  updateMaterialQuantity(id: number, quantity: number): void {
    this.updateMaterial(id, { quantity });
  }
}
