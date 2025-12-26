# Manuel d'Administration Globale - LexPremium ERP

## 1. Gestion des Utilisateurs et de la Sécurité
### 1.1 Création d'un compte collaborateur
Accédez à l'onglet "Utilisateurs" dans le menu Admin. Pour chaque nouveau membre :
- Définissez son rôle (l'Assistant a des droits limités, l'Admin a accès à tout).
- Saisissez son taux horaire. Ce taux est invisible pour le collaborateur mais sert au cabinet pour calculer la marge nette sur chaque dossier.
### 1.2 Suspension d'accès
En cas de départ d'un collaborateur, utilisez le bouton "Désactiver". Le compte reste en base pour l'historique des dossiers, mais l'accès au portail est immédiatement bloqué.

## 2. Configuration Financière du Cabinet
### 2.1 Paramètres de Taxes (TVA)
Par défaut, le système est configuré pour la TVA sénégalaise (18%). Vous pouvez modifier ce taux globalement dans les paramètres. Toutes les nouvelles factures utiliseront alors le nouveau taux.
### 2.2 Relevé d'Identité Bancaire (RIB)
Configurez vos informations bancaires dans l'en-tête de facture. Ces informations apparaîtront automatiquement en bas de chaque facture générée au format PDF pour faciliter les virements de vos clients.

## 3. Gestion du Portail Client
### 3.1 Activation du code d'accès
Chaque client (Particulier ou Entreprise) peut disposer d'un accès à son propre espace.
1. Allez sur la fiche du Client.
2. Générez un "Code d'Accès" (PIN à 4 ou 6 chiffres).
3. Transmettez ce code et son email au client.
Il pourra alors suivre l'avancement de ses dossiers et télécharger ses factures en toute autonomie.

## 4. Maintenance de l'Assistant IA (LexA)
### 4.1 Alimentation de la base de connaissances
Le système "apprend" de vos dossiers. Plus vous téléchargez de jurisprudence de qualité dans le module "Jurisprudence", plus l'IA sera précise dans ses réponses pour votre cabinet.
### 4.2 Suivi de consommation
L'IA utilise des jetons (tokens). Un dashboard spécifique vous permet de voir quel collaborateur sollicite le plus l'IA et de gérer les coûts associés à l'abonnement OpenAI/Deepseek.
