package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.Declaration;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class DeclarationDTO {
    private Long id;
    private LocalDateTime declarationDate;
    private String declaredBy;
    private String validateBy;
    private String note;
    private Declaration.DeclarationStatus status;
    private String declarationType;

    public static DeclarationDTO toDto(Declaration entity) {
        if (entity == null) {
            return null;
        }
        if (entity instanceof com.kinga.suivimat.entity.OutgoingDeclaration) {
            return OutgoingDeclarationDTO.toDto((com.kinga.suivimat.entity.OutgoingDeclaration) entity);
        } else if (entity instanceof com.kinga.suivimat.entity.ReturnDeclaration) {
            return ReturnDeclarationDTO.toDto((com.kinga.suivimat.entity.ReturnDeclaration) entity);
        }
        return null;
    }
}
