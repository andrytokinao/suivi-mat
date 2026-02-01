package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialMovement;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialMovementDTO {
    private Long id;
    private Long materialId;
    private String materialName;
    private String materialSerialNumber;
    private int quantity;
    private LocalDateTime createdAt;
    private LocalDateTime validatedAt;
    private String createdBy;
    private String validatedBy;
    private String verifiedBy;
    private MaterialMovement.MovementStatus status;
    private LocalDateTime movementDate;
    private Material.MaterialCondition condition;
    private Long outgoingDeclarationId;
    private Long returnDeclarationId;

    public static MaterialMovementDTO toDto(MaterialMovement entity) {
        if (entity == null) {
            return null;
        }
        return MaterialMovementDTO.builder()
                .id(entity.getId())
                .materialId(entity.getMaterial() != null ? entity.getMaterial().getId() : null)
                .materialName(entity.getMaterial() != null ? entity.getMaterial().getName() : null)
                .materialSerialNumber(entity.getMaterial() != null ? entity.getMaterial().getSerialNumber() : null)
                .quantity(entity.getQuantity())
                .createdAt(entity.getCreatedAt())
                .validatedAt(entity.getValidatedAt())
                .createdBy(entity.getCreatedBy())
                .validatedBy(entity.getValidatedBy())
                .verifiedBy(entity.getVerifiedBy())
                .status(entity.getStatus())
                .movementDate(entity.getMovementDate())
                .condition(entity.getCondition())
                .outgoingDeclarationId(entity.getOutgoingDeclaration() != null ? entity.getOutgoingDeclaration().getId() : null)
                .returnDeclarationId(entity.getReturnDeclaration() != null ? entity.getReturnDeclaration().getId() : null)
                .build();
    }

    public static MaterialMovement toEntity(MaterialMovementDTO dto) {
        if (dto == null) {
            return null;
        }
        MaterialMovement entity = MaterialMovement.builder()
                .id(dto.getId())
                .quantity(dto.getQuantity())
                .createdAt(dto.getCreatedAt())
                .validatedAt(dto.getValidatedAt())
                .createdBy(dto.getCreatedBy())
                .validatedBy(dto.getValidatedBy())
                .verifiedBy(dto.getVerifiedBy())
                .status(dto.getStatus())
                .movementDate(dto.getMovementDate())
                .condition(dto.getCondition())
                .build();
        // Les relations seront gérées par le service
        return entity;
    }
}
