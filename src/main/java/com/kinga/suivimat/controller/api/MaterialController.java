package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialCategory;
import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.services.MaterialService;
import com.kinga.suivimat.services.MaterialMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController extends BaseController<Material, Long> {

    private final MaterialService materialService;
    private final MaterialMovementService materialMovementService;

    public MaterialController(MaterialService materialService, MaterialMovementService materialMovementService) {
        super(materialService);
        this.materialService = materialService;
        this.materialMovementService = materialMovementService;
    }

    @GetMapping("/root-categories")
    public List<MaterialCategory> getRootCategories() {
        return materialService.getRootCategories();
    }

    @GetMapping("/{id}/movements")
    public List<MaterialMovement> getMaterialMovements(@PathVariable Long id) {
        return materialMovementService.findByMaterialId(id);
    }

    @GetMapping("/serial/{serialNumber}")
    public Material findBySerialNumber(@PathVariable String serialNumber) {
        return materialService.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException("Material not found with serial: " + serialNumber));
    }
}