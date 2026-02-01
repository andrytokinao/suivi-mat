package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.ReturnDeclaration;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnDeclarationDTO extends DeclarationDTO {
    private List<Long> movementIds;
    private LocalDateTime verifiedAt;
    private String verifiedBy;
    private String returnConditionNote;

    public static ReturnDeclarationDTO toDto(ReturnDeclaration entity) {
        if (entity == null) {
            return null;
        }
        ReturnDeclarationDTO dto = ReturnDeclarationDTO.builder()
                .movementIds(entity.getMovements() != null ?
                        entity.getMovements().stream()
                                .map(m -> m.getId())
                                .collect(Collectors.toList()) : null)
                .verifiedAt(entity.getVerifiedAt())
                .verifiedBy(entity.getVerifiedBy())
                .returnConditionNote(entity.getReturnConditionNote())
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

    public static ReturnDeclaration toEntity(ReturnDeclarationDTO dto) {
        if (dto == null) {
            return null;
        }
        ReturnDeclaration entity = ReturnDeclaration.builder()
                .verifiedAt(dto.getVerifiedAt())
                .verifiedBy(dto.getVerifiedBy())
                .returnConditionNote(dto.getReturnConditionNote())
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
