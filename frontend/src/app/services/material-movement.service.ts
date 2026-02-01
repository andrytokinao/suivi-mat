import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { MaterialMovement } from '../models/declaration';
import { MovementStatus } from '../models/enums';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialMovementService {
  private movementsSubject = new BehaviorSubject<MaterialMovement[]>([]);
  public movements$ = this.movementsSubject.asObservable();

  private isLoading$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading$.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // ============== CRUD OPERATIONS ==============

  /**
   * Get all material movements
   * GET /api/material-movements
   */
  getAllMovements(): Observable<MaterialMovement[]> {
    this.isLoading$.next(true);
    return this.apiService.get<MaterialMovement[]>('/material-movements')
      .pipe(
        tap(movements => {
          this.movementsSubject.next(movements);
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
   * Get movement by ID
   * GET /api/material-movements/{id}
   */
  getMovementById(id: number): Observable<MaterialMovement> {
    return this.apiService.get<MaterialMovement>(`/material-movements/${id}`);
  }

  /**
   * Create new movement
   * POST /api/material-movements
   */
  createMovement(movement: Partial<MaterialMovement>): Observable<MaterialMovement> {
    this.isLoading$.next(true);
    return this.apiService.post<MaterialMovement>('/material-movements', movement)
      .pipe(
        tap(newMovement => {
          const current = this.movementsSubject.value;
          this.movementsSubject.next([...current, newMovement]);
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
   * Update movement
   * PUT /api/material-movements/{id}
   */
  updateMovement(id: number, movement: Partial<MaterialMovement>): Observable<MaterialMovement> {
    this.isLoading$.next(true);
    return this.apiService.put<MaterialMovement>(`/material-movements/${id}`, movement)
      .pipe(
        tap(updatedMovement => {
          const current = this.movementsSubject.value;
          const index = current.findIndex(m => m.id === id);
          if (index !== -1) {
            current[index] = updatedMovement;
            this.movementsSubject.next([...current]);
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
   * Delete movement
   * DELETE /api/material-movements/{id}
   */
  deleteMovement(id: number): Observable<void> {
    this.isLoading$.next(true);
    return this.apiService.delete<void>(`/material-movements/${id}`)
      .pipe(
        tap(() => {
          const current = this.movementsSubject.value;
          this.movementsSubject.next(current.filter(m => m.id !== id));
          this.errorSubject.next(null);
        }),
        catchError(error => {
          this.errorSubject.next(error.message);
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      );
  }

  // ============== FILTER OPERATIONS ==============

  /**
   * Get movements by material ID
   * GET /api/material-movements/material/{materialId}
   */
  getMovementsByMaterialId(materialId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/material-movements/material/${materialId}`);
  }

  /**
   * Get movements by declaration ID
   * GET /api/material-movements/declaration/{declarationId}
   */
  getMovementsByDeclarationId(declarationId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/material-movements/declaration/${declarationId}`);
  }

  /**
   * Get movements by status
   * GET /api/material-movements/status/{status}
   */
  getMovementsByStatus(status: MovementStatus): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/material-movements/status/${status}`);
  }

  // ============== CONVENIENCE METHODS ==============

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  getCurrentMovements(): MaterialMovement[] {
    return this.movementsSubject.value;
  }
}
