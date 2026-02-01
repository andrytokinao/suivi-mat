package com.kinga.suivimat.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    // Statistiques globales
    private long totalMaterials;
    private long totalDeclarations;
    private long totalMaintenances;
    private long totalCategories;

    // Répartition des matériels par statut
    private Map<String, Long> materialsByStatus;

    // Répartition des matériels par condition
    private Map<String, Long> materialsByCondition;

    // Répartition des déclarations par statut
    private Map<String, Long> declarationsByStatus;

    // Répartition des maintenances par statut
    private Map<String, Long> maintenancesByStatus;

    // Répartition des matériels par catégorie
    private Map<String, Long> materialsByCategory;

    // Activité récente
    private long recentMaterials; // Créés dans les 30 derniers jours
    private long pendingDeclarations;
    private long activeMaintenances;

    // Métadonnées
    private LocalDateTime generatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardFilter {
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Long categoryId;
        private String materialStatus;
        private String declarationStatus;
        private String maintenanceStatus;
    }
}
