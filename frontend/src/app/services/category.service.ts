import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialCategory } from '../models/category';

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
