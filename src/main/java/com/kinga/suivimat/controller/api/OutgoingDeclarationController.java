package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.OutgoingDeclaration;
import com.kinga.suivimat.services.OutgoingDeclarationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outgoing-declarations")
public class OutgoingDeclarationController extends BaseController<OutgoingDeclaration, Long> {

    private final OutgoingDeclarationService outgoingDeclarationService;

    public OutgoingDeclarationController(OutgoingDeclarationService outgoingDeclarationService) {
        super(outgoingDeclarationService);
        this.outgoingDeclarationService = outgoingDeclarationService;
    }

    @GetMapping("/validated-by/{validatedBy}")
    public List<OutgoingDeclaration> getByValidatedBy(@PathVariable String validatedBy) {
        return outgoingDeclarationService.findByValidatedBy(validatedBy);
    }

    @GetMapping("/status/{status}")
    public List<OutgoingDeclaration> getByStatus(@PathVariable Declaration.DeclarationStatus status) {
        return outgoingDeclarationService.findByStatus(status);
    }
}