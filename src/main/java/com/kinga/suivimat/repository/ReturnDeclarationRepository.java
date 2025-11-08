package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.ReturnDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnDeclarationRepository extends JpaRepository<ReturnDeclaration, Long> {
    List<ReturnDeclaration> findByVerifiedBy(String verifiedBy);
    List<ReturnDeclaration> findByStatus(Declaration.DeclarationStatus status);
}
