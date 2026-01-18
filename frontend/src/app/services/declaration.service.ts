import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Declaration, OutgoingDeclaration, ReturnDeclaration, MaterialMovement } from '../models/declaration';
import { DeclarationStatus, MovementStatus } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {
  private declarations: Declaration[] = [
    {
      id: 1,
      declarationType: 'OUTGOING',
      declarationDate: '2024-03-01',
      declaredBy: 'Jean Dupont',
      status: DeclarationStatus.APPROVED,
      note: 'Utilisation pour le projet X',
      additionalInfo: 'Bureau 205',
      validatedBy: 'Admin',
      movements: [
        {
          id: 1,
          material: 2,
          materialName: 'Laptop HP ProBook',
          quantity: 1,
          condition: 'GOOD',
          status: MovementStatus.VALIDATED,
          createdAt: '2024-03-01',
          createdBy: 'Jean Dupont',
          validatedAt: '2024-03-01',
          validatedBy: 'Admin',
          outgoingDeclaration: 1
        }
      ]
    },
    {
      id: 2,
      declarationType: 'OUTGOING',
      declarationDate: '2024-03-05',
      declaredBy: 'Marie Martin',
      status: DeclarationStatus.PENDING,
      note: 'Besoin pour la formation',
      additionalInfo: 'Salle de formation A',
      movements: [
        {
          id: 2,
          material: 3,
          materialName: 'Souris Logitech MX',
          quantity: 5,
          condition: 'EXCELLENT',
          status: MovementStatus.PENDING,
          createdAt: '2024-03-05',
          createdBy: 'Marie Martin',
          outgoingDeclaration: 2
        }
      ]
    }
  ];

  private declarationsSubject = new BehaviorSubject<Declaration[]>(this.declarations);
  public declarations$ = this.declarationsSubject.asObservable();

  constructor() {}

  getDeclarations(): Observable<Declaration[]> {
    return this.declarations$;
  }

  getDeclarationById(id: number): Declaration | undefined {
    return this.declarations.find(d => d.id === id);
  }

  getPendingDeclarations(): Declaration[] {
    return this.declarations.filter(d => d.status === DeclarationStatus.PENDING);
  }

  getOutgoingDeclarationsNotReturned(): OutgoingDeclaration[] {
    return this.declarations.filter(d =>
      d.declarationType === 'OUTGOING' &&
      d.status === DeclarationStatus.APPROVED &&
      d.movements.some(m => m.status !== MovementStatus.RETURNED)
    ) as OutgoingDeclaration[];
  }

  createOutgoingDeclaration(declaration: Omit<OutgoingDeclaration, 'id'>): OutgoingDeclaration {
    const newDeclaration: OutgoingDeclaration = {
      ...declaration,
      id: Math.max(...this.declarations.map(d => d.id), 0) + 1,
      declarationDate: new Date().toISOString(),
      status: DeclarationStatus.PENDING
    };
    this.declarations.push(newDeclaration);
    this.declarationsSubject.next(this.declarations);
    return newDeclaration;
  }

  createReturnDeclaration(declaration: Omit<ReturnDeclaration, 'id'>): ReturnDeclaration {
    const newDeclaration: ReturnDeclaration = {
      ...declaration,
      id: Math.max(...this.declarations.map(d => d.id), 0) + 1,
      declarationDate: new Date().toISOString(),
      status: DeclarationStatus.PENDING
    };
    this.declarations.push(newDeclaration);
    this.declarationsSubject.next(this.declarations);
    return newDeclaration;
  }

  updateDeclaration(id: number, updates: Partial<Declaration>): void {
    const index = this.declarations.findIndex(d => d.id === id);
    if (index !== -1) {
      this.declarations[index] = { ...this.declarations[index], ...updates };
      this.declarationsSubject.next(this.declarations);
    }
  }

  validateDeclaration(id: number, validatedBy: string, note?: string): void {
    this.updateDeclaration(id, {
      status: DeclarationStatus.APPROVED,
      validatedBy,
      note: note || this.declarations.find(d => d.id === id)?.note
    });
  }

  rejectDeclaration(id: number, validatedBy: string, note: string): void {
    this.updateDeclaration(id, {
      status: DeclarationStatus.REJECTED,
      validatedBy,
      note
    });
  }

  addNoteToDeclaration(id: number, note: string): void {
    const declaration = this.declarations.find(d => d.id === id);
    if (declaration) {
      const currentNote = declaration.note || '';
      this.updateDeclaration(id, {
        note: currentNote + '\n' + note
      });
    }
  }
}
