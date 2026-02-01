import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Dashboard, DashboardFilter } from '../models/dashboard';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardSubject = new BehaviorSubject<Dashboard | null>(null);
  public dashboard$ = this.dashboardSubject.asObservable();

  private isLoading$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading$.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // ============== DASHBOARD STATISTICS ==============

  /**
   * Get dashboard statistics without filters
   * GET /api/dashboard
   */
  getDashboard(): Observable<Dashboard> {
    this.isLoading$.next(true);
    return this.apiService.get<Dashboard>('/dashboard')
      .pipe(
        tap(dashboard => {
          this.dashboardSubject.next(dashboard);
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
   * Get dashboard statistics with filters via query params
   * GET /api/dashboard/filter?startDate=...&endDate=...&categoryId=...
   */
  getDashboardWithFilter(filter: DashboardFilter): Observable<Dashboard> {
    this.isLoading$.next(true);
    const params: any = {};

    if (filter.startDate) params.startDate = filter.startDate;
    if (filter.endDate) params.endDate = filter.endDate;
    if (filter.categoryId) params.categoryId = filter.categoryId;
    if (filter.materialStatus) params.materialStatus = filter.materialStatus;
    if (filter.declarationStatus) params.declarationStatus = filter.declarationStatus;
    if (filter.maintenanceStatus) params.maintenanceStatus = filter.maintenanceStatus;

    return this.apiService.get<Dashboard>('/dashboard/filter', params)
      .pipe(
        tap(dashboard => {
          this.dashboardSubject.next(dashboard);
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
   * Get dashboard statistics with filters via POST body
   * POST /api/dashboard/filter
   */
  getDashboardWithFilterPost(filter: DashboardFilter): Observable<Dashboard> {
    this.isLoading$.next(true);
    return this.apiService.post<Dashboard>('/dashboard/filter', filter)
      .pipe(
        tap(dashboard => {
          this.dashboardSubject.next(dashboard);
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
   * Get materials statistics only
   * GET /api/dashboard/materials?status=...&categoryId=...
   */
  getMaterialsStats(status?: string, categoryId?: number): Observable<Dashboard> {
    this.isLoading$.next(true);
    const params: any = {};
    if (status) params.status = status;
    if (categoryId) params.categoryId = categoryId;

    return this.apiService.get<Dashboard>('/dashboard/materials', params)
      .pipe(
        tap(dashboard => {
          this.dashboardSubject.next(dashboard);
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
   * Get declarations statistics only
   * GET /api/dashboard/declarations?status=...
   */
  getDeclarationsStats(status?: string): Observable<Dashboard> {
    this.isLoading$.next(true);
    const params: any = {};
    if (status) params.status = status;

    return this.apiService.get<Dashboard>('/dashboard/declarations', params)
      .pipe(
        tap(dashboard => {
          this.dashboardSubject.next(dashboard);
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
   * Get maintenances statistics only
   * GET /api/dashboard/maintenances?status=...
   */
  getMaintenancesStats(status?: string): Observable<Dashboard> {
    this.isLoading$.next(true);
    const params: any = {};
    if (status) params.status = status;

    return this.apiService.get<Dashboard>('/dashboard/maintenances', params)
      .pipe(
        tap(dashboard => {
          this.dashboardSubject.next(dashboard);
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
   * Get statistics for a specific period
   * GET /api/dashboard/period?start=...&end=...
   */
  getStatsByPeriod(start: string, end: string): Observable<Dashboard> {
    this.isLoading$.next(true);
    return this.apiService.get<Dashboard>('/dashboard/period', { start, end })
      .pipe(
        tap(dashboard => {
          this.dashboardSubject.next(dashboard);
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

  getCurrentDashboard(): Dashboard | null {
    return this.dashboardSubject.value;
  }
}
