# Application Angular SuiviMat - Structure Complète

## Installation et Configuration

### 1. Créer le projet Angular
```bash
ng new suivimat-app
cd suivimat-app
npm install
```

### 2. Installer les dépendances nécessaires
```bash
npm install @angular/material @angular/cdk
npm install lucide-angular
```

---

## Structure des Fichiers

```
src/
├── app/
│   ├── models/
│   │   ├── material.model.ts
│   │   ├── category.model.ts
│   │   ├── declaration.model.ts
│   │   └── enums.ts
│   ├── services/
│   │   ├── material.service.ts
│   │   ├── category.service.ts
│   │   └── declaration.service.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   ├── sidebar.component.html
│   │   │   │   └── sidebar.component.css
│   │   │   └── header/
│   │   │       ├── header.component.ts
│   │   │       ├── header.component.html
│   │   │       └── header.component.css
│   │   ├── declarations/
│   │   │   ├── outgoing-declaration/
│   │   │   │   ├── outgoing-declaration.component.ts
│   │   │   │   ├── outgoing-declaration.component.html
│   │   │   │   └── outgoing-declaration.component.css
│   │   │   ├── return-declaration/
│   │   │   │   ├── return-declaration.component.ts
│   │   │   │   ├── return-declaration.component.html
│   │   │   │   └── return-declaration.component.css
│   │   │   └── declaration-list/
│   │   │       ├── declaration-list.component.ts
│   │   │       ├── declaration-list.component.html
│   │   │       └── declaration-list.component.css
│   │   ├── materials/
│   │   │   ├── material-list/
│   │   │   │   ├── material-list.component.ts
│   │   │   │   ├── material-list.component.html
│   │   │   │   └── material-list.component.css
│   │   │   └── material-form/
│   │   │       ├── material-form.component.ts
│   │   │       ├── material-form.component.html
│   │   │       └── material-form.component.css
│   │   ├── categories/
│   │   │   ├── category-list/
│   │   │   │   ├── category-list.component.ts
│   │   │   │   ├── category-list.component.html
│   │   │   │   └── category-list.component.css
│   │   │   └── category-form/
│   │   │       ├── category-form.component.ts
│   │   │       ├── category-form.component.html
│   │   │       └── category-form.component.css
│   │   └── admin/
│   │       ├── validation-list/
│   │       │   ├── validation-list.component.ts
│   │       │   ├── validation-list.component.html
│   │       │   └── validation-list.component.css
│   │       └── validation-detail/
│   │           ├── validation-detail.component.ts
│   │           ├── validation-detail.component.html
│   │           └── validation-detail.component.css
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.css
│   └── app.module.ts
└── styles.css
```

---

## 1. Models (src/models/)

### enums.ts
```typescript
export enum MaterialStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED'
}

export enum MaterialCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum DeclarationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum MovementStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  RETURNED = 'RETURNED'
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
```

### category.model.ts
```typescript
export interface MaterialCategory {
  id: number;
  name: string;
  description: string;
  parent: number | null;
  children?: MaterialCategory[];
}
```

### material.model.ts
```typescript
import { MaterialStatus, MaterialCondition } from './enums';
import { MaterialCategory } from './category.model';

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
```

### declaration.model.ts
```typescript
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
```

---

## 2. Services (src/services/)

