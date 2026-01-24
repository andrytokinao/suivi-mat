# Quick Start Guide - SuiviMat Angular + Java API

## 🚀 Démarrage rapide en 5 minutes

### Prérequis
- Node.js 18+ installé
- Java 17+ installé
- Port 4200 (Angular) et 8080 (Java API) disponibles

### Étape 1: Installation des dépendances Frontend

```bash
cd frontend
npm install
```

*L'installation des dépendances ng-bootstrap et bootstrap a déjà été faite.*

### Étape 2: Démarrer le serveur Java

```bash
# À la racine du projet
./mvnw spring-boot:run
```

**Ou sur Windows:**
```bash
mvnw.cmd spring-boot:run
```

Attendez que vous voyiez:
```
Started SuiviMatApplication in X.XXX seconds
```

### Étape 3: Démarrer le serveur Angular

```bash
# Dans le répertoire frontend
cd frontend
ng serve
```

Ou directement:
```bash
npm start
```

### Étape 4: Accédez à l'application

Ouvrez votre navigateur et allez à:
```
http://localhost:4200
```

## ✅ Vérification que tout fonctionne

### 1. Matériels
- Allez à **Matériels** → vous devriez voir une liste chargée depuis l'API
- Cliquez sur **Ajouter** → un formulaire modal s'ouvre
- Remplissez le formulaire et cliquez **Créer**
- Vous pouvez modifier/supprimer chaque matériel

### 2. Catégories
- Allez à **Catégories** → vous devriez voir les catégories de l'API
- Cliquez sur **Ajouter une catégorie** → formulaire modal
- Créez une nouvelle catégorie avec un parent optionnel

### 3. Déclarations
- Allez à **Déclarations** → liste des déclarations
- Filtrez par type (Outgoing/Return) ou statut
- Approbation/Rejet des déclarations en attente

## 🔧 Paramètres de configuration

### URL de l'API
Définie dans: `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api',
  production: false
};
```

### Port du serveur Java
Défini dans: `src/main/resources/application.properties`

Vérifiez:
```properties
server.port=8080
```

## 📊 Endpoints de test

Vous pouvez tester les endpoints directement avec curl:

```bash
# Lister tous les matériels
curl http://localhost:8080/api/materials

# Créer un matériel
curl -X POST http://localhost:8080/api/materials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Material",
    "reference": "REF-TEST-001",
    "serialNumber": "SN-TEST-001",
    "description": "Test description",
    "category": 1,
    "status": "AVAILABLE",
    "currentCondition": "GOOD",
    "purchaseId": "P001"
  }'
```

## 🐛 Problèmes courants et solutions

### "Cannot GET http://localhost:4200"
✓ Assurez-vous que `ng serve` est en cours d'exécution
✓ Vérifiez que le port 4200 n'est pas utilisé

### "API is not reachable"
✓ Vérifiez que `./mvnw spring-boot:run` est en cours d'exécution
✓ Confirmez l'URL API dans `environment.ts`
✓ Vérifiez les logs de la console (F12)

### "Module not found: @ng-bootstrap/ng-bootstrap"
```bash
npm install @ng-bootstrap/ng-bootstrap bootstrap --legacy-peer-deps
npm install
```

### Erreurs CORS
Si vous voyez des erreurs CORS, ajoutez cette configuration à votre contrôleur Java:

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class YourController {
    // ...
}
```

## 📁 Structure de fichiers principaux

```
frontend/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── api.service.ts          ← Service HTTP base
│   │   │   ├── material.service.ts     ← API matériels
│   │   │   ├── category.service.ts     ← API catégories
│   │   │   └── declaration.service.ts  ← API déclarations
│   │   ├── components/
│   │   │   ├── materials/
│   │   │   │   ├── material-list/      ← Liste des matériels
│   │   │   │   └── material-form/      ← Modal formulaire
│   │   │   ├── categories/
│   │   │   │   ├── category-list/      ← Liste des catégories
│   │   │   │   └── category-form/      ← Modal formulaire
│   │   │   └── declarations/
│   │   │       └── declaration-list/   ← Liste déclarations
│   │   └── app.config.ts               ← Config Angular (HttpClient)
│   ├── environments/
│   │   └── environment.ts              ← Config API URL
│   └── styles.css                      ← Bootstrap CSS import
└── package.json
```

## 🔄 Flux complet d'une opération

### Créer un matériel:
1. Click "Ajouter" → `material-list.component.ts`
2. Ouvre Modal → `material-form.component.ts`
3. Remplit formulaire → Form validation
4. Click "Créer" → `MaterialService.addMaterial()`
5. HTTP POST → `ApiService.post()` → `http://localhost:8080/api/materials`
6. Reçoit réponse → MAJ BehaviorSubject dans `MaterialService`
7. Composant s'abonne → MAJ affichage liste
8. Modal se ferme

## 💡 Conseils d'utilisation

1. **Lors du développement** : Maintenez les deux serveurs en arrière-plan
2. **Pour déboguer** : Ouvrez la console (F12) pour voir les requêtes HTTP
3. **Pour les formulaires** : Les validations côté client sont actives
4. **Pour les suppressions** : Une confirmation est demandée
5. **États de chargement** : Un spinner s'affiche pendant les requêtes

## 📚 Ressources supplémentaires

- **Guide d'intégration complet** : `frontend/src/app/API_INTEGRATION_GUIDE.md`
- **NgBootstrap Docs** : https://ng-bootstrap.github.io/
- **Angular HttpClient** : https://angular.io/guide/http
- **Bootstrap CSS** : https://getbootstrap.com/

## 🎯 Points clés de cette implémentation

✅ **API REST complète** - Tous les CRUD (Create, Read, Update, Delete)
✅ **NgbModal** - Formulaires modaux professionnels
✅ **RxJS** - Gestion réactive des données
✅ **Validation** - Côté client avec Reactive Forms
✅ **Gestion d'erreurs** - Try/catch et messages d'erreur
✅ **États de chargement** - Spinners et boutons désactivés
✅ **Recherche et filtrage** - En temps réel
✅ **Pagination** - Côté frontend

---

**Dernière mise à jour**: 2026-01-24
**Version Angular**: 19.2.0
**Version ng-bootstrap**: Compatible avec Angular 19
