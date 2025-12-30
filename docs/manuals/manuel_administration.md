# Manuel d'Administration Exhaustif - LexPremium ERP
![[lawyer.png]]

## AVANT-PROPOS
L'administration de *LexPremium ERP* est le garant de l'intégrité des données du cabinet. Ce manuel détaille les fonctions de haut niveau réservées aux administrateurs, permettant de configurer, sécuriser et superviser l'ensemble de l'écosystème numérique de la *SCP d'Avocats Dia & Associés*.

---

## CHAPITRE 1 : GESTION DES UTILISATEURS ET RÔLES
La maîtrise des accès est le premier pilier de la sécurité de votre cabinet. Chaque collaborateur doit disposer d'un profil parfaitement configuré pour exercer ses missions.

### 1.1 Configuration des Comptes
- *Email professionnel* : Cette information sert d'identifiant unique et inviolable pour chaque membre du cabinet, garantissant que chaque action est tracée.
- *Rôle applicatif* : Vous devez affecter un profil (`ADMIN`, `AVOCAT`, `COLLABORATEUR` ou `SECRETAIRE`) à chaque utilisateur. Résultat attendu : le système déploie automatiquement les menus et les droits correspondants à la fonction de la personne.
- *Taux Horaire* : Cette variable financière cruciale permet de calculer la rentabilité de chaque collaborateur. Elle doit inclure le salaire brut et les charges sociales pour offrir un coût de revient exact lors de l'analyse des dossiers.

### 1.2 Permissions Granulaires
En plus des rôles standards, l'administrateur peut affiner l'accès via le champ *Permissions*. Résultat attendu : vous pouvez autoriser un stagiaire à voir les documents sans qu'il puisse consulter le module *Comptabilité* ou les *Fonds Tiers CARPA*.

---

## CHAPITRE 2 : PARAMÉTRAGE STRUCTUREL DU CABINET
Ce chapitre détaille comment imprimer la marque de prestige du cabinet sur l'ensemble de ses documents officiels.

### 2.1 Identité Visuelle et Logo
- *Logo du Cabinet* : En téléchargeant votre logo dans les paramètres généraux, vous assurez une image de marque cohérente. Résultat attendu : votre identité visuelle apparaît en haute résolution sur chaque *Facture*, *Actequi* ou *Courrier* généré par le logiciel.

### 2.2 Configuration Fiscale (TVA et BRS)
- *Taux de TVA* : Configurez le taux légal (18% par défaut). Résultat attendu : le système calcule automatiquement la taxe sur chaque honoraires, évitant les erreurs de saisie manuelle.
- *Préciput et BRS* : Activez ces options pour les dossiers assujettis. Résultat attendu : le logiciel génère les décomptes fiscaux précis conformes à la règlementation sénégalaise.

### 2.3 Coordonnées Bancaires (RIB)
Enregistrez vos différents comptes (*Compte Honoraires*, *Compte CARPA*). Résultat attendu : lors de l'édition d'une facture, vous pourrez choisir quel RIB afficher pour orienter le règlement du client de manière sécurisée.

---

## CHAPITRE 3 : GESTION DE L'INFRASTRUCTURE CLOUD
*LexPremium* repose sur une architecture robuste qui nécessite une surveillance légère mais régulière.

### 3.1 Base de Données MongoDB Atlas
L'administrateur a accès au tableau de bord des performances. Informations affichées : volume de stockage utilisé par la *GED* et vitesse de réponse du serveur. Résultat attendu : un fonctionnement fluide et sans ralentissement pour tous les utilisateurs.

### 3.2 Clés API et Connecteurs IA
Le pilotage de l'intelligence artificielle se fait via des clés de sécurité (`OPENAI_API_KEY`). Résultat attendu : en cas de changement de fournisseur, l'administrateur peut mettre à jour les connecteurs pour que les fonctions de *Recherche IA* restent toujours opérationnelles.

---

## CHAPITRE 4 : MAINTENANCE, SAUVEGARDES ET AUDIT
La sécurité des données est la priorité absolue du prestataire et de l'administrateur.

### 4.1 Sauvegardes de Sécurité (Backups)
Le système effectue des sauvegardes automatiques quotidiennes. Résultat attendu : une sécurité totale contre toute perte accidentelle de données, avec une possibilité de restauration minute par minute.

### 4.2 Module d'Audit (Logs)
- *Logs d'Administration* : Affiche la liste exhaustive des connexions, des suppressions de fichiers et des modifications de factures. Résultat attendu : une traçabilité parfaite pour garantir la confidentialité et le secret professionnel au sein de l'équipe.

### 4.3 Archivage Automatisé
Cette fonction permet de masquer les dossiers clos de la vue active. Résultat attendu : une interface toujours rapide et une attention concentrée sur les affaires génératrices de revenus, tout en gardant un accès aux archives juridiques.

---

## CHAPITRE 5 : PILOTAGE STRATÉGIQUE ET ANALYTICS
L'administrateur et les associés disposent d'outils d'aide à la décision avancés.

- **Configuration des Taux Externes vs Internes** : 
    - *Taux Externe* : Ce que vous facturez au client.
    - *Taux Interne (Coût de revient)* : Ce que le collaborateur coûte au cabinet par heure.
    - *Résultat* : Le module **Pilotage** utilise ces variables pour calculer la marge nette réelle par dossier.
- **Supervision du Recouvrement** : Accédez à la balance agée globale pour identifier les clients chroniquement en retard et adapter la stratégie commerciale.

---

## CHAPITRE 6 : GESTION DU PORTAIL ET DES ARCHIVES
- **Sécurité du Portail Client** :
    - Génération des codes PIN : Assurez-vous que chaque client reçoit son code d'accès de manière sécurisée (Remis en main propre ou via SMS crypté).
    - Contrôle des publications : Seuls les documents marqués comme "SIGNÉS" sont visibles par le client.
- **Gestion du Cycle de Vie des Archives** :
    - Définissez les emplacements physiques (Salles, Rayons).
    - Gérez les droits de "Désarchivage" pour limiter la manipulation des dossiers clos.

---
**LexPremium - Propulsé par l'IA pour l'Excellence Juridique.**
*Documentation mise à jour : Décembre 2025*
*SCP d'Avocats Dia & Associés*
