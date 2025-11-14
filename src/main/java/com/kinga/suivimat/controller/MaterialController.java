package com.kinga.suivimat.controller;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.services.MaterialService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping("/materials")
    public String listMaterials(Model model) {
        model.addAttribute("pageTitle", "Liste des matériels");

        // Récupération des matériaux depuis la base de données
        List<Material> materials = materialService.getAllMaterials();
        model.addAttribute("materials", materials);

        return "material-list"; // Thymeleaf template à créer ou modifier
    }
}
