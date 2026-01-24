import {Component, OnInit} from '@angular/core';
import {Material} from '../../../models/material';
import {MaterialCategory} from '../../../models/category';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialService} from '../../../services/material.service';
import {CategoryService} from '../../../services/category.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MaterialFormComponent} from '../material-form/material-form.component';
import {MenueCategoryComponent} from '../../../shared/menue-category/menue-category.component';

@Component({
  selector: 'app-material-list',
  imports: [CommonModule, FormsModule, MenueCategoryComponent, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.css'
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  categories: MaterialCategory[] = [];
  selectedCategories = new Set<number>();

  searchTerm = '';

  page = 1;
  pageSize = 6;

  filteredMaterials: Material[] = [];
  pagedMaterials: Material[] = [];
  searchValue: any;
  isLoading = false;
  error: string | null = null;

  constructor(
    protected materialService: MaterialService,
    protected categoryService: CategoryService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    // Load materials from API
    this.materialService.getMaterials().subscribe(materials => {
      this.materials = materials;
      this.applyFilters();
    });

    // Load categories from API
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    // Subscribe to loading state
    this.materialService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    // Subscribe to error state
    this.materialService.error$.subscribe(error => {
      this.error = error;
    });

    // Subscribe to category filter changes
    this.categoryService.selectedCategories$.subscribe(selectedCategories => {
      this.selectedCategories = selectedCategories;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredMaterials = this.materials.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategory = this.selectedCategories.size === 0 || this.selectedCategories.has(m.category);
      return matchSearch && matchCategory;
    });
    this.page = 1;
    this.updatePage();
  }

  updatePage(): void {
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

  /**
   * Open modal to create new material
   */
  openAddModal(): void {
    const modalRef = this.modalService.open(MaterialFormComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.categories = this.categories;

    modalRef.result.then(
      (result) => {
        if (result) {
          // Material was created successfully
          console.log('Material created:', result);
          this.materialService.loadMaterials();
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  /**
   * Open modal to edit material
   */
  openEditModal(material: Material): void {
    const modalRef = this.modalService.open(MaterialFormComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.material = material;
    modalRef.componentInstance.categories = this.categories;

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Material updated:', result);
          this.materialService.loadMaterials();
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  /**
   * Delete material
   */
  deleteMaterial(material: Material): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${material.name}" ?`)) {
      this.materialService.deleteMaterial(material.id).subscribe({
        next: () => {
          console.log('Material deleted:', material.id);
          this.materialService.loadMaterials();
        },
        error: (error) => {
          console.error('Error deleting material:', error);
          alert('Erreur lors de la suppression du matériel');
        }
      });
    }
  }

  /**
   * Search materials in real-time
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }
}
