package com.kinga.suivimat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@DiscriminatorValue("RETURN")
@Data @NoArgsConstructor
@AllArgsConstructor @Builder
public class ReturnDeclaration extends Declaration {

    @OneToMany(mappedBy = "returnDeclaration", cascade = CascadeType.ALL)

    private List<MaterialMovement> movements;

    private LocalDateTime verifiedAt;
    private String verifiedBy;
    private String returnConditionNote;

    @Override
    public String getDeclarationType() {
        return "RETOUR";
    }

    @Override
    public String getAdditionalInfo() {
        return returnConditionNote;
    }
}
