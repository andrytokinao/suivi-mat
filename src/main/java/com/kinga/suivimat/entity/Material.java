package com.kinga.suivimat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private Set<MaterialMovement> movements = new HashSet<>();

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    private Set<MaterialState> states = new HashSet<>();

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    private Set<Maintenance> maintenances = new HashSet<>();


    @Enumerated(EnumType.STRING)
    private MaterialCondition currentCondition;

    public enum MaterialCondition {
        GOOD, DAMAGED, BROKEN, IN_REPAIR
    }
}
