package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.MaterialCategory;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private Long parentId;
    private List<MaterialCategoryDTO> children;

    public static MaterialCategoryDTO toDto(MaterialCategory entity) {
        if (entity == null) {
            return null;
        }
        return MaterialCategoryDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .parentId(entity.getParent() != null ? entity.getParent().getId() : null)
                .children(entity.getChildren() != null ?
                        entity.getChildren().stream()
                                .map(MaterialCategoryDTO::toDto)
                                .collect(Collectors.toList()) : null)
                .build();
    }

    public static MaterialCategory toEntity(MaterialCategoryDTO dto) {
        if (dto == null) {
            return null;
        }
        MaterialCategory entity = MaterialCategory.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        // Parent et children seront gérés par le service
        return entity;
    }
}
