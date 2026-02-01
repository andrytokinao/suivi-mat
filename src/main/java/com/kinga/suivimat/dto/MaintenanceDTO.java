package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.Maintenance;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceDTO {
    private Long id;
    private Long materialId;
    private String materialName;
    private String materialSerialNumber;
    private String maintenanceType;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal cost;
    private Boolean linkedToCharge;
    private String chargeId;
    private String performedBy;
    private Maintenance.MaintenanceStatus status;

    public static MaintenanceDTO toDto(Maintenance entity) {
        if (entity == null) {
            return null;
        }
        return MaintenanceDTO.builder()
                .id(entity.getId())
                .materialId(entity.getMaterial() != null ? entity.getMaterial().getId() : null)
                .materialName(entity.getMaterial() != null ? entity.getMaterial().getName() : null)
                .materialSerialNumber(entity.getMaterial() != null ? entity.getMaterial().getSerialNumber() : null)
                .maintenanceType(entity.getMaintenanceType())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .cost(entity.getCost())
                .linkedToCharge(entity.getLinkedToCharge())
                .chargeId(entity.getChargeId())
                .performedBy(entity.getPerformedBy())
                .status(entity.getStatus())
                .build();
    }

    public static Maintenance toEntity(MaintenanceDTO dto) {
        if (dto == null) {
            return null;
        }
        Maintenance entity = Maintenance.builder()
                .id(dto.getId())
                .maintenanceType(dto.getMaintenanceType())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .cost(dto.getCost())
                .linkedToCharge(dto.getLinkedToCharge())
                .chargeId(dto.getChargeId())
                .performedBy(dto.getPerformedBy())
                .status(dto.getStatus())
                .build();
        // Material sera géré par le service
        return entity;
    }
}
