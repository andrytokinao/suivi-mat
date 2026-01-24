package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.OutgoingDeclaration;
import com.kinga.suivimat.repository.OutgoingDeclarationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutgoingDeclarationService extends BaseService<OutgoingDeclaration, Long> {

    private final OutgoingDeclarationRepository outgoingDeclarationRepository;

    public OutgoingDeclarationService(OutgoingDeclarationRepository outgoingDeclarationRepository) {
        super(outgoingDeclarationRepository);
        this.outgoingDeclarationRepository = outgoingDeclarationRepository;
    }

    public List<OutgoingDeclaration> findByValidatedBy(String validatedBy) {
        return outgoingDeclarationRepository.findByValidatedBy(validatedBy);
    }

    public List<OutgoingDeclaration> findByStatus(Declaration.DeclarationStatus status) {
        return outgoingDeclarationRepository.findByStatus(status);
    }
}