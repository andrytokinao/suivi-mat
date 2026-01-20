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
      name: 'Topographie',
      description: 'Matériel topographique',
      parent: null,
      children: [
        {
          id: 2,
          name: 'Instruments topo',
          description: 'Station totale, GPS, niveaux',
          parent: 1
        },
        {
          id: 3,
          name: 'Accessoires topo',
          description: 'Trépieds, mires, jalons',
          parent: 1
        }
      ]
    },
    {
      id: 4,
      name: 'Informatique & Impression',
      description: 'Matériel informatique et impression',
      parent: null,
      children: [
        {
          id: 5,
          name: 'Logiciels techniques',
          description: 'AutoCAD, Civil 3D, Covadis',
          parent: 4
        }
      ]
    },
    {
      id: 6,
      name: 'BTP & Sécurité',
      description: 'Matériel de chantier et sécurité',
      parent: null,
      children: [
        {
          id: 7,
          name: 'EPI',
          description: 'Casques, gilets, chaussures',
          parent: 6
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
