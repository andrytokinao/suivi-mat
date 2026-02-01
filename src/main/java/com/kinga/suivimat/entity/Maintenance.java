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




    public enum MaintenanceStatus {
        PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
