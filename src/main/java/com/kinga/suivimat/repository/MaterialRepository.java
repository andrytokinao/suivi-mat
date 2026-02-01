package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.*;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findBySerialNumber(String serialNumber);
    List<Material> findByCurrentCondition(Maintenance.MaintenanceStatus condition);

    @Query("SELECT DISTINCT m FROM Material m " +
           "LEFT JOIN FETCH m.category c " +
           "LEFT JOIN FETCH m.movements")
    List<Material> findAllWithMovements();

    @Query("SELECT m FROM Material m " +
           "LEFT JOIN FETCH m.category c " +
           "LEFT JOIN FETCH c.parent " +
           "LEFT JOIN FETCH c.children " +
           "LEFT JOIN FETCH m.movements " +
           "LEFT JOIN FETCH m.states " +
           "LEFT JOIN FETCH m.maintenances " +
           "WHERE m.id = :id")
    Optional<Material> findByIdWithFullDetails(@Param("id") Long id);
}
