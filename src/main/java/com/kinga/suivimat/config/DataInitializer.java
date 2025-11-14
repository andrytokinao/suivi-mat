package com.kinga.suivimat.config;

import com.kinga.suivimat.entity.*;
import com.kinga.suivimat.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final MaterialRepository materialRepository;
    private final DeclarationRepository declarationRepository;
    private final MaterialMovementRepository materialMovementRepository;
    private final MaintenanceRepository maintenanceRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           MaterialRepository materialRepository,
                           DeclarationRepository declarationRepository,
                           MaterialMovementRepository materialMovementRepository,
                           MaintenanceRepository maintenanceRepository) {
        this.categoryRepository = categoryRepository;
        this.materialRepository = materialRepository;
        this.declarationRepository = declarationRepository;
        this.materialMovementRepository = materialMovementRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // --- Catégories ---
        MaterialCategory topographie = new MaterialCategory();
        topographie.setName("Topographie");

        MaterialCategory numerique = new MaterialCategory();
        numerique.setName("Outils numériques");

        MaterialCategory mesure = new MaterialCategory();
        mesure.setName("Mesure");

        categoryRepository.saveAll(List.of(topographie, numerique, mesure));

        // --- Matériels ---
        Material m1 = new Material();
        m1.setName("Appareil topographique");
        m1.setCategory(topographie);

        Material m2 = new Material();
        m2.setName("Tablette");
        m2.setCategory(numerique);

        Material m3 = new Material();
        m3.setName("Niveau laser");
        m3.setCategory(mesure);

        Material m4 = new Material();
        m4.setName("Mètre ruban");
        m4.setCategory(mesure);

        materialRepository.saveAll(List.of(m1, m2, m3, m4));

        // --- Déclarations ---
        OutgoingDeclaration d1 = new OutgoingDeclaration();
        d1.setDeclaredBy("Jean Dupont");
        d1.setDeclarationDate(LocalDateTime.now().minusDays(2));
        d1.setStatus(Declaration.DeclarationStatus.PENDING);
        d1.setNote("Travaux sur site client");

        ReturnDeclaration d2 = new ReturnDeclaration();
        d2.setDeclaredBy("Marie Curie");
        d2.setDeclarationDate(LocalDateTime.now().minusDays(1));
        d2.setStatus(Declaration.DeclarationStatus.PENDING);
        d2.setReturnConditionNote("Retour après chantier");

        declarationRepository.saveAll(List.of(d1, d2));

        // --- Movements ---
        MaterialMovement mm1 = new MaterialMovement();
        mm1.setMaterial(m1);
        mm1.setQuantity(1);
        mm1.setMovementDate(LocalDateTime.now().minusDays(2));
        mm1.setOutgoingDeclaration(d1);

        MaterialMovement mm2 = new MaterialMovement();
        mm2.setMaterial(m2);
        mm2.setQuantity(2);
        mm2.setCondition(m2.getCurrentCondition());
        mm2.setMovementDate(LocalDateTime.now().minusDays(2));
        mm2.setOutgoingDeclaration(d1);

        MaterialMovement mm3 = new MaterialMovement();
        mm3.setMaterial(m3);
        mm3.setQuantity(1);
        mm3.setCondition(m3.getCurrentCondition());
        mm3.setMovementDate(LocalDateTime.now().minusDays(1));
        mm3.setOutgoingDeclaration(d1);
        mm3.setReturnDeclaration(d2);

        materialMovementRepository.saveAll(List.of(mm1, mm2, mm3));

        // --- Maintenance ---
        Maintenance mt1 = new Maintenance();
        mt1.setMaterial(m2);
        mt1.setDescription("Réparation écran tactile");
        mt1.setStartDate(LocalDateTime.now().minusDays(1));
        mt1.setStatus(Maintenance.MaintenanceStatus.IN_PROGRESS);

        Maintenance mt2 = new Maintenance();
        mt2.setMaterial(m3);
        mt2.setDescription("Calibrage niveau laser");
        mt2.setStartDate(LocalDateTime.now());
        mt2.setStatus(Maintenance.MaintenanceStatus.COMPLETED);

        maintenanceRepository.saveAll(List.of(mt1, mt2));

        System.out.println("=== Initialisation des données terminée ===");
    }
}
