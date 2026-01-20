import { Component, OnInit } from '@angular/core';
import { Material } from '../../../models/material';
import { MaterialCategory } from '../../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../../services/material.service';
import { CategoryService } from '../../../services/category.service';
import {MenueCategoryComponent} from '../../../shared/menue-category/menue-category.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-material-list',
  imports: [CommonModule, FormsModule,MenueCategoryComponent,MatFormFieldModule,MatInputModule,MatIconModule ,MatInput],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.css'
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  selectedCategories = new Set<number>();

  searchTerm = '';

  page = 1;
  pageSize = 6;

  filteredMaterials: Material[] = [];
  pagedMaterials: Material[] = [];
  searchValue: any;

  constructor(
    protected materialService: MaterialService,
    protected categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.materialService.getMaterials().subscribe(materials => {
      this.materials = materials;
      this.applyFilters();
    });
    this.categoryService.selectedCategories$.subscribe(selectedCategories => {
      this.selectedCategories = selectedCategories;
      this.applyFilters();
    })


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

}