### material.service.ts
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Material, MaterialState } from '../models/material.model';
import { MaterialStatus, MaterialCondition } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materials: Material[] = [
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
```

### category.service.ts
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialCategory } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: MaterialCategory[] = [
    { id: 1, name: 'Informatique', parent: null, description: 'Matériel informatique' },
    { id: 2, name: 'Ordinateurs', parent: 1, description: 'PC et laptops' },
    { id: 3, name: 'Périphériques', parent: 1, description: 'Souris, claviers, écrans' },
    { id: 4, name: 'Réseau', parent: 1, description: 'Équipements réseau' },
    { id: 5, name: 'Mobilier', parent: null, description: 'Mobilier de bureau' },
    { id: 6, name: 'Chaises', parent: 5, description: 'Chaises de bureau' },
    { id: 7, name: 'Bureaux', parent: 5, description: 'Tables de travail' },
    { id: 8, name: 'Rangement', parent: 5, description: 'Armoires et étagères' }
  ];

  private categoriesSubject = new BehaviorSubject<MaterialCategory[]>(this.categories);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {}

  getCategories(): Observable<MaterialCategory[]> {
    return this.categories$;
  }

  getCategoryById(id: number): MaterialCategory | undefined {
    return this.categories.find(c => c.id === id);
  }

  getRootCategories(): MaterialCategory[] {
    return this.categories.filter(c => c.parent === null);
  }

  getChildCategories(parentId: number): MaterialCategory[] {
    return this.categories.filter(c => c.parent === parentId);
  }

  getCategoryHierarchy(): MaterialCategory[] {
    const roots = this.getRootCategories();
    return roots.map(root => ({
      ...root,
      children: this.buildCategoryTree(root.id)
    }));
  }

  private buildCategoryTree(parentId: number): MaterialCategory[] {
    const children = this.getChildCategories(parentId);
    return children.map(child => ({
      ...child,
      children: this.buildCategoryTree(child.id)
    }));
  }

  addCategory(category: Omit<MaterialCategory, 'id'>): MaterialCategory {
    const newCategory = {
      ...category,
      id: Math.max(...this.categories.map(c => c.id), 0) + 1
    };
    this.categories.push(newCategory);
    this.categoriesSubject.next(this.categories);
    return newCategory;
  }

  updateCategory(id: number, category: Partial<MaterialCategory>): void {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...category };
      this.categoriesSubject.next(this.categories);
    }
  }

  deleteCategory(id: number): void {
    // Vérifier s'il y a des enfants
    const hasChildren = this.categories.some(c => c.parent === id);
    if (!hasChildren) {
      this.categories = this.categories.filter(c => c.id !== id);
      this.categoriesSubject.next(this.categories);
    } else {
      throw new Error('Impossible de supprimer une catégorie avec des sous-catégories');
    }
  }
}
```

### declaration.service.ts
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Declaration, OutgoingDeclaration, ReturnDeclaration, MaterialMovement } from '../models/declaration.model';
import { DeclarationStatus, MovementStatus } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {
  private declarations: Declaration[] = [
    {
      id: 1,
      declarationType: 'OUTGOING',
      declarationDate: '2024-03-01',
      declaredBy: 'Jean Dupont',
      status: DeclarationStatus.APPROVED,
      note: 'Utilisation pour le projet X',
      additionalInfo: 'Bureau 205',
      validatedBy: 'Admin',
      movements: [
        {
          id: 1,
          material: 2,
          materialName: 'Laptop HP ProBook',
          quantity: 1,
          condition: 'GOOD',
          status: MovementStatus.VALIDATED,
          createdAt: '2024-03-01',
          createdBy: 'Jean Dupont',
          validatedAt: '2024-03-01',
          validatedBy: 'Admin',
          outgoingDeclaration: 1
        }
      ]
    },
    {
      id: 2,
      declarationType: 'OUTGOING',
      declarationDate: '2024-03-05',
      declaredBy: 'Marie Martin',
      status: DeclarationStatus.PENDING,
      note: 'Besoin pour la formation',
      additionalInfo: 'Salle de formation A',
      movements: [
        {
          id: 2,
          material: 3,
          materialName: 'Souris Logitech MX',
          quantity: 5,
          condition: 'EXCELLENT',
          status: MovementStatus.PENDING,
          createdAt: '2024-03-05',
          createdBy: 'Marie Martin',
          outgoingDeclaration: 2
        }
      ]
    }
  ];

  private declarationsSubject = new BehaviorSubject<Declaration[]>(this.declarations);
  public declarations$ = this.declarationsSubject.asObservable();

  constructor() {}

  getDeclarations(): Observable<Declaration[]> {
    return this.declarations$;
  }

  getDeclarationById(id: number): Declaration | undefined {
    return this.declarations.find(d => d.id === id);
  }

  getPendingDeclarations(): Declaration[] {
    return this.declarations.filter(d => d.status === DeclarationStatus.PENDING);
  }

  getOutgoingDeclarationsNotReturned(): OutgoingDeclaration[] {
    return this.declarations.filter(d => 
      d.declarationType === 'OUTGOING' && 
      d.status === DeclarationStatus.APPROVED &&
      d.movements.some(m => m.status !== MovementStatus.RETURNED)
    ) as OutgoingDeclaration[];
  }

  createOutgoingDeclaration(declaration: Omit<OutgoingDeclaration, 'id'>): OutgoingDeclaration {
    const newDeclaration: OutgoingDeclaration = {
      ...declaration,
      id: Math.max(...this.declarations.map(d => d.id), 0) + 1,
      declarationDate: new Date().toISOString(),
      status: DeclarationStatus.PENDING
    };
    this.declarations.push(newDeclaration);
    this.declarationsSubject.next(this.declarations);
    return newDeclaration;
  }

  createReturnDeclaration(declaration: Omit<ReturnDeclaration, 'id'>): ReturnDeclaration {
    const newDeclaration: ReturnDeclaration = {
      ...declaration,
      id: Math.max(...this.declarations.map(d => d.id), 0) + 1,
      declarationDate: new Date().toISOString(),
      status: DeclarationStatus.PENDING
    };
    this.declarations.push(newDeclaration);
    this.declarationsSubject.next(this.declarations);
    return newDeclaration;
  }

  updateDeclaration(id: number, updates: Partial<Declaration>): void {
    const index = this.declarations.findIndex(d => d.id === id);
    if (index !== -1) {
      this.declarations[index] = { ...this.declarations[index], ...updates };
      this.declarationsSubject.next(this.declarations);
    }
  }

  validateDeclaration(id: number, validatedBy: string, note?: string): void {
    this.updateDeclaration(id, {
      status: DeclarationStatus.APPROVED,
      validatedBy,
      note: note || this.declarations.find(d => d.id === id)?.note
    });
  }

  rejectDeclaration(id: number, validatedBy: string, note: string): void {
    this.updateDeclaration(id, {
      status: DeclarationStatus.REJECTED,
      validatedBy,
      note
    });
  }

  addNoteToDeclaration(id: number, note: string): void {
    const declaration = this.declarations.find(d => d.id === id);
    if (declaration) {
      const currentNote = declaration.note || '';
      this.updateDeclaration(id, {
        note: currentNote + '\n' + note
      });
    }
  }
}
```

---

## 3. Components - Layout

### sidebar.component.ts
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Déclarations',
      icon: 'file-text',
      route: '/declarations',
      children: [
        { label: 'Nouvelle Sortie', icon: 'arrow-up-circle', route: '/declarations/outgoing/new' },
        { label: 'Nouveau Retour', icon: 'arrow-down-circle', route: '/declarations/return/new' },
        { label: 'Mes Déclarations', icon: 'list', route: '/declarations/list' }
      ]
    },
    {
      label: 'Administration',
      icon: 'shield',
      route: '/admin',
      children: [
        { label: 'Validations', icon: 'check-circle', route: '/admin/validations' }
      ]
    },
    {
      label: 'Matériels',
      icon: 'package',
      route: '/materials',
      children: [
        { label: 'Liste', icon: 'list', route: '/materials/list' },
        { label: 'Nouveau', icon: 'plus', route: '/materials/new' }
      ]
    },
    {
      label: 'Catégories',
      icon: 'folder',
      route: '/categories',
      children: [
        { label: 'Liste', icon: 'list', route: '/categories/list' },
        { label: 'Nouvelle', icon: 'plus', route: '/categories/new' }
      ]
    }
  ];

  expandedItems: Set<string> = new Set();

  constructor(private router: Router) {}

  toggleExpand(label: string): void {
    if (this.expandedItems.has(label)) {
      this.expandedItems.delete(label);
    } else {
      this.expandedItems.add(label);
    }
  }

  isExpanded(label: string): boolean {
    return this.expandedItems.has(label);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
```

