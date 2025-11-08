package com.kinga.suivimat.repository;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.OutgoingDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutgoingDeclarationRepository extends JpaRepository<OutgoingDeclaration, Long> {
    List<OutgoingDeclaration> findByValidatedBy(String validatedBy);
    List<OutgoingDeclaration> findByStatus(Declaration.DeclarationStatus status);
}
