package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.entity.MaterialCategory;
import com.kinga.suivimat.services.MaterialCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/material-categories")
public class MaterialCategoryController extends BaseController<MaterialCategory, Long> {

    private final MaterialCategoryService materialCategoryService;

    public MaterialCategoryController(MaterialCategoryService materialCategoryService) {
        super(materialCategoryService);
        this.materialCategoryService = materialCategoryService;
    }

    @GetMapping("/parent/{parentId}")
    public List<MaterialCategory> getByParentId(@PathVariable Long parentId) {
        return materialCategoryService.findByParentId(parentId);
    }

    @GetMapping("/root")
    public List<MaterialCategory> getRootCategories() {
        return materialCategoryService.findRootCategories();
    }
}