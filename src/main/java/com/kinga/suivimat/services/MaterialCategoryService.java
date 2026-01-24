package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.MaterialCategory;
import com.kinga.suivimat.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialCategoryService extends BaseService<MaterialCategory, Long> {

    private final CategoryRepository categoryRepository;

    public MaterialCategoryService(CategoryRepository categoryRepository) {
        super(categoryRepository);
        this.categoryRepository = categoryRepository;
    }

    public List<MaterialCategory> findByParentId(Long parentId) {
        return categoryRepository.findMaterialCategoriesByParentId(parentId);
    }

    public List<MaterialCategory> findRootCategories() {
        return categoryRepository.findMaterialCategoriesByParentId(null);
    }

    public List<MaterialCategory> findByParent(MaterialCategory parent) {
        return categoryRepository.findByParent(parent);
    }
}