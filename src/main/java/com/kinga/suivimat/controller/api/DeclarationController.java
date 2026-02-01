package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.DeclarationDTO;
import com.kinga.suivimat.dto.MaterialMovementDTO;
import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.services.DeclarationService;
import com.kinga.suivimat.services.MaterialMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/declarations")
public class DeclarationController {

    private final DeclarationService declarationService;
    private final MaterialMovementService materialMovementService;

    public DeclarationController(DeclarationService declarationService,
                                 MaterialMovementService materialMovementService) {
        this.declarationService = declarationService;
        this.materialMovementService = materialMovementService;
    }

    @GetMapping
    public List<DeclarationDTO> findAll() {
        return declarationService.findAll().stream()
                .map(DeclarationDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public DeclarationDTO findById(@PathVariable Long id) {
        return declarationService.findById(id)
                .map(DeclarationDTO::toDto)
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        declarationService.deleteById(id);
    }

    @GetMapping("/type/{type}")
    public List<DeclarationDTO> getByType(@PathVariable String type) {
        return declarationService.findAll().stream()
                .filter(d -> type.equalsIgnoreCase(d.getDeclarationType()))
                .map(DeclarationDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/movements")
    public List<MaterialMovementDTO> getDeclarationMovements(@PathVariable Long id) {
        return materialMovementService.getMovementsByDeclaration(id).stream()
                .map(MaterialMovementDTO::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/approve")
    public DeclarationDTO approveDeclaration(@PathVariable Long id) {
        Declaration approved = declarationService.approveDeclaration(id);
        return DeclarationDTO.toDto(approved);
    }

    @PostMapping("/{id}/reject")
    public DeclarationDTO rejectDeclaration(@PathVariable Long id) {
        Declaration rejected = declarationService.rejectDeclaration(id);
        return DeclarationDTO.toDto(rejected);
    }

    @GetMapping("/status/{status}")
    public List<DeclarationDTO> getByStatus(@PathVariable Declaration.DeclarationStatus status) {
        return declarationService.findByStatus(status).stream()
                .map(DeclarationDTO::toDto)
                .collect(Collectors.toList());
    }
}