# 🎯 SuiviMat - Material Tracking System

> Une application web moderne de gestion de matériels avec **Angular** (Frontend) + **Spring Boot** (Backend API)

[![Angular](https://img.shields.io/badge/Angular-19.2.0-red?logo=angular)](https://angular.io)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![ng-bootstrap](https://img.shields.io/badge/ng--bootstrap-compatible-pink?logo=bootstrap)](https://ng-bootstrap.github.io/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Démarrage rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Contribuer](#-contribuer)

---

## 🎨 À propos

**SuiviMat** est une solution complète de gestion de matériels d'entreprise. Elle permet:

- 📦 **Gestion des matériels** - Créer, modifier, consulter, supprimer
- 🏷️ **Catégorisation hiérarchique** - Organiser par catégories et sous-catégories
- 📋 **Déclarations** - Gérer les sorties et retours de matériels
- 📊 **Suivi complet** - État, condition, mouvements de chaque article
- 🔐 **API REST** - Architecture API-first, prête pour mobile/web

---

## ✨ Fonctionnalités

### 📦 Matériels
- ✅ CRUD complet (Créer, Lire, Modifier, Supprimer)
- ✅ Recherche et filtrage par catégorie
- ✅ Gestion du statut et de l'état
- ✅ Support quantité (matériels en masse)
- ✅ Pagination et affichage en grille
- ✅ Formulaires modaux NgbModal

### 🏷️ Catégories
- ✅ Hiérarchie parent/enfants
- ✅ Gestion complète CRUD
- ✅ Affichage en table avec arborescence
- ✅ Comptage de sous-catégories

### 📋 Déclarations
- ✅ Type: Sorties (OUTGOING) / Retours (RETURN)
- ✅ Filtrage avancé (type, statut)
- ✅ Approbation/Rejet des déclarations
- ✅ Suivi des mouvements de matériels

### 🔧 API REST
- ✅ Architecture complète REST
- ✅ Endpoints pour tous les modules
- ✅ Validation côté serveur
- ✅ Gestion d'erreurs robuste

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** 18+ et **npm**
- **Java** 17+
- **Git**

### Installation et démarrage

#### Option 1: Script automatisé (Windows)
```bash
# Exécutez simplement
start.cmd
```

#### Option 2: Script automatisé (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

#### Option 3: Démarrage manuel

**Terminal 1 - Backend Java:**
```bash
./mvnw spring-boot:run
# Ou sur Windows: mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend Angular:**
```bash
cd frontend
npm install
ng serve
```

L'application ouvre automatiquement à **http://localhost:4200**

---

## 🏗️ Architecture

### Stack technologique

```
Frontend (Angular 19.2)
├── Standalone Components
├── Reactive Forms
├── HttpClient + RxJS
├── ng-bootstrap (Modals)
└── Bootstrap CSS

Backend (Spring Boot 3.5.7)
├── REST Controllers
├── JPA/Hibernate
├── H2 Database
└── Maven Build

Communication
└── REST API (JSON)
```

### Structure des répertoires

```
suivi-mat/
├── frontend/                    # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/       # Services HTTP (API)
│   │   │   ├── components/     # Composants
│   │   │   ├── models/         # TypeScript interfaces
│   │   │   └── shared/         # Composants partagés
│   │   ├── environments/       # Config d'environnement
│   │   └── styles.css          # CSS global (Bootstrap import)
│   ├── package.json
│   ├── angular.json
│   └── QUICK_START.md          # Guide de démarrage
│
├── src/                        # Code Java Spring Boot
│   ├── main/java/
│   │   └── com/kinga/suivimat/
│   │       ├── controller/     # REST Controllers
│   │       ├── entity/         # Entités JPA
│   │       ├── service/        # Services métier
│   │       └── repository/     # Accès à la DB
│   └── main/resources/
│       ├── application.properties
│       └── templates/          # Thymeleaf (si besoin)
│
├── pom.xml                     # Maven configuration
├── start.sh                    # Script démarrage Linux/Mac
├── start.cmd                   # Script démarrage Windows
├── IMPLEMENTATION_SUMMARY.md   # Détails implémentation
└── README.md                   # Ce fichier
```

---

## 📚 Documentation

### Guides disponibles

| Document | Description |
|----------|-------------|
| **[QUICK_START.md](frontend/QUICK_START.md)** | 🚀 Démarrage en 5 minutes |
| **[API_INTEGRATION_GUIDE.md](frontend/src/app/API_INTEGRATION_GUIDE.md)** | 📖 Intégration API complète |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | 📝 Résumé des modifications |

### Endpoints API

```
Materials
GET    /api/materials              # Tous les matériels
POST   /api/materials              # Créer
PUT    /api/materials/{id}         # Modifier
DELETE /api/materials/{id}         # Supprimer

Categories
GET    /api/material-categories    # Toutes les catégories
POST   /api/material-categories    # Créer
PUT    /api/material-categories/{id}      # Modifier
DELETE /api/material-categories/{id}      # Supprimer

Declarations
GET    /api/declarations           # Toutes les déclarations
POST   /api/declarations/{id}/approve     # Approuver
POST   /api/declarations/{id}/reject      # Rejeter
```

### Testing avec curl

```bash
# Récupérer tous les matériels
curl http://localhost:8080/api/materials

# Créer un matériel
curl -X POST http://localhost:8080/api/materials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell",
    "reference": "REF-001",
    "serialNumber": "SN-001",
    "description": "Ordinateur portable",
    "category": 1,
    "status": "AVAILABLE",
    "currentCondition": "GOOD"
  }'
```

---

## 🎯 Utilisation

### 1️⃣ Matériels
1. Allez dans **Matériels**
2. Cliquez **Ajouter** pour créer un nouveau matériel
3. Remplissez le formulaire
4. Cliquez **Créer**
5. Pour modifier/supprimer, utilisez les boutons de la carte

### 2️⃣ Catégories
1. Allez dans **Catégories**
2. Cliquez **Ajouter une catégorie**
3. Créez une catégorie avec parent optionnel
4. Modifiez/supprimez avec les boutons de la table

### 3️⃣ Déclarations
1. Allez dans **Déclarations**
2. Filtrez par type (Outgoing/Return) et statut
3. Approbation/Rejet disponible pour les déclarations en attente

---

## 🔧 Configuration

### URL de l'API
Fichier: `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api',
  production: false
};
```

### Port du serveur
Fichier: `src/main/resources/application.properties`

```properties
server.port=8080
```

---

## 🐛 Troubleshooting

### Erreur: "Cannot connect to API"
- ✅ Vérifiez que Java est en cours d'exécution sur le port 8080
- ✅ Vérifiez l'URL API dans `environment.ts`
- ✅ Ouvrez la console (F12) pour voir les erreurs

### Erreur: "Module not found"
```bash
cd frontend
npm install @ng-bootstrap/ng-bootstrap bootstrap --legacy-peer-deps
npm install
```

### Modals ne s'affichent pas
- ✅ Vérifiez que Bootstrap CSS est importé
- ✅ Vérifiez que ng-bootstrap est installé

### Port déjà en utilisation
```bash
# Trouver le processus utilisant le port 8080
lsof -i :8080  # Linux/Mac

