import { Component, OnInit } from '@angular/core';
import { MaterialCategory } from '../../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories: MaterialCategory[] = [];
  hierarchyCategories: MaterialCategory[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.categoryService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.categoryService.error$.subscribe(error => {
      this.error = error;
    });
  }

  /**
   * Load categories from API
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.buildHierarchy();
    });
  }

  /**
   * Build category hierarchy for display
   */
  buildHierarchy(): void {
    const roots = this.categories.filter(c => c.parent === null);
    this.hierarchyCategories = roots.map(root => this.buildTree(root));
  }

  /**
   * Build tree recursively
   */
  private buildTree(category: MaterialCategory): MaterialCategory {
    const children = this.categories.filter(c => c.parent === category.id);
    return {
      ...category,
      children: children.length > 0 ? children.map(child => this.buildTree(child)) : undefined
    };
  }

  /**
   * Open modal to create new category
   */
  openAddModal(): void {
    const modalRef = this.modalService.open(CategoryFormComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.parentCategories = this.categories;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadCategories();
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  /**
   * Open modal to edit category
   */
  openEditModal(category: MaterialCategory): void {
    const modalRef = this.modalService.open(CategoryFormComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.category = category;
    // Get all categories except the current one for parent selection
    modalRef.componentInstance.parentCategories = this.categories.filter(c => c.id !== category.id);

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadCategories();
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  /**
   * Delete category
   */
  deleteCategory(category: MaterialCategory): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Erreur lors de la suppression de la catégorie');
        }
      });
    }
  }

  /**
   * Get child count for a category
   */
  getChildCount(category: MaterialCategory): number {
    return this.categories.filter(c => c.parent === category.id).length;
  }
}
