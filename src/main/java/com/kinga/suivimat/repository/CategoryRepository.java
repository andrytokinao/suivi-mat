package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.MaterialCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<MaterialCategory, Long> {
    List<MaterialCategory> findByParent(MaterialCategory parent);
    List<MaterialCategory> findMaterialCategoriesByParentId(Long parentId );
}
