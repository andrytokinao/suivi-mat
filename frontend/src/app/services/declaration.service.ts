import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
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

  getDeclarationsByType(type: 'OUTGOING' | 'RETURN'): Observable<Declaration[]> {
    return this.apiService.get<Declaration[]>(`/declarations/type/${type}`);
  }

  getDeclarationsByStatus(status: DeclarationStatus): Observable<Declaration[]> {
    return this.apiService.get<Declaration[]>(`/declarations/status/${status}`);
  }

  createOutgoingDeclaration(declarationData: OutgoingDeclarationFormData): Observable<OutgoingDeclaration> {
    this.isLoading$.next(true);

    const payload = {
      declaredBy: declarationData.declaredBy,
      usagePurpose: declarationData.usagePurpose,
      note: declarationData.note,
      status: DeclarationStatus.PENDING,
      movements: declarationData.movements.map(m => ({
        material: { id: m.material },
        quantity: m.quantity,
        condition: m.condition,
        status: MovementStatus.PENDING_VALIDATION,
        createdBy: declarationData.declaredBy,
        note: m.note
      }))
    };

    return this.apiService.post<OutgoingDeclaration>('/declarations', payload)
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

  createReturnDeclaration(declarationData: ReturnDeclarationFormData): Observable<ReturnDeclaration> {
    this.isLoading$.next(true);

    const payload = {
      declaredBy: declarationData.declaredBy,
      returnConditionNote: declarationData.returnConditionNote,
      verifiedBy: declarationData.verifiedBy,
      note: declarationData.note,
      status: DeclarationStatus.PENDING,
      movements: declarationData.movements.map(m => ({
        material: { id: m.material },
        quantity: m.quantity,
        condition: m.condition,
        status: MovementStatus.PENDING_VERIFICATION,
        createdBy: declarationData.declaredBy,
        note: m.note
      }))
    };

    return this.apiService.post<ReturnDeclaration>('/declarations', payload)
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

  // Fixed method name
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

  // Fixed method name
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

  getDeclarationMovements(declarationId: number): Observable<MaterialMovement[]> {
    return this.apiService.get<MaterialMovement[]>(`/declarations/${declarationId}/movements`);
  }

  getPendingDeclarations(): Observable<Declaration[]> {
    return this.getDeclarationsByStatus(DeclarationStatus.PENDING);
  }

  getOutgoingDeclarations(): Observable<OutgoingDeclaration[]> {
    return this.getDeclarationsByType('OUTGOING') as Observable<OutgoingDeclaration[]>;
  }

  getReturnDeclarations(): Observable<ReturnDeclaration[]> {
    return this.getDeclarationsByType('RETURN') as Observable<ReturnDeclaration[]>;
  }

  getOutgoingDeclarationsNotReturned(): Observable<Declaration[]> {
    return this.getDeclarationsByType('OUTGOING').pipe(
      map(declarations =>
        declarations.filter(d =>
          d.status === DeclarationStatus.APPROVED &&
          (d as OutgoingDeclaration).movements?.some(m =>
            m.status !== MovementStatus.VERIFIED
          )
        )
      )
    );
  }

  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
