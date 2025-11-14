package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.MaterialMovement;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialMovementRepository extends JpaRepository<MaterialMovement, Long> {
    List<MaterialMovement> findByOutgoingDeclarationId(Long outgoingDeclarationId);
    List<MaterialMovement> findByReturnDeclarationId(Long returnDeclarationId);
    List<MaterialMovement> findByOutgoingDeclarationIdOrReturnDeclarationId(Long outgoingDeclarationId, Long returnDeclarationId);
    List<MaterialMovement> findByStatus(MaterialMovement.MovementStatus status);
    List<MaterialMovement> findByStatus(MaterialMovement.MovementStatus status, Pageable pageable);
    List<MaterialMovement> findByMaterialId(Long materialId);
}
