# Feuille de Route - Sécurisation LexPremium

## Phase 1 : Urgences Absolues (Immédiat)
### Objectif : Combler les failles critiques d'accès

- [ ] **Suppression des Backdoors**
  - Retirer la condition `password === "demo123"` dans `loginStaff`.
  - Retirer la condition `code === "1234"` dans `loginClient`.
  - Forcer la définition d'un code d'accès client sécurisé à la création.

- [ ] **Durcissement de l'Authentification**
  - Implémenter `bcrypt.hash` dans `createUser`, `updateUser` et `updateUserPassword`.
  - Migrer tous les mots de passe existants vers des hashs (script de migration requis).
  - Vérifier UNIQUEMENT via `bcrypt.compare` lors du login.

- [ ] **Sécurisation des Sessions (JWT)**
  - Remplacer le stockage de l'ID brut dans le cookie par un **JWT signé** (Jason Web Token).
  - Inclure `userId`, `role`, et une date d'expiration dans le payload.
  - Signer le JWT avec une clé secrète forte (`JWT_SECRET` dans `.env`).
  - Vérifier la signature du JWT dans le `middleware.ts`.

## Phase 2 : Protection des Données et Fichiers (Court Terme)
### Objectif : Empêcher les fuites de données et l'exécution de code malveillant

- [ ] **Refonte du Système d'Upload**
  - Ne plus stocker dans `public/uploads`.
  - Utiliser un stockage privé (ex: dossier local sécurisé ou Blob Storage).
  - Créer une route API `GET /api/documents/:id` qui vérifie les droits avant de servir le fichier.
  - Valider le type MIME des fichiers (magic numbers) avant acceptation.

- [ ] **Contrôle d'Accès (RBAC/ABAC)**
  - Créer un utilitaire `verifyDossierAccess(userId, dossierId)` à appeler au début de chaque action.
  - S'assurer que les clients ne voient que leurs propres dossiers.

## Phase 3 : Durcissement et Monitoring (Moyen Terme)
### Objectif : Détection et Prévention avancée

- [ ] **Protection contre les Injections IA**
  - Sanitizer les entrées avant envoi à l'API OpenAI.
  - Utiliser des "System Prompts" renforcés pour délimiter les instructions des données.

- [ ] **Audit Logs (Journalisation)**
  - Enregistrer toutes les actions sensibles (connexion, suppression de document, modification de droits) dans une table `SecurityLog`.
  - Alerter les admins en cas de tentatives de connexion suspectes.

- [ ] **Rate Limiting**
  - Limiter le nombre de tentatives de connexion (ex: 5 essais / 15 min) pour bloquer le brute-force.

## Plan d'Action Technique (Script Migration)

1. Créer une clé secrète JWT.
2. Mettre à jour `actions.ts`.
3. Mettre à jour `middleware.ts`.
4. Lancer un script de migration pour hacher les mots de passe en clair existants.
