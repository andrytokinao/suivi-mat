package com.kinga.suivimat.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Material material;

    private String maintenanceType;
    private String description;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private BigDecimal cost;
    private Boolean linkedToCharge;
    private String chargeId;

    private String performedBy;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;

    enum MaterialCondition {
        GOOD,       // Matériel en bon état, fonctionne normalement
        DAMAGED,    // Matériel endommagé (ex : rayure, pièce cassée mais toujours utilisable)
        BROKEN,     // Matériel en panne ou inutilisable
        IN_REPAIR   // Matériel en cours de réparation ou d’entretien
    }


    public enum MaintenanceStatus {
        PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
