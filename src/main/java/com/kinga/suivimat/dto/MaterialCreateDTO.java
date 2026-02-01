package com.kinga.suivimat.dto;

import com.kinga.suivimat.entity.Material;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialCreateDTO {
    private String name;
    private Long categoryId;
    private Material.MaterialCondition currentCondition;
    private String purchaseId;
    private String description;
}
