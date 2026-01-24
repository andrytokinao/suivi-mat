import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../../services/category.service';
import { MaterialCategory } from '../../../models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  @Input() category?: MaterialCategory;
  @Input() parentCategories: MaterialCategory[] = [];

  form!: FormGroup;
  isLoading = false;
  submitted = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      parent: [null]
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.category;
    if (this.isEditMode && this.category) {
      this.form.patchValue(this.category);
    }
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.form.value;

    if (this.isEditMode && this.category) {
      // Update
      this.categoryService.updateCategory(this.category.id, formValue).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.activeModal.close(result);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.isLoading = false;
        }
      });
    } else {
      // Create
      this.categoryService.addCategory(formValue).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.activeModal.close(result);
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
