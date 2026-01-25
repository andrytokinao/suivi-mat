import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { Material, MaterialFormData, MaterialState } from '../models/material';
import { MaterialStatus, MaterialCondition } from '../models/enums';
import { ApiService } from './api.service';
import { MaterialCategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materialsSubject = new BehaviorSubject<Material[]>([]);
  public materials$ = this.materialsSubject.asObservable();

  private isLoading$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading$.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadMaterials();
  }

  /**
   * Load all materials from API
   */
  loadMaterials(): void {
    this.isLoading$.next(true);
    this.apiService.get<Material[]>('/materials')
      .pipe(
        tap(materials => {
          this.materialsSubject.next(materials);
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
   * Get all materials
   */
  getMaterials(): Observable<Material[]> {
    return this.materials$;
  }

  /**
   * Get material by ID
   */
  getMaterialById(id: number): Observable<Material> {
    return this.apiService.get<Material>(`/materials/${id}`);
  }

  /**
   * Create new material
   */
  addMaterial(materialData: MaterialFormData): Observable<Material> {
    this.isLoading$.next(true);

    // Transform form data to match backend expectations
    const payload: any = {
      name: materialData.name,
      reference: materialData.reference,
      serialNumber: materialData.serialNumber,
      description: materialData.description,
      status: materialData.status,
      currentCondition: materialData.currentCondition,
      purchaseId: materialData.purchaseId,
      category: materialData.category ? { id: materialData.category } : null
    };

    return this.apiService.post<Material>('/materials', payload)
      .pipe(
        tap(newMaterial => {
          const currentMaterials = this.materialsSubject.value;
          this.materialsSubject.next([...currentMaterials, newMaterial]);
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
   * Update material
   */
  updateMaterial(id: number, materialData: Partial<MaterialFormData>): Observable<Material> {
    this.isLoading$.next(true);

    // Transform form data to match backend expectations
    const payload: any = { ...materialData };
    if (materialData.category !== undefined) {
      payload.category = materialData.category ? { id: materialData.category } : null;
    }

    return this.apiService.put<Material>(`/materials/${id}`, payload)
      .pipe(
        tap(updatedMaterial => {
          const currentMaterials = this.materialsSubject.value;
          const index = currentMaterials.findIndex(m => m.id === id);
          if (index !== -1) {
            currentMaterials[index] = updatedMaterial;
            this.materialsSubject.next([...currentMaterials]);
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
   * Delete material
   */
  deleteMaterial(id: number): Observable<void> {
    this.isLoading$.next(true);
    return this.apiService.delete<void>(`/materials/${id}`)
      .pipe(
        tap(() => {
          const currentMaterials = this.materialsSubject.value;
          this.materialsSubject.next(currentMaterials.filter(m => m.id !== id));
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
   * Get available materials
   */
  getAvailableMaterials(): Observable<Material[]> {
    return this.materials$.pipe(
      map(materials => materials.filter(m => m.status === MaterialStatus.AVAILABLE))
    );
  }

  /**
   * Update material status
   */
  updateMaterialStatus(id: number, status: MaterialStatus): Observable<Material> {
    return this.updateMaterial(id, { status });
  }

  /**
   * Update material condition
   */
  updateMaterialCondition(id: number, condition: MaterialCondition): Observable<Material> {
    return this.updateMaterial(id, { currentCondition: condition });
  }

  /**
   * Get materials by serial number
   */
  getMaterialBySerialNumber(serialNumber: string): Observable<Material> {
    return this.apiService.get<Material>(`/materials/serial/${serialNumber}`);
  }

  /**
   * Get root categories
   */
  getRootCategories(): Observable<MaterialCategory[]> {
    return this.apiService.get<MaterialCategory[]>('/materials/root-categories');
  }

  /**
   * Get material movements
   */
  getMaterialMovements(materialId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`/materials/${materialId}/movements`);
  }

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
