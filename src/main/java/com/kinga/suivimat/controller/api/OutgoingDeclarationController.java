package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.OutgoingDeclarationDTO;
import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.OutgoingDeclaration;
import com.kinga.suivimat.services.OutgoingDeclarationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/outgoing-declarations")
public class OutgoingDeclarationController {

    private final OutgoingDeclarationService outgoingDeclarationService;

    public OutgoingDeclarationController(OutgoingDeclarationService outgoingDeclarationService) {
        this.outgoingDeclarationService = outgoingDeclarationService;
    }

    @GetMapping
    public List<OutgoingDeclarationDTO> findAll() {
        return outgoingDeclarationService.findAll().stream()
                .map(OutgoingDeclarationDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public OutgoingDeclarationDTO findById(@PathVariable Long id) {
        return outgoingDeclarationService.findById(id)
                .map(OutgoingDeclarationDTO::toDto)
                .orElse(null);
    }

    @PostMapping
    public OutgoingDeclarationDTO create(@RequestBody OutgoingDeclarationDTO dto) {
        OutgoingDeclaration entity = OutgoingDeclarationDTO.toEntity(dto);
        OutgoingDeclaration saved = outgoingDeclarationService.save(entity);
        return OutgoingDeclarationDTO.toDto(saved);
    }

    @PutMapping("/{id}")
    public OutgoingDeclarationDTO update(@PathVariable Long id, @RequestBody OutgoingDeclarationDTO dto) {
        OutgoingDeclaration entity = OutgoingDeclarationDTO.toEntity(dto);
        entity.setId(id);
        OutgoingDeclaration saved = outgoingDeclarationService.save(entity);
        return OutgoingDeclarationDTO.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        outgoingDeclarationService.deleteById(id);
    }

    @GetMapping("/validated-by/{validatedBy}")
    public List<OutgoingDeclarationDTO> getByValidatedBy(@PathVariable String validatedBy) {
        return outgoingDeclarationService.findByValidatedBy(validatedBy).stream()
                .map(OutgoingDeclarationDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/status/{status}")
    public List<OutgoingDeclarationDTO> getByStatus(@PathVariable Declaration.DeclarationStatus status) {
        return outgoingDeclarationService.findByStatus(status).stream()
                .map(OutgoingDeclarationDTO::toDto)
                .collect(Collectors.toList());
    }
}