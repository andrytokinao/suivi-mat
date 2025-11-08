package com.kinga.suivimat.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class MaterialCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    private MaterialCategory parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<MaterialCategory> children;
}
