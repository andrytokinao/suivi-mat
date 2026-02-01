package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialState;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialFullDetailDTO {
    // Informations de base du matériel
    private Long id;
    private String name;
    private String reference;
    private String serialNumber;
    private String description;
    private MaterialState.MaterialStatus status;
    private String purchaseId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Material.MaterialCondition currentCondition;
    private int availableQuantity; // Sum of movement quantities

    // Catégorie complète
    private MaterialCategoryDTO category;

    // Liste de tous les mouvements
    private List<MaterialMovementDTO> movements;

    // Liste de tous les états
    private List<MaterialStateDTO> states;

    // Liste de tous les entretiens
    private List<MaintenanceDTO> maintenances;

    public static MaterialFullDetailDTO toDto(Material entity) {
        if (entity == null) {
            return null;
        }
        int availableQty = entity.getMovements() != null ?
                entity.getMovements().stream()
                        .mapToInt(m -> m.getQuantity())
                        .sum() : 0;

        return MaterialFullDetailDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .reference(entity.getReference())
                .serialNumber(entity.getSerialNumber())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .purchaseId(entity.getPurchaseId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .currentCondition(entity.getCurrentCondition())
                .availableQuantity(availableQty)
                .category(MaterialCategoryDTO.toDto(entity.getCategory()))
                .movements(entity.getMovements() != null ?
                        entity.getMovements().stream()
                                .map(MaterialMovementDTO::toDto)
                                .collect(Collectors.toList()) : null)
                .states(entity.getStates() != null ?
                        entity.getStates().stream()
                                .map(MaterialStateDTO::toDto)
                                .collect(Collectors.toList()) : null)
                .maintenances(entity.getMaintenances() != null ?
                        entity.getMaintenances().stream()
                                .map(MaintenanceDTO::toDto)
                                .collect(Collectors.toList()) : null)
                .build();
    }
}
