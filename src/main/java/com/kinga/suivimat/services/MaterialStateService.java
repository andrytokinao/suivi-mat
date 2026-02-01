package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.MaterialState;
import com.kinga.suivimat.repository.MaterialStateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialStateService extends BaseService<MaterialState, Long> {

    private final MaterialStateRepository materialStateRepository;

    public MaterialStateService(MaterialStateRepository materialStateRepository) {
        super(materialStateRepository);
        this.materialStateRepository = materialStateRepository;
    }

    public List<MaterialState> findByMaterialId(Long materialId) {
        return materialStateRepository.findByMaterialId(materialId);
    }

    public List<MaterialState> findByMaterialIdOrderByDateDesc(Long materialId) {
        return materialStateRepository.findByMaterialIdOrderByDateDesc(materialId);
    }
}
