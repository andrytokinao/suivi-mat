package com.kinga.suivimat.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MaterialMovement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Material material;

    private int quantity;

    private LocalDateTime createdAt;
    private LocalDateTime validatedAt;

    private String createdBy;
    private String validatedBy;
    private String verifiedBy;

    @Enumerated(EnumType.STRING)
    private MovementStatus status;
    private LocalDateTime movementDate;
    private Material.MaterialCondition condition;

    @ManyToOne
    @JoinColumn(name = "outgoing_declaration_id")
    @JsonBackReference
    private OutgoingDeclaration outgoingDeclaration;

    @ManyToOne
    @JoinColumn(name = "return_declaration_id")
    @JsonBackReference
    private ReturnDeclaration returnDeclaration; // nullable


    public enum MovementStatus {
        PENDING_VALIDATION, VALIDATED, PENDING_VERIFICATION, VERIFIED, REJECTED
    }

}
