import {Component, OnInit} from '@angular/core';
import {MaterialCategory} from '../../models/category';
import {CategoryService} from '../../services/category.service';
import {Material} from '../../models/material';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-menue-category',
  imports: [CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './menue-category.component.html',
  styleUrl: './menue-category.component.css'
})
export class MenueCategoryComponent implements OnInit{
  categories: MaterialCategory[] = [];
  materials:Material[] = [];
  selectedCategories = new Set<number>();

  constructor(private categoryService:CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.categoryService.selectedCategories$.subscribe(selected => {
      this.selectedCategories = selected;
    })
  }


  toggleCategory(id: number): void {

    this.categoryService.toggleCategory(id);
  }

  getSelectedCategoriesArray(): number[] {
    return Array.from(this.selectedCategories);
  }

  getCategoryName(id: number): string {
    const findCategory = (cats: MaterialCategory[]): string | undefined => {
      for (const cat of cats) {
        if (cat.id === id) return cat.name;
        if (cat.children?.length) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findCategory(this.categories) || 'Catégorie inconnue';
  }

  getCategoryCount(id: number): number {
    return this.materials.filter(m => m.categoryId === id).length;
  }

  clearAllFilters() {
    this.categoryService.clearAllFilters();
  }
}
