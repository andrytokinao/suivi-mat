import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeclarationService } from '../../../services/declaration.service';
import { MaterialService } from '../../../services/material.service';
import { Material } from '../../../models/material';
import { MaterialCondition } from '../../../models/enums';
import { OutgoingDeclaration, MaterialMovement } from '../../../models/declaration';
import { Subject, takeUntil } from 'rxjs';

interface MaterialToReturn {
  movement: MaterialMovement;
  material: Material | null;
  selected: boolean;
  returnCondition: MaterialCondition;
  returnQuantity: number;
  note: string;
}

@Component({
  selector: 'app-return-declaration-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './return-declaration-form.component.html',
  styleUrls: ['./return-declaration-form.component.css']
})
export class ReturnDeclarationFormComponent implements OnInit, OnDestroy {
  step: number = 1;

  // Step 1: Select outgoing declaration
  outgoingDeclarations: OutgoingDeclaration[] = [];
  selectedOutgoingDeclaration: OutgoingDeclaration | null = null;

  // Step 2: Select materials to return
  materialsToReturn: MaterialToReturn[] = [];
  availableMaterials: Material[] = [];

  // Step 3: Form data
  declaredBy: string = '';
  returnConditionNote: string = '';
  verifiedBy: string = '';
  note: string = '';

  conditions = Object.values(MaterialCondition);

  isLoading = false;
  loadingMessage = '';
  error: string | null = null;
  successMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private declarationService: DeclarationService,
    private materialService: MaterialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOutgoingDeclarations();
    this.loadAvailableMaterials();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOutgoingDeclarations(): void {
    this.isLoading = true;
    this.loadingMessage = 'Chargement des déclarations...';

    this.declarationService.getOutgoingDeclarationsNotReturned()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (declarations) => {
          this.outgoingDeclarations = declarations;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des déclarations: ' + err.message;
          this.isLoading = false;
        }
      });
  }

  private loadAvailableMaterials(): void {
    this.materialService.getMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (materials) => {
          this.availableMaterials = materials;
        },
        error: (err) => {
          console.error('Error loading materials:', err);
        }
      });
  }

  selectOutgoingDeclaration(declaration: OutgoingDeclaration): void {
    this.selectedOutgoingDeclaration = declaration;

    // Load movements for this declaration
    if (declaration.movements) {
      this.setupMaterialsToReturn(declaration.movements);
    } else {
      this.declarationService.getDeclarationMovements(declaration.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (movements) => {
            this.setupMaterialsToReturn(movements);
          },
          error: (err) => {
            this.error = 'Erreur lors du chargement des mouvements: ' + err.message;
          }
        });
    }
  }

  private setupMaterialsToReturn(movements: MaterialMovement[]): void {
    this.materialsToReturn = movements.map(m => ({
      movement: m,
      material: this.availableMaterials.find(mat => mat.id === m.materialId) || null,
      selected: true,
      returnCondition: m.condition || MaterialCondition.GOOD,
      returnQuantity: m.quantity,
      note: ''
    }));
  }

  toggleMaterialSelection(item: MaterialToReturn): void {
    item.selected = !item.selected;
  }

  get selectedMaterialsCount(): number {
    return this.materialsToReturn.filter(m => m.selected).length;
  }

  nextStep(): void {
    if (this.step === 1 && this.selectedOutgoingDeclaration) {
      this.step = 2;
      this.error = null;
    } else if (this.step === 2 && this.selectedMaterialsCount > 0) {
      this.step = 3;
      this.error = null;
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
      this.error = null;
    }
  }

  canSubmit(): boolean {
    return !!this.declaredBy && !!this.returnConditionNote && this.selectedMaterialsCount > 0;
  }

  submit(): void {
    if (!this.canSubmit()) {
      this.error = 'Veuillez remplir tous les champs requis';
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Création de la déclaration de retour...';
    this.error = null;

    const selectedMaterials = this.materialsToReturn.filter(m => m.selected);

    const declarationData = {
      declaredBy: this.declaredBy,
      returnConditionNote: this.returnConditionNote,
      verifiedBy: this.verifiedBy || '',
      note: this.note || null,
      movements: selectedMaterials.map(sm => ({
        material: sm.movement.materialId!,
        quantity: sm.returnQuantity,
        condition: sm.returnCondition,
        note: sm.note || null
      }))
    };

    this.declarationService.createReturnDeclaration(declarationData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Déclaration de retour créée avec succès!';
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

  cancel(): void {
    this.router.navigate(['/declarations/list']);
  }

  clearError(): void {
    this.error = null;
  }

  getMaterialName(materialId: number | null): string {
    if (!materialId) return 'Matériel inconnu';
    return this.availableMaterials.find(m => m.id === materialId)?.name || 'Matériel inconnu';
  }

  getConditionLabel(condition: MaterialCondition): string {
    const labels: Record<MaterialCondition, string> = {
      [MaterialCondition.GOOD]: 'Bon état',
      [MaterialCondition.DAMAGED]: 'Endommagé',
      [MaterialCondition.BROKEN]: 'Cassé',
      [MaterialCondition.IN_REPAIR]: 'En réparation'
    };
    return labels[condition] || condition;
  }

  getConditionClass(condition: MaterialCondition): string {
    const classes: Record<MaterialCondition, string> = {
      [MaterialCondition.GOOD]: 'badge-good',
      [MaterialCondition.DAMAGED]: 'badge-damaged',
      [MaterialCondition.BROKEN]: 'badge-broken',
      [MaterialCondition.IN_REPAIR]: 'badge-repair'
    };
    return classes[condition] || '';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
