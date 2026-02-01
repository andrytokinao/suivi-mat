import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { tap, catchError, finalize, map, switchMap } from 'rxjs/operators';
import {
  Declaration,
  OutgoingDeclaration,
  ReturnDeclaration,
  MaterialMovement,
  OutgoingDeclarationFormData,
  ReturnDeclarationFormData
} from '../models/declaration';
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

  getDeclarations(): Observable<Declaration[]> {
    return this.declarations$;
  }

  getDeclarationById(id: number): Observable<Declaration> {
    return this.apiService.get<Declaration>(`/declarations/${id}`);
  }

  getDeclarationsByType(type: 'SORTIE' | 'RETOUR'): Observable<Declaration[]> {
    return this.apiService.get<Declaration[]>(`/declarations/type/${type}`);
  }

  getDeclarationsByStatus(status: DeclarationStatus): Observable<Declaration[]> {
    return this.apiService.get<Declaration[]>(`/declarations/status/${status}`);
  }

  // Outgoing Declarations API
  getAllOutgoingDeclarations(): Observable<OutgoingDeclaration[]> {
    return this.apiService.get<OutgoingDeclaration[]>('/outgoing-declarations');
  }

  getOutgoingDeclarationById(id: number): Observable<OutgoingDeclaration> {
    return this.apiService.get<OutgoingDeclaration>(`/outgoing-declarations/${id}`);
  }

  getOutgoingDeclarationsByStatus(status: DeclarationStatus): Observable<OutgoingDeclaration[]> {
    return this.apiService.get<OutgoingDeclaration[]>(`/outgoing-declarations/status/${status}`);
  }

  getOutgoingDeclarationsByValidatedBy(validatedBy: string): Observable<OutgoingDeclaration[]> {
    return this.apiService.get<OutgoingDeclaration[]>(`/outgoing-declarations/validated-by/${validatedBy}`);
  }

  createOutgoingDeclaration(declarationData: OutgoingDeclarationFormData): Observable<OutgoingDeclaration> {
    this.isLoading$.next(true);

    const payload = {
      declaredBy: declarationData.declaredBy,
      usagePurpose: declarationData.usagePurpose,
      note: declarationData.note,
      status: DeclarationStatus.PENDING,
      declarationType: 'SORTIE'
    };

    return this.apiService.post<OutgoingDeclaration>('/outgoing-declarations', payload)
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

  updateOutgoingDeclaration(id: number, declaration: Partial<OutgoingDeclaration>): Observable<OutgoingDeclaration> {
    this.isLoading$.next(true);
    return this.apiService.put<OutgoingDeclaration>(`/outgoing-declarations/${id}`, declaration)
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

  deleteOutgoingDeclaration(id: number): Observable<void> {
    this.isLoading$.next(true);
    return this.apiService.delete<void>(`/outgoing-declarations/${id}`)
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

  // Return Declarations API
  getAllReturnDeclarations(): Observable<ReturnDeclaration[]> {
    return this.apiService.get<ReturnDeclaration[]>('/return-declarations');
  }

  getReturnDeclarationById(id: number): Observable<ReturnDeclaration> {
    return this.apiService.get<ReturnDeclaration>(`/return-declarations/${id}`);
  }

  getReturnDeclarationsByStatus(status: DeclarationStatus): Observable<ReturnDeclaration[]> {
    return this.apiService.get<ReturnDeclaration[]>(`/return-declarations/status/${status}`);
  }

  getReturnDeclarationsByVerifiedBy(verifiedBy: string): Observable<ReturnDeclaration[]> {
    return this.apiService.get<ReturnDeclaration[]>(`/return-declarations/verified-by/${verifiedBy}`);
  }

  createReturnDeclaration(declarationData: ReturnDeclarationFormData): Observable<ReturnDeclaration> {
    this.isLoading$.next(true);

    const payload = {
      declaredBy: declarationData.declaredBy,
      returnConditionNote: declarationData.returnConditionNote,
      verifiedBy: declarationData.verifiedBy,
      note: declarationData.note,
      status: DeclarationStatus.PENDING,
      declarationType: 'RETURN'
    };

    return this.apiService.post<ReturnDeclaration>('/return-declarations', payload)
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

  updateReturnDeclaration(id: number, declaration: Partial<ReturnDeclaration>): Observable<ReturnDeclaration> {
    this.isLoading$.next(true);
    return this.apiService.put<ReturnDeclaration>(`/return-declarations/${id}`, declaration)
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

  deleteReturnDeclaration(id: number): Observable<void> {
    this.isLoading$.next(true);
    return this.apiService.delete<void>(`/return-declarations/${id}`)
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

  // General declaration operations
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

  approveDeclaration(id: number, notes?: string): Observable<Declaration> {
    this.isLoading$.next(true);
    const payload = notes ? { note: notes } : {};
    return this.apiService.post<Declaration>(`/declarations/${id}/approve`, payload)
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

  rejectDeclaration(id: number, reason?: string): Observable<Declaration> {
    this.isLoading$.next(true);
    const payload = reason ? { note: reason } : {};
    return this.apiService.post<Declaration>(`/declarations/${id}/reject`, payload)
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

  // Material Movements
  getDeclarationMovements(declarationId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/declarations/${declarationId}/movements`);
  }

  getMaterialMovementsByDeclaration(declarationId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/material-movements/declaration/${declarationId}`);
  }

  getMaterialMovementsByMaterial(materialId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/material-movements/material/${materialId}`);
  }

  getMaterialMovementsByStatus(status: MovementStatus): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/material-movements/status/${status}`);
  }

  getAllMaterialMovements(): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>('/material-movements');
  }

  getMaterialMovementById(id: number): Observable<MaterialMovement> {
    return this.apiService.get<MaterialMovement>(`/material-movements/${id}`);
  }

  createMaterialMovement(movement: Partial<MaterialMovement>): Observable<MaterialMovement> {
    return this.apiService.post<MaterialMovement>('/material-movements', movement);
  }

  updateMaterialMovement(id: number, movement: Partial<MaterialMovement>): Observable<MaterialMovement> {
    return this.apiService.put<MaterialMovement>(`/material-movements/${id}`, movement);
  }

  deleteMaterialMovement(id: number): Observable<void> {
    return this.apiService.delete<void>(`/material-movements/${id}`);
  }

  // Convenience methods
  getPendingDeclarations(): Observable<Declaration[]> {
    return this.getDeclarationsByStatus(DeclarationStatus.PENDING);
  }

  getOutgoingDeclarations(): Observable<OutgoingDeclaration[]> {
    return this.getAllOutgoingDeclarations();
  }

  getReturnDeclarations(): Observable<ReturnDeclaration[]> {
    return this.getAllReturnDeclarations();
  }

  /**
   * Get outgoing declarations that have approved status and have movements not yet verified
   */
  getOutgoingDeclarationsNotReturned(): Observable<OutgoingDeclaration[]> {
    return this.getOutgoingDeclarationsByStatus(DeclarationStatus.APPROVED).pipe(
      switchMap(declarations => {
        if (declarations.length === 0) {
          return of([]);
        }
        // Fetch movements for each declaration to check their status
        const movementRequests = declarations.map(d =>
          this.getDeclarationMovements(d.id).pipe(
            map(movements => ({ declaration: d, movements }))
          )
        );
        return forkJoin(movementRequests).pipe(
          map(results =>
            results
              .filter(r => r.movements.some(m => m.status !== MovementStatus.VERIFIED))
              .map(r => ({
                ...r.declaration,
                movements: r.movements
              }))
          )
        );
      })
    );
  }

  /**
   * Get a declaration with its movements populated
   */
  getDeclarationWithMovements(id: number): Observable<Declaration> {
    return this.getDeclarationById(id).pipe(
      switchMap(declaration =>
        this.getDeclarationMovements(id).pipe(
          map(movements => {
            if (declaration.declarationType === 'SORTIE') {
              return { ...declaration, movements } as OutgoingDeclaration;
            } else {
              return { ...declaration, movements } as ReturnDeclaration;
            }
          })
        )
      )
    );
  }

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
