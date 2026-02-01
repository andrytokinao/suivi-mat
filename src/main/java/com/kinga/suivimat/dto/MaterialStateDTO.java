package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.Material;
import com.kinga.suivimat.entity.MaterialState;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialStateDTO {
    private Long id;
    private Long materialId;
    private String materialName;
    private Material.MaterialCondition state;
    private String description;
    private String updatedBy;
    private LocalDateTime date;

    public static MaterialStateDTO toDto(MaterialState entity) {
        if (entity == null) {
            return null;
        }
        return MaterialStateDTO.builder()
                .id(entity.getId())
                .materialId(entity.getMaterial() != null ? entity.getMaterial().getId() : null)
                .materialName(entity.getMaterial() != null ? entity.getMaterial().getName() : null)
                .state(entity.getState())
                .description(entity.getDescription())
                .updatedBy(entity.getUpdatedBy())
                .date(entity.getDate())
                .build();
    }

    public static MaterialState toEntity(MaterialStateDTO dto) {
        if (dto == null) {
            return null;
        }
        return MaterialState.builder()
                .id(dto.getId())
                .state(dto.getState())
                .description(dto.getDescription())
                .updatedBy(dto.getUpdatedBy())
                .date(dto.getDate())
                .build();
        // Material sera géré par le service
    }
}
