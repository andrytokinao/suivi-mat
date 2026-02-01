package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.OutgoingDeclaration;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutgoingDeclarationDTO extends DeclarationDTO {
    private List<Long> movementIds;
    private String usagePurpose;
    private String validatedBy;

    public static OutgoingDeclarationDTO toDto(OutgoingDeclaration entity) {
        if (entity == null) {
            return null;
        }
        OutgoingDeclarationDTO dto = OutgoingDeclarationDTO.builder()
                .movementIds(entity.getMovements() != null ?
                        entity.getMovements().stream()
                                .map(m -> m.getId())
                                .collect(Collectors.toList()) : null)
                .usagePurpose(entity.getUsagePurpose())
                .validatedBy(entity.getValidatedBy())
                .build();

        dto.setId(entity.getId());
        dto.setDeclarationDate(entity.getDeclarationDate());
        dto.setDeclaredBy(entity.getDeclaredBy());
        dto.setValidateBy(entity.getValidateBy());
        dto.setNote(entity.getNote());
        dto.setStatus(entity.getStatus());
        dto.setDeclarationType(entity.getDeclarationType());

        return dto;
    }

    public static OutgoingDeclaration toEntity(OutgoingDeclarationDTO dto) {
        if (dto == null) {
            return null;
        }
        OutgoingDeclaration entity = OutgoingDeclaration.builder()
                .usagePurpose(dto.getUsagePurpose())
                .validatedBy(dto.getValidatedBy())
                .build();

        entity.setId(dto.getId());
        entity.setDeclarationDate(dto.getDeclarationDate());
        entity.setDeclaredBy(dto.getDeclaredBy());
        entity.setValidateBy(dto.getValidateBy());
        entity.setNote(dto.getNote());
        entity.setStatus(dto.getStatus());

        // Les mouvements seront gérés par le service
        return entity;
    }
}
