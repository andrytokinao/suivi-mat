package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialCategory;
import com.kinga.suivimat.repository.CategoryRepository;
import com.kinga.suivimat.repository.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService extends BaseService<Material, Long> {

    private final MaterialRepository materialRepository;
    private final CategoryRepository categoryRepository;

    public MaterialService(MaterialRepository materialRepository, CategoryRepository categoryRepository) {
        super(materialRepository);
        this.materialRepository = materialRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<MaterialCategory> getRootCategories() {
        return categoryRepository.findMaterialCategoriesByParentId(null);
    }

    public Optional<Material> findBySerialNumber(String serialNumber) {
        return materialRepository.findBySerialNumber(serialNumber);
    }

    public List<Material> findByCondition(Maintenance.MaintenanceStatus condition) {
        return materialRepository.findByCurrentCondition(condition);
    }

    public MaterialCategory getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
    }

    @Transactional(readOnly = true)
    public Optional<Material> findByIdWithFullDetails(Long id) {
        return materialRepository.findByIdWithFullDetails(id);
    }

    @Transactional(readOnly = true)
    public List<Material> findAllWithMovements() {
        return materialRepository.findAllWithMovements();
    }
}