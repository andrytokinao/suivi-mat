package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.*;
import com.kinga.suivimat.entity.Maintenance;
import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.entity.MaterialState;
import com.kinga.suivimat.services.MaintenanceService;
import com.kinga.suivimat.services.MaterialMovementService;
import com.kinga.suivimat.services.MaterialService;
import com.kinga.suivimat.services.MaterialStateService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;
    private final MaterialMovementService materialMovementService;
    private final MaintenanceService maintenanceService;
    private final MaterialStateService materialStateService;

    public MaterialController(MaterialService materialService,
                              MaterialMovementService materialMovementService,
                              MaintenanceService maintenanceService,
                              MaterialStateService materialStateService) {
        this.materialService = materialService;
        this.materialMovementService = materialMovementService;
        this.maintenanceService = maintenanceService;
        this.materialStateService = materialStateService;
    }

    @GetMapping
    public List<MaterialDTO> findAll() {
        return materialService.findAllWithMovements().stream()
                .map(MaterialDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MaterialDTO findById(@PathVariable Long id) {
        return materialService.findById(id)
                .map(MaterialDTO::toDto)
                .orElse(null);
    }

    @GetMapping("/{id}/full-details")
    public MaterialFullDetailDTO getFullDetails(@PathVariable Long id) {
        return materialService.findByIdWithFullDetails(id)
                .map(MaterialFullDetailDTO::toDto)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
    }

    @PostMapping
    public MaterialDTO create(@RequestBody MaterialCreateDTO dto) {
        Material entity = new Material();

        // Champs fournis par l'utilisateur
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setCurrentCondition(dto.getCurrentCondition());
        entity.setPurchaseId(dto.getPurchaseId());

        // Champs générés automatiquement par l'application
        entity.setReference(generateReference());
        entity.setSerialNumber(generateSerialNumber());
        entity.setStatus(MaterialState.MaterialStatus.AVAILABLE);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        // Associer la catégorie
        if (dto.getCategoryId() != null) {
            entity.setCategory(materialService.getCategoryById(dto.getCategoryId()));
        }

        Material saved = materialService.save(entity);
        return MaterialDTO.toDto(saved);
    }

    private String generateReference() {
        // Génère une référence unique au format MAT-YYYY-XXXX
        String year = String.valueOf(LocalDateTime.now().getYear());
        String uniqueId = String.format("%04d", (int)(Math.random() * 10000));
        return "MAT-" + year + "-" + uniqueId;
    }

    private String generateSerialNumber() {
        // Génère un numéro de série unique au format SN-UUID
        return "SN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @PutMapping("/{id}")
    public MaterialDTO update(@PathVariable Long id, @RequestBody MaterialDTO dto) {
        Material entity = MaterialDTO.toEntity(dto);
        entity.setId(id);
        if (dto.getCategoryId() != null) {
            entity.setCategory(materialService.getCategoryById(dto.getCategoryId()));
        }
        Material saved = materialService.save(entity);
        return MaterialDTO.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        materialService.deleteById(id);
    }

    @GetMapping("/root-categories")
    public List<MaterialCategoryDTO> getRootCategories() {
        return materialService.getRootCategories().stream()
                .map(MaterialCategoryDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/movements")
    public List<MaterialMovementDTO> getMaterialMovements(@PathVariable Long id) {
        return materialMovementService.findByMaterialId(id).stream()
                .map(MaterialMovementDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/serial/{serialNumber}")
    public MaterialDTO findBySerialNumber(@PathVariable String serialNumber) {
        return materialService.findBySerialNumber(serialNumber)
                .map(MaterialDTO::toDto)
                .orElseThrow(() -> new RuntimeException("Material not found with serial: " + serialNumber));
    }

    // ============== MOVEMENTS CRUD ==============

    @GetMapping("/{materialId}/movements/{movementId}")
    public MaterialMovementDTO getMovementById(@PathVariable Long materialId, @PathVariable Long movementId) {
        return materialMovementService.findById(movementId)
                .filter(m -> m.getMaterial() != null && m.getMaterial().getId().equals(materialId))
                .map(MaterialMovementDTO::toDto)
                .orElseThrow(() -> new RuntimeException("Movement not found with id: " + movementId));
    }

    @PostMapping("/{materialId}/movements")
    public MaterialMovementDTO createMovement(@PathVariable Long materialId, @RequestBody MaterialMovementDTO dto) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        MaterialMovement entity = MaterialMovementDTO.toEntity(dto);
        entity.setMaterial(material);
        entity.setCreatedAt(LocalDateTime.now());

        MaterialMovement saved = materialMovementService.save(entity);
        return MaterialMovementDTO.toDto(saved);
    }

    @PutMapping("/{materialId}/movements/{movementId}")
    public MaterialMovementDTO updateMovement(@PathVariable Long materialId,
                                               @PathVariable Long movementId,
                                               @RequestBody MaterialMovementDTO dto) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        MaterialMovement existing = materialMovementService.findById(movementId)
                .orElseThrow(() -> new RuntimeException("Movement not found with id: " + movementId));

        MaterialMovement entity = MaterialMovementDTO.toEntity(dto);
        entity.setId(movementId);
        entity.setMaterial(material);
        entity.setCreatedAt(existing.getCreatedAt());

        MaterialMovement saved = materialMovementService.save(entity);
        return MaterialMovementDTO.toDto(saved);
    }

    @DeleteMapping("/{materialId}/movements/{movementId}")
    public void deleteMovement(@PathVariable Long materialId, @PathVariable Long movementId) {
        materialMovementService.findById(movementId)
                .filter(m -> m.getMaterial() != null && m.getMaterial().getId().equals(materialId))
                .orElseThrow(() -> new RuntimeException("Movement not found with id: " + movementId));
        materialMovementService.deleteById(movementId);
    }

    @PutMapping("/{materialId}/movements/batch")
    public List<MaterialMovementDTO> updateMovementsBatch(@PathVariable Long materialId,
                                                          @RequestBody List<MaterialMovementDTO> dtos) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        return dtos.stream().map(dto -> {
            MaterialMovement entity;
            if (dto.getId() != null) {
                // Update existing
                MaterialMovement existing = materialMovementService.findById(dto.getId())
                        .orElseThrow(() -> new RuntimeException("Movement not found with id: " + dto.getId()));
                entity = MaterialMovementDTO.toEntity(dto);
                entity.setId(dto.getId());
                entity.setCreatedAt(existing.getCreatedAt());
            } else {
                // Create new
                entity = MaterialMovementDTO.toEntity(dto);
                entity.setCreatedAt(LocalDateTime.now());
            }
            entity.setMaterial(material);
            return MaterialMovementDTO.toDto(materialMovementService.save(entity));
        }).collect(Collectors.toList());
    }

    @PostMapping("/{materialId}/movements/batch")
    public List<MaterialMovementDTO> createMovementsBatch(@PathVariable Long materialId,
                                                          @RequestBody List<MaterialMovementDTO> dtos) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        return dtos.stream().map(dto -> {
            MaterialMovement entity = MaterialMovementDTO.toEntity(dto);
            entity.setMaterial(material);
            entity.setCreatedAt(LocalDateTime.now());
            return MaterialMovementDTO.toDto(materialMovementService.save(entity));
        }).collect(Collectors.toList());
    }

    @DeleteMapping("/{materialId}/movements/batch")
    public void deleteMovementsBatch(@PathVariable Long materialId, @RequestBody List<Long> movementIds) {
        movementIds.forEach(movementId -> {
            materialMovementService.findById(movementId)
                    .filter(m -> m.getMaterial() != null && m.getMaterial().getId().equals(materialId))
                    .orElseThrow(() -> new RuntimeException("Movement not found with id: " + movementId));
            materialMovementService.deleteById(movementId);
        });
    }

    // ============== MAINTENANCES CRUD ==============

    @GetMapping("/{materialId}/maintenances")
    public List<MaintenanceDTO> getMaterialMaintenances(@PathVariable Long materialId) {
        return maintenanceService.findByMaterialId(materialId).stream()
                .map(MaintenanceDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{materialId}/maintenances/{maintenanceId}")
    public MaintenanceDTO getMaintenanceById(@PathVariable Long materialId, @PathVariable Long maintenanceId) {
        return maintenanceService.findById(maintenanceId)
                .filter(m -> m.getMaterial() != null && m.getMaterial().getId().equals(materialId))
                .map(MaintenanceDTO::toDto)
                .orElseThrow(() -> new RuntimeException("Maintenance not found with id: " + maintenanceId));
    }

    @PostMapping("/{materialId}/maintenances")
    public MaintenanceDTO createMaintenance(@PathVariable Long materialId, @RequestBody MaintenanceDTO dto) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        Maintenance entity = MaintenanceDTO.toEntity(dto);
        entity.setMaterial(material);

        Maintenance saved = maintenanceService.save(entity);
        return MaintenanceDTO.toDto(saved);
    }

    @PutMapping("/{materialId}/maintenances/{maintenanceId}")
    public MaintenanceDTO updateMaintenance(@PathVariable Long materialId,
                                             @PathVariable Long maintenanceId,
                                             @RequestBody MaintenanceDTO dto) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        maintenanceService.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance not found with id: " + maintenanceId));

        Maintenance entity = MaintenanceDTO.toEntity(dto);
        entity.setId(maintenanceId);
        entity.setMaterial(material);

        Maintenance saved = maintenanceService.save(entity);
        return MaintenanceDTO.toDto(saved);
    }

    @DeleteMapping("/{materialId}/maintenances/{maintenanceId}")
    public void deleteMaintenance(@PathVariable Long materialId, @PathVariable Long maintenanceId) {
        maintenanceService.findById(maintenanceId)
                .filter(m -> m.getMaterial() != null && m.getMaterial().getId().equals(materialId))
                .orElseThrow(() -> new RuntimeException("Maintenance not found with id: " + maintenanceId));
        maintenanceService.deleteById(maintenanceId);
    }

    @PutMapping("/{materialId}/maintenances/batch")
    public List<MaintenanceDTO> updateMaintenancesBatch(@PathVariable Long materialId,
                                                        @RequestBody List<MaintenanceDTO> dtos) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        return dtos.stream().map(dto -> {
            Maintenance entity;
            if (dto.getId() != null) {
                // Update existing
                maintenanceService.findById(dto.getId())
                        .orElseThrow(() -> new RuntimeException("Maintenance not found with id: " + dto.getId()));
                entity = MaintenanceDTO.toEntity(dto);
                entity.setId(dto.getId());
            } else {
                // Create new
                entity = MaintenanceDTO.toEntity(dto);
            }
            entity.setMaterial(material);
            return MaintenanceDTO.toDto(maintenanceService.save(entity));
        }).collect(Collectors.toList());
    }

    @PostMapping("/{materialId}/maintenances/batch")
    public List<MaintenanceDTO> createMaintenancesBatch(@PathVariable Long materialId,
                                                        @RequestBody List<MaintenanceDTO> dtos) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        return dtos.stream().map(dto -> {
            Maintenance entity = MaintenanceDTO.toEntity(dto);
            entity.setMaterial(material);
            return MaintenanceDTO.toDto(maintenanceService.save(entity));
        }).collect(Collectors.toList());
    }

    @DeleteMapping("/{materialId}/maintenances/batch")
    public void deleteMaintenancesBatch(@PathVariable Long materialId, @RequestBody List<Long> maintenanceIds) {
        maintenanceIds.forEach(maintenanceId -> {
            maintenanceService.findById(maintenanceId)
                    .filter(m -> m.getMaterial() != null && m.getMaterial().getId().equals(materialId))
                    .orElseThrow(() -> new RuntimeException("Maintenance not found with id: " + maintenanceId));
            maintenanceService.deleteById(maintenanceId);
        });
    }

    // ============== STATES CRUD ==============

    @GetMapping("/{materialId}/states")
    public List<MaterialStateDTO> getMaterialStates(@PathVariable Long materialId) {
        return materialStateService.findByMaterialIdOrderByDateDesc(materialId).stream()
                .map(MaterialStateDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{materialId}/states/{stateId}")
    public MaterialStateDTO getStateById(@PathVariable Long materialId, @PathVariable Long stateId) {
        return materialStateService.findById(stateId)
                .filter(s -> s.getMaterial() != null && s.getMaterial().getId().equals(materialId))
                .map(MaterialStateDTO::toDto)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + stateId));
    }

    @PostMapping("/{materialId}/states")
    public MaterialStateDTO createState(@PathVariable Long materialId, @RequestBody MaterialStateDTO dto) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        MaterialState entity = MaterialStateDTO.toEntity(dto);
        entity.setMaterial(material);
        entity.setDate(LocalDateTime.now());

        MaterialState saved = materialStateService.save(entity);
        return MaterialStateDTO.toDto(saved);
    }

    @PutMapping("/{materialId}/states/{stateId}")
    public MaterialStateDTO updateState(@PathVariable Long materialId,
                                         @PathVariable Long stateId,
                                         @RequestBody MaterialStateDTO dto) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        MaterialState existing = materialStateService.findById(stateId)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + stateId));

        MaterialState entity = MaterialStateDTO.toEntity(dto);
        entity.setId(stateId);
        entity.setMaterial(material);
        entity.setDate(existing.getDate());

        MaterialState saved = materialStateService.save(entity);
        return MaterialStateDTO.toDto(saved);
    }

    @DeleteMapping("/{materialId}/states/{stateId}")
    public void deleteState(@PathVariable Long materialId, @PathVariable Long stateId) {
        materialStateService.findById(stateId)
                .filter(s -> s.getMaterial() != null && s.getMaterial().getId().equals(materialId))
                .orElseThrow(() -> new RuntimeException("State not found with id: " + stateId));
        materialStateService.deleteById(stateId);
    }

    @PutMapping("/{materialId}/states/batch")
    public List<MaterialStateDTO> updateStatesBatch(@PathVariable Long materialId,
                                                    @RequestBody List<MaterialStateDTO> dtos) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        return dtos.stream().map(dto -> {
            MaterialState entity;
            if (dto.getId() != null) {
                // Update existing
                MaterialState existing = materialStateService.findById(dto.getId())
                        .orElseThrow(() -> new RuntimeException("State not found with id: " + dto.getId()));
                entity = MaterialStateDTO.toEntity(dto);
                entity.setId(dto.getId());
                entity.setDate(existing.getDate());
            } else {
                // Create new
                entity = MaterialStateDTO.toEntity(dto);
                entity.setDate(LocalDateTime.now());
            }
            entity.setMaterial(material);
            return MaterialStateDTO.toDto(materialStateService.save(entity));
        }).collect(Collectors.toList());
    }

    @PostMapping("/{materialId}/states/batch")
    public List<MaterialStateDTO> createStatesBatch(@PathVariable Long materialId,
                                                    @RequestBody List<MaterialStateDTO> dtos) {
        Material material = materialService.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + materialId));

        return dtos.stream().map(dto -> {
            MaterialState entity = MaterialStateDTO.toEntity(dto);
            entity.setMaterial(material);
            entity.setDate(LocalDateTime.now());
            return MaterialStateDTO.toDto(materialStateService.save(entity));
        }).collect(Collectors.toList());
    }

    @DeleteMapping("/{materialId}/states/batch")
    public void deleteStatesBatch(@PathVariable Long materialId, @RequestBody List<Long> stateIds) {
        stateIds.forEach(stateId -> {
            materialStateService.findById(stateId)
                    .filter(s -> s.getMaterial() != null && s.getMaterial().getId().equals(materialId))
                    .orElseThrow(() -> new RuntimeException("State not found with id: " + stateId));
            materialStateService.deleteById(stateId);
        });
    }
}