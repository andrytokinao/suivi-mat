package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.MaterialCategoryDTO;
import com.kinga.suivimat.entity.MaterialCategory;
import com.kinga.suivimat.services.MaterialCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/material-categories")
public class MaterialCategoryController {

    private final MaterialCategoryService materialCategoryService;

    public MaterialCategoryController(MaterialCategoryService materialCategoryService) {
        this.materialCategoryService = materialCategoryService;
    }

    @GetMapping
    public List<MaterialCategoryDTO> findAll() {
        return materialCategoryService.findAll().stream()
                .map(MaterialCategoryDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MaterialCategoryDTO findById(@PathVariable Long id) {
        return materialCategoryService.findById(id)
                .map(MaterialCategoryDTO::toDto)
                .orElse(null);
    }

    @PostMapping
    public MaterialCategoryDTO create(@RequestBody MaterialCategoryDTO dto) {
        MaterialCategory entity = MaterialCategoryDTO.toEntity(dto);
        if (dto.getParentId() != null) {
            MaterialCategory parent = materialCategoryService.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            entity.setParent(parent);
        }
        MaterialCategory saved = materialCategoryService.save(entity);
        return MaterialCategoryDTO.toDto(saved);
    }

    @PutMapping("/{id}")
    public MaterialCategoryDTO update(@PathVariable Long id, @RequestBody MaterialCategoryDTO dto) {
        MaterialCategory entity = MaterialCategoryDTO.toEntity(dto);
        entity.setId(id);
        if (dto.getParentId() != null) {
            MaterialCategory parent = materialCategoryService.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            entity.setParent(parent);
        }
        MaterialCategory saved = materialCategoryService.save(entity);
        return MaterialCategoryDTO.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        materialCategoryService.deleteById(id);
    }

    @GetMapping("/parent/{parentId}")
    public List<MaterialCategoryDTO> getByParentId(@PathVariable Long parentId) {
        return materialCategoryService.findByParentId(parentId).stream()
                .map(MaterialCategoryDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/root")
    public List<MaterialCategoryDTO> getRootCategories() {
        return materialCategoryService.findRootCategories().stream()
                .map(MaterialCategoryDTO::toDto)
                .collect(Collectors.toList());
    }
}