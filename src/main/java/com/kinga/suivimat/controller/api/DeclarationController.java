package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.services.DeclarationService;
import com.kinga.suivimat.services.MaterialMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/declarations")
public class DeclarationController extends BaseController<Declaration, Long> {

    private final DeclarationService declarationService;
    private final MaterialMovementService materialMovementService;

    public DeclarationController(DeclarationService declarationService,
                                 MaterialMovementService materialMovementService) {
        super(declarationService);
        this.declarationService = declarationService;
        this.materialMovementService = materialMovementService;
    }

    @GetMapping("/type/{type}")
    public List<Declaration> getByType(@PathVariable String type) {
        return declarationService.findAll().stream()
                .filter(d -> type.equalsIgnoreCase(d.getDeclarationType()))
                .toList();
    }

    @GetMapping("/{id}/movements")
    public List<MaterialMovement> getDeclarationMovements(@PathVariable Long id) {
        return materialMovementService.getMovementsByDeclaration(id);
    }

    @PostMapping("/{id}/approve")
    public Declaration approveDeclaration(@PathVariable Long id) {
        return declarationService.approveDeclaration(id);
    }

    @PostMapping("/{id}/reject")
    public Declaration rejectDeclaration(@PathVariable Long id) {
        return declarationService.rejectDeclaration(id);
    }

    @GetMapping("/status/{status}")
    public List<Declaration> getByStatus(@PathVariable Declaration.DeclarationStatus status) {
        return declarationService.findByStatus(status);
    }
}