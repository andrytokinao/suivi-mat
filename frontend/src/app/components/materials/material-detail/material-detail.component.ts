import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

import { MaterialService } from '../../../services/material.service';
import { DeclarationService } from '../../../services/declaration.service';
import {
  MaterialFullDetail,
  MaterialState,
  MaterialStateFormData,
  Maintenance,
  MaintenanceFormData
} from '../../../models/material';
import { MaterialMovement } from '../../../models/declaration';
import { MaterialStatus, MaterialCondition, MaintenanceStatus, MovementStatus } from '../../../models/enums';
import { OutgoingDeclarationFormComponent } from '../../declarations/outgoing-declaration-form/outgoing-declaration-form.component';

@Component({
  selector: 'app-material-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  templateUrl: './material-detail.component.html',
  styleUrls: ['./material-detail.component.css']
})
export class MaterialDetailComponent implements OnInit, OnDestroy {
  materialId!: number;
  materialDetail: MaterialFullDetail | null = null;
  isLoading = false;
  error: string | null = null;

  // Forms
  maintenanceForm!: FormGroup;
  stateForm!: FormGroup;
  movementForm!: FormGroup;
  batchMaintenanceForm!: FormGroup;
  batchMovementForm!: FormGroup;

  // UI State
  showMaintenanceForm = false;
  showStateForm = false;
  showMovementForm = false;
  showBatchMaintenanceForm = false;
  showBatchMovementForm = false;
  editingMaintenance: Maintenance | null = null;
  editingState: MaterialState | null = null;
  editingMovement: MaterialMovement | null = null;

