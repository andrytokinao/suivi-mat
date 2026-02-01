import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';
import { CategoryService } from '../../services/category.service';
import { Dashboard, DashboardFilter } from '../../models/dashboard';
import { MaterialCategory } from '../../models/category';
import { MaterialStatus, MaterialCondition, DeclarationStatus, MaintenanceStatus } from '../../models/enums';

@Component({
  selector: 'app-dashboard',
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
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboard: Dashboard | null = null;
  categories: MaterialCategory[] = [];
  isLoading = false;
  error: string | null = null;

  filterForm!: FormGroup;
  showFilters = false;

  materialStatuses = Object.values(MaterialStatus);
  declarationStatuses = Object.values(DeclarationStatus);
  maintenanceStatuses = Object.values(MaintenanceStatus);

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.initFilterForm();
  }

  ngOnInit(): void {
    this.subscribeToLoadingState();
    this.subscribeToErrors();
    this.loadDashboard();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      categoryId: [null],
      materialStatus: [null],
      declarationStatus: [null],
      maintenanceStatus: [null]
    });
  }

  private subscribeToLoadingState(): void {
    this.dashboardService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);
  }

  private subscribeToErrors(): void {
    this.dashboardService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);
  }

  loadDashboard(): void {
    this.dashboardService.getDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dashboard) => {
          this.dashboard = dashboard;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement du tableau de bord: ' + err.message;
        }
      });
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = this.flattenCategories(categories);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des catégories:', err);
        }
      });
  }

  private flattenCategories(categories: MaterialCategory[]): MaterialCategory[] {
    let flattened: MaterialCategory[] = [];
    categories.forEach(cat => {
      flattened.push(cat);
      if (cat.children && cat.children.length > 0) {
        flattened = flattened.concat(this.flattenCategories(cat.children));
      }
    });
    return flattened;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const filter: DashboardFilter = {};

    if (formValue.startDate) {
      filter.startDate = this.formatDate(formValue.startDate);
    }
    if (formValue.endDate) {
      filter.endDate = this.formatDate(formValue.endDate);
    }
    if (formValue.categoryId) {
      filter.categoryId = formValue.categoryId;
    }
    if (formValue.materialStatus) {
      filter.materialStatus = formValue.materialStatus;
    }
    if (formValue.declarationStatus) {
      filter.declarationStatus = formValue.declarationStatus;
    }
    if (formValue.maintenanceStatus) {
      filter.maintenanceStatus = formValue.maintenanceStatus;
    }

    const hasFilters = Object.keys(filter).length > 0;

    if (hasFilters) {
      this.dashboardService.getDashboardWithFilter(filter)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dashboard) => {
            this.dashboard = dashboard;
            this.error = null;
          },
          error: (err) => {
            this.error = 'Erreur lors de l\'application des filtres: ' + err.message;
          }
        });
    } else {
      this.loadDashboard();
    }
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.loadDashboard();
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStatusKeys(statusMap: { [key: string]: number } | undefined): string[] {
    return statusMap ? Object.keys(statusMap) : [];
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();

    // Material Status
    if (statusLower === 'available') return 'status-success';
    if (statusLower === 'in_use') return 'status-info';
    if (statusLower === 'under_maintenance') return 'status-warning';
    if (statusLower === 'lost' || statusLower === 'retired') return 'status-danger';

    // Declaration Status
    if (statusLower === 'pending' || statusLower === 'pending_validation' || statusLower === 'pending_verification') return 'status-warning';
    if (statusLower === 'approved' || statusLower === 'validated' || statusLower === 'verified') return 'status-success';
    if (statusLower === 'rejected') return 'status-danger';

    // Maintenance Status
    if (statusLower === 'planned') return 'status-info';
    if (statusLower === 'in_progress') return 'status-warning';
    if (statusLower === 'completed') return 'status-success';
    if (statusLower === 'cancelled') return 'status-danger';

    // Condition
    if (statusLower === 'good') return 'status-success';
    if (statusLower === 'damaged' || statusLower === 'in_repair') return 'status-warning';
    if (statusLower === 'broken') return 'status-danger';

    return 'status-default';
  }

  translateStatus(status: string): string {
    const translations: { [key: string]: string } = {
      // Material Status
      'AVAILABLE': 'Disponible',
      'IN_USE': 'En utilisation',
      'UNDER_MAINTENANCE': 'En maintenance',
      'LOST': 'Perdu',
      'RETIRED': 'Retiré',

      // Condition
      'GOOD': 'Bon état',
      'DAMAGED': 'Endommagé',
      'BROKEN': 'Cassé',
      'IN_REPAIR': 'En réparation',

      // Declaration Status
      'PENDING': 'En attente',
      'APPROVED': 'Approuvée',
      'REJECTED': 'Rejetée',
      'PENDING_VALIDATION': 'En attente de validation',
      'VALIDATED': 'Validé',
      'PENDING_VERIFICATION': 'En attente de vérification',
      'VERIFIED': 'Vérifié',

      // Maintenance Status
      'PLANNED': 'Planifiée',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée'
    };

    return translations[status] || status;
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
}
