package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.services.MaintenanceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenances")
public class MaintenanceController extends BaseController<Maintenance, Long> {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        super(maintenanceService);
        this.maintenanceService = maintenanceService;
    }

    @PutMapping("/{id}/status")
    public Maintenance updateStatus(@PathVariable Long id,
                                    @RequestParam Maintenance.MaintenanceStatus status) {
        return maintenanceService.updateStatus(id, status);
    }

    @PostMapping("/{id}/complete")
    public Maintenance completeMaintenance(@PathVariable Long id) {
        return maintenanceService.updateStatus(id, Maintenance.MaintenanceStatus.COMPLETED);
    }

    @PostMapping("/{id}/cancel")
    public Maintenance cancelMaintenance(@PathVariable Long id) {
        return maintenanceService.updateStatus(id, Maintenance.MaintenanceStatus.CANCELLED);
    }
}