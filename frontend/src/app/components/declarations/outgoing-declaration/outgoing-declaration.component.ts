import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Material} from '../../../models/material';
import {MaterialCategory} from '../../../models/category';
import {MaterialService} from '../../../services/material.service';
import {CategoryService} from '../../../services/category.service';
import {DeclarationService} from '../../../services/declaration.service';
import {Declaration, OutgoingDeclaration} from '../../../models/declaration';
import {FormsModule} from '@angular/forms';
import {NgFor, NgIf} from '@angular/common';



interface SelectedMaterial {
  material: Material;
  quantity: number;
}

@Component({
  selector: 'app-outgoing-declaration',
  standalone:true,
  imports:[FormsModule,NgFor,NgIf],
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
    const declaration:any = {
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
