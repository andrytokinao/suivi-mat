package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialCategory;
import com.kinga.suivimat.repository.CategoryRepository;
import com.kinga.suivimat.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CategoryRepository categoryRepository;

    public MaterialService(MaterialRepository materialRepository, CategoryRepository categoryRepository) {
        this.materialRepository = materialRepository;
        this.categoryRepository = categoryRepository;
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

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }

    public List<MaterialCategory> getRootCategories() {
        return categoryRepository.findMaterialCategoriesByParentId(null);
    }
}
