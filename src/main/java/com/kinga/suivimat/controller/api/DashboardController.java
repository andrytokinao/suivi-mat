package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.DashboardDTO;
import com.kinga.suivimat.services.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Récupère les statistiques du dashboard sans filtres
     * GET /api/dashboard
     */
    @GetMapping
    public DashboardDTO getDashboard() {
        return dashboardService.getDashboardStats();
    }

    /**
     * Récupère les statistiques du dashboard avec filtres via paramètres de requête
     * GET /api/dashboard/filter?startDate=...&endDate=...&categoryId=...&materialStatus=...&declarationStatus=...&maintenanceStatus=...
     *
     * Exemple: /api/dashboard/filter?startDate=2025-01-01T00:00:00&endDate=2026-01-31T23:59:59&materialStatus=AVAILABLE
     */
    @GetMapping("/filter")
    public DashboardDTO getDashboardWithFilter(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String materialStatus,
            @RequestParam(required = false) String declarationStatus,
            @RequestParam(required = false) String maintenanceStatus) {

        DashboardDTO.DashboardFilter filter = DashboardDTO.DashboardFilter.builder()
                .startDate(startDate)
                .endDate(endDate)
                .categoryId(categoryId)
                .materialStatus(materialStatus)
                .declarationStatus(declarationStatus)
                .maintenanceStatus(maintenanceStatus)
                .build();

        return dashboardService.getDashboardStats(filter);
    }

    /**
     * Récupère les statistiques du dashboard avec filtres via POST body
     * POST /api/dashboard/filter
     * Body: { "startDate": "...", "endDate": "...", "categoryId": 1, ... }
     */
    @PostMapping("/filter")
    public DashboardDTO getDashboardWithFilterPost(@RequestBody DashboardDTO.DashboardFilter filter) {
        return dashboardService.getDashboardStats(filter);
    }

    /**
     * Récupère uniquement les statistiques des matériels
     * GET /api/dashboard/materials?status=AVAILABLE
     */
    @GetMapping("/materials")
    public DashboardDTO getMaterialsStats(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId) {

        DashboardDTO.DashboardFilter filter = DashboardDTO.DashboardFilter.builder()
                .materialStatus(status)
                .categoryId(categoryId)
                .build();

        return dashboardService.getDashboardStats(filter);
    }

    /**
     * Récupère uniquement les statistiques des déclarations
     * GET /api/dashboard/declarations?status=PENDING
     */
    @GetMapping("/declarations")
    public DashboardDTO getDeclarationsStats(@RequestParam(required = false) String status) {
        DashboardDTO.DashboardFilter filter = DashboardDTO.DashboardFilter.builder()
                .declarationStatus(status)
                .build();

        return dashboardService.getDashboardStats(filter);
    }

    /**
     * Récupère uniquement les statistiques des maintenances
     * GET /api/dashboard/maintenances?status=IN_PROGRESS
     */
    @GetMapping("/maintenances")
    public DashboardDTO getMaintenancesStats(@RequestParam(required = false) String status) {
        DashboardDTO.DashboardFilter filter = DashboardDTO.DashboardFilter.builder()
                .maintenanceStatus(status)
                .build();

        return dashboardService.getDashboardStats(filter);
    }

    /**
     * Récupère les statistiques pour une période donnée
     * GET /api/dashboard/period?start=2025-01-01T00:00:00&end=2025-12-31T23:59:59
     */
    @GetMapping("/period")
    public DashboardDTO getStatsByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        DashboardDTO.DashboardFilter filter = DashboardDTO.DashboardFilter.builder()
                .startDate(start)
                .endDate(end)
                .build();

        return dashboardService.getDashboardStats(filter);
    }
}
