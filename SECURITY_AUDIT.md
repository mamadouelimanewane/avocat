# Audit de Sécurité - Application Avocat/LexPremium

## 1. Résumé Exécutif
L'audit de sécurité réalisé le 08/02/2026 révèle plusieurs vulnérabilités critiques mettant en péril la confidentialité et l'intégrité des données du cabinet et de ses clients. La présence de **portes dérobées (backdoors)**, d'une **gestion de session non sécurisée** et d'un **stockage de mots de passe en clair** nécessite une intervention immédiate.

**Score de Sécurité Global : CRITIQUE (2/10)**

## 2. Vulnérabilités Critiques (Priorité P0)

### 🚨 2.1 Backdoor "Master Password" (Authentification)
- **Localisation** : `app/actions.ts` - Fonction `loginStaff` (Lignes 3440-3442)
- **Description** : Le code contient une vérification `if (password === "demo123")` qui contourne toute validation de mot de passe réel.
- **Risque** : Tout attaquant connaissant ce mot de passe peut se connecter en tant qu'administrateur avec n'importe quelle adresse email (même fictive si le code attribue un ID par défaut).
- **Preuve** : 
  ```typescript
  if (password === "demo123") { isPasswordValid = true }
  ```

### 🔓 2.2 Authentification Client par Défaut
- **Localisation** : `app/actions.ts` - Fonction `loginClient` (Ligne 3552)
- **Description** : Si un client n'a pas défini de code d'accès, le système accepte automatiquement le code `'1234'`.
- **Risque** : Accès trivial aux dossiers clients si l'attaquant connaît l'email du client.

### 🍪 2.3 Détournement de Session (Session Hijacking)
- **Localisation** : `app/actions.ts` - Fonctions `loginStaff` et `loginClient`
- **Description** : Les cookies de session (`auth_token`, `portal_token`) contiennent directement l'ID de l'utilisateur/client en clair (ou base64 implicite). Il n'y a ni signature cryptographique ni jeton aléatoire.
- **Risque** : Un attaquant qui devine ou force l'ID d'un utilisateur (format MongoDB ObjectId) peut forger un cookie et usurper l'identité de n'importe qui (Administrateur ou Client).

## 3. Vulnérabilités Majeures (Priorité P1)

### 🔑 3.1 Stockage de Mots de Passe en Clair
- **Localisation** : `app/actions.ts` - `updateUserPassword` (Ligne 3514) et `loginStaff` (Ligne 3446)
- **Description** : 
  - La fonction de mise à jour enregistre le nouveau mot de passe directement en texte clair dans la base de données sans le hacher (Bcrypt est importé mais non utilisé ici).
  - La fonction de connexion compare le mot de passe en clair avant de vérifier le hash, ce qui indique que la base contient des mots de passe non protégés.
- **Risque** : En cas de fuite de la base de données (SQL Dump ou Injection), tous les mots de passe sont compromis instantanément.

### 📂 3.2 Upload de Fichiers Non Sécurisé
- **Localisation** : `app/actions.ts` - `uploadDocument`
- **Description** : 
  - Les fichiers sont stockés dans le dossier public (`public/uploads`) accessible directement via le navigateur.
  - Aucune validation du contenu du fichier (MIME type réel vs extension).
  - Pas de vérification des droits : un utilisateur peut uploader un fichier dans le dossier d'un autre (IDOR).
- **Risque** : Exécution de code malveillant (si configuration serveur permissive), XSS via upload HTML/SVG, ou saturation de stockage.

### 🛡️ 3.3 Absence de Contrôle d'Accès (IDOR)
- **Localisation** : Diverses Server Actions (`createDossier`, `uploadDocument`, etc.)
- **Description** : Les actions prennent des IDs (ex: `dossierId`, `clientId`) en paramètre sans vérifier si l'utilisateur connecté a le droit d'accéder à ces ressources spécifiques.
- **Risque** : Un avocat pourrait accéder ou modifier les dossiers confidentiels d'un autre avocat ou cabinet (si multi-tenant).

## 4. Vulnérabilités Modérées (Priorité P2)

### 🤖 4.1 Injection de Prompt IA
- **Localisation** : `generateAIDocument`, `analyzeOpposingDocument`
- **Description** : Les données utilisateur (description, contenu OCR) sont insérées directement dans les prompts envoyés à OpenAI sans sanitization stricte.
- **Risque** : Un utilisateur malveillant pourrait manipuler l'IA pour lui faire ignorer ses consignes de sécurité ou générer du contenu inapproprié.

### ⚠️ 4.2 Gestion des Erreurs
- **Description** : Certaines erreurs retournent des messages génériques, mais les logs serveurs (`console.error`) peuvent exposer des données sensibles dans les environnements de production si non filtrés.

## 5. Recommandations Immédiates

1.  **Supprimer le code "demo123" et "1234" immédiatement.**
2.  **Implémenter Bcrypt systématiquement** pour tout stockage de mot de passe.
3.  **Remplacer les cookies d'ID brut par des sessions sécurisées** (JWT signé ou Session ID aléatoire stocké en Redis/DB).
4.  **Sécuriser l'upload** : Stocker les fichiers hors de la racine publique (ex: S3 ou dossier privé) et servir via une route API authentifiée.
5.  **Ajouter des politiques d'autorisation** (Policy check) au début de chaque Server Action sensible.

---
*Audit généré par l'Assistant de Sécurité LexPremium*
