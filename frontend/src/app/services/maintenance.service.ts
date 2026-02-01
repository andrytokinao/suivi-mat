import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Maintenance, MaintenanceFormData } from '../models/material';
import { MaintenanceStatus } from '../models/enums';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private maintenancesSubject = new BehaviorSubject<Maintenance[]>([]);
  public maintenances$ = this.maintenancesSubject.asObservable();

  private isLoading$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading$.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadMaintenances();
  }

  // ============== CRUD OPERATIONS ==============

  loadMaintenances(): void {
    this.isLoading$.next(true);
    this.apiService.get<Maintenance[]>('/maintenances')
      .pipe(
        tap(maintenances => {
          this.maintenancesSubject.next(maintenances);
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

  getMaintenances(): Observable<Maintenance[]> {
    return this.maintenances$;
  }

  getMaintenanceById(id: number): Observable<Maintenance> {
    return this.apiService.get<Maintenance>(`/maintenances/${id}`);
  }

  createMaintenance(maintenance: MaintenanceFormData): Observable<Maintenance> {
    this.isLoading$.next(true);
    return this.apiService.post<Maintenance>('/maintenances', maintenance)
      .pipe(
        tap(newMaintenance => {
          const current = this.maintenancesSubject.value;
          this.maintenancesSubject.next([...current, newMaintenance]);
          this.errorSubject.next(null);
        }),
        catchError(error => {
          this.errorSubject.next(error.message);
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      );
  }

  updateMaintenance(id: number, maintenance: Partial<Maintenance>): Observable<Maintenance> {
    this.isLoading$.next(true);
    return this.apiService.put<Maintenance>(`/maintenances/${id}`, maintenance)
      .pipe(
        tap(updatedMaintenance => {
          const current = this.maintenancesSubject.value;
          const index = current.findIndex(m => m.id === id);
          if (index !== -1) {
            current[index] = updatedMaintenance;
            this.maintenancesSubject.next([...current]);
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

  deleteMaintenance(id: number): Observable<void> {
    this.isLoading$.next(true);
    return this.apiService.delete<void>(`/maintenances/${id}`)
      .pipe(
        tap(() => {
          const current = this.maintenancesSubject.value;
          this.maintenancesSubject.next(current.filter(m => m.id !== id));
          this.errorSubject.next(null);
        }),
        catchError(error => {
          this.errorSubject.next(error.message);
          throw error;
        }),
        finalize(() => this.isLoading$.next(false))
      );
  }

  // ============== STATUS OPERATIONS ==============

  updateStatus(id: number, status: MaintenanceStatus): Observable<Maintenance> {
    this.isLoading$.next(true);
    return this.apiService.put<Maintenance>(`/maintenances/${id}/status?status=${status}`, {})
      .pipe(
        tap(updatedMaintenance => {
          const current = this.maintenancesSubject.value;
          const index = current.findIndex(m => m.id === id);
          if (index !== -1) {
            current[index] = updatedMaintenance;
            this.maintenancesSubject.next([...current]);
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

  completeMaintenance(id: number): Observable<Maintenance> {
    this.isLoading$.next(true);
    return this.apiService.post<Maintenance>(`/maintenances/${id}/complete`, {})
      .pipe(
        tap(updatedMaintenance => {
          const current = this.maintenancesSubject.value;
          const index = current.findIndex(m => m.id === id);
          if (index !== -1) {
            current[index] = updatedMaintenance;
            this.maintenancesSubject.next([...current]);
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

  cancelMaintenance(id: number): Observable<Maintenance> {
    this.isLoading$.next(true);
    return this.apiService.post<Maintenance>(`/maintenances/${id}/cancel`, {})
      .pipe(
        tap(updatedMaintenance => {
          const current = this.maintenancesSubject.value;
          const index = current.findIndex(m => m.id === id);
          if (index !== -1) {
            current[index] = updatedMaintenance;
            this.maintenancesSubject.next([...current]);
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

  // ============== CONVENIENCE METHODS ==============

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
