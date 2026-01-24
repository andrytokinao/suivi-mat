package com.kinga.suivimat.controller.view;

import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.services.MaintenanceService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/maintenances")
public class MaintenanceViewController {

    private final MaintenanceService maintenanceService;

    public MaintenanceViewController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public String listMaintenances(Model model) {
        model.addAttribute("pageTitle", "Liste des maintenances");

        List<Maintenance> maintenances = maintenanceService.findAll();
        model.addAttribute("maintenances", maintenances);

        return "maintenance-list";
    }

    @GetMapping("/{id}")
    public String maintenanceDetail(@PathVariable Long id, Model model) {
        Maintenance maintenance = maintenanceService.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance not found with id: " + id));

        model.addAttribute("pageTitle", "Détails maintenance #" + id);
        model.addAttribute("maintenance", maintenance);

        return "maintenance-detail";
    }

    @PostMapping("/{id}/complete")
    public String markAsCompleted(@PathVariable Long id) {
        maintenanceService.updateStatus(id, Maintenance.MaintenanceStatus.COMPLETED);
        return "redirect:/maintenances/" + id;
    }

    @PostMapping("/{id}/cancel")
    public String cancelMaintenance(@PathVariable Long id) {
        maintenanceService.updateStatus(id, Maintenance.MaintenanceStatus.CANCELLED);
        return "redirect:/maintenances/" + id;
    }
}