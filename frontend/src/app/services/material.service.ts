import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Material, MaterialState } from '../models/material';
import { MaterialStatus, MaterialCondition } from '../models/enums';
import { ApiService } from './api.service';

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
  addMaterial(material: Omit<Material, 'id' | 'createdAt'>): Observable<Material> {
    this.isLoading$.next(true);
    return this.apiService.post<Material>('/materials', material)
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
  updateMaterial(id: number, material: Partial<Material>): Observable<Material> {
    this.isLoading$.next(true);
    return this.apiService.put<Material>(`/materials/${id}`, material)
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
    return this.apiService.get<Material[]>('/materials')
      .pipe(
        tap(materials => {
          const filtered = materials.filter(m =>
            m.status === MaterialStatus.AVAILABLE &&
            (!m.quantifiable || (m.quantity && m.quantity > 0))
          );
          return filtered;
        })
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
   * Update material quantity
   */
  updateMaterialQuantity(id: number, quantity: number): Observable<Material> {
    return this.updateMaterial(id, { quantity });
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
  getRootCategories() {
    return this.apiService.get(`/materials/root-categories`);
  }

  /**
   * Get material movements
   */
  getMaterialMovements(materialId: number) {
    return this.apiService.get(`/materials/${materialId}/movements`);
  }

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
