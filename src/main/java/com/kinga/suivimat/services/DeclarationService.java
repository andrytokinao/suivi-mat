package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.repository.DeclarationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeclarationService extends BaseService<Declaration, Long> {

    private final DeclarationRepository declarationRepository;

    public DeclarationService(DeclarationRepository declarationRepository) {
        super(declarationRepository);
        this.declarationRepository = declarationRepository;
    }

    public List<Declaration> findByDeclaredBy(String declaredBy) {
        return declarationRepository.findByDeclaredBy(declaredBy);
    }

    public List<Declaration> findByStatus(Declaration.DeclarationStatus status) {
        return declarationRepository.findByStatus(status);
    }

    public Declaration approveDeclaration(Long id) {
        Declaration declaration = findById(id)
                .orElseThrow(() -> new RuntimeException("Declaration not found"));
        declaration.setStatus(Declaration.DeclarationStatus.APPROVED);
        return save(declaration);
    }

    public Declaration rejectDeclaration(Long id) {
        Declaration declaration = findById(id)
                .orElseThrow(() -> new RuntimeException("Declaration not found"));
        declaration.setStatus(Declaration.DeclarationStatus.REJECTED);
        return save(declaration);
    }
}