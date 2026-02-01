import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from '../../../models/material';
import { MaterialCategory } from '../../../models/category';
import { MaterialService } from '../../../services/material.service';
import { CategoryService } from '../../../services/category.service';
import { DeclarationService } from '../../../services/declaration.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenueCategoryComponent } from '../../../shared/menue-category/menue-category.component';
import { MaterialCondition, MaterialStatus } from '../../../models/enums';
import { Subject, takeUntil } from 'rxjs';

interface SelectedMaterial {
  material: Material;
  quantity: number;
  condition: MaterialCondition;
}

@Component({
  selector: 'app-outgoing-declaration',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MenueCategoryComponent
  ],
  templateUrl: './outgoing-declaration.component.html',
  styleUrls: ['./outgoing-declaration.component.css']
})
export class OutgoingDeclarationComponent implements OnInit, OnDestroy {
  step: number = 1;
  materials: Material[] = [];
  categories: MaterialCategory[] = [];
  selectedMaterials: SelectedMaterial[] = [];
  filteredMaterials: Material[] = [];

  searchTerm: string = '';
  selectedCategories = new Set<number>();

  usagePurpose: string = '';
  note: string = '';
  additionalInfo: string = '';
  expectedReturnDate: string = '';
  declaredBy: string = '';

  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private materialService: MaterialService,
    private categoryService: CategoryService,
    private declarationService: DeclarationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
    this.loadCategories();
    this.subscribeToCategoryFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMaterials(): void {
    this.isLoading = true;
    this.materialService.getMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (materials) => {
          this.materials = materials;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des matériels: ' + err.message;
          this.isLoading = false;
        }
      });
  }

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
        }
      });
  }

  private subscribeToCategoryFilters(): void {
    this.categoryService.selectedCategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filteredC => {
        this.selectedCategories = filteredC;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    this.filteredMaterials = this.materials.filter(m => {
      const matchSearch = !this.searchTerm ||
        m.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.serialNumber?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchCategory = this.selectedCategories.size === 0 ||
        (m.categoryId && this.selectedCategories.has(m.categoryId));

      const isAvailable = m.status === MaterialStatus.AVAILABLE;

      return matchSearch && matchCategory && isAvailable;
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
        quantity: 1,
        condition: material.currentCondition || MaterialCondition.GOOD
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
      this.error = null;
    }
  }

  previousStep(): void {
    if (this.step === 2) {
      this.step = 1;
      this.error = null;
    }
  }

  canSubmit(): boolean {
    return !!this.usagePurpose && !!this.declaredBy && this.selectedMaterials.length > 0;
  }

  submit(): void {
    if (!this.usagePurpose || !this.declaredBy) {
      this.error = 'Veuillez remplir tous les champs requis (Déclarant et Objet de l\'utilisation)';
      return;
    }

    if (this.selectedMaterials.length === 0) {
      this.error = 'Veuillez sélectionner au moins un matériel';
      return;
    }

    this.isLoading = true;
    this.error = null;

    const declarationData = {
      declaredBy: this.declaredBy,
      usagePurpose: this.usagePurpose,
      note: this.note || null,
      additionalInfo: this.additionalInfo || null,
      movements: this.selectedMaterials.map(sm => ({
        material: sm.material.id,
        quantity: sm.quantity,
        condition: sm.condition,
        note: null
      }))
    };

    this.declarationService.createOutgoingDeclaration(declarationData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Déclaration de sortie créée avec succès!';
          setTimeout(() => {
            this.router.navigate(['/declarations/list']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Erreur lors de la création: ' + (error.message || 'Erreur inconnue');
          console.error('Error creating declaration:', error);
        }
      });
  }

  getCategoryName(material: Material): string {
    if (material.categoryName) return material.categoryName;
    if (material.categoryId) {
      return this.categories.find(c => c.id === material.categoryId)?.name || 'Non catégorisé';
    }
    return 'Non catégorisé';
  }

  getConditionLabel(condition: MaterialCondition): string {
    switch (condition) {
      case MaterialCondition.GOOD: return 'Bon';
      case MaterialCondition.DAMAGED: return 'Endommagé';
      case MaterialCondition.BROKEN: return 'Cassé';
      case MaterialCondition.IN_REPAIR: return 'En réparation';
      default: return condition;
    }
  }

  goBack(): void {
    this.router.navigate(['/declarations/list']);
  }

  clearError(): void {
    this.error = null;
  }

  clearSuccess(): void {
    this.successMessage = null;
  }
}
