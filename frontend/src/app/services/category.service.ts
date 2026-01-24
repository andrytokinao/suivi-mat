import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { MaterialCategory } from '../models/category';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<MaterialCategory[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  protected selectedCategoriesSubject = new BehaviorSubject<Set<number>>(new Set<number>());
  selectedCategories$ = this.selectedCategoriesSubject.asObservable();

  private isLoading$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading$.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCategories();
  }

  /**
   * Load all categories from API
   */
  loadCategories(): void {
    this.isLoading$.next(true);
    this.apiService.get<MaterialCategory[]>('/material-categories')
      .pipe(
        tap(categories => {
          this.categoriesSubject.next(categories);
          this.errorSubject.next(null);
        }),
        catchError(error => {
          this.errorSubject.next(error.message);
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe();
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<MaterialCategory[]> {
    return this.categories$;
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: number): Observable<MaterialCategory> {
    return this.apiService.get<MaterialCategory>(`/material-categories/${id}`);
  }

  /**
   * Get root categories
   */
  getRootCategories(): Observable<MaterialCategory[]> {
    return this.apiService.get<MaterialCategory[]>('/material-categories/root');
  }

  /**
   * Get child categories
   */
  getChildCategories(parentId: number): Observable<MaterialCategory[]> {
    return this.apiService.get<MaterialCategory[]>(`/material-categories/parent/${parentId}`);
  }

  /**
   * Create new category
   */
  addCategory(category: Omit<MaterialCategory, 'id'>): Observable<MaterialCategory> {
    this.isLoading$.next(true);
    return this.apiService.post<MaterialCategory>('/material-categories', category)
      .pipe(
        tap(newCategory => {
          const currentCategories = this.categoriesSubject.value;
          this.categoriesSubject.next([...currentCategories, newCategory]);
          this.errorSubject.next(null);
        }),
        catchError(error => {
          this.errorSubject.next(error.message);
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      );
  }

  /**
   * Update category
   */
  updateCategory(id: number, category: Partial<MaterialCategory>): Observable<MaterialCategory> {
    this.isLoading$.next(true);
    return this.apiService.put<MaterialCategory>(`/material-categories/${id}`, category)
      .pipe(
        tap(updatedCategory => {
          const currentCategories = this.categoriesSubject.value;
          const index = currentCategories.findIndex(c => c.id === id);
          if (index !== -1) {
            currentCategories[index] = updatedCategory;
            this.categoriesSubject.next([...currentCategories]);
          }
          this.errorSubject.next(null);
        }),
        catchError(error => {
          this.errorSubject.next(error.message);
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      );
  }

  /**
   * Delete category
   */
  deleteCategory(id: number): Observable<void> {
    this.isLoading$.next(true);
    return this.apiService.delete<void>(`/material-categories/${id}`)
      .pipe(
        tap(() => {
          const currentCategories = this.categoriesSubject.value;
          this.categoriesSubject.next(currentCategories.filter(c => c.id !== id));
          this.errorSubject.next(null);
        }),
        catchError(error => {
          this.errorSubject.next(error.message);
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      );
  }

  /**
   * Build category hierarchy
   */
  getCategoryHierarchy(): Observable<MaterialCategory[]> {
    return this.getRootCategories()
      .pipe(
        tap(roots => {
          // Build tree for each root
          const hierarchies = roots.map(root => this.buildCategoryTree(root));
          return hierarchies;
        })
      );
  }

  /**
   * Build category tree recursively
   */
  private buildCategoryTree(parent: MaterialCategory): MaterialCategory {
    const children = this.categoriesSubject.value.filter(c => c.parent === parent.id);
    return {
      ...parent,
      children: children.length > 0 ? children.map(child => this.buildCategoryTree(child)) : []
    };
  }

  /**
   * Toggle category selection filter
   */
  toggleCategory(id: number): void {
    const selectedCategories = this.selectedCategoriesSubject.value;
    selectedCategories.has(id)
      ? selectedCategories.delete(id)
      : selectedCategories.add(id);
    this.selectedCategoriesSubject.next(new Set(selectedCategories));
  }

  /**
   * Clear all filters
   */
  clearAllFilters(): void {
    this.selectedCategoriesSubject.next(new Set<number>());
  }

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
