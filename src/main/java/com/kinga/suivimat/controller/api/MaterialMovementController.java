package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.MaterialMovementDTO;
import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.services.MaterialMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/material-movements")
public class MaterialMovementController {

    private final MaterialMovementService materialMovementService;

    public MaterialMovementController(MaterialMovementService materialMovementService) {
        this.materialMovementService = materialMovementService;
    }

    @GetMapping
    public List<MaterialMovementDTO> findAll() {
        return materialMovementService.findAll().stream()
                .map(MaterialMovementDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MaterialMovementDTO findById(@PathVariable Long id) {
        return materialMovementService.findById(id)
                .map(MaterialMovementDTO::toDto)
                .orElse(null);
    }

    @PostMapping
    public MaterialMovementDTO create(@RequestBody MaterialMovementDTO dto) {
        MaterialMovement entity = MaterialMovementDTO.toEntity(dto);
        MaterialMovement saved = materialMovementService.save(entity);
        return MaterialMovementDTO.toDto(saved);
    }

    @PutMapping("/{id}")
    public MaterialMovementDTO update(@PathVariable Long id, @RequestBody MaterialMovementDTO dto) {
        MaterialMovement entity = MaterialMovementDTO.toEntity(dto);
        entity.setId(id);
        MaterialMovement saved = materialMovementService.save(entity);
        return MaterialMovementDTO.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        materialMovementService.deleteById(id);
    }

    @GetMapping("/material/{materialId}")
    public List<MaterialMovementDTO> getByMaterialId(@PathVariable Long materialId) {
        return materialMovementService.findByMaterialId(materialId).stream()
                .map(MaterialMovementDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/declaration/{declarationId}")
    public List<MaterialMovementDTO> getByDeclarationId(@PathVariable Long declarationId) {
        return materialMovementService.getMovementsByDeclaration(declarationId).stream()
                .map(MaterialMovementDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/status/{status}")
    public List<MaterialMovementDTO> getByStatus(@PathVariable MaterialMovement.MovementStatus status) {
        return materialMovementService.findByStatus(status).stream()
                .map(MaterialMovementDTO::toDto)
                .collect(Collectors.toList());
    }
}