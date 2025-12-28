# Manuel des Structures de Données et Fonctions Algorithmiques

## 1. Dictionnaire des Données (Data Dictionary)
Ce chapitre définit les entités atomiques qui composent l'univers LexPremium.

### 1.1 Entité `User` (Le Capital Humain)
- `id` : Identifiant unique (BSON ObjectId).
- `role` : Typologie d'utilisateur (ADMIN, AVOCAT, COLLABORATEUR).
- `permissions` : Tableau binaire ou JSON de droits granulaires.
- `hourlyRate` : Base de calcul de la rentabilité (Standard: FCFA).

### 1.2 Entité `Dossier` (L'Atome Métier)
- `reference` : Clé unique métier (Unique Index).
- `status` : Machine à états (OUVERT -> EN_ATTENTE -> CLOTURE -> ARCHIVE).
- `metadata` : Champs extensibles pour le type de procédure (Civil, Pénal, Arbitrage).

### 1.3 Entité `Facture` (Le Flux Financier)
- `number` : Numérotation chronologique continue (Garantie légale).
- `items` : Sous-collection contenant les lignes de prestations (Description, Qté, Prix).
- `tvaRate` : Taux dynamique (Par défaut 18%).

## 2. Algorithmes et Fonctions Core
Les fonctions sont implémentées en tant que `Server Actions` pour une sécurité maximale.

### 2.1 Calcul de Rentabilité
`calculateProfitability(dossierId)` :
1. Récupère le total des honoraires facturés.
2. Soustrait les débours (frais de justice).
3. Soustrait le (Temps passé * Taux horaire du collaborateur).
4. Retourne la marge nette réelle.

### 2.2 Moteur d'Extraction IA (LexParser)
`analyzeDocument(fileId)` :
1. Envoie le flux binaire à l'API OCR (Tesseract ou OpenAI Vision).
2. Analyse le texte brut via un modèle NLP (Natural Language Processing).
3. Extrait les entités nommées (Dates, Juridictions, Sommes, Articles de loi).
4. Met à jour les métadonnées du dossier.

### 2.3 Système de Notification Automatisé
`triggerNotification(type, payload)` :
- **Email** : Forge un template HTML via Resend.
- **WhatsApp** : Formate une URL encodée pour l'ouverture de session wa.me.

## 3. Schéma Relationnel et Intégrité
Bien que NoSQL, le système maintient une intégrité référentielle :
- **Cascade Deletion** : La suppression d'un dossier (réservée à l'admin) entraîne le marquage "Soft-Delete" des documents liés.
- **Relational Mapping** : Utilisation des relations `@relation` de Prisma pour lier les factures aux clients et aux dossiers sans duplication d'information.

## 4. Performance des Requêtes
- **Indexes** : Indexation sur les champs `email`, `reference`, `clientId` et `status` pour garantir des temps de réponse inférieurs à 50ms sur des bases de 100 000 dossiers.
- **Caching** : Utilisation du cache d'instance pour les données de configuration (Paramètres du cabinet).

## 5. Extensions et Scalabilité du Schéma
Le schéma est conçu pour être "backward compatible". L'ajout de nouveaux champs se fait via des types optionnels (`?`) dans Prisma, évitant toute rupture de service lors des mises à jour.
