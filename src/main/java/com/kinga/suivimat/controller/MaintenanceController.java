package com.kinga.suivimat.controller;


import com.kinga.suivimat.entity.Material;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/maintenances")
public class MaintenanceController {

    @GetMapping
    public String listMaintenances(Model model) {
        model.addAttribute("pageTitle", "Maintenance");

        // Données fictives
        List<Map<String, Object>> maintenances = Arrays.asList(
                Map.of("id", 101L, "material", "Projector Epson", "status", "IN_PROGRESS", "startDate", LocalDate.of(2025, 11, 5)),
                Map.of("id", 102L, "material", "HP Laptop", "status", "COMPLETED", "startDate", LocalDate.of(2025, 10, 28))
        );

        model.addAttribute("maintenances", maintenances);
        return "maintenance-list";
    }

    @GetMapping("/{id}")
    public String maintenanceDetail(@PathVariable Long id, Model model) {
        model.addAttribute("pageTitle", "Maintenance Details");

        // Données fictives
        Map<String, Object> maintenance = Map.of(
                "id", id,
                "material", Material.builder().name("Projector Epson").build(),
                "status", "IN_PROGRESS",
                "description", "Lens replacement and cleaning",
                "startDate", LocalDate.of(2025, 11, 5),
                "technician", "Alex Johnson"
        );

        model.addAttribute("maintenance", maintenance);
        return "maintenance-detail";
    }
}
