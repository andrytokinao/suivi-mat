package     com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    public List<Maintenance> getAllMaintenances() {
        return maintenanceRepository.findAll();
    }

    public Optional<Maintenance> getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id);
    }

    public Maintenance saveMaintenance(Maintenance maintenance) {
        return maintenanceRepository.save(maintenance);
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }

    public Maintenance updateStatus(Long id, Maintenance.MaintenanceStatus status) {
        Maintenance maintenance = maintenanceRepository.findById(id).orElseThrow();
        maintenance.setStatus(status);
        return maintenanceRepository.save(maintenance);
    }
}