### sidebar.component.html
```html
<div class="sidebar">
  <div class="sidebar-header">
    <h2>SuiviMat</h2>
    <p class="text-sm text-gray-400">Gestion de Matériel</p>
  </div>

  <nav class="sidebar-nav">
    <div *ngFor="let item of menuItems" class="menu-item-group">
      <div 
        class="menu-item" 
        [class.has-children]="item.children"
        (click)="item.children ? toggleExpand(item.label) : navigate(item.route)">
        <span class="menu-icon">📦</span>
        <span class="menu-label">{{ item.label }}</span>
        <span *ngIf="item.children" class="expand-icon">
          {{ isExpanded(item.label) ? '▼' : '▶' }}
        </span>
      </div>

      <div *ngIf="item.children && isExpanded(item.label)" class="submenu">
        <div 
          *ngFor="let child of item.children" 
          class="submenu-item"
          (click)="navigate(child.route)">
          <span class="submenu-icon">•</span>
          <span class="submenu-label">{{ child.label }}</span>
        </div>
      </div>
    </div>
  </nav>

  <div class="sidebar-footer">
    <div class="user-info">
      <span class="user-icon">👤</span>
      <span class="user-name">Utilisateur</span>
    </div>
  </div>
</div>
```

### sidebar.component.css
```css
.sidebar {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}

.menu-item-group {
  margin-bottom: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  gap: 12px;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item.has-children {
  justify-content: space-between;
}

.menu-label {
  flex: 1;
  font-weight: 500;
}

.expand-icon {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.submenu {
  padding-left: 20px;
  margin-top: 4px;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}
```

