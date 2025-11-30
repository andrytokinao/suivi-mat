package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;

    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public Optional<Material> getMaterialById(Long id) {
        return materialRepository.findById(id);
    }

    public Material saveMaterial(Material material) {
        return materialRepository.save(material);
    }

    public Material updateMaterial(Long id, Material updated) {
        return materialRepository.findById(id)
                .map(material -> {

                    material.setName(updated.getName());
                    material.setReference(updated.getReference());
                    material.setSerialNumber(updated.getSerialNumber());
                    material.setDescription(updated.getDescription());

                    material.setStatus(updated.getStatus());
                    material.setCurrentCondition(updated.getCurrentCondition());

                    material.setPurchaseId(updated.getPurchaseId());
                    material.setCategory(updated.getCategory());

                    material.setUpdatedAt(LocalDateTime.now());

                    return materialRepository.save(material);
                })
                .orElseThrow(() ->
                        new RuntimeException("Matériel non trouvé avec id " + id)
                );
    }


    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }
}
