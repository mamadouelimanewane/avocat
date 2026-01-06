# Manuel d'Administration Stratégique - LexPremium ERP 2.0
![[lawyer.png]]

## AVANT-PROPOS
L'administration de *LexPremium ERP 2.0* est le garant de l'intégrité et de la performance du cabinet. Ce manuel détaille les fonctions de haut niveau réservées aux administrateurs, permettant de configurer, sécuriser et superviser les nouveaux moteurs stratégiques de la version 2.0.

---

## CHAPITRE 1 : GESTION DES UTILISATEURS ET PERFORMANCE
La maîtrise des accès et de la rentabilité humaine.

### 1.1 Rôles et Privilèges V2.0
- **Nouveaux Profils** : Gestion des rôles `PARTNER`, `ASSOCIATE`, `JUNIOR`, `OFFICE_MANAGER`.
- **Permissions Exécutives** : Seuls les rôles `PARTNER` et `ADMIN` ont accès au **Tableau de Bord Exécutif** (`/executive`).

### 1.2 Taux et Productivité
- **Coût de Revient Horaire** : Paramétrez le coût horaire de chaque collaborateur pour permettre au moteur analytique de calculer la **Marge Nette** réelle des dossiers.

---

## CHAPITRE 2 : CONFIGURATION IA ET SERVICES EXTERNES
LexPremium 2.0 repose sur une collaboration étroite avec des APIs de pointe.

### 2.1 Moteurs d'Intelligence Artificielle
- **Multi-Modèle** : Configurez vos clés `DEEPSEEK_API_KEY` et `OPENAI_API_KEY`.
- **Optimisation des Coûts** : Activez le **Système de Cache** pour réduire les factures d'IA de 80%.
- **Monitoring IA** : Accédez à la page `/monitoring-ia` pour surveillez la consommation de jetons et la latence.

### 2.2 Communication WhatsApp Business
- **Intégration Twilio** : Saisissez vos identifiants Twilio pour activer les relances automatiques par WhatsApp dans le module de recouvrement.

---

## CHAPITRE 3 : PILOTAGE DU RECOUVREMENT (FINANCES)
### 3.1 Paramétrage des Relances
- **Templates de Mise en Demeure** : Personnalisez le texte légal utilisé par le générateur automatique de documents.
- **Seuils de Risque** : Définissez les montants à partir desquels une facture est considérée comme "Critique" (Défaut : 10 000 000 FCFA).

---

## CHAPITRE 4 : INFRASTRUCTURE ET SÉCURITÉ
### 4.1 Base de Données Atlas
- **Supervision** : Surveillance de la charge MongoDB pour garantir un temps de réponse < 2s sur les dossiers volumineux.
- **Rétention des Logs** : Tracabilité de chaque accès aux dossiers sensibles pour une conformité déontologique totale.

### 4.2 OCR et Documents
- **Gestion Tesseract** : Supervision de l'indexation plein-texte effectuée par l'OCR Neural.

---

## CHAPITRE 5 : CALCULS EXPERTS (SUCCESSION)
### 5.1 Mise à jour Juridique
- **Barème Fiscal** : Assurez-vous que les taux de droits de succession (CGI Sénégal) sont à jour dans le système.
- **Options de Partage** : Configuration par défaut de l'option conjoint (Usufruit vs Pleine Propriété).

---
**LexPremium - Propulsé par l'IA pour l'Excellence Juridique.**
*Documentation mise à jour : Janvier 2026 - Version Masterclass 2.0*
*Cabinet LexPremium AI Innovations*
