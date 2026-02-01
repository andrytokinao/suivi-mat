package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.MaintenanceDTO;
import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.services.MaintenanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/maintenances")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public List<MaintenanceDTO> findAll() {
        return maintenanceService.findAll().stream()
                .map(MaintenanceDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MaintenanceDTO findById(@PathVariable Long id) {
        return maintenanceService.findById(id)
                .map(MaintenanceDTO::toDto)
                .orElse(null);
    }

    @PostMapping
    public MaintenanceDTO create(@RequestBody MaintenanceDTO dto) {
        Maintenance entity = MaintenanceDTO.toEntity(dto);
        Maintenance saved = maintenanceService.save(entity);
        return MaintenanceDTO.toDto(saved);
    }

    @PutMapping("/{id}")
    public MaintenanceDTO update(@PathVariable Long id, @RequestBody MaintenanceDTO dto) {
        Maintenance entity = MaintenanceDTO.toEntity(dto);
        entity.setId(id);
        Maintenance saved = maintenanceService.save(entity);
        return MaintenanceDTO.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        maintenanceService.deleteById(id);
    }

    @PutMapping("/{id}/status")
    public MaintenanceDTO updateStatus(@PathVariable Long id,
                                    @RequestParam Maintenance.MaintenanceStatus status) {
        Maintenance updated = maintenanceService.updateStatus(id, status);
        return MaintenanceDTO.toDto(updated);
    }

    @PostMapping("/{id}/complete")
    public MaintenanceDTO completeMaintenance(@PathVariable Long id) {
        Maintenance updated = maintenanceService.updateStatus(id, Maintenance.MaintenanceStatus.COMPLETED);
        return MaintenanceDTO.toDto(updated);
    }

    @PostMapping("/{id}/cancel")
    public MaintenanceDTO cancelMaintenance(@PathVariable Long id) {
        Maintenance updated = maintenanceService.updateStatus(id, Maintenance.MaintenanceStatus.CANCELLED);
        return MaintenanceDTO.toDto(updated);
    }
}