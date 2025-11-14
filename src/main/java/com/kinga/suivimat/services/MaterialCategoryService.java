package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.MaterialCategory;
import com.kinga.suivimat.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialCategoryService {

    private final CategoryRepository categoryRepository;

    public MaterialCategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<MaterialCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<MaterialCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public MaterialCategory saveCategory(MaterialCategory category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
