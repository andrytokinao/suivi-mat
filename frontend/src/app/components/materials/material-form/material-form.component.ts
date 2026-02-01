import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialService } from '../../../services/material.service';
import { Material, MaterialCreateData } from '../../../models/material';
import { MaterialStatus, MaterialCondition } from '../../../models/enums';
import { MaterialCategory } from '../../../models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.css']
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
    private materialService: MaterialService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.material;
    if (this.isEditMode && this.material) {
      this.patchFormWithMaterial();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      categoryId: [null, Validators.required],
      currentCondition: [MaterialCondition.GOOD],
      purchaseId: ['']
    });
  }

  patchFormWithMaterial(): void {
    if (!this.material) return;

    this.form.patchValue({
      name: this.material.name,
      description: this.material.description,
      categoryId: this.material.categoryId,
      currentCondition: this.material.currentCondition,
      purchaseId: this.material.purchaseId
    });
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
    const formValue: MaterialCreateData = this.form.value;

    if (this.isEditMode && this.material) {
      this.updateMaterial(formValue);
    } else {
      this.createMaterial(formValue);
    }
  }

  createMaterial(formData: MaterialCreateData): void {
    this.materialService.addMaterial(formData).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.activeModal.close(result);
      },
      error: (error) => {
        console.error('Error creating material:', error);
        this.isLoading = false;
        alert('Erreur lors de la création du matériel: ' + error.message);
      }
    });
  }

  updateMaterial(formData: MaterialCreateData): void {
    if (!this.material) return;

    this.materialService.updateMaterial(this.material.id, formData).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.activeModal.close(result);
      },
      error: (error) => {
        console.error('Error updating material:', error);
        this.isLoading = false;
        alert('Erreur lors de la mise à jour du matériel: ' + error.message);
      }
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
