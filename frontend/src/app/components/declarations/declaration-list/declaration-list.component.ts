import { Component, OnInit } from '@angular/core';
import { Declaration } from '../../../models/declaration';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeclarationService } from '../../../services/declaration.service';
import { DeclarationStatus } from '../../../models/enums';

@Component({
  selector: 'app-declaration-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './declaration-list.component.html',
  styleUrl: './declaration-list.component.css'
})
export class DeclarationListComponent implements OnInit {
  declarations: Declaration[] = [];
  filteredDeclarations: Declaration[] = [];
  isLoading = false;
  error: string | null = null;

  page = 1;
  pageSize = 10;
  pagedDeclarations: Declaration[] = [];

  searchTerm = '';
  filterType: 'ALL' | 'OUTGOING' | 'RETURN' = 'ALL';
  filterStatus: DeclarationStatus | 'ALL' = 'ALL';

  statuses = Object.values(DeclarationStatus);
  DeclarationStatus = DeclarationStatus;

  constructor(private declarationService: DeclarationService) {}

  ngOnInit(): void {
    this.loadDeclarations();

    this.declarationService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.declarationService.error$.subscribe(error => {
      this.error = error;
    });
  }

  /**
   * Load declarations from API
   */
  loadDeclarations(): void {
    this.declarationService.getDeclarations().subscribe(declarations => {
      this.declarations = declarations;
      this.applyFilters();
    });
  }

  /**
   * Apply filters and search
   */
  applyFilters(): void {
    this.filteredDeclarations = this.declarations.filter(d => {
      const matchSearch =
        d.declaredBy.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.note?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchType = this.filterType === 'ALL' || d.declarationType === this.filterType;

      const matchStatus = this.filterStatus === 'ALL' || d.status === this.filterStatus;

      return matchSearch && matchType && matchStatus;
    });

    this.page = 1;
    this.updatePage();
  }

  /**
   * Update pagination
   */
  updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedDeclarations = this.filteredDeclarations.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDeclarations.length / this.pageSize) || 1;
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.updatePage();
  }

  /**
   * Get status badge color
   */
  getStatusBadgeClass(status: DeclarationStatus): string {
    switch (status) {
      case DeclarationStatus.PENDING:
        return 'bg-warning';
      case DeclarationStatus.APPROVED:
        return 'bg-success';
      case DeclarationStatus.REJECTED:
        return 'bg-danger';
      case DeclarationStatus.COMPLETED:
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Approve declaration
   */
  approveDeclaration(declaration: Declaration): void {
    this.declarationService.approveDeclaration(declaration.id).subscribe({
      next: () => {
        console.log('Declaration approved:', declaration.id);
        this.loadDeclarations();
      },
      error: (error) => {
        console.error('Error approving declaration:', error);
        alert('Erreur lors de l\'approbation');
      }
    });
  }

  /**
   * Reject declaration
   */
  rejectDeclaration(declaration: Declaration): void {
    this.declarationService.rejectDeclaration(declaration.id).subscribe({
      next: () => {
        console.log('Declaration rejected:', declaration.id);
        this.loadDeclarations();
      },
      error: (error) => {
        console.error('Error rejecting declaration:', error);
        alert('Erreur lors du rejet');
      }
    });
  }
}
