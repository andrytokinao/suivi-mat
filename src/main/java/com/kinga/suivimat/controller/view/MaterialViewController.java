package com.kinga.suivimat.controller.view;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.services.MaterialService;
import com.kinga.suivimat.services.MaterialMovementService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/materials")
public class MaterialViewController {

    private final MaterialService materialService;
    private final MaterialMovementService materialMovementService;

    public MaterialViewController(MaterialService materialService,
                                  MaterialMovementService materialMovementService) {
        this.materialService = materialService;
        this.materialMovementService = materialMovementService;
    }

    @GetMapping
    public String listMaterials(Model model) {
        List<Material> materials = materialService.findAll();

        model.addAttribute("pageTitle", "Liste des matériels");
        model.addAttribute("materials", materials);
        return "material-list";
    }

    @GetMapping("/{id}")
    public String materialDetail(@PathVariable Long id, Model model) {
        Material material = materialService.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        List<MaterialMovement> movements = materialMovementService.findByMaterialId(id);

        model.addAttribute("pageTitle", "Détails du matériel - " + material.getName());
        model.addAttribute("material", material);
        model.addAttribute("recentMovements", movements.stream().limit(5).toList());
        return "material-detail";
    }
}