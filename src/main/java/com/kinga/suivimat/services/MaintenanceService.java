package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;

@Service
public class MaintenanceService extends BaseService<Maintenance, Long> {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository) {
        super(maintenanceRepository);
        this.maintenanceRepository = maintenanceRepository;
    }

    public Maintenance updateStatus(Long id, Maintenance.MaintenanceStatus status) {
        Maintenance maintenance = findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));
        maintenance.setStatus(status);
        return save(maintenance);
    }
}