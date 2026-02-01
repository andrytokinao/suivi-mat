// Dashboard interface matching DashboardDTO
export interface Dashboard {
  // Statistiques globales
  totalMaterials: number;
  totalDeclarations: number;
  totalMaintenances: number;
  totalCategories: number;

  // Répartition des matériels par statut
  materialsByStatus: { [key: string]: number };

  // Répartition des matériels par condition
  materialsByCondition: { [key: string]: number };

  // Répartition des déclarations par statut
  declarationsByStatus: { [key: string]: number };

  // Répartition des maintenances par statut
  maintenancesByStatus: { [key: string]: number };

  // Répartition des matériels par catégorie
  materialsByCategory: { [key: string]: number };

  // Activité récente
  recentMaterials: number;
  pendingDeclarations: number;
  activeMaintenances: number;

  // Métadonnées
  generatedAt: string;
}

// Dashboard filter matching DashboardDTO.DashboardFilter
export interface DashboardFilter {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  materialStatus?: string;
  declarationStatus?: string;
  maintenanceStatus?: string;
}
