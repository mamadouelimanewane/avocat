# Manuel d'Administration Exhaustif - LexPremium ERP

## 1. Gouvernance et Sécurité
L'administration de LexPremium ERP est le garant de l'intégrité des données du cabinet. Ce manuel détaille les fonctions de haut niveau réservées aux administrateurs.

## 2. Gestion des Utilisateurs et Rôles
### 2.1 Configuration des Comptes
Pour chaque collaborateur (Avocat, Clerc, Secrétaire) :
- **Email professionnel** : Utilisé comme identifiant unique.
- **Rôle applicatif** : `ADMIN`, `AVOCAT`, `COLLABORATEUR` ou `SECRETAIRE`. Les permissions sont pré-configurées selon ces rôles.
- **Taux Horaire** : Variable cruciale pour le calcul de la rentabilité. Il doit refléter le coût de revient du collaborateur (Salaire + Charges).

### 2.2 Permissions Granulaires
Bien que les rôles soient prédéfinis, vous pouvez ajuster les permissions via le champ JSON `permissions` pour autoriser ou restreindre l'accès à des modules sensibles (ex: accès total à la comptabilité).

## 3. Paramétrage Structurel du Cabinet
### 3.1 Identité Visuelle
Dans les paramètres généraux, téléchargez le logo du cabinet au format PNG ou JPG (fond transparent conseillé). Il sera utilisé sur tous les PDF (Factures, Actes, Courriers).
### 3.2 Configuration Fiscale (TVA et BRS)
- **TVA** : Le taux par défaut est de 18%.
- **BRS (Bénéfice sur Revenus Spécifiques)** : Pour les prestataires assujettis, vous pouvez activer le calcul de la BRS lors de la facturation.
### 3.3 Coordonnées Bancaires
Enregistrez un ou plusieurs RIB. Le système vous permet de choisir quel compte afficher sur chaque facture, utile si vous séparez les fonds propres des fonds tiers (CARPA).

## 4. Gestion de l'Infrastructure Cloud
### 4.1 Base de Données MongoDB
LexPremium utilise MongoDB Atlas. L'administrateur doit périodiquement vérifier l'état de l'espace disque utilisé et les performances des requêtes via la console Atlas.
### 4.2 Clés API et Secret (Variables d'Environnement)
Toutes les intégrations sont pilotées par des variables d'environnement sur Vercel :
- `OPENAI_API_KEY` : Pour les fonctions d'IA.
- `RESEND_API_KEY` : Pour l'envoi d'emails.
- `DATABASE_URL` : Chaîne de connexion à la base de données.

## 5. Maintenance et Sauvegardes
### 5.1 Sauvegardes de Sécurité
L'instance MongoDB Atlas est configurée pour des sauvegardes automatiques quotidiennes. En cas de sinistre, une restauration au point de sauvegarde (Point-in-time recovery) peut être effectuée.
### 5.2 Archivage des Dossiers
Pour maintenir la fluidité de l'interface, archivez les dossiers clos depuis plus d'un an. Ils restent consultables mais ne polluent plus les recherches actives.

## 6. Audit et Traçabilité
Le module "Logs d'Administration" permet de suivre qui a accédé au système, quelles factures ont été modifiées et quel document a été téléchargé, assurant une conformité parfaite vis-à-vis du secret professionnel.

## 7. Gestion du Stockage (GED)
Surveillez la consommation de la GED. Il est conseillé de limiter la taille des fichiers individuels (max 50 Mo par document) pour optimiser les temps d'analyse par l'IA.