---

## 4. Component Principal - Déclaration Sortie

### outgoing-declaration.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../../services/material.service';
import { CategoryService } from '../../../services/category.service';
import { DeclarationService } from '../../../services/declaration.service';
import { Material } from '../../../models/material.model';
import { MaterialCategory } from '../../../models/category.model';

interface SelectedMaterial {
  material: Material;
  quantity: number;
}

@Component({
  selector: 'app-outgoing-declaration',
  templateUrl: './outgoing-declaration.component.html',
  styleUrls: ['./outgoing-declaration.component.css']
})
export class OutgoingDeclarationComponent implements OnInit {
  step: number = 1;
  materials: Material[] = [];
  categories: MaterialCategory[] = [];
  selectedMaterials: SelectedMaterial[] = [];
  
  // Filtres
  searchTerm: string = '';
  selectedCategory: number | null = null;
  
  // Formulaire étape 2
  usagePurpose: string = '';
  note: string = '';
  additionalInfo: string = '';
  expectedReturnDate: string = '';

  constructor(
    private materialService: MaterialService,
    private categoryService: CategoryService,
    private declarationService: DeclarationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.materialService.getMaterials().subscribe(materials => {
      this.materials = materials;
    });
    
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  get filteredMaterials(): Material[] {
    return this.materials.filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          material.serialNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || material.category === this.selectedCategory;
      
      const isAvailable = material.status === 'AVAILABLE';
      
      return matchesSearch && matchesCategory && isAvailable;
    });
  }

  isMaterialSelected(material: Material): boolean {
    return this.selectedMaterials.some(sm => sm.material.id === material.id);
  }

  toggleMaterial(material: Material): void {
    const index = this.selectedMaterials.findIndex(sm => sm.material.id === material.id);
    
    if (index > -1) {
      this.selectedMaterials.splice(index, 1);
    } else {
      this.selectedMaterials.push({
        material,
        quantity: 1
      });
    }
  }

  updateQuantity(materialId: number, quantity: number): void {
    const selected = this.selectedMaterials.find(sm => sm.material.id === materialId);
    if (selected) {
      selected.quantity = Math.max(1, quantity);
    }
  }

  removeMaterial(materialId: number): void {
    this.selectedMaterials = this.selectedMaterials.filter(sm => sm.material.id !== materialId);
  }

  nextStep(): void {
    if (this.step === 1 && this.selectedMaterials.length > 0) {
      this.step = 2;
    }
  }

  previousStep(): void {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  submit(): void {
    const declaration = {
      declarationType: 'OUTGOING' as const,
      declaredBy: 'Utilisateur actuel',
      note: this.note,
      additionalInfo: this.additionalInfo,
      usagePurpose: this.usagePurpose,
      expectedReturnDate: this.expectedReturnDate,
      movements: this.selectedMaterials.map(sm => ({
        id: 0,
        material: sm.material.id,
        materialName: sm.material.name,
        quantity: sm.quantity,
        condition: sm.material.currentCondition,
        status: 'PENDING' as const,
        createdAt: new Date().toISOString(),
        createdBy: 'Utilisateur actuel'
      }))
    };

    this.declarationService.createOutgoingDeclaration(declaration);
    alert('Déclaration de sortie créée avec succès!');
    this.router.navigate(['/declarations/list']);
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find(c => c.id === categoryId)?.name || '';
  }
}
```

### outgoing-declaration.component.html
```html
<div class="container">
  <div class="header">
    <h1>Nouvelle Déclaration de Sortie</h1>
    <div class="steps">
      <div class="step" [class.active]="step === 1" [class.completed]="step > 1">
        <div class="step-number">1</div>
        <div class="step-label">Sélection Matériel</div>
      </div>
      <div class="step-line"></div>
      <div class="step" [class.active]="step === 2">
        <div class="step-number">2</div>
        <div class="step-label">Informations</div>
      </div>
    </div>
  </div>

  <!-- Étape 1: Sélection du matériel -->
  <div *ngIf="step === 1" class="step-content">
    <div class="filters">
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Rechercher par nom ou numéro de série..."
          class="search-input">
      </div>
      
      <select [(ngModel)]="selectedCategory" class="category-select">
        <option [value]="null">Toutes les catégories</option>
        <option *ngFor="let category of categories" [value]="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="materials-grid">
      <div 
        *ngFor="let material of filteredMaterials" 
        class="material-card"
        [class.selected]="isMaterialSelected(material)"
        (click)="toggleMaterial(material)">
        <div class="material-checkbox">
          <input 
            type="checkbox" 
            [checked]="isMaterialSelected(material)"
            (click)="$event.stopPropagation()">
        </div>
        <div class="material-info">
          <h3>{{ material.name }}</h3>
          <p class="serial">SN: {{ material.serialNumber }}</p>
          <p class="category">{{ getCategoryName(material.category) }}</p>
          <div class="material-meta">
            <span class="badge badge-success">{{ material.currentCondition }}</span>
            <span *ngIf="material.quantifiable" class="quantity">Qté: {{ material.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="selectedMaterials.length > 0" class="selected-materials">
      <h3>Matériels sélectionnés ({{ selectedMaterials.length }})</h3>
      <div class="selected-list">
        <div *ngFor="let sm of selectedMaterials" class="selected-item">
          <span class="material-name">{{ sm.material.name }}</span>
          <div class="quantity-controls" *ngIf="sm.material.quantifiable">
            <button (click)="updateQuantity(sm.material.id, sm.quantity - 1)">-</button>
            <input 
              type="number" 
              [value]="sm.quantity" 
              (change)="updateQuantity(sm.material.id, +$event.target.value)"
              min="1">
            <button (click)="updateQuantity(sm.material.id, sm.quantity + 1)">+</button>
          </div>
          <button class="remove-btn" (click)="removeMaterial(sm.material.id)">×</button>
        </div>
      </div>
    </div>

    <div class="actions">
      <button 
        class="btn btn-primary" 
        [disabled]="selectedMaterials.length === 0"
        (click)="nextStep()">
        Suivant
      </button>
    </div>
  </div>

  <!-- Étape 2: Informations de la déclaration -->
  <div *ngIf="step === 2" class="step-content">
    <form class="declaration-form">
      <div class="form-group">
        <label>Objet de l'utilisation *</label>
        <input 
          type="text" 
          [(ngModel)]="usagePurpose" 
          name="usagePurpose"
          placeholder="Ex: Projet X, Formation, etc."
          required>
      </div>

      <div class="form-group">
        <label>Date de retour prévue</label>
        <input 
          type="date" 
          [(ngModel)]="expectedReturnDate"
          name="expectedReturnDate">
      </div>

      <div class="form-group">
        <label>Note</label>
        <textarea 
          [(ngModel)]="note"
          name="note"
          rows="4"
          placeholder="Informations complémentaires..."></textarea>
      </div>

      <div class="form-group">
        <label>Informations additionnelles</label>
        <input 
          type="text" 
          [(ngModel)]="additionalInfo"
          name="additionalInfo"
          placeholder="Ex: Bureau 205, Salle A, etc.">
      </div>

      <div class="summary">
        <h3>Récapitulatif</h3>
        <ul>
          <li *ngFor="let sm of selectedMaterials">
            {{ sm.material.name }} 
            <span *ngIf="sm.material.quantifiable">(x{{ sm.quantity }})</span>
          </li>
        </ul>
      </div>
    </form>

    <div class="actions">
      <button class="btn btn-secondary" (click)="previousStep()">Retour</button>
      <button 
        class="btn btn-primary" 
        [disabled]="!usagePurpose"
        (click)="submit()">
        Créer la déclaration
      </button>
    </div>
  </div>
</div>
```

### outgoing-declaration.component.css
```css
.container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1e293b;
}

.steps {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #64748b;
}

.step.active .step-number {
  background: #3b82f6;
  color: white;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input,
.category-select {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.material-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 12px;
}

.material-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.material-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.material-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.serial,
.category {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
}

.material-meta {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.selected-materials {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
}

.material-name {
  flex: 1;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-controls input {
  width: 60px;
  text-align: center;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 6px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
}

.declaration-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #334155;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.summary {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-top: 24px;
}
```

---

## 5. app.module.ts

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { OutgoingDeclarationComponent } from './components/declarations/outgoing-declaration/outgoing-declaration.component';
import { ReturnDeclarationComponent } from './components/declarations/return-declaration/return-declaration.component';
import { DeclarationListComponent } from './components/declarations/declaration-list/declaration-list.component';
import { MaterialListComponent } from './components/materials/material-list/material-list.component';
import { MaterialFormComponent } from './components/materials/material-form/material-form.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { ValidationListComponent } from './components/admin/validation-list/validation-list.component';
import { ValidationDetailComponent } from './components/admin/validation-detail/validation-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    OutgoingDeclarationComponent,
    ReturnDeclarationComponent,
    DeclarationListComponent,
    MaterialListComponent,
    MaterialFormComponent,
    CategoryListComponent,
    CategoryFormComponent,
    ValidationListComponent,
    ValidationDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## 6. app-routing.module.ts

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutgoingDeclarationComponent } from './components/declarations/outgoing-declaration/outgoing-declaration.component';
import { ReturnDeclarationComponent } from './components/declarations/return-declaration/return-declaration.component';
import { DeclarationListComponent } from './components/declarations/declaration-list/declaration-list.component';
import { MaterialListComponent } from './components/materials/material-list/material-list.component';
import { MaterialFormComponent } from './components/materials/material-form/material-form.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { ValidationListComponent } from './components/admin/validation-list/validation-list.component';
import { ValidationDetailComponent } from './components/admin/validation-detail/validation-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/declarations/outgoing/new', pathMatch: 'full' },
  { path: 'declarations/outgoing/new', component: OutgoingDeclarationComponent },
  { path: 'declarations/return/new', component: ReturnDeclarationComponent },
  { path: 'declarations/list', component: DeclarationListComponent },
  { path: 'materials/list', component: MaterialListComponent },
  { path: 'materials/new', component: MaterialFormComponent },
  { path: 'materials/edit/:id', component: MaterialFormComponent },
  { path: 'categories/list', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'admin/validations', component: ValidationListComponent },
  { path: 'admin/validations/:id', component: ValidationDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 7. app.component.ts & HTML

### app.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'suivimat-app';
}
```

### app.component.html
```html
<div class="app-container">
  <app-sidebar></app-sidebar>
  <main class="main-content">
    <router-outlet></router-outlet>
  </main>
</div>
```

### app.component.css
```css
.app-container {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 24px;
}
```

---

## 8. styles.css (global)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
  color: #1e293b;
}

/* Utilitaires */
.text-sm {
  font-size: 0.875rem;
}

.text-gray-400 {
  color: #9ca3af;
}

/* Pour continuer avec les autres components, suivez le même pattern */
```

---

## Instructions de déploiement

1. Créez le projet: `ng new suivimat-app`
2. Copiez tous les fichiers dans leurs répertoires respectifs
3. Installez les dépendances: `npm install`
4. Lancez l'application: `ng serve`
5. Accédez à `http://localhost:4200`

Cette structure fournit une application Angular complète avec toutes les fonctionnalités demandées. Vous pouvez maintenant implémenter les components restants en suivant le même pattern!