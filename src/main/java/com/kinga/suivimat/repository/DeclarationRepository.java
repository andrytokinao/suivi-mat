package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.Declaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeclarationRepository extends JpaRepository<Declaration, Long> {
    List<Declaration> findByDeclaredBy(String declaredBy);
    List<Declaration> findByStatus(Declaration.DeclarationStatus status);
}
