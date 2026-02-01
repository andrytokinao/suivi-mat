import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../../../services/material.service';
import { CategoryService } from '../../../services/category.service';
import { Material } from '../../../models/material';
import { MaterialCategory } from '../../../models/category';
import { MaterialCondition } from '../../../models/enums';
import { MaterialFormComponent } from '../material-form/material-form.component';
import { MaterialStatusModalComponent } from '../material-status-modal/material-status-modal.component';
import {MenueCategoryComponent} from '../../../shared/menue-category/menue-category.component';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MenueCategoryComponent
  ],
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent implements OnInit, OnDestroy {
  materials: Material[] = [];
  categories: MaterialCategory[] = [];
  selectedCategories = new Set<number>();

  searchTerm = '';
  page = 1;
  pageSize = 6;

  filteredMaterials: Material[] = [];
  pagedMaterials: Material[] = [];

  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private materialService: MaterialService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
    this.loadCategories();
    this.subscribeToLoadingState();
    this.subscribeToErrors();
    this.subscribeToCategoryFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMaterials(): void {
    this.materialService.getMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (materials) => {
          this.materials = materials;
          this.applyFilters();
        },
        error: (err) => {
          this.error = err.message;
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

  private subscribeToLoadingState(): void {
    this.materialService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);
  }

  private subscribeToErrors(): void {
    this.materialService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);
  }

  private subscribeToCategoryFilters(): void {
    this.categoryService.selectedCategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedCategories => {
        this.selectedCategories = selectedCategories;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    this.filteredMaterials = this.materials.filter(m => {
      const matchSearch = !this.searchTerm ||
        m.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.reference?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.serialNumber?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchCategory = this.selectedCategories.size === 0 ||
        (m.categoryId && this.selectedCategories.has(m.categoryId));

      return matchSearch && matchCategory;
    });

    this.page = 1;
    this.updatePage();
  }

  private updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedMaterials = this.filteredMaterials.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMaterials.length / this.pageSize) || 1;
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.updatePage();
  }

  getPageNumbers(): number[] {
    const maxPagesToShow = 5;
    const pages: number[] = [];

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxPagesToShow / 2);
      const rightOffset = maxPagesToShow - leftOffset - 1;

      let start = Math.max(1, this.page - leftOffset);
      let end = Math.min(this.totalPages, this.page + rightOffset);

      if (this.page <= leftOffset) {
        end = maxPagesToShow;
      } else if (this.page >= this.totalPages - rightOffset) {
        start = this.totalPages - maxPagesToShow + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(MaterialFormComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.categories = this.categories;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadMaterials();
          this.error = null;
        }
      },
      () => {} // Dismissed
    );
  }

  openEditModal(material: Material): void {
    const modalRef = this.modalService.open(MaterialFormComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.material = material;
    modalRef.componentInstance.categories = this.categories;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadMaterials();
          this.error = null;
        }
      },
      () => {} // Dismissed
    );
  }

  deleteMaterial(material: Material): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${material.name}" ?`)) {
      this.materialService.deleteMaterial(material.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadMaterials();
            this.error = null;
          },
          error: (error) => {
            this.error = 'Erreur lors de la suppression: ' + error.message;
          }
        });
    }
  }

  openStatusChangeModal(material: Material): void {
    const modalRef = this.modalService.open(MaterialStatusModalComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.material = material;
    modalRef.componentInstance.changeType = 'status';

    modalRef.result.then(
      (result) => {
        if (result?.status) {
          this.materialService.updateMaterialStatus(material.id, result.status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.loadMaterials();
                this.error = null;
              },
              error: (error) => {
                this.error = 'Erreur lors de la mise à jour du statut: ' + error.message;
              }
            });
        }
      },
      () => {} // Dismissed
    );
  }

  openConditionChangeModal(material: Material): void {
    const modalRef = this.modalService.open(MaterialStatusModalComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.material = material;
    modalRef.componentInstance.changeType = 'condition';

    modalRef.result.then(
      (result) => {
        if (result?.currentCondition) {
          this.materialService.updateMaterialCondition(material.id, result.currentCondition)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.loadMaterials();
                this.error = null;
              },
              error: (error) => {
                this.error = 'Erreur lors de la mise à jour de l\'état: ' + error.message;
              }
            });
        }
      },
      () => {} // Dismissed
    );
  }

  getConditionClass(condition: MaterialCondition | null): string {
    if (!condition) return 'unknown';

    const lowerCondition = condition.toLowerCase();

    if (lowerCondition === 'good') return 'bon';
    if (lowerCondition === 'damaged' || lowerCondition === 'in_repair') return 'moyen';
    if (lowerCondition === 'broken') return 'mauvais';

    return 'unknown';
  }

  getCategoryName(material: Material): string {
    return material.categoryName || 'Non catégorisé';
  }

  clearError(): void {
    this.error = null;
  }

  viewMaterialDetail(material: Material): void {
    this.router.navigate(['/materials', material.id]);
  }
}
