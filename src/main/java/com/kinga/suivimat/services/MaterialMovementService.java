package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.repository.MaterialMovementRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialMovementService extends BaseService<MaterialMovement, Long> {

    private final MaterialMovementRepository movementRepository;

    public MaterialMovementService(MaterialMovementRepository movementRepository) {
        super(movementRepository);
        this.movementRepository = movementRepository;
    }

    public List<MaterialMovement> findByMaterialId(Long materialId) {
        return movementRepository.findByMaterialId(materialId);
    }

    public List<MaterialMovement> getMovementsByDeclaration(Long declarationId) {
        return movementRepository.findByOutgoingDeclarationIdOrReturnDeclarationId(
                declarationId, declarationId);
    }

    public List<MaterialMovement> findByStatus(MaterialMovement.MovementStatus status) {
        return movementRepository.findByStatus(status);
    }

    public List<MaterialMovement> findByStatus(MaterialMovement.MovementStatus status, Pageable pageable) {
        return movementRepository.findByStatus(status, pageable);
    }

    public List<MaterialMovement> findByOutgoingDeclarationId(Long outgoingDeclarationId) {
        return movementRepository.findByOutgoingDeclarationId(outgoingDeclarationId);
    }

    public List<MaterialMovement> findByReturnDeclarationId(Long returnDeclarationId) {
        return movementRepository.findByReturnDeclarationId(returnDeclarationId);
    }
}