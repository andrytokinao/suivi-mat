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
      name: 'Station totale Leica TS07',
      category: 2,
      serialNumber: 'SN-LEICA-001',
      reference: 'REF-TOPO-001',
      status: MaterialStatus.IN_USE,
      currentCondition: MaterialCondition.EXCELLENT,
      description: 'Station totale électronique pour levés topographiques',
      purchaseId: 'P001',
      createdAt: '2024-01-10',
      quantifiable: false
    },
    {
      id: 2,
      name: 'GPS RTK Trimble R10',
      category: 2,
      serialNumber: 'SN-TRIMBLE-002',
      reference: 'REF-TOPO-002',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Récepteur GNSS RTK pour levés de précision',
      purchaseId: 'P002',
      createdAt: '2024-01-18',
      quantifiable: false
    },
    {
      id: 3,
      name: 'Niveau automatique Leica NA324',
      category: 2,
      serialNumber: 'SN-NIV-003',
      reference: 'REF-TOPO-003',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Niveau optique pour travaux de nivellement',
      purchaseId: 'P003',
      createdAt: '2024-02-01',
      quantifiable: false
    },
    {
      id: 4,
      name: 'Trépieds topographiques',
      category: 3,
      serialNumber: 'SN-TRP-004',
      reference: 'REF-ACC-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Trépieds en aluminium pour instruments topo',
      purchaseId: 'P004',
      createdAt: '2024-02-05',
      quantifiable: true,
      quantity: 12
    },
    {
      id: 5,
      name: 'Mires de nivellement',
      category: 3,
      serialNumber: 'SN-MIR-005',
      reference: 'REF-ACC-002',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Mires graduées en aluminium',
      purchaseId: 'P005',
      createdAt: '2024-02-10',
      quantifiable: true,
      quantity: 10
    },
    {
      id: 6,
      name: 'Ordinateur portable HP ZBook',
      category: 4,
      serialNumber: 'SN-PC-006',
      reference: 'REF-INF-001',
      status: MaterialStatus.IN_USE,
      currentCondition: MaterialCondition.GOOD,
      description: 'PC de calcul pour AutoCAD, Covadis, Civil 3D',
      purchaseId: 'P006',
      createdAt: '2024-01-25',
      quantifiable: false
    },
    {
      id: 7,
      name: 'Logiciel AutoCAD Civil 3D',
      category: 5,
      serialNumber: 'LIC-C3D-007',
      reference: 'REF-LOG-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.EXCELLENT,
      description: 'Logiciel de conception et d’aménagement VRD',
      purchaseId: 'P007',
      createdAt: '2024-02-12',
      quantifiable: true,
      quantity: 5
    },
    {
      id: 8,
      name: 'Imprimante traceur A0 HP DesignJet',
      category: 4,
      serialNumber: 'SN-PLOT-008',
      reference: 'REF-INF-002',
      status: MaterialStatus.IN_USE,
      currentCondition: MaterialCondition.FAIR,
      description: 'Traceur grand format pour plans techniques',
      purchaseId: 'P008',
      createdAt: '2024-01-30',
      quantifiable: false
    },
    {
      id: 9,
      name: 'Casques de chantier',
      category: 6,
      serialNumber: 'SN-CAS-009',
      reference: 'REF-BTP-001',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Équipements de protection individuelle',
      purchaseId: 'P009',
      createdAt: '2024-02-15',
      quantifiable: true,
      quantity: 30
    },
    {
      id: 10,
      name: 'Gilets de sécurité réfléchissants',
      category: 6,
      serialNumber: 'SN-GIL-010',
      reference: 'REF-BTP-002',
      status: MaterialStatus.AVAILABLE,
      currentCondition: MaterialCondition.GOOD,
      description: 'Gilets haute visibilité pour chantiers',
      purchaseId: 'P010',
      createdAt: '2024-02-20',
      quantifiable: true,
      quantity: 40
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
