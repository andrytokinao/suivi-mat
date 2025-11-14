package com.kinga.suivimat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "declaration_type", discriminatorType = DiscriminatorType.STRING)
@Data
public abstract class Declaration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime declarationDate;
    private String declaredBy;
    private String validateBy;
    private String note;
    private DeclarationStatus status;
    public abstract String getDeclarationType();

    public abstract String getAdditionalInfo();
    public Declaration() {

    }
    public enum DeclarationStatus {
        PENDING, APPROVED, REJECTED
    }
}
