package com.kinga.suivimat.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
class MaterialState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Material material;

    @Enumerated(EnumType.STRING)
    private Material.MaterialCondition state;

    private String description;
    private String updatedBy;
    private LocalDateTime date;

    enum MaterialStatus {
        AVAILABLE, IN_USE, UNDER_MAINTENANCE, LOST, RETIRED
    }
}