  // Enums
  materialStatuses = Object.values(MaterialStatus);
  materialConditions = Object.values(MaterialCondition);
  maintenanceStatuses = Object.values(MaintenanceStatus);
  movementStatuses = Object.values(MovementStatus);

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materialService: MaterialService,
    private declarationService: DeclarationService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.materialId = +params['id'];
      this.loadMaterialDetails();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms(): void {
    // Single maintenance form
    this.maintenanceForm = this.fb.group({
      maintenanceType: ['', Validators.required],
      description: [''],
      startDate: [new Date(), Validators.required],
      endDate: [null],
      cost: [null],
      linkedToCharge: [false],
      chargeId: [''],
      performedBy: [''],
      status: [MaintenanceStatus.PLANNED, Validators.required]
    });

    // State form
    this.stateForm = this.fb.group({
      state: [MaterialCondition.GOOD, Validators.required],
      description: [''],
      updatedBy: ['', Validators.required]
    });

    // Movement form
    this.movementForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      condition: [MaterialCondition.GOOD, Validators.required],
      note: ['']
    });

    // Batch maintenance form
    this.batchMaintenanceForm = this.fb.group({
      maintenances: this.fb.array([])
    });

    // Batch movement form
    this.batchMovementForm = this.fb.group({
      movements: this.fb.array([])
    });
  }

  get maintenancesFormArray(): FormArray {
    return this.batchMaintenanceForm.get('maintenances') as FormArray;
  }

  get movementsFormArray(): FormArray {
    return this.batchMovementForm.get('movements') as FormArray;
  }

  // ============== LOAD DATA ==============

  loadMaterialDetails(): void {
    this.isLoading = true;
    this.error = null;

    this.materialService.getMaterialFullDetails(this.materialId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (detail) => {
          this.materialDetail = detail;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des détails: ' + err.message;
          this.isLoading = false;
        }
      });
  }

  // ============== MAINTENANCE CRUD ==============

  openMaintenanceForm(maintenance?: Maintenance): void {
    this.showMaintenanceForm = true;
    this.editingMaintenance = maintenance || null;

    if (maintenance) {
      this.maintenanceForm.patchValue({
        maintenanceType: maintenance.maintenanceType,
        description: maintenance.description,
        startDate: new Date(maintenance.startDate),
        endDate: maintenance.endDate ? new Date(maintenance.endDate) : null,
        cost: maintenance.cost,
        linkedToCharge: maintenance.linkedToCharge,
        chargeId: maintenance.chargeId,
        performedBy: maintenance.performedBy,
        status: maintenance.status
      });
    } else {
      this.maintenanceForm.reset({
        maintenanceType: '',
        description: '',
        startDate: new Date(),
        endDate: null,
        cost: null,
        linkedToCharge: false,
        chargeId: '',
        performedBy: '',
        status: MaintenanceStatus.PLANNED
      });
    }
  }

  closeMaintenanceForm(): void {
    this.showMaintenanceForm = false;
    this.editingMaintenance = null;
    this.maintenanceForm.reset();
  }

  saveMaintenance(): void {
    if (this.maintenanceForm.invalid) return;

    const formValue = this.maintenanceForm.value;
    const maintenanceData: MaintenanceFormData = {
      materialId: this.materialId,
      maintenanceType: formValue.maintenanceType,
      description: formValue.description || null,
      startDate: this.formatDate(formValue.startDate),
      endDate: formValue.endDate ? this.formatDate(formValue.endDate) : null,
      cost: formValue.cost,
      linkedToCharge: formValue.linkedToCharge,
      chargeId: formValue.chargeId || null,
      performedBy: formValue.performedBy || null,
      status: formValue.status
    };

    this.isLoading = true;

    if (this.editingMaintenance) {
      this.materialService.updateMaintenance(this.materialId, this.editingMaintenance.id, maintenanceData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMaterialDetails();
            this.closeMaintenanceForm();
          },
          error: (err) => {
            this.error = 'Erreur lors de la mise à jour: ' + err.message;
            this.isLoading = false;
          }
        });
    } else {
      this.materialService.createMaintenance(this.materialId, maintenanceData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMaterialDetails();
            this.closeMaintenanceForm();
          },
          error: (err) => {
            this.error = 'Erreur lors de la création: ' + err.message;
            this.isLoading = false;
          }
        });
    }
  }

  deleteMaintenance(maintenance: Maintenance): void {
    if (confirm(`Supprimer la maintenance "${maintenance.maintenanceType}" ?`)) {
      this.materialService.deleteMaintenance(this.materialId, maintenance.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.loadMaterialDetails(),
          error: (err) => this.error = 'Erreur lors de la suppression: ' + err.message
        });
    }
  }

  // ============== BATCH MAINTENANCE ==============

  openBatchMaintenanceForm(): void {
    this.showBatchMaintenanceForm = true;
    this.maintenancesFormArray.clear();
    this.addMaintenanceToArray();
  }

  closeBatchMaintenanceForm(): void {
    this.showBatchMaintenanceForm = false;
    this.maintenancesFormArray.clear();
  }

  addMaintenanceToArray(): void {
    const maintenanceGroup = this.fb.group({
      maintenanceType: ['', Validators.required],
      description: [''],
      startDate: [new Date(), Validators.required],
      endDate: [null],
      cost: [null],
      linkedToCharge: [false],
      chargeId: [''],
      performedBy: [''],
      status: [MaintenanceStatus.PLANNED, Validators.required]
    });
    this.maintenancesFormArray.push(maintenanceGroup);
  }

  removeMaintenanceFromArray(index: number): void {
    this.maintenancesFormArray.removeAt(index);
  }

  saveBatchMaintenances(): void {
    if (this.batchMaintenanceForm.invalid) return;

    const maintenances: MaintenanceFormData[] = this.maintenancesFormArray.controls.map(ctrl => {
      const val = ctrl.value;
      return {
        materialId: this.materialId,
        maintenanceType: val.maintenanceType,
        description: val.description || null,
        startDate: this.formatDate(val.startDate),
        endDate: val.endDate ? this.formatDate(val.endDate) : null,
        cost: val.cost,
        linkedToCharge: val.linkedToCharge,
        chargeId: val.chargeId || null,
        performedBy: val.performedBy || null,
        status: val.status
      };
    });

    this.isLoading = true;

    this.materialService.createMaintenancesBatch(this.materialId, maintenances)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadMaterialDetails();
          this.closeBatchMaintenanceForm();
        },
        error: (err) => {
          this.error = 'Erreur lors de la création en lot: ' + err.message;
          this.isLoading = false;
        }
      });
  }

  // ============== STATE CRUD ==============

  openStateForm(state?: MaterialState): void {
    this.showStateForm = true;
    this.editingState = state || null;

    if (state) {
      this.stateForm.patchValue({
        state: state.state,
        description: state.description,
        updatedBy: state.updatedBy || ''
      });
    } else {
      this.stateForm.reset({
        state: this.materialDetail?.currentCondition || MaterialCondition.GOOD,
        description: '',
        updatedBy: ''
      });
    }
  }

  closeStateForm(): void {
    this.showStateForm = false;
    this.editingState = null;
    this.stateForm.reset();
  }

  saveState(): void {
    if (this.stateForm.invalid) return;

    const formValue = this.stateForm.value;
    const stateData: MaterialStateFormData = {
      state: formValue.state,
      description: formValue.description || null,
      updatedBy: formValue.updatedBy
    };

    this.isLoading = true;

    if (this.editingState) {
      this.materialService.updateState(this.materialId, this.editingState.id, stateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMaterialDetails();
            this.closeStateForm();
          },
          error: (err) => {
            this.error = 'Erreur lors de la mise à jour: ' + err.message;
            this.isLoading = false;
          }
        });
    } else {
      this.materialService.createState(this.materialId, stateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMaterialDetails();
            this.closeStateForm();
          },
          error: (err) => {
            this.error = 'Erreur lors de la création: ' + err.message;
            this.isLoading = false;
          }
        });
    }
  }

  deleteState(state: MaterialState): void {
    if (confirm(`Supprimer cet historique d'état ?`)) {
      this.materialService.deleteState(this.materialId, state.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.loadMaterialDetails(),
          error: (err) => this.error = 'Erreur lors de la suppression: ' + err.message
        });
    }
  }

  // ============== MOVEMENT CRUD ==============

  openMovementForm(movement?: MaterialMovement): void {
    this.showMovementForm = true;
    this.editingMovement = movement || null;

    if (movement) {
      this.movementForm.patchValue({
        quantity: movement.quantity,
        condition: movement.condition,
        note: ''
      });
    } else {
      this.movementForm.reset({
        quantity: 1,
        condition: this.materialDetail?.currentCondition || MaterialCondition.GOOD,
        note: ''
      });
    }
  }

  closeMovementForm(): void {
    this.showMovementForm = false;
    this.editingMovement = null;
    this.movementForm.reset();
  }

  saveMovement(): void {
    if (this.movementForm.invalid) return;

    const formValue = this.movementForm.value;
    const movementData: Partial<MaterialMovement> = {
      materialId: this.materialId,
      quantity: formValue.quantity,
      condition: formValue.condition,
      status: MovementStatus.PENDING_VALIDATION
    };

    this.isLoading = true;

    if (this.editingMovement) {
      this.materialService.updateMovement(this.materialId, this.editingMovement.id, movementData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMaterialDetails();
            this.closeMovementForm();
          },
          error: (err) => {
            this.error = 'Erreur lors de la mise à jour: ' + err.message;
            this.isLoading = false;
          }
        });
    } else {
      this.materialService.createMovement(this.materialId, movementData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMaterialDetails();
            this.closeMovementForm();
          },
          error: (err) => {
            this.error = 'Erreur lors de la création: ' + err.message;
            this.isLoading = false;
          }
        });
    }
  }

  deleteMovement(movement: MaterialMovement): void {
    if (confirm(`Supprimer ce mouvement ?`)) {
      this.materialService.deleteMovement(this.materialId, movement.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.loadMaterialDetails(),
          error: (err) => this.error = 'Erreur lors de la suppression: ' + err.message
        });
    }
  }

  // ============== BATCH MOVEMENT ==============

  openBatchMovementForm(): void {
    this.showBatchMovementForm = true;
    this.movementsFormArray.clear();
    this.addMovementToArray();
  }

  closeBatchMovementForm(): void {
    this.showBatchMovementForm = false;
    this.movementsFormArray.clear();
  }

  addMovementToArray(): void {
    const movementGroup = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      condition: [this.materialDetail?.currentCondition || MaterialCondition.GOOD, Validators.required],
      note: ['']
    });
    this.movementsFormArray.push(movementGroup);
  }

  removeMovementFromArray(index: number): void {
    this.movementsFormArray.removeAt(index);
  }

  saveBatchMovements(): void {
    if (this.batchMovementForm.invalid) return;

    const movements: Partial<MaterialMovement>[] = this.movementsFormArray.controls.map(ctrl => {
      const val = ctrl.value;
      return {
        materialId: this.materialId,
        quantity: val.quantity,
        condition: val.condition,
        status: MovementStatus.PENDING_VALIDATION
      };
    });

    this.isLoading = true;

    this.materialService.createMovementsBatch(this.materialId, movements)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadMaterialDetails();
          this.closeBatchMovementForm();
        },
        error: (err) => {
          this.error = 'Erreur lors de la création en lot: ' + err.message;
          this.isLoading = false;
        }
      });
  }

  // ============== DECLARATIONS SHORTCUTS ==============

  openOutgoingDeclarationForm(): void {
    const modalRef = this.modalService.open(OutgoingDeclarationFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    // Pre-fill with current material
    modalRef.componentInstance.preselectedMaterialId = this.materialId;
    modalRef.componentInstance.preselectedMaterialName = this.materialDetail?.name;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadMaterialDetails();
        }
      },
      () => {} // Modal dismissed
    );
  }

  openReturnDeclarationForm(): void {
    // Navigate to return declaration form page
    // The return declaration form is a multi-step page component, not a modal
    this.router.navigate(['/declarations/return/new'], {
      queryParams: {
        materialId: this.materialId,
        materialName: this.materialDetail?.name
      }
    });
  }

  // ============== UTILITIES ==============

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';

    if (['good', 'available', 'completed', 'validated', 'verified', 'approved'].includes(statusLower)) {
      return 'status-success';
    }
    if (['in_use', 'planned', 'pending', 'pending_validation', 'pending_verification'].includes(statusLower)) {
      return 'status-warning';
    }
    if (['damaged', 'under_maintenance', 'in_progress', 'in_repair'].includes(statusLower)) {
      return 'status-info';
    }
    if (['broken', 'lost', 'retired', 'rejected', 'cancelled'].includes(statusLower)) {
      return 'status-danger';
    }
    return 'status-default';
  }

  translateStatus(status: string): string {
    const translations: { [key: string]: string } = {
      'AVAILABLE': 'Disponible',
      'IN_USE': 'En utilisation',
      'UNDER_MAINTENANCE': 'En maintenance',
      'LOST': 'Perdu',
      'RETIRED': 'Retiré',
      'GOOD': 'Bon état',
      'DAMAGED': 'Endommagé',
      'BROKEN': 'Cassé',
      'IN_REPAIR': 'En réparation',
      'PLANNED': 'Planifiée',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée',
      'PENDING_VALIDATION': 'En attente de validation',
      'VALIDATED': 'Validé',
      'PENDING_VERIFICATION': 'En attente de vérification',
      'VERIFIED': 'Vérifié',
      'REJECTED': 'Rejeté'
    };
    return translations[status] || status;
  }

  goBack(): void {
    this.router.navigate(['/materials/list']);
  }
}
