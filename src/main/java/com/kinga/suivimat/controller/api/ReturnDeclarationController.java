package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.ReturnDeclaration;
import com.kinga.suivimat.services.ReturnDeclarationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/return-declarations")
public class ReturnDeclarationController extends BaseController<ReturnDeclaration, Long> {

    private final ReturnDeclarationService returnDeclarationService;

    public ReturnDeclarationController(ReturnDeclarationService returnDeclarationService) {
        super(returnDeclarationService);
        this.returnDeclarationService = returnDeclarationService;
    }

    @GetMapping("/verified-by/{verifiedBy}")
    public List<ReturnDeclaration> getByVerifiedBy(@PathVariable String verifiedBy) {
        return returnDeclarationService.findByVerifiedBy(verifiedBy);
    }

    @GetMapping("/status/{status}")
    public List<ReturnDeclaration> getByStatus(@PathVariable Declaration.DeclarationStatus status) {
        return returnDeclarationService.findByStatus(status);
    }
}