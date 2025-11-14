package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.repository.MaterialMovementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialMovementService {

    private final MaterialMovementRepository movementRepository;

    public MaterialMovementService(MaterialMovementRepository movementRepository) {
        this.movementRepository = movementRepository;
    }

    public List<MaterialMovement> getAllMovements() {
        return movementRepository.findAll();
    }

    public Optional<MaterialMovement> getMovementById(Long id) {
        return movementRepository.findById(id);
    }

    public MaterialMovement saveMovement(MaterialMovement movement) {
        return movementRepository.save(movement);
    }

    public void deleteMovement(Long id) {
        movementRepository.deleteById(id);
    }
    public List<MaterialMovement> findByMaterialId(Long materialId) {
        return movementRepository.findByMaterialId(materialId);
    }

    public List<MaterialMovement> getMovementsByDeclaration(Long id) {
        return movementRepository.findByOutgoingDeclarationIdOrReturnDeclarationId(id,id);
    }
}