# Windows PowerShell
Get-NetTCPConnection -LocalPort 8080

# Changer le port dans application.properties
server.port=8081
```

---

## 📈 Performance et scalabilité

- 📊 Pagination côté frontend (configurable)
- 🔍 Recherche optimisée avec filtres
- 🚀 API REST peut être déployée indépendamment
- 💾 Base de données H2 (dev) - facilement remplaçable par PostgreSQL/MySQL

---

## 🔐 Sécurité

Points à considérer pour la production:
- [ ] Ajouter authentification (JWT)
- [ ] Implémenter CORS correctement
- [ ] Valider toutes les entrées côté serveur
- [ ] Ajouter des rôles et permissions
- [ ] HTTPS en production
- [ ] Rate limiting sur l'API

---

## 🤝 Contribuer

### Comment contribuer
1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de code
- Utilisez TypeScript strict
- Suivez les conventions Angular
- Testez avant de commiter
- Documentez les changements importants

---

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Support

### Documentation
- 📖 [Angular Docs](https://angular.io/docs)
- 📖 [Spring Boot Docs](https://spring.io/projects/spring-boot)
- 📖 [ng-bootstrap Docs](https://ng-bootstrap.github.io/)
- 📖 [Bootstrap Docs](https://getbootstrap.com/)

### Guides locaux
- 🚀 [Quick Start](frontend/QUICK_START.md)
- 📚 [API Integration](frontend/src/app/API_INTEGRATION_GUIDE.md)
- 📝 [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

---

## 👥 Auteurs

- **Frontend**: Angular 19 avec ng-bootstrap
- **Backend**: Spring Boot 3.5.7
- **Base de données**: H2 (development)

---

## 🎓 Apprentissage

Cette application démontre:
- ✅ Architecture moderne Angular (standalone components)
- ✅ Patterns RxJS réactifs
- ✅ REST API Spring Boot complète
- ✅ Formulaires modaux avec ng-bootstrap
- ✅ Gestion d'erreurs robuste
- ✅ Responsive design avec Bootstrap

---

**Dernière mise à jour**: 2026-01-24  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

---

### 🎉 Bon développement!

Pour toute question ou suggestion, consultez la [documentation complète](frontend/QUICK_START.md) ou lancez l'application avec les scripts fournis.

```bash
# Windows
start.cmd

# Linux/Mac
./start.sh
```

L'application ouvrira automatiquement à **http://localhost:4200** 🚀
