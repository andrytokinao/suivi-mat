package com.kinga.suivimat.services;

import com.kinga.suivimat.dto.DashboardDTO;
import com.kinga.suivimat.entity.*;
import com.kinga.suivimat.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final MaterialRepository materialRepository;
    private final DeclarationRepository declarationRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final CategoryRepository categoryRepository;

    public DashboardService(MaterialRepository materialRepository,
                            DeclarationRepository declarationRepository,
                            MaintenanceRepository maintenanceRepository,
                            CategoryRepository categoryRepository) {
        this.materialRepository = materialRepository;
        this.declarationRepository = declarationRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Récupère les statistiques du dashboard avec filtres optionnels
     */
    public DashboardDTO getDashboardStats(DashboardDTO.DashboardFilter filter) {
        List<Material> materials = materialRepository.findAll();
        List<Declaration> declarations = declarationRepository.findAll();
        List<Maintenance> maintenances = maintenanceRepository.findAll();
        List<MaterialCategory> categories = categoryRepository.findAll();

        // Appliquer les filtres si présents
        if (filter != null) {
            materials = filterMaterials(materials, filter);
            declarations = filterDeclarations(declarations, filter);
            maintenances = filterMaintenances(maintenances, filter);
        }

        return DashboardDTO.builder()
                .totalMaterials(materials.size())
                .totalDeclarations(declarations.size())
                .totalMaintenances(maintenances.size())
                .totalCategories(categories.size())
                .materialsByStatus(countMaterialsByStatus(materials))
                .materialsByCondition(countMaterialsByCondition(materials))
                .declarationsByStatus(countDeclarationsByStatus(declarations))
                .maintenancesByStatus(countMaintenancesByStatus(maintenances))
                .materialsByCategory(countMaterialsByCategory(materials))
                .recentMaterials(countRecentMaterials(materials))
                .pendingDeclarations(countPendingDeclarations(declarations))
                .activeMaintenances(countActiveMaintenances(maintenances))
                .generatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Récupère les statistiques sans filtres
     */
    public DashboardDTO getDashboardStats() {
        return getDashboardStats(null);
    }

    // ============== FILTRAGE ==============

    private List<Material> filterMaterials(List<Material> materials, DashboardDTO.DashboardFilter filter) {
        return materials.stream()
                .filter(m -> {
                    // Filtre par date de création
                    if (filter.getStartDate() != null && m.getCreatedAt() != null
                            && m.getCreatedAt().isBefore(filter.getStartDate())) {
                        return false;
                    }
                    if (filter.getEndDate() != null && m.getCreatedAt() != null
                            && m.getCreatedAt().isAfter(filter.getEndDate())) {
                        return false;
                    }
                    // Filtre par catégorie
                    if (filter.getCategoryId() != null && m.getCategory() != null
                            && !m.getCategory().getId().equals(filter.getCategoryId())) {
                        return false;
                    }
                    // Filtre par statut
                    if (filter.getMaterialStatus() != null && m.getStatus() != null
                            && !m.getStatus().name().equals(filter.getMaterialStatus())) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    private List<Declaration> filterDeclarations(List<Declaration> declarations, DashboardDTO.DashboardFilter filter) {
        return declarations.stream()
                .filter(d -> {
                    // Filtre par date
                    if (filter.getStartDate() != null && d.getDeclarationDate() != null
                            && d.getDeclarationDate().isBefore(filter.getStartDate())) {
                        return false;
                    }
                    if (filter.getEndDate() != null && d.getDeclarationDate() != null
                            && d.getDeclarationDate().isAfter(filter.getEndDate())) {
                        return false;
                    }
                    // Filtre par statut
                    if (filter.getDeclarationStatus() != null && d.getStatus() != null
                            && !d.getStatus().name().equals(filter.getDeclarationStatus())) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    private List<Maintenance> filterMaintenances(List<Maintenance> maintenances, DashboardDTO.DashboardFilter filter) {
        return maintenances.stream()
                .filter(m -> {
                    // Filtre par date de début
                    if (filter.getStartDate() != null && m.getStartDate() != null
                            && m.getStartDate().isBefore(filter.getStartDate())) {
                        return false;
                    }
                    if (filter.getEndDate() != null && m.getStartDate() != null
                            && m.getStartDate().isAfter(filter.getEndDate())) {
                        return false;
                    }
                    // Filtre par statut
                    if (filter.getMaintenanceStatus() != null && m.getStatus() != null
                            && !m.getStatus().name().equals(filter.getMaintenanceStatus())) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    // ============== COMPTAGES ==============

    private Map<String, Long> countMaterialsByStatus(List<Material> materials) {
        Map<String, Long> result = new HashMap<>();
        for (MaterialState.MaterialStatus status : MaterialState.MaterialStatus.values()) {
            result.put(status.name(), 0L);
        }
        result.putAll(materials.stream()
                .filter(m -> m.getStatus() != null)
                .collect(Collectors.groupingBy(m -> m.getStatus().name(), Collectors.counting())));
        return result;
    }

    private Map<String, Long> countMaterialsByCondition(List<Material> materials) {
        Map<String, Long> result = new HashMap<>();
        for (Material.MaterialCondition condition : Material.MaterialCondition.values()) {
            result.put(condition.name(), 0L);
        }
        result.putAll(materials.stream()
                .filter(m -> m.getCurrentCondition() != null)
                .collect(Collectors.groupingBy(m -> m.getCurrentCondition().name(), Collectors.counting())));
        return result;
    }

    private Map<String, Long> countDeclarationsByStatus(List<Declaration> declarations) {
        Map<String, Long> result = new HashMap<>();
        for (Declaration.DeclarationStatus status : Declaration.DeclarationStatus.values()) {
            result.put(status.name(), 0L);
        }
        result.putAll(declarations.stream()
                .filter(d -> d.getStatus() != null)
                .collect(Collectors.groupingBy(d -> d.getStatus().name(), Collectors.counting())));
        return result;
    }

    private Map<String, Long> countMaintenancesByStatus(List<Maintenance> maintenances) {
        Map<String, Long> result = new HashMap<>();
        for (Maintenance.MaintenanceStatus status : Maintenance.MaintenanceStatus.values()) {
            result.put(status.name(), 0L);
        }
        result.putAll(maintenances.stream()
                .filter(m -> m.getStatus() != null)
                .collect(Collectors.groupingBy(m -> m.getStatus().name(), Collectors.counting())));
        return result;
    }

    private Map<String, Long> countMaterialsByCategory(List<Material> materials) {
        Map<String, Long> result = new HashMap<>();
        result.put("Sans catégorie", materials.stream()
                .filter(m -> m.getCategory() == null)
                .count());
        result.putAll(materials.stream()
                .filter(m -> m.getCategory() != null)
                .collect(Collectors.groupingBy(m -> m.getCategory().getName(), Collectors.counting())));
        return result;
    }

    private long countRecentMaterials(List<Material> materials) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return materials.stream()
                .filter(m -> m.getCreatedAt() != null && m.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();
    }

    private long countPendingDeclarations(List<Declaration> declarations) {
        return declarations.stream()
                .filter(d -> d.getStatus() == Declaration.DeclarationStatus.PENDING)
                .count();
    }

    private long countActiveMaintenances(List<Maintenance> maintenances) {
        return maintenances.stream()
                .filter(m -> m.getStatus() == Maintenance.MaintenanceStatus.IN_PROGRESS
                          || m.getStatus() == Maintenance.MaintenanceStatus.PLANNED)
                .count();
    }
}
