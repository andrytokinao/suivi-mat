package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByMaterialId(Long materialId);
    List<Maintenance> findByMaterialIdOrderByStartDateDesc(Long materialId);
}
