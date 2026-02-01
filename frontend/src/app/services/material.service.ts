import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import {
  Material,
  MaterialFormData,
  MaterialCreateData,
  MaterialFullDetail,
  MaterialState,
  MaterialStateFormData,
  Maintenance,
  MaintenanceFormData
} from '../models/material';
import { MaterialStatus, MaterialCondition, MaintenanceStatus } from '../models/enums';
import { ApiService } from './api.service';
import { MaterialCategory } from '../models/category';
import { MaterialMovement } from '../models/declaration';

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

  // ============== MATERIALS CRUD ==============

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

  getMaterials(): Observable<Material[]> {
    return this.materials$;
  }

  getMaterialById(id: number): Observable<Material> {
    return this.apiService.get<Material>(`/materials/${id}`);
  }

  getMaterialFullDetails(id: number): Observable<MaterialFullDetail> {
    return this.apiService.get<MaterialFullDetail>(`/materials/${id}/full-details`);
  }

  addMaterial(materialData: MaterialCreateData): Observable<Material> {
    this.isLoading$.next(true);
    return this.apiService.post<Material>('/materials', materialData)
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

  updateMaterial(id: number, materialData: Partial<Material>): Observable<Material> {
    this.isLoading$.next(true);
    return this.apiService.put<Material>(`/materials/${id}`, materialData)
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

  getMaterialBySerialNumber(serialNumber: string): Observable<Material> {
    return this.apiService.get<Material>(`/materials/serial/${serialNumber}`);
  }

  getRootCategories(): Observable<MaterialCategory[]> {
    return this.apiService.get<MaterialCategory[]>('/materials/root-categories');
  }

  // ============== MOVEMENTS CRUD ==============

  getMaterialMovements(materialId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/materials/${materialId}/movements`);
  }

  getMovementById(materialId: number, movementId: number): Observable<MaterialMovement> {
    return this.apiService.get<MaterialMovement>(`/materials/${materialId}/movements/${movementId}`);
  }

  createMovement(materialId: number, movement: Partial<MaterialMovement>): Observable<MaterialMovement> {
    return this.apiService.post<MaterialMovement>(`/materials/${materialId}/movements`, movement);
  }

  updateMovement(materialId: number, movementId: number, movement: Partial<MaterialMovement>): Observable<MaterialMovement> {
    return this.apiService.put<MaterialMovement>(`/materials/${materialId}/movements/${movementId}`, movement);
  }

  deleteMovement(materialId: number, movementId: number): Observable<void> {
    return this.apiService.delete<void>(`/materials/${materialId}/movements/${movementId}`);
  }

  createMovementsBatch(materialId: number, movements: Partial<MaterialMovement>[]): Observable<MaterialMovement[]> {
    return this.apiService.post<MaterialMovement[]>(`/materials/${materialId}/movements/batch`, movements);
  }

  updateMovementsBatch(materialId: number, movements: Partial<MaterialMovement>[]): Observable<MaterialMovement[]> {
    return this.apiService.put<MaterialMovement[]>(`/materials/${materialId}/movements/batch`, movements);
  }

  deleteMovementsBatch(materialId: number, movementIds: number[]): Observable<void> {
    return this.apiService.delete<void>(`/materials/${materialId}/movements/batch`, movementIds);
  }

  // ============== MAINTENANCES CRUD ==============

  getMaterialMaintenances(materialId: number): Observable<Maintenance[]> {
    return this.apiService.get<Maintenance[]>(`/materials/${materialId}/maintenances`);
  }

  getMaintenanceById(materialId: number, maintenanceId: number): Observable<Maintenance> {
    return this.apiService.get<Maintenance>(`/materials/${materialId}/maintenances/${maintenanceId}`);
  }

  createMaintenance(materialId: number, maintenance: MaintenanceFormData): Observable<Maintenance> {
    return this.apiService.post<Maintenance>(`/materials/${materialId}/maintenances`, maintenance);
  }

  updateMaintenance(materialId: number, maintenanceId: number, maintenance: Partial<Maintenance>): Observable<Maintenance> {
    return this.apiService.put<Maintenance>(`/materials/${materialId}/maintenances/${maintenanceId}`, maintenance);
  }

  deleteMaintenance(materialId: number, maintenanceId: number): Observable<void> {
    return this.apiService.delete<void>(`/materials/${materialId}/maintenances/${maintenanceId}`);
  }

  createMaintenancesBatch(materialId: number, maintenances: MaintenanceFormData[]): Observable<Maintenance[]> {
    return this.apiService.post<Maintenance[]>(`/materials/${materialId}/maintenances/batch`, maintenances);
  }

  updateMaintenancesBatch(materialId: number, maintenances: Partial<Maintenance>[]): Observable<Maintenance[]> {
    return this.apiService.put<Maintenance[]>(`/materials/${materialId}/maintenances/batch`, maintenances);
  }

  deleteMaintenancesBatch(materialId: number, maintenanceIds: number[]): Observable<void> {
    return this.apiService.delete<void>(`/materials/${materialId}/maintenances/batch`, maintenanceIds);
  }

  // ============== STATES CRUD ==============

  getMaterialStates(materialId: number): Observable<MaterialState[]> {
    return this.apiService.get<MaterialState[]>(`/materials/${materialId}/states`);
  }

  getStateById(materialId: number, stateId: number): Observable<MaterialState> {
    return this.apiService.get<MaterialState>(`/materials/${materialId}/states/${stateId}`);
  }

  createState(materialId: number, state: MaterialStateFormData): Observable<MaterialState> {
    return this.apiService.post<MaterialState>(`/materials/${materialId}/states`, state);
  }

  updateState(materialId: number, stateId: number, state: Partial<MaterialState>): Observable<MaterialState> {
    return this.apiService.put<MaterialState>(`/materials/${materialId}/states/${stateId}`, state);
  }

  deleteState(materialId: number, stateId: number): Observable<void> {
    return this.apiService.delete<void>(`/materials/${materialId}/states/${stateId}`);
  }

  createStatesBatch(materialId: number, states: MaterialStateFormData[]): Observable<MaterialState[]> {
    return this.apiService.post<MaterialState[]>(`/materials/${materialId}/states/batch`, states);
  }

  updateStatesBatch(materialId: number, states: Partial<MaterialState>[]): Observable<MaterialState[]> {
    return this.apiService.put<MaterialState[]>(`/materials/${materialId}/states/batch`, states);
  }

  deleteStatesBatch(materialId: number, stateIds: number[]): Observable<void> {
    return this.apiService.delete<void>(`/materials/${materialId}/states/batch`, stateIds);
  }

  // ============== CONVENIENCE METHODS ==============

  updateMaterialStatus(id: number, status: MaterialStatus): Observable<Material> {
    return this.updateMaterial(id, { status });
  }

  updateMaterialCondition(id: number, condition: MaterialCondition): Observable<Material> {
    return this.updateMaterial(id, { currentCondition: condition });
  }


  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
