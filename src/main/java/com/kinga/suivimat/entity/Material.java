package com.kinga.suivimat.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * SuiviMat – Gestion du matériel d'entreprise
 * Inclut : matériels, mouvements, déclarations, entretiens et catégories hiérarchiques.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String reference;
    private String serialNumber;
    private String description;

    @Enumerated(EnumType.STRING)
    private MaterialState.MaterialStatus status;

    @ManyToOne
    private MaterialCategory category;

    private String purchaseId; // Lien vers gestion des achats

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    private List<MaterialMovement> movements;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    private List<MaterialState> states;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    private List<Maintenance> maintenances;
    @Enumerated(EnumType.STRING)
    private MaterialCondition currentCondition;
    public enum MaterialCondition {
        GOOD, DAMAGED, BROKEN, IN_REPAIR
    }
}
