package com.kinga.suivimat.services;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.ReturnDeclaration;
import com.kinga.suivimat.repository.ReturnDeclarationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReturnDeclarationService extends BaseService<ReturnDeclaration, Long> {

    private final ReturnDeclarationRepository returnDeclarationRepository;

    public ReturnDeclarationService(ReturnDeclarationRepository returnDeclarationRepository) {
        super(returnDeclarationRepository);
        this.returnDeclarationRepository = returnDeclarationRepository;
    }

    public List<ReturnDeclaration> findByVerifiedBy(String verifiedBy) {
        return returnDeclarationRepository.findByVerifiedBy(verifiedBy);
    }

    public List<ReturnDeclaration> findByStatus(Declaration.DeclarationStatus status) {
        return returnDeclarationRepository.findByStatus(status);
    }
}