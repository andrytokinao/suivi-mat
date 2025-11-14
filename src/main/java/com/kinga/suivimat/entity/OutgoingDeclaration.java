package com.kinga.suivimat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@DiscriminatorValue("OUTGOING")
@Data
@AllArgsConstructor @Builder
public class OutgoingDeclaration extends Declaration {

    @OneToMany(mappedBy = "outgoingDeclaration", cascade = CascadeType.ALL)
    private List<MaterialMovement> movements;
    private String usagePurpose;
    private String validatedBy;


    public OutgoingDeclaration() {
    }

    @Override
    public String getDeclarationType() {
        return "SORTIE";
    }

    @Override
    public String getAdditionalInfo() {
        return usagePurpose;
    }

}
