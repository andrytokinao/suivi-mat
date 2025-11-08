package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.*;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findBySerialNumber(String serialNumber);
    List<Material> findByCurrentCondition(Maintenance.MaintenanceStatus condition);
}
