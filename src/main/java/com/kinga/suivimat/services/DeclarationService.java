package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.repository.DeclarationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeclarationService {

    private final DeclarationRepository declarationRepository;

    public DeclarationService(DeclarationRepository declarationRepository) {
        this.declarationRepository = declarationRepository;
    }

    public List<Declaration> getAllDeclarations() {
        return declarationRepository.findAll();
    }

    public Optional<Declaration> getDeclarationById(Long id) {
        return declarationRepository.findById(id);
    }

    public Declaration saveDeclaration(Declaration declaration) {
        return declarationRepository.save(declaration);
    }

    public void deleteDeclaration(Long id) {
        declarationRepository.deleteById(id);
    }

    // Exemples de méthodes métiers
    public Declaration approveDeclaration(Long id) {
        Declaration declaration = declarationRepository.findById(id).orElseThrow();
        declaration.setStatus(Declaration.DeclarationStatus.APPROVED);
        return declarationRepository.save(declaration);
    }

    public Declaration rejectDeclaration(Long id) {
        Declaration declaration = declarationRepository.findById(id).orElseThrow();
        declaration.setStatus(Declaration.DeclarationStatus.REJECTED);
        return declarationRepository.save(declaration);
    }
}
