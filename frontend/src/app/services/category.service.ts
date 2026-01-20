import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialCategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: MaterialCategory[] = [
    {
      id: 1,
      name: 'Informatique',
      description: 'Matériel informatique',
      parent: null,
      children: [
        {
          id: 2,
          name: 'Ordinateurs',
          description: 'PC et laptops',
          parent: 1
        },
        {
          id: 3,
          name: 'Périphériques',
          description: 'Souris, claviers, écrans',
          parent: 1
        },
        {
          id: 4,
          name: 'Réseau',
          description: 'Équipements réseau',
          parent: 1
        }
      ]
    },
    {
      id: 5,
      name: 'Mobilier',
      description: 'Mobilier de bureau',
      parent: null,
      children: [
        {
          id: 6,
          name: 'Chaises',
          description: 'Chaises de bureau',
          parent: 5
        },
        {
          id: 7,
          name: 'Bureaux',
          description: 'Tables de travail',
          parent: 5
        },
        {
          id: 8,
          name: 'Rangement',
          description: 'Armoires et étagères',
          parent: 5
        }
      ]
    }
  ];
  protected selectedCategoriesSubject = new BehaviorSubject<Set<number>>(new Set<number>());
  selectedCategories$ = this.selectedCategoriesSubject.asObservable();
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

  toggleCategory(id:number) {
    let selectedCategories = this.selectedCategoriesSubject.value;
    selectedCategories.has(id)
      ? selectedCategories.delete(id)
      : selectedCategories.add(id);
    this.selectedCategoriesSubject.next(selectedCategories);
  }

  clearAllFilters() {
    this.selectedCategoriesSubject.next(new Set<number>);
  }
}
