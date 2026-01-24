package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.services.MaterialMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/material-movements")
public class MaterialMovementController extends BaseController<MaterialMovement, Long> {

    private final MaterialMovementService materialMovementService;

    public MaterialMovementController(MaterialMovementService materialMovementService) {
        super(materialMovementService);
        this.materialMovementService = materialMovementService;
    }

    @GetMapping("/material/{materialId}")
    public List<MaterialMovement> getByMaterialId(@PathVariable Long materialId) {
        return materialMovementService.findByMaterialId(materialId);
    }

    @GetMapping("/declaration/{declarationId}")
    public List<MaterialMovement> getByDeclarationId(@PathVariable Long declarationId) {
        return materialMovementService.getMovementsByDeclaration(declarationId);
    }

    @GetMapping("/status/{status}")
    public List<MaterialMovement> getByStatus(@PathVariable MaterialMovement.MovementStatus status) {
        return materialMovementService.findByStatus(status);
    }
}