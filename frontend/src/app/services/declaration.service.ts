import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Declaration, OutgoingDeclaration, ReturnDeclaration, MaterialMovement } from '../models/declaration';
import { DeclarationStatus, MovementStatus } from '../models/enums';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {
  private declarationsSubject = new BehaviorSubject<Declaration[]>([]);
  public declarations$ = this.declarationsSubject.asObservable();

  private isLoading$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading$.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadDeclarations();
  }

  /**
   * Load all declarations from API
   */
  loadDeclarations(): void {
    this.isLoading$.next(true);
    this.apiService.get<Declaration[]>('/declarations')
      .pipe(
        tap(declarations => {
          this.declarationsSubject.next(declarations);
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
   * Get all declarations
   */
  getDeclarations(): Observable<Declaration[]> {
    return this.declarations$;
  }

  /**
   * Get declaration by ID
   */
  getDeclarationById(id: number): Observable<Declaration> {
    return this.apiService.get<Declaration>(`/declarations/${id}`);
  }

  /**
   * Get declarations by type
   */
  getDeclarationsByType(type: 'OUTGOING' | 'RETURN'): Observable<Declaration[]> {
    return this.apiService.get<Declaration[]>(`/declarations/type/${type}`);
  }

  /**
   * Get declarations by status
   */
  getDeclarationsByStatus(status: DeclarationStatus): Observable<Declaration[]> {
    return this.apiService.get<Declaration[]>(`/declarations/status/${status}`);
  }

  /**
   * Create outgoing declaration
   */
  createOutgoingDeclaration(declaration: Omit<OutgoingDeclaration, 'id' | 'declarationDate'>): Observable<OutgoingDeclaration> {
    this.isLoading$.next(true);
    return this.apiService.post<OutgoingDeclaration>('/declarations', declaration)
      .pipe(
        tap(newDeclaration => {
          const currentDeclarations = this.declarationsSubject.value;
          this.declarationsSubject.next([...currentDeclarations, newDeclaration]);
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
   * Create return declaration
   */
  createReturnDeclaration(declaration: Omit<ReturnDeclaration, 'id' | 'declarationDate'>): Observable<ReturnDeclaration> {
    this.isLoading$.next(true);
    return this.apiService.post<ReturnDeclaration>('/declarations', declaration)
      .pipe(
        tap(newDeclaration => {
          const currentDeclarations = this.declarationsSubject.value;
          this.declarationsSubject.next([...currentDeclarations, newDeclaration]);
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
   * Update declaration
   */
  updateDeclaration(id: number, declaration: Partial<Declaration>): Observable<Declaration> {
    this.isLoading$.next(true);
    return this.apiService.put<Declaration>(`/declarations/${id}`, declaration)
      .pipe(
        tap(updatedDeclaration => {
          const currentDeclarations = this.declarationsSubject.value;
          const index = currentDeclarations.findIndex(d => d.id === id);
          if (index !== -1) {
            currentDeclarations[index] = updatedDeclaration;
            this.declarationsSubject.next([...currentDeclarations]);
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
   * Delete declaration
   */
  deleteDeclaration(id: number): Observable<void> {
    this.isLoading$.next(true);
    return this.apiService.delete<void>(`/declarations/${id}`)
      .pipe(
        tap(() => {
          const currentDeclarations = this.declarationsSubject.value;
          this.declarationsSubject.next(currentDeclarations.filter(d => d.id !== id));
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
   * Approve declaration
   */
  approveDeclaration(id: number): Observable<Declaration> {
    this.isLoading$.next(true);
    return this.apiService.post<Declaration>(`/declarations/${id}/approve`, {})
      .pipe(
        tap(updatedDeclaration => {
          const currentDeclarations = this.declarationsSubject.value;
          const index = currentDeclarations.findIndex(d => d.id === id);
          if (index !== -1) {
            currentDeclarations[index] = updatedDeclaration;
            this.declarationsSubject.next([...currentDeclarations]);
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
   * Reject declaration
   */
  rejectDeclaration(id: number): Observable<Declaration> {
    this.isLoading$.next(true);
    return this.apiService.post<Declaration>(`/declarations/${id}/reject`, {})
      .pipe(
        tap(updatedDeclaration => {
          const currentDeclarations = this.declarationsSubject.value;
          const index = currentDeclarations.findIndex(d => d.id === id);
          if (index !== -1) {
            currentDeclarations[index] = updatedDeclaration;
            this.declarationsSubject.next([...currentDeclarations]);
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
   * Get declaration movements
   */
  getDeclarationMovements(declarationId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/declarations/${declarationId}/movements`);
  }

  /**
   * Get pending declarations
   */
  getPendingDeclarations(): Observable<Declaration[]> {
    return this.getDeclarationsByStatus(DeclarationStatus.PENDING);
  }

  /**
   * Get outgoing declarations not returned
   */
  getOutgoingDeclarationsNotReturned(): Observable<Declaration[]> {
    return this.getDeclarationsByType('OUTGOING')
      .pipe(
        tap(declarations => {
          return declarations.filter(d =>
            d.status === DeclarationStatus.APPROVED &&
            d.movements.some(m => m.status !== MovementStatus.RETURNED)
          );
        })
      );
  }

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
