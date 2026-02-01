package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.MaterialState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialStateRepository extends JpaRepository<MaterialState, Long> {
    List<MaterialState> findByMaterialId(Long materialId);
    List<MaterialState> findByMaterialIdOrderByDateDesc(Long materialId);
}
