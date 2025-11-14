package com.kinga.suivimat.controller;

import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.MaterialMovement;
import com.kinga.suivimat.services.DeclarationService;
import com.kinga.suivimat.services.MaterialMovementService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/declarations")
public class DeclarationController {

    private final DeclarationService declarationService;
    private final MaterialMovementService materialMovementService;

    public DeclarationController(DeclarationService declarationService,
                                 MaterialMovementService materialMovementService) {
        this.declarationService = declarationService;
        this.materialMovementService = materialMovementService;
    }

    @GetMapping
    public String listDeclarations(@RequestParam(required = false) String type, Model model) {
        List<Declaration> declarations = declarationService.getAllDeclarations();

        if (type != null && !type.isEmpty()) {
            declarations = declarations.stream()
                    .filter(d -> type.equalsIgnoreCase(d.getDeclarationType()))
                    .toList();
        }

        model.addAttribute("pageTitle", "Liste des déclarations");
        model.addAttribute("declarations", declarations);
        model.addAttribute("type", type); // pour maintenir la sélection dans le formulaire
        return "declaration-list";
    }

    @GetMapping("/{id}")
    public String declarationDetail(@PathVariable Long id, Model model) {
        Declaration declaration = declarationService.getDeclarationById(id).orElse(null);
        if (declaration == null) {
            return "redirect:/declarations";
        }

        List<MaterialMovement> movements = materialMovementService.getMovementsByDeclaration(id);

        model.addAttribute("pageTitle", "Détails de la déclaration #" + id);
        model.addAttribute("declaration", declaration);
        model.addAttribute("movements", movements);
        model.addAttribute("note", declaration.getNote() != null ? declaration.getNote() : "");

        return "declaration-detail";
    }

    @PostMapping("/{id}/validate")
    public String validateSelected(@PathVariable Long id,
                                   @RequestParam(required = false) List<Long> selectedMovements) {

        if (selectedMovements != null) {
            List<MaterialMovement> movements = materialMovementService.getMovementsByDeclaration(id);
            for (MaterialMovement m : movements) {
                if (selectedMovements.contains(m.getId())) {
                    m.setStatus(MaterialMovement.MovementStatus.VALIDATED);
                    m.setValidatedBy("responsable.admin"); // Ici on peut récupérer l’utilisateur connecté plus tard
                    m.setValidatedAt(LocalDateTime.now());
                    materialMovementService.saveMovement(m);
                }
            }
        }

        return "redirect:/declarations/" + id;
    }

    @PostMapping("/{id}/comment")
    public String addComment(@PathVariable Long id, @RequestParam String note) {
        Optional<Declaration> declaration = declarationService.getDeclarationById(id);
        if (declaration.isPresent()) {
            declaration.get().setNote(note);
            declarationService.saveDeclaration(declaration.get());
        }
        return "redirect:/declarations/" + id;
    }
}
