import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialService } from '../../../services/material.service';
import { CategoryService } from '../../../services/category.service';
import { Material } from '../../../models/material';
import { MaterialStatus, MaterialCondition } from '../../../models/enums';
import { CommonModule } from '@angular/common';
import { MaterialCategory } from '../../../models/category';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.css'
})
export class MaterialFormComponent implements OnInit {
  @Input() material?: Material;
  @Input() categories: MaterialCategory[] = [];

  form!: FormGroup;
  isLoading = false;
  submitted = false;
  isEditMode = false;
  statuses = Object.values(MaterialStatus);
  conditions = Object.values(MaterialCondition);

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private materialService: MaterialService,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      reference: ['', [Validators.required, Validators.minLength(2)]],
      serialNumber: ['', Validators.required],
      description: ['', Validators.required],
      category: [null, Validators.required],
      status: [MaterialStatus.AVAILABLE, Validators.required],
      currentCondition: [MaterialCondition.GOOD, Validators.required],
      purchaseId: [''],
      quantifiable: [false],
      quantity: [0]
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.material;
    if (this.isEditMode && this.material) {
      this.form.patchValue(this.material);
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

    if (this.isEditMode && this.material) {
      // Update
      this.materialService.updateMaterial(this.material.id, formValue).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.activeModal.close(result);
        },
        error: (error) => {
          console.error('Error updating material:', error);
          this.isLoading = false;
        }
      });
    } else {
      // Create
      this.materialService.addMaterial(formValue).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.activeModal.close(result);
        },
        error: (error) => {
          console.error('Error creating material:', error);
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
