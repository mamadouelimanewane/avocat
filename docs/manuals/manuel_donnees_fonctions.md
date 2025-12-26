# Structure des Données et des Fonctions - LexPremium ERP

## 1. Modèle de Données (Schema)
LexPremium utilise un schéma relationnel flexible optimisé pour MongoDB Atlas. Voici les entités principales :

### A. Entités Centrales
- **User** : Gère les avocats et collaborateurs (Rôles, Taux horaires, Permissions).
- **Client** : Stocke les informations des particuliers et entreprises, incluant leurs codes comptables auxiliaires.
- **Dossier** : L'entité pivot liant les pièces (GED), les factures et les événements d'audience.

### B. Modules Financiers
- **Facture** : Gère les honoraires, les taxes (TVA) et le statut de paiement.
- **Transaction** : Enregistrement comptable conforme au système SYSCOHADA (Débit/Crédit).
- **Account** : Plan comptable structuré (Classe 1 à 8).

### C. Modules de Support
- **Document** : Métadonnées des fichiers avec gestion de versions.
- **Task** : Système de kanban et de délégation.
- **CommunicationLog** : Historique des interactions WhatsApp, Mail et Appel.

## 2. Fonctions et Logique Métier (Server Actions)
La logique de l'application est découpée en fonctions serveur sécurisées situées dans `app/actions.ts`.

### A. Gestion du Cabinet
- `createDossier` : Initialise une affaire et crée l'arborescence documentaire.
- `updateInvoiceStatus` : Gère le cycle de vie d'une facture et déclenche automatiquement l'envoi d'email et l'écriture comptable.

### B. Intelligence Artificielle
- `generateCompletion` : Interface avec OpenAI/Deepseek pour le chat assisté.
- `analyzeDocument` : Fonction d'extraction de données clés depuis des PDF via OCR et IA.

### C. Utilitaires
- `sendEmail` : Wrapper pour le service Resend.
- `logCommunication` : Assure la traçabilité des échanges clients.

## 3. Flux d'Intégration
Chaque action utilisateur (ex: créer une facture) déclenche une cascade de fonctions :
1. Validation des données (Zod).
2. Mise à jour de la base de données (Prisma).
3. Notification (Mail/WhatsApp).
4. Mise à jour de la comptabilité générale.
