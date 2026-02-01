package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialState;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialDTO {
    private Long id;
    private String name;
    private String reference;
    private String serialNumber;
    private String description;
    private MaterialState.MaterialStatus status;
    private Long categoryId;
    private String categoryName;
    private String purchaseId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Material.MaterialCondition currentCondition;
    private int availableQuantity; // Sum of movement quantities

    public static MaterialDTO toDto(Material entity) {
        if (entity == null) {
            return null;
        }
        int availableQty = entity.getMovements() != null ?
                entity.getMovements().stream()
                        .mapToInt(m -> m.getQuantity())
                        .sum() : 0;

        return MaterialDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .reference(entity.getReference())
                .serialNumber(entity.getSerialNumber())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .purchaseId(entity.getPurchaseId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .currentCondition(entity.getCurrentCondition())
                .availableQuantity(availableQty)
                .build();
    }

    public static Material toEntity(MaterialDTO dto) {
        if (dto == null) {
            return null;
        }
        Material entity = Material.builder()
                .id(dto.getId())
                .name(dto.getName())
                .reference(dto.getReference())
                .serialNumber(dto.getSerialNumber())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .purchaseId(dto.getPurchaseId())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .currentCondition(dto.getCurrentCondition())
                .build();
        // Category sera gérée par le service
        return entity;
    }
}
