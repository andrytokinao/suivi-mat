package com.kinga.suivimat.controller.api;

import com.kinga.suivimat.dto.ReturnDeclarationDTO;
import com.kinga.suivimat.entity.Declaration;
import com.kinga.suivimat.entity.ReturnDeclaration;
import com.kinga.suivimat.services.ReturnDeclarationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/return-declarations")
public class ReturnDeclarationController {

    private final ReturnDeclarationService returnDeclarationService;

    public ReturnDeclarationController(ReturnDeclarationService returnDeclarationService) {
        this.returnDeclarationService = returnDeclarationService;
    }

    @GetMapping
    public List<ReturnDeclarationDTO> findAll() {
        return returnDeclarationService.findAll().stream()
                .map(ReturnDeclarationDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ReturnDeclarationDTO findById(@PathVariable Long id) {
        return returnDeclarationService.findById(id)
                .map(ReturnDeclarationDTO::toDto)
                .orElse(null);
    }

    @PostMapping
    public ReturnDeclarationDTO create(@RequestBody ReturnDeclarationDTO dto) {
        ReturnDeclaration entity = ReturnDeclarationDTO.toEntity(dto);
        ReturnDeclaration saved = returnDeclarationService.save(entity);
        return ReturnDeclarationDTO.toDto(saved);
    }

    @PutMapping("/{id}")
    public ReturnDeclarationDTO update(@PathVariable Long id, @RequestBody ReturnDeclarationDTO dto) {
        ReturnDeclaration entity = ReturnDeclarationDTO.toEntity(dto);
        entity.setId(id);
        ReturnDeclaration saved = returnDeclarationService.save(entity);
        return ReturnDeclarationDTO.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        returnDeclarationService.deleteById(id);
    }

    @GetMapping("/verified-by/{verifiedBy}")
    public List<ReturnDeclarationDTO> getByVerifiedBy(@PathVariable String verifiedBy) {
        return returnDeclarationService.findByVerifiedBy(verifiedBy).stream()
                .map(ReturnDeclarationDTO::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/status/{status}")
    public List<ReturnDeclarationDTO> getByStatus(@PathVariable Declaration.DeclarationStatus status) {
        return returnDeclarationService.findByStatus(status).stream()
                .map(ReturnDeclarationDTO::toDto)
                .collect(Collectors.toList());
    }
}