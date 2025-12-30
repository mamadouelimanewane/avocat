# Manuel Technique de Haute Performance - LexPremium ERP
![[ai_concept.png]]

## AVANT-PROPOS
Ce manuel détaille l'architecture logicielle de *LexPremium ERP*. Il est destiné aux responsables informatiques ou aux auditeurs techniques souhaitant comprendre pourquoi cette solution est la plus avancée du marché pour les cabinets d'avocats modernes. Chaque terme en *Marron* identifie une technologie ou un module de l'architecture.

---

## CHAPITRE 1 : LA STACK TECHNOLOGIQUE PRO-GRADE
*LexPremium* repose sur une architecture "Full Cloud" et "Serverless", garantissant une rapidité record et une sécurité maximale.

### 1.1 Le Framework de Référence : Next.js 14
Nous utilisons la toute dernière version de Next.js avec son moteur de rendu par composants serveurs.
- *Server Components* : Cette technologie permet de traiter la logique métier complexe directement sur nos serveurs haute performance. Résultat attendu : une réduction massive du code envoyé vers votre navigateur, assurant une fluidité parfaite même sur des ordinateurs ou mobiles anciens.
- *Streaming & Suspense* : Le logiciel affiche les éléments de l'interface de manière progressive. Résultat attendu : même avec des listes de milliers de dossiers, l'écran de travail s'affiche en moins d'une seconde.

### 1.2 Persistance des Données : MongoDB Atlas
Le choix d'une base de données NoSQL (Orientée documents) est stratégique pour le monde juridique.
- *Schéma Flexible* : Contrairement aux anciens logiciels rigides, *LexPremium* peut évoluer sans interruption de service pour ajouter de nouveaux champs (ex: nouvelles étapes procédurales OHADA).
- *Prisma ORM* : C'est la couche de sécurité qui assure le lien entre le code et la donnée. Résultat attendu : une intégrité parfaite de chaque transaction financière ou archivage d'acte.

---

## CHAPITRE 2 : L'ENGINE D'INTELLIGENCE ARTIFICIELLE
Le cœur de l'innovation de *LexPremium* réside dans son intégration profonde de l'IA générative.

### 2.1 LexAI : Le Cerveau du Cabinet
- *Moteur de Dialogue contextuel* : Basé sur les modèles les plus puissants au monde (GPT-4o), il est configuré avec une base de connaissances spécifique au Droit Civil et à l'Acte Unique OHADA.
- *Extraction de Données (OCR)* : Utilise désormais **Tesseract.js** (basé sur le moteur Google Tesseract LSTM). Résultat attendu : capable de lire des photos de mauvaise qualité, des scans inclinés et des polices complexes, le tout en local côté serveur pour une confidentialité totale.
- *Parapheur Numérique* : Implémentation via Canvas HTML5. Les signatures sont converties en vecteurs SVG ou images PNG haute résolution, cryptées en base64 et stockées de manière immuable avec le hash du document.
- **NOUVEAU - Pipeline de Génération Procédurale** : Utilisation de modèles LLM structurés (JSON Mode) pour convertir des requêtes en langage naturel ("Procédure de divorce") en une série d'objets temporels (Tâches, Événements) injectés directement dans le graphe de données du dossier via une transaction atomique.
- **OmniSearch Hybride** : Architecture de recherche avancée combinant :
    1.  **Prisma / MongoDB** : Pour les requêtes structurées (WHERE title CONTAINS...)
    2.  **In-Memory Fuzzy Logic (Fuse.js)** : Pour le re-ranking et la tolérance aux fautes de frappe sur les résultats immédiats.
    3.  **OCR Text Indexing** : Recherche plein texte dans le contenu extrait des PDF/Images.
    4.  **Base Vectorielle (Préparation)** : Structure de données prête pour le RAG (Retrieval Augmented Generation) sur la jurisprudence.

---

## CHAPITRE 3 : SÉCURITÉ, CHIFFREMENT ET CONFORMITÉ
Dans une profession où le secret est la règle, la technique se doit d'être au-dessus de tout soupçon.

### 3.1 Protection des Données (Encryption)
- *Chiffrement AES-256* : Tous les documents stockés dans la *GED* sont cryptés au repos. Résultat attendu : même en cas d'accès non autorisé à l'infrastructure physique, vos pièces de procédure restent illisibles pour un tiers.
- *Isolation des Sessions* : Nous utilisons des jetons de sécurité sécurisés (HTTP-Only). Résultat attendu : une protection totale contre les tentatives de piratage de session ou d'usurpation d'identité.

### 3.2 Livraison Continue et Haute Disponibilité
Le déploiement est assuré par l'infrastructure mondiale de **Vercel**. Résultat attendu : le logiciel bénéficie d'une disponibilité de 99,9%, avec des serveurs stratégiquement placés pour offrir une latence minimale en Afrique.

---

## CHAPITRE 4 : ARCHITECTURE DU PORTAIL ET ANALYTICS
- **Portail Client (Isolé)** : Le portail est conçu comme une application "Read-Only" sécurisée. L'authentification repose sur un couple Email / AccessCode (PIN) vérifié en temps réel via Prisma. La session est maintenue localement pour une réactivité maximale.
- **Engine d'Analytics de Rentabilité** : Les indicateurs de pilotage sont calculés à la volée via des agrégations complexes regroupant `Factures`, `Payments`, `Expenses` et `TimeEntries`. La formule de marge incorpore le `internalHourlyRate` défini globalement dans les paramètres du cabinet.

---

## CHAPITRE 5 : GESTION DE L'ARCHIVAGE ET CYCLE DE VIE
- **Module d'Archivage Physique et Numérique** : L'archivage d'un dossier déclenche une double action :
    1.  Mise à jour du statut du `Dossier` vers `ARCHIVE`.
    2.  Migration des `Documents` liés vers un `ArchiveBoxId` spécifique, avec horodatage immuable de l'archivage.
- **Registre Technique** : Une table `ArchiveBox` centralise les méta-données de localisation physique, permettant un lien direct entre le coffre-fort physique et le document numérique.

---
**LexPremium - L'Ingénierie de pointe au service du Droit.**
*Documentation mise à jour : Décembre 2025*
*SCP d'Avocats Dia & Associés*
