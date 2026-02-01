package com.kinga.suivimat.config;

import com.kinga.suivimat.entity.*;
import com.kinga.suivimat.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final MaterialRepository materialRepository;
    private final DeclarationRepository declarationRepository;
    private final MaterialMovementRepository materialMovementRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final MaterialStateRepository materialStateRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           MaterialRepository materialRepository,
                           DeclarationRepository declarationRepository,
                           MaterialMovementRepository materialMovementRepository,
                           MaintenanceRepository maintenanceRepository,
                           MaterialStateRepository materialStateRepository) {
        this.categoryRepository = categoryRepository;
        this.materialRepository = materialRepository;
        this.declarationRepository = declarationRepository;
        this.materialMovementRepository = materialMovementRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.materialStateRepository = materialStateRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (this.categoryRepository.count() > 0)
            return;

        System.out.println("=== Démarrage de l'initialisation des données ===");

        // =====================================================================
        // CATÉGORIES HIÉRARCHIQUES
        // =====================================================================

        // Catégories parentes (niveau 1)
        MaterialCategory terrain = createCategory("Matériel de terrain", null);
        MaterialCategory bureau = createCategory("Matériel de bureau", null);
        MaterialCategory transport = createCategory("Matériel de transport", null);
        MaterialCategory securite = createCategory("Équipements de sécurité", null);
        categoryRepository.saveAll(List.of(terrain, bureau, transport, securite));

        // Sous-catégories terrain (niveau 2)
        MaterialCategory topographie = createCategory("Topographie", terrain);
        MaterialCategory mesure = createCategory("Instruments de mesure", terrain);
        MaterialCategory geotechnique = createCategory("Géotechnique", terrain);
        MaterialCategory hydraulique = createCategory("Matériel hydraulique", terrain);
        categoryRepository.saveAll(List.of(topographie, mesure, geotechnique, hydraulique));

        // Sous-catégories bureau (niveau 2)
        MaterialCategory informatique = createCategory("Informatique", bureau);
        MaterialCategory impression = createCategory("Impression et reproduction", bureau);
        MaterialCategory mobilier = createCategory("Mobilier technique", bureau);
        categoryRepository.saveAll(List.of(informatique, impression, mobilier));

        // Sous-catégories transport (niveau 2)
        MaterialCategory vehicules = createCategory("Véhicules", transport);
        MaterialCategory remorques = createCategory("Remorques et équipements", transport);
        categoryRepository.saveAll(List.of(vehicules, remorques));

        // Sous-catégories sécurité (niveau 2)
        MaterialCategory epi = createCategory("EPI - Équipements de protection", securite);
        MaterialCategory signalisation = createCategory("Signalisation", securite);
        categoryRepository.saveAll(List.of(epi, signalisation));

        // Sous-sous-catégories topographie (niveau 3)
        MaterialCategory stationsTotales = createCategory("Stations totales", topographie);
        MaterialCategory gps = createCategory("GPS et GNSS", topographie);
        MaterialCategory niveaux = createCategory("Niveaux optiques", topographie);
        categoryRepository.saveAll(List.of(stationsTotales, gps, niveaux));

        // Sous-sous-catégories informatique (niveau 3)
        MaterialCategory ordinateurs = createCategory("Ordinateurs", informatique);
        MaterialCategory tablettes = createCategory("Tablettes et mobiles", informatique);
        MaterialCategory accessoires = createCategory("Accessoires informatiques", informatique);
        categoryRepository.saveAll(List.of(ordinateurs, tablettes, accessoires));

        // =====================================================================
        // MATÉRIELS
        // =====================================================================

        // --- Matériels Topographie - Stations totales ---
        Material m1 = createMaterial("Leica TS16", stationsTotales, "Station totale robotisée haute précision",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-001");
        Material m2 = createMaterial("Trimble S9", stationsTotales, "Station totale 1\" de précision",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-002");
        Material m3 = createMaterial("Topcon GT-1003", stationsTotales, "Station totale motorisée",
                Material.MaterialCondition.DAMAGED, MaterialState.MaterialStatus.UNDER_MAINTENANCE, "ACH-2023-015");

        // --- Matériels Topographie - GPS ---
        Material m4 = createMaterial("Trimble R12i", gps, "Récepteur GNSS multi-fréquences",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.IN_USE, "ACH-2024-003");
        Material m5 = createMaterial("Leica GS18 T", gps, "Récepteur GNSS RTK avec IMU",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-004");
        Material m6 = createMaterial("Emlid Reach RS2+", gps, "Récepteur GNSS RTK compact",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-020");
        Material m7 = createMaterial("Trimble R10 Model 2", gps, "Récepteur GNSS intégré",
                Material.MaterialCondition.IN_REPAIR, MaterialState.MaterialStatus.UNDER_MAINTENANCE, "ACH-2022-008");

        // --- Matériels Topographie - Niveaux ---
        Material m8 = createMaterial("Leica NA730 Plus", niveaux, "Niveau automatique 30x",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-025");
        Material m9 = createMaterial("Topcon AT-B4A", niveaux, "Niveau automatique de chantier",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-026");
        Material m10 = createMaterial("Sokkia B40A", niveaux, "Niveau automatique 24x",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.IN_USE, "ACH-2022-012");

        // --- Matériels Mesure ---
        Material m11 = createMaterial("Leica DISTO X4", mesure, "Télémètre laser 150m avec caméra",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-010");
        Material m12 = createMaterial("Bosch GLM 250 VF", mesure, "Télémètre laser professionnel",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-011");
        Material m13 = createMaterial("Mètre ruban Stanley 50m", mesure, "Ruban de mesure longue distance",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-030");
        Material m14 = createMaterial("Roue de mesure Nedo", mesure, "Odomètre professionnel",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-031");
        Material m15 = createMaterial("Clinomètre Suunto PM-5", mesure, "Clinomètre de précision",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2022-018");

        // --- Matériels Géotechnique ---
        Material m16 = createMaterial("Pénétromètre dynamique PANDA", geotechnique, "Pénétromètre léger à énergie variable",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-040");
        Material m17 = createMaterial("Tarière manuelle Eijkelkamp", geotechnique, "Kit de prélèvement de sol",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-041");
        Material m18 = createMaterial("Scissomètre de poche", geotechnique, "Mesure de résistance au cisaillement",
                Material.MaterialCondition.DAMAGED, MaterialState.MaterialStatus.UNDER_MAINTENANCE, "ACH-2022-022");

        // --- Matériels Hydraulique ---
        Material m19 = createMaterial("Courantomètre OTT MF Pro", hydraulique, "Mesure de débit et vitesse",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-020");
        Material m20 = createMaterial("Sonde piézométrique Keller", hydraulique, "Capteur de niveau d'eau",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.IN_USE, "ACH-2023-045");

        // --- Matériels Informatique - Ordinateurs ---
        Material m21 = createMaterial("Dell Precision 7780", ordinateurs, "Station mobile de travail 17\"",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.IN_USE, "ACH-2024-050");
        Material m22 = createMaterial("Dell Precision 5570", ordinateurs, "Ultrabook workstation 15\"",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-051");
        Material m23 = createMaterial("Lenovo ThinkPad P16", ordinateurs, "Station mobile haute performance",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-055");
        Material m24 = createMaterial("HP ZBook Fury 16 G10", ordinateurs, "Workstation mobile robuste",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.IN_USE, "ACH-2023-056");

        // --- Matériels Informatique - Tablettes ---
        Material m25 = createMaterial("Trimble T10x", tablettes, "Tablette durcie pour topographie",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-060");
        Material m26 = createMaterial("Panasonic Toughbook FZ-G2", tablettes, "Tablette tout-terrain Windows",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.IN_USE, "ACH-2024-061");
        Material m27 = createMaterial("Samsung Galaxy Tab Active4 Pro", tablettes, "Tablette durcie Android",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-062");
        Material m28 = createMaterial("Getac F110", tablettes, "Tablette ultra-durcie 11\"",
                Material.MaterialCondition.BROKEN, MaterialState.MaterialStatus.RETIRED, "ACH-2021-030");

        // --- Matériels Informatique - Accessoires ---
        Material m29 = createMaterial("Disque dur externe Samsung T7 2To", accessoires, "SSD portable rapide",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-070");
        Material m30 = createMaterial("Souris Logitech MX Anywhere 3", accessoires, "Souris sans fil compacte",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-071");

        // --- Matériels Impression ---
        Material m31 = createMaterial("HP DesignJet T1600", impression, "Traceur grand format 36\"",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-080");
        Material m32 = createMaterial("Canon imagePROGRAF PRO-4100", impression, "Traceur photo 44\"",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-081");
        Material m33 = createMaterial("Epson SC-T5400", impression, "Traceur technique 36\"",
                Material.MaterialCondition.DAMAGED, MaterialState.MaterialStatus.UNDER_MAINTENANCE, "ACH-2022-040");

        // --- Matériels Véhicules ---
        Material m34 = createMaterial("Peugeot Partner 4x4", vehicules, "Véhicule utilitaire tout-terrain",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.IN_USE, "ACH-2023-100");
        Material m35 = createMaterial("Toyota Land Cruiser", vehicules, "4x4 baroudeur missions longues",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2022-101");
        Material m36 = createMaterial("Renault Kangoo E-Tech", vehicules, "Utilitaire électrique",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-102");

        // --- Matériels EPI ---
        Material m37 = createMaterial("Casque de chantier Petzl Vertex", epi, "Casque de protection ventilé",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-110");
        Material m38 = createMaterial("Gilet haute visibilité classe 3", epi, "Gilet réfléchissant professionnel",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-111");
        Material m39 = createMaterial("Chaussures de sécurité S3", epi, "Chaussures de terrain renforcées",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2024-112");

        // --- Matériels Signalisation ---
        Material m40 = createMaterial("Kit de balisage routier", signalisation, "Cônes, balises et panneaux",
                Material.MaterialCondition.GOOD, MaterialState.MaterialStatus.AVAILABLE, "ACH-2023-120");

        materialRepository.saveAll(List.of(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10,
                m11, m12, m13, m14, m15, m16, m17, m18, m19, m20,
                m21, m22, m23, m24, m25, m26, m27, m28, m29, m30,
                m31, m32, m33, m34, m35, m36, m37, m38, m39, m40));

        // =====================================================================
        // DÉCLARATIONS DE SORTIE
        // =====================================================================

        // Déclaration 1 - Mission terrain en cours
        OutgoingDeclaration out1 = createOutgoingDeclaration(
                "Jean Dupont", "Levé topographique site industriel Marseille",
                Declaration.DeclarationStatus.APPROVED, "Sophie Martin",
                "Mission de 3 jours - Site TOTAL Fos-sur-Mer", -5);

        // Déclaration 2 - En attente de validation
        OutgoingDeclaration out2 = createOutgoingDeclaration(
                "Pierre Lambert", "Implantation chantier résidentiel Lyon",
                Declaration.DeclarationStatus.PENDING, null,
                "Projet Les Jardins du Rhône - Phase 1", -2);

        // Déclaration 3 - Mission terminée
        OutgoingDeclaration out3 = createOutgoingDeclaration(
                "Marie Curie", "Étude hydraulique cours d'eau Dordogne",
                Declaration.DeclarationStatus.APPROVED, "Jean-Paul Richter",
                "Campagne de mesures de débit - Rapport annuel", -15);

        // Déclaration 4 - En cours
        OutgoingDeclaration out4 = createOutgoingDeclaration(
                "Lucas Bernard", "Reconnaissance géotechnique Bordeaux",
                Declaration.DeclarationStatus.APPROVED, "Sophie Martin",
                "Sondages pour fondations immeuble bureaux", -3);

        // Déclaration 5 - Rejetée
        OutgoingDeclaration out5 = createOutgoingDeclaration(
                "Emma Petit", "Maintenance préventive équipements",
                Declaration.DeclarationStatus.REJECTED, "Jean-Paul Richter",
                "Demande non conforme - matériel déjà réservé", -1);

        // Déclaration 6 - Mission longue durée
        OutgoingDeclaration out6 = createOutgoingDeclaration(
                "Thomas Moreau", "Suivi mensuel déformations barrage",
                Declaration.DeclarationStatus.APPROVED, "Sophie Martin",
                "Mission permanente - Barrage de Vouglans", -30);

        // Déclaration 7 - Formation externe
        OutgoingDeclaration out7 = createOutgoingDeclaration(
                "Julie Roux", "Formation client utilisation GPS RTK",
                Declaration.DeclarationStatus.APPROVED, "Jean-Paul Richter",
                "Formation 2 jours - Client VINCI Construction", -7);

        // Déclaration 8 - Très récente
        OutgoingDeclaration out8 = createOutgoingDeclaration(
                "Antoine Lefebvre", "Contrôle dimensionnel ouvrage d'art",
                Declaration.DeclarationStatus.PENDING, null,
                "Pont autoroutier A89 - Contrôle géométrique", 0);

        declarationRepository.saveAll(List.of(out1, out2, out3, out4, out5, out6, out7, out8));

        // =====================================================================
        // DÉCLARATIONS DE RETOUR
        // =====================================================================

        // Retour 1 - Complet après mission Dordogne
        ReturnDeclaration ret1 = createReturnDeclaration(
                "Marie Curie", "Retour mission hydraulique Dordogne",
                Declaration.DeclarationStatus.APPROVED, "Pierre Lambert",
                "Matériel en bon état - nettoyage effectué", -10);

        // Retour 2 - Partiel avec problème
        ReturnDeclaration ret2 = createReturnDeclaration(
                "Jean Dupont", "Retour partiel mission Marseille",
                Declaration.DeclarationStatus.PENDING, null,
                "GPS endommagé lors du transport - à vérifier", -1);

        // Retour 3 - Formation terminée
        ReturnDeclaration ret3 = createReturnDeclaration(
                "Julie Roux", "Retour formation VINCI",
                Declaration.DeclarationStatus.APPROVED, "Sophie Martin",
                "Tout le matériel vérifié et fonctionnel", -5);

        // Retour 4 - Mission géotechnique
        ReturnDeclaration ret4 = createReturnDeclaration(
                "Lucas Bernard", "Retour sondages Bordeaux",
                Declaration.DeclarationStatus.APPROVED, "Jean-Paul Richter",
                "Pénétromètre nécessite recalibrage", 0);

        declarationRepository.saveAll(List.of(ret1, ret2, ret3, ret4));

        // =====================================================================
        // MOUVEMENTS DE MATÉRIELS
        // =====================================================================

        // Mouvements pour out1 (Mission Marseille - Jean Dupont)
        MaterialMovement mv1 = createMovement(m1, 1, out1, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Jean Dupont", "Sophie Martin", -5);
        MaterialMovement mv2 = createMovement(m4, 1, out1, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Jean Dupont", "Sophie Martin", -5);
        MaterialMovement mv3 = createMovement(m25, 1, out1, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Jean Dupont", "Sophie Martin", -5);
        MaterialMovement mv4 = createMovement(m37, 2, out1, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Jean Dupont", "Sophie Martin", -5);

        // Mouvements pour out2 (Lyon - Pierre Lambert) - En attente
        MaterialMovement mv5 = createMovement(m2, 1, out2, null, MaterialMovement.MovementStatus.PENDING_VALIDATION,
                Material.MaterialCondition.GOOD, "Pierre Lambert", null, -2);
        MaterialMovement mv6 = createMovement(m5, 1, out2, null, MaterialMovement.MovementStatus.PENDING_VALIDATION,
                Material.MaterialCondition.GOOD, "Pierre Lambert", null, -2);
        MaterialMovement mv7 = createMovement(m11, 1, out2, null, MaterialMovement.MovementStatus.PENDING_VALIDATION,
                Material.MaterialCondition.GOOD, "Pierre Lambert", null, -2);

        // Mouvements pour out3 (Dordogne - Marie Curie) - Mission terminée avec retour
        MaterialMovement mv8 = createMovement(m19, 1, out3, ret1, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.GOOD, "Marie Curie", "Jean-Paul Richter", -15);
        MaterialMovement mv9 = createMovement(m20, 1, out3, ret1, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.GOOD, "Marie Curie", "Jean-Paul Richter", -15);
        MaterialMovement mv10 = createMovement(m26, 1, out3, ret1, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.GOOD, "Marie Curie", "Jean-Paul Richter", -15);

        // Mouvements pour out4 (Bordeaux - Lucas Bernard)
        MaterialMovement mv11 = createMovement(m16, 1, out4, ret4, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.DAMAGED, "Lucas Bernard", "Sophie Martin", -3);
        MaterialMovement mv12 = createMovement(m17, 1, out4, ret4, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.GOOD, "Lucas Bernard", "Sophie Martin", -3);
        MaterialMovement mv13 = createMovement(m34, 1, out4, ret4, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.GOOD, "Lucas Bernard", "Sophie Martin", -3);

        // Mouvements pour out6 (Barrage - Thomas Moreau) - Mission longue
        MaterialMovement mv14 = createMovement(m1, 1, out6, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Thomas Moreau", "Sophie Martin", -30);
        MaterialMovement mv15 = createMovement(m6, 2, out6, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Thomas Moreau", "Sophie Martin", -30);
        MaterialMovement mv16 = createMovement(m10, 1, out6, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Thomas Moreau", "Sophie Martin", -30);
        MaterialMovement mv17 = createMovement(m21, 1, out6, null, MaterialMovement.MovementStatus.VALIDATED,
                Material.MaterialCondition.GOOD, "Thomas Moreau", "Sophie Martin", -30);

        // Mouvements pour out7 (Formation - Julie Roux) - Terminé et retourné
        MaterialMovement mv18 = createMovement(m5, 1, out7, ret3, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.GOOD, "Julie Roux", "Jean-Paul Richter", -7);
        MaterialMovement mv19 = createMovement(m27, 2, out7, ret3, MaterialMovement.MovementStatus.VERIFIED,
                Material.MaterialCondition.GOOD, "Julie Roux", "Jean-Paul Richter", -7);

        // Mouvements pour out8 (Pont A89 - Antoine Lefebvre) - En attente
        MaterialMovement mv20 = createMovement(m2, 1, out8, null, MaterialMovement.MovementStatus.PENDING_VALIDATION,
                Material.MaterialCondition.GOOD, "Antoine Lefebvre", null, 0);
        MaterialMovement mv21 = createMovement(m8, 1, out8, null, MaterialMovement.MovementStatus.PENDING_VALIDATION,
                Material.MaterialCondition.GOOD, "Antoine Lefebvre", null, 0);
        MaterialMovement mv22 = createMovement(m13, 3, out8, null, MaterialMovement.MovementStatus.PENDING_VALIDATION,
                Material.MaterialCondition.GOOD, "Antoine Lefebvre", null, 0);

        // Mouvements de stock initial (entrées en stock positives)
        MaterialMovement stock1 = createStockMovement(m1, 5, "Achat initial", -60);
        MaterialMovement stock2 = createStockMovement(m2, 3, "Achat initial", -60);
        MaterialMovement stock3 = createStockMovement(m4, 4, "Achat initial", -60);
        MaterialMovement stock4 = createStockMovement(m5, 6, "Achat initial", -60);
        MaterialMovement stock5 = createStockMovement(m6, 8, "Achat initial", -60);
        MaterialMovement stock6 = createStockMovement(m8, 4, "Achat initial", -60);
        MaterialMovement stock7 = createStockMovement(m9, 3, "Achat initial", -60);
        MaterialMovement stock8 = createStockMovement(m10, 5, "Achat initial", -60);
        MaterialMovement stock9 = createStockMovement(m11, 10, "Achat initial", -60);
        MaterialMovement stock10 = createStockMovement(m12, 8, "Achat initial", -60);
        MaterialMovement stock11 = createStockMovement(m13, 20, "Achat initial", -60);
        MaterialMovement stock12 = createStockMovement(m14, 5, "Achat initial", -60);
        MaterialMovement stock13 = createStockMovement(m15, 6, "Achat initial", -60);
        MaterialMovement stock14 = createStockMovement(m16, 2, "Achat initial", -60);
        MaterialMovement stock15 = createStockMovement(m17, 3, "Achat initial", -60);
        MaterialMovement stock16 = createStockMovement(m19, 2, "Achat initial", -60);
        MaterialMovement stock17 = createStockMovement(m20, 4, "Achat initial", -60);
        MaterialMovement stock18 = createStockMovement(m21, 3, "Achat initial", -60);
        MaterialMovement stock19 = createStockMovement(m22, 4, "Achat initial", -60);
        MaterialMovement stock20 = createStockMovement(m23, 2, "Achat initial", -60);
        MaterialMovement stock21 = createStockMovement(m24, 3, "Achat initial", -60);
        MaterialMovement stock22 = createStockMovement(m25, 5, "Achat initial", -60);
        MaterialMovement stock23 = createStockMovement(m26, 4, "Achat initial", -60);
        MaterialMovement stock24 = createStockMovement(m27, 10, "Achat initial", -60);
        MaterialMovement stock25 = createStockMovement(m29, 15, "Achat initial", -60);
        MaterialMovement stock26 = createStockMovement(m30, 20, "Achat initial", -60);
        MaterialMovement stock27 = createStockMovement(m34, 2, "Achat initial", -60);
        MaterialMovement stock28 = createStockMovement(m35, 1, "Achat initial", -60);
        MaterialMovement stock29 = createStockMovement(m36, 2, "Achat initial", -60);
        MaterialMovement stock30 = createStockMovement(m37, 50, "Achat initial", -60);
        MaterialMovement stock31 = createStockMovement(m38, 100, "Achat initial", -60);
        MaterialMovement stock32 = createStockMovement(m39, 30, "Achat initial", -60);
        MaterialMovement stock33 = createStockMovement(m40, 5, "Achat initial", -60);

        materialMovementRepository.saveAll(List.of(
                mv1, mv2, mv3, mv4, mv5, mv6, mv7, mv8, mv9, mv10,
                mv11, mv12, mv13, mv14, mv15, mv16, mv17, mv18, mv19, mv20, mv21, mv22,
                stock1, stock2, stock3, stock4, stock5, stock6, stock7, stock8, stock9, stock10,
                stock11, stock12, stock13, stock14, stock15, stock16, stock17, stock18, stock19, stock20,
                stock21, stock22, stock23, stock24, stock25, stock26, stock27, stock28, stock29, stock30,
                stock31, stock32, stock33
        ));

        // =====================================================================
        // MAINTENANCES
        // =====================================================================

        // Maintenance planifiée
        Maintenance maint1 = createMaintenance(m1, "Calibrage annuel", "Calibrage métrologique station totale Leica",
                Maintenance.MaintenanceStatus.PLANNED, new BigDecimal("450.00"), "Leica Geosystems France",
                10, null, false, null);

        // Maintenance en cours
        Maintenance maint2 = createMaintenance(m3, "Réparation optique", "Remplacement prisme endommagé",
                Maintenance.MaintenanceStatus.IN_PROGRESS, new BigDecimal("1200.00"), "Topcon France",
                -5, null, true, "CHG-2024-001");

        Maintenance maint3 = createMaintenance(m7, "Réparation antenne", "Remplacement antenne GNSS défectueuse",
                Maintenance.MaintenanceStatus.IN_PROGRESS, new BigDecimal("850.00"), "Trimble France",
                -3, null, true, "CHG-2024-002");

        // Maintenance terminée
        Maintenance maint4 = createMaintenance(m2, "Révision complète", "Maintenance préventive annuelle",
                Maintenance.MaintenanceStatus.COMPLETED, new BigDecimal("320.00"), "Trimble France",
                -30, -25, false, null);

        Maintenance maint5 = createMaintenance(m8, "Nettoyage optique", "Nettoyage et ajustement niveau optique",
                Maintenance.MaintenanceStatus.COMPLETED, new BigDecimal("95.00"), "Atelier interne",
                -15, -14, false, null);

        Maintenance maint6 = createMaintenance(m19, "Étalonnage", "Étalonnage courantomètre - certificat COFRAC",
                Maintenance.MaintenanceStatus.COMPLETED, new BigDecimal("280.00"), "OTT HydroMet",
                -45, -40, true, "CHG-2023-015");

        // Maintenance annulée
        Maintenance maint7 = createMaintenance(m33, "Réparation tête impression", "Remplacement tête d'impression",
                Maintenance.MaintenanceStatus.CANCELLED, new BigDecimal("1500.00"), "Canon France",
                -20, null, false, null);

        // Maintenances diverses
        Maintenance maint8 = createMaintenance(m18, "Réparation scissomètre", "Remplacement ressort de torsion",
                Maintenance.MaintenanceStatus.IN_PROGRESS, new BigDecimal("180.00"), "Eijkelkamp",
                -2, null, false, null);

        Maintenance maint9 = createMaintenance(m21, "Mise à jour système", "Installation Windows 11 et logiciels topo",
                Maintenance.MaintenanceStatus.COMPLETED, new BigDecimal("0.00"), "Service informatique",
                -7, -6, false, null);

        Maintenance maint10 = createMaintenance(m34, "Révision véhicule", "Révision 60000km + contrôle technique",
                Maintenance.MaintenanceStatus.COMPLETED, new BigDecimal("780.00"), "Peugeot Pro",
                -20, -19, true, "CHG-2024-003");

        Maintenance maint11 = createMaintenance(m35, "Vidange + pneus", "Vidange complète et remplacement pneus",
                Maintenance.MaintenanceStatus.PLANNED, new BigDecimal("1200.00"), "Toyota Concessionnaire",
                15, null, false, null);

        Maintenance maint12 = createMaintenance(m31, "Maintenance traceur", "Remplacement têtes et nettoyage",
                Maintenance.MaintenanceStatus.PLANNED, new BigDecimal("650.00"), "HP Enterprise",
                5, null, false, null);

        maintenanceRepository.saveAll(List.of(maint1, maint2, maint3, maint4, maint5, maint6,
                maint7, maint8, maint9, maint10, maint11, maint12));

        // =====================================================================
        // HISTORIQUE DES ÉTATS
        // =====================================================================

        // États pour m3 (Station Topcon endommagée)
        MaterialState state1 = createState(m3, Material.MaterialCondition.GOOD, "État initial à l'achat", "Admin", -365);
        MaterialState state2 = createState(m3, Material.MaterialCondition.DAMAGED, "Chute lors transport", "Jean Dupont", -10);

        // États pour m7 (GPS en réparation)
        MaterialState state3 = createState(m7, Material.MaterialCondition.GOOD, "État initial", "Admin", -400);
        MaterialState state4 = createState(m7, Material.MaterialCondition.DAMAGED, "Problème antenne détecté", "Marie Curie", -20);
        MaterialState state5 = createState(m7, Material.MaterialCondition.IN_REPAIR, "Envoyé en réparation Trimble", "Sophie Martin", -3);

        // États pour m18 (Scissomètre endommagé)
        MaterialState state6 = createState(m18, Material.MaterialCondition.GOOD, "État initial", "Admin", -500);
        MaterialState state7 = createState(m18, Material.MaterialCondition.DAMAGED, "Ressort cassé lors utilisation", "Lucas Bernard", -5);

        // États pour m28 (Tablette retirée)
        MaterialState state8 = createState(m28, Material.MaterialCondition.GOOD, "État initial", "Admin", -800);
        MaterialState state9 = createState(m28, Material.MaterialCondition.DAMAGED, "Écran fissuré", "Pierre Lambert", -200);
        MaterialState state10 = createState(m28, Material.MaterialCondition.BROKEN, "Carte mère HS - irréparable", "Service IT", -50);

        // États pour m33 (Traceur en maintenance)
        MaterialState state11 = createState(m33, Material.MaterialCondition.GOOD, "État initial", "Admin", -600);
        MaterialState state12 = createState(m33, Material.MaterialCondition.DAMAGED, "Problème qualité impression", "Julie Roux", -25);

        // États pour m16 (Pénétromètre retour maintenance)
        MaterialState state13 = createState(m16, Material.MaterialCondition.GOOD, "État initial", "Admin", -300);
        MaterialState state14 = createState(m16, Material.MaterialCondition.DAMAGED, "Usure tige - recalibrage nécessaire", "Lucas Bernard", 0);

        materialStateRepository.saveAll(List.of(state1, state2, state3, state4, state5, state6,
                state7, state8, state9, state10, state11, state12, state13, state14));

        System.out.println("=== Initialisation des données terminée avec succès ===");
        System.out.println("  - " + categoryRepository.count() + " catégories créées");
        System.out.println("  - " + materialRepository.count() + " matériels créés");
        System.out.println("  - " + declarationRepository.count() + " déclarations créées");
        System.out.println("  - " + materialMovementRepository.count() + " mouvements créés");
        System.out.println("  - " + maintenanceRepository.count() + " maintenances créées");
        System.out.println("  - " + materialStateRepository.count() + " états créés");
    }

    // =====================================================================
    // MÉTHODES UTILITAIRES
    // =====================================================================

    private MaterialCategory createCategory(String name, MaterialCategory parent) {
        MaterialCategory category = new MaterialCategory();
        category.setName(name);
        category.setParent(parent);
        return category;
    }

    private Material createMaterial(String name, MaterialCategory category, String description,
                                     Material.MaterialCondition condition, MaterialState.MaterialStatus status,
                                     String purchaseId) {
        Material material = new Material();
        material.setName(name);
        material.setCategory(category);
        material.setDescription(description);
        material.setCurrentCondition(condition);
        material.setStatus(status);
        material.setPurchaseId(purchaseId);
        material.setReference("MAT-" + LocalDateTime.now().getYear() + "-" + String.format("%04d", (int)(Math.random() * 10000)));
        material.setSerialNumber("SN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        material.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 365)));
        material.setUpdatedAt(LocalDateTime.now());
        return material;
    }

    private OutgoingDeclaration createOutgoingDeclaration(String declaredBy, String usagePurpose,
                                                           Declaration.DeclarationStatus status, String validatedBy,
                                                           String note, int daysOffset) {
        OutgoingDeclaration declaration = new OutgoingDeclaration();
        declaration.setDeclaredBy(declaredBy);
        declaration.setUsagePurpose(usagePurpose);
        declaration.setStatus(status);
        declaration.setValidatedBy(validatedBy);
        declaration.setNote(note);
        declaration.setDeclarationDate(LocalDateTime.now().plusDays(daysOffset));
        if (validatedBy != null) {
            declaration.setValidateBy(validatedBy);
        }
        return declaration;
    }

    private ReturnDeclaration createReturnDeclaration(String declaredBy, String returnConditionNote,
                                                       Declaration.DeclarationStatus status, String verifiedBy,
                                                       String note, int daysOffset) {
        ReturnDeclaration declaration = new ReturnDeclaration();
        declaration.setDeclaredBy(declaredBy);
        declaration.setReturnConditionNote(returnConditionNote);
        declaration.setStatus(status);
        declaration.setVerifiedBy(verifiedBy);
        declaration.setNote(note);
        declaration.setDeclarationDate(LocalDateTime.now().plusDays(daysOffset));
        if (verifiedBy != null) {
            declaration.setVerifiedAt(LocalDateTime.now().plusDays(daysOffset).plusHours(2));
            declaration.setValidateBy(verifiedBy);
        }
        return declaration;
    }

    private MaterialMovement createMovement(Material material, int quantity, OutgoingDeclaration outgoing,
                                             ReturnDeclaration returnDecl, MaterialMovement.MovementStatus status,
                                             Material.MaterialCondition condition, String createdBy,
                                             String validatedBy, int daysOffset) {
        MaterialMovement movement = new MaterialMovement();
        movement.setMaterial(material);
        movement.setQuantity(-quantity); // Négatif pour les sorties
        movement.setOutgoingDeclaration(outgoing);
        movement.setReturnDeclaration(returnDecl);
        movement.setStatus(status);
        movement.setCondition(condition);
        movement.setCreatedBy(createdBy);
        movement.setValidatedBy(validatedBy);
        movement.setCreatedAt(LocalDateTime.now().plusDays(daysOffset));
        movement.setMovementDate(LocalDateTime.now().plusDays(daysOffset));
        if (validatedBy != null) {
            movement.setValidatedAt(LocalDateTime.now().plusDays(daysOffset).plusHours(1));
        }
        if (returnDecl != null) {
            movement.setVerifiedBy(returnDecl.getVerifiedBy());
        }
        return movement;
    }

    private MaterialMovement createStockMovement(Material material, int quantity, String note, int daysOffset) {
        MaterialMovement movement = new MaterialMovement();
        movement.setMaterial(material);
        movement.setQuantity(quantity); // Positif pour les entrées en stock
        movement.setStatus(MaterialMovement.MovementStatus.VERIFIED);
        movement.setCondition(Material.MaterialCondition.GOOD);
        movement.setCreatedBy("Admin Stock");
        movement.setValidatedBy("Admin Stock");
        movement.setVerifiedBy("Admin Stock");
        movement.setCreatedAt(LocalDateTime.now().plusDays(daysOffset));
        movement.setValidatedAt(LocalDateTime.now().plusDays(daysOffset));
        movement.setMovementDate(LocalDateTime.now().plusDays(daysOffset));
        return movement;
    }

    private Maintenance createMaintenance(Material material, String type, String description,
                                           Maintenance.MaintenanceStatus status, BigDecimal cost,
                                           String performedBy, int startDaysOffset, Integer endDaysOffset,
                                           boolean linkedToCharge, String chargeId) {
        Maintenance maintenance = new Maintenance();
        maintenance.setMaterial(material);
        maintenance.setMaintenanceType(type);
        maintenance.setDescription(description);
        maintenance.setStatus(status);
        maintenance.setCost(cost);
        maintenance.setPerformedBy(performedBy);
        maintenance.setStartDate(LocalDateTime.now().plusDays(startDaysOffset));
        if (endDaysOffset != null) {
            maintenance.setEndDate(LocalDateTime.now().plusDays(endDaysOffset));
        }
        maintenance.setLinkedToCharge(linkedToCharge);
        maintenance.setChargeId(chargeId);
        return maintenance;
    }

    private MaterialState createState(Material material, Material.MaterialCondition condition,
                                       String description, String updatedBy, int daysOffset) {
        MaterialState state = new MaterialState();
        state.setMaterial(material);
        state.setState(condition);
        state.setDescription(description);
        state.setUpdatedBy(updatedBy);
        state.setDate(LocalDateTime.now().plusDays(daysOffset));
        return state;
    }
}
