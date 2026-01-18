# Angular CLI – FICHIER UNIQUE DES COMMANDES

## Objectif
Ce document UNIQUE contient TOUTES les commandes Angular CLI nécessaires pour générer exactement la structure fournie par l’utilisateur. Le fichier est copiable, imprimable et téléchargeable.

---

## 1. Création du projet

```bash
ng new frontend
cd frontend 

npm install @angular/material@19 @angular/cdk@19
```

---

## 2. Models

```bash
ng generate interface app/models/material
ng generate interface app/models/category
ng generate interface app/models/declaration
```

```bash
touch src/app/models/enums.ts
```

---

## 3. Services

```bash
ng generate service app/services/material
ng generate service app/services/category
ng generate service app/services/declaration
```

---

## 4. Layout

```bash
ng generate component app/components/layout/sidebar --skip-tests
ng generate component app/components/layout/header --skip-tests
```

---

## 5. Declarations

```bash
ng generate component app/components/declarations/outgoing-declaration --skip-tests
ng generate component app/components/declarations/return-declaration --skip-tests
ng generate component app/components/declarations/declaration-list --skip-tests
```

---

## 6. Materials

```bash
ng generate component app/components/materials/material-list --skip-tests
ng generate component app/components/materials/material-form --skip-tests
```

---

## 7. Categories

```bash
ng generate component app/components/categories/category-list --skip-tests
ng generate component app/components/categories/category-form --skip-tests
```

---

## 8. Admin

```bash
ng generate component app/components/admin/validation-list --skip-tests
ng generate component app/components/admin/validation-detail --skip-tests
```

---

## 9. Routing principal

```bash
ng generate module app-routing --flat --module=app
```

---

## 10. Lancer le projet

```bash
ng serve -o
```

---

## Résultat attendu

La structure générée correspond exactement à :

```text
src/
└── app/
    ├── models/
    ├── services/
    ├── components/
    │   ├── layout/
    │   ├── declarations/
    │   ├── materials/
    │   ├── categories/
    │   └── admin/
    ├── app-routing.module.ts
    ├── app.component.*
    └── app.module.ts
```

---

Fin du fichier.

