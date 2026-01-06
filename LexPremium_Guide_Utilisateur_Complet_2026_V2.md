# 📘 GUIDE UTILISATEUR COMPLET - LexPremium 2026

## Version 2.0 - Janvier 2026

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Nouveautés 2026](#nouveautés-2026)
3. [Prise en Main Rapide](#prise-en-main)
4. [Modules Essentiels](#modules-essentiels)
5. [Modules Avancés](#modules-avancés)
6. [Modules Experts (Nouveaux)](#modules-experts)
7. [Intelligence Artificielle](#intelligence-artificielle)
8. [Comptabilité OHADA](#comptabilité)
9. [FAQ & Dépannage](#faq)

---

## 🌟 Introduction

**LexPremium** est la solution de gestion de cabinet d'avocats **la plus avancée du Sénégal**, entièrement conforme aux standards **OHADA** et au **droit sénégalais**.

### 🎯 Public Cible
- Cabinets d'avocats individuels
- Cabinets associés (2-20 avocats)
- Juristes d'entreprise
- Notaires (modules spécialisés)

### ✨ Différenciation
✅ **100% Cloud** - Accessible partout  
✅ **IA Intégrée** - DeepSeek + GPT-4  
✅ **OHADA natif** - Comptabilité conforme  
✅ **Multi-langue** - Français + support Wolof  

---

## 🆕 Nouveautés 2026

### 🚀 Modules Stratégiques (Janvier 2026)

#### 1. **Tableau de Bord Exécutif** 📊
Route : `/executive`

**Fonctionnalités :**
- KPI temps réel (CA, Recouvrement, Marge, Créances)
- Prévisions de trésorerie 30/60/90 jours
- Alertes intelligentes urgentes/warnings
- Graphiques interactifs (Recharts)
- Analyse par domaine juridique et par avocat
- Liste des dossiers à risque avec scoring

**Indicateurs Clés :**
- CA Réalisé vs Objectif (%)
- Taux de Recouvrement (seuil critique : 70%)
- Créances > 30 jours
- Marge Nette (CA - Charges - Temps interne)

**Graphiques :**
- Evolution CA vs Objectifs (Area Chart)
- Taux Recouvrement Mensuel (Line Chart)
- CA par Domaine (Pie Chart)
- Performance par Avocat (Bar Chart)

#### 2. **Module de Recouvrement Automatisé** 💰
Route : `/recouvrement` (amélioré)

**Fonctionnalités :**
- Catégorisation automatique (Récent/Moyen/Critique)
- **Scoring Client IA** (0-100) multi-facteurs
- 3 niveaux de relances :
  - Courtoise (email)
  - Ferme (email + WhatsApp)
  - Mise en Demeure (document juridique)
- Templates intelligents avec variables
- Envoi multi-canal (Email + WhatsApp)
- Génération automatique mise en demeure

**Algorithme de Scoring :**
```
Score = Historique paiement (40pts)
      + Délai moyen (30pts)
      + Montant impayé (20pts)
      + Volume factures (10pts)

Risque : Élevé (>80) | Moyen (50-80) | Faible (<50)
```

**Timeline :**
- ≤30j : Badge bleu
- 30-60j : Badge amber
- >60j : Badge rouge animé

#### 3. **Calculateur de Succession Professionnel** ⚖️
Route : `/succession`

**10 Méthodes de Calcul Juridiques :**
1. Liquidation régime matrimonial
2. Masse de calcul (rapport donations)
3. Réserve héréditaire (1/2, 2/3, 3/4)
4. Ordre des héritiers (4 ordres)
5. Calcul des parts (usufruit/nue-propriété)
6. Réduction libéralités excessives
7. Droits de succession (barème fiscal)
8. Valorisation démembrement (selon âge)
9. Masse à partager (imputation donations)
10. Soulte entre cohéritiers

**Interface :**
- 4 onglets (Calculs, Partage, Fiscalité, Libéralités)
- Gestion héritiers illimitée
- Inventaire patrimoine (Actifs/Dettes)
- Support testament
- Conformité Code de la Famille sénégalais

**Sorties :**
- Parts par héritier (%, montant)
- Droits de succession calculés
- Alertes excès libéralités
- Rapport détaillé exportable

---

## 🚀 Prise en Main Rapide

### Étape 1 : Connexion
```
URL : https://lexapp.vercel.app
Email : demo@lexpremium.sn
Mot de passe : demo123
```

### Étape 2 : Tableau de Bord
Accédez au **Dashboard** pour une vue d'ensemble :
- Dossiers actifs
- Tâches du jour
- Événements à venir
- CA mensuel

### Étape 3 : Créer un Client
1. Menu **Clients** → Bouton "Nouveau Client"
2. Remplir : Nom, Email, Téléphone, Adresse
3. Type : Particulier / Entreprise
4. Enregistrer

### Étape 4 : Créer un Dossier
1. Menu **Dossiers** → "Nouveau Dossier"
2. Lier au client
3. Choisir type : Civil, Pénal, Commercial, Foncier, Social
4. Ajouter description
5. Créer

### Étape 5 : Charger un Document
1. Ouvrir le dossier
2. Onglet **Documents**
3. Uploader fichier (PDF, Word, Image)
4. Lancer l'**OCR** automatique
5. Le texte est extrait et analysé

---

## 📂 Modules Essentiels

### 1. Gestion des Dossiers

#### Création Dossier
- Titre descriptif
- Référence unique (auto ou manuel)
- Client associé
- Type de procédure
- Statut : Ouvert / Judiciaire / Clos / Archivé

#### Onglets Dossier
**a) Vue d'ensemble**
- Résumé IA du dossier
- Chronologie événements
- Tâches associées

**b) Documents**
- Upload illimité
- OCR automatique (Tesseract + AI)
- Versioning
- Signature électronique
- Génération IA (contrats, actes)

**c) Finance**
- Factures liées
- Paiements reçus
- Débours
- CARPA (fonds tiers)
- Rentabilité dossier

**d) Communication**
- Emails clients
- WhatsApp Business
- Appels enregistrés
- Historique complet

**e) Calendrier**
- Audiences
- Délais procéduraux
- Rappels automatiques

### 2. Gestion des Clients

#### Fiche Client
- Informations personnelles
- Historique dossiers
- Facturation globale
- Score de risque crédit

#### Portail Client Sécurisé
Route : `/portal/login`

**Accès Client :**
- Email + Code 6 chiffres
- Envoi auto par Email & WhatsApp

**Fonctionnalités Client :**
- Consultation dossiers
- Téléchargement documents signés
- Factures & paiements
- Messages sécurisés

### 3. Facturation & Paiements

#### Création Facture
- Saisie manuelle OU
- **Facturation IA** (analyse temps passé + débours)
- TVA 18% (Sénégal)
- Conditions paiement personnalisables

#### Modes de Paiement
- Espèces
- Chèque
- Virement
- Mobile Money (Orange Money, Wave)

#### Exports
- PDF professionnel (logo cabinet)
- Excel (comptabilité)
- Envoi email auto

### 4. Agenda & Délais

#### Calendrier Maître
- Vue : Mois / Semaine / Jour
- Filtres par avocat / dossier / type
- Intégration iCal (export)

#### Types d'Événements
- **Audiences** (tribunal, localisation)
- **Délais procéduraux** (calcul auto)
- **RDV Clients**
- **Tâches Internes**

#### **DeadlinePro** (IA)
- Calcul délais OHADA/Sénégal
- Alertes J-7, J-3, J-1
- Suggestions actions

---

## 🎯 Modules Avancés

### 1. Outils Juridiques (`/outils`)

#### a) Calculateur de Délais
- Procédure Civile (CPC Sénégal)
- Procédure Pénale
- OHADA (Actes Uniformes)
- Jours fériés intégrés

#### b) Bibliothèque Juridique
- Codes (Famille, Commerce, Procédure)
- OHADA (9 Actes Uniformes)
- Recherche full-text
- **Assistant IA** intégré

#### c) Veille Juridique Flash
- Actualités JO (Journal Officiel)
- Décisions CCJA
- Alertes thématiques

#### d) Dictée Juridique IA
- Transcription vocale
- Structuration automatique notes audience
- Identification parties/réquisitions

#### e) Fiscalité Foncière
- Calcul droits enregistrement (3% ou 5%)
- Frais conservation (1%)
- Honoraires notaire (barème)
- Plus-value immobilière

#### f) Quantum Simulator (Social)
- Indemnités licenciement
- Barème CCNI Sénégal
- 3 paramètres (salaire, ancienneté, âge)

### 2. Intelligence Artificielle

#### **LexAI Assistant**
Fonctionnalités :
- Rédaction contrats personnalisés
- Analyse documents adverses
- Recherche jurisprudentielle
- Résumé exécutif dossier
- Prédiction issues judiciaires

#### **Modules IA Premium**

**a) JusticePredictor**
- Analyse description litige
- Juridiction concernée
- Taux succès estimé (%)
- Points forts/faibles
- Recommandations stratégiques

**b) Adverse Document Scanner**
- Upload document adverse
- Détection arguments clés
- Points faibles identifiés
- Contre-argumentation suggérée

**c) Contract Analyzer**
- Vérification clauses dangereuses
- Conformité OHADA
- Suggestions améliorations

**d) Judge Profiler**
- Statistiques juge (taux confirmation, durée moyenne)
- Sensibilités juridiques
- Stratégie recommandée
- Radar chart performance

**e) Conflict Checker**
- Scan base clients/dossiers
- Détection conflits d'intérêts
- Relation CLIENT vs ADVERSE
- Alertes automatiques

**f) Sherlock Scanner (OSINT)**
- Scan solvabilité débiteur
- Actifs détectés (simulation)
- Score risque 0-100
- Sources publiques

**g) Execution Commander**
- Pilotage voies exécution
- Carte interactive des biens
- Taux recouvrement
- Planning saisies

**h) Nexus Graph (Réseau)**
- Cartographie relations
- Détection conflits complexes
- Visualisation graphe

### 3. Recherche Globale

**Omni-Search** (Cmd+K)
- Dossiers
- Clients
- Documents
- Jurisprudence
- Codes juridiques

**Filtres Avancés :**
- Par date
- Par statut
- Par avocat
- Par montant

---

## 🏆 Modules Experts (Nouveaux 2026)

### 1. Tableau de Bord Exécutif 📊

**Route :** `/executive`

**Public :** Associés, Direction Cabinet

#### Interface
**4 KPI Principaux :**
1. CA Réalisé / Objectif (barre progression)
2. Taux Recouvrement (%) avec seuil
3. Créances en Cours (> 30j)
4. Marge Nette (%)

**Prévisions Trésorerie :**
- Solde actuel
- +30 jours
- +60 jours
- +90 jours
- Note prudence taux recouvrement

**Alertes Intelligentes :**
- URGENTES (rouge) : Créances > 10M ou Taux < 70%
- WARNINGS (amber) : Seuils intermédiaires
- Lien direct dossier concerné

**Graphiques :**
- Evolution CA vs Objectifs (Area Chart)
- Taux Recouvrement (Line Chart)
- CA par Domaine (Pie Chart)
- Performance Avocat (Bar Chart)

**Dossiers à Risque :**
- Scoring HIGH/MEDIUM/LOW
- Motif risque
- Action rapide

#### Utilisation
1. Accéder `/executive`
2. Analyser KPI
3. Cliquer graphique pour drill-down
4. Exporter PDF rapport mensuel

### 2. Recouvrement Automatisé 💰

**Route :** `/recouvrement` (page améliorée)  
**Composant :** `<RecouvrementModule />`

**Public :** Secrétariat, Comptabilité

#### Dashboard Recouvrement
- Total Impayés (montant)
- Factures Critiques (>60j)
- Délai Moyen Paiement
- Relances Envoyées (mois)

#### Catégorisation Auto
3 onglets :
- **Récents** (≤30j) - Badge bleu
- **30-60j** - Badge amber
- **Critiques** (>60j) - Badge rouge animé

#### Scoring Client (0-100)
**Algorithme :**
```javascript
score = historiqueScore(40) 
      + delayScore(30) 
      + amountScore(20) 
      + volumeScore(10)
```

**Interprétation :**
- 0-49 : Risque Faible (vert)
- 50-79 : Risque Moyen (amber)
- 80-100 : Risque Élevé (rouge)

#### Système de Relances

**Niveau 1 : Courtoise**
- Ton professionnel cordial
- Rappel échéance
- Canal : Email

**Niveau 2 : Ferme**
- Mention relances précédentes
- Délai 8 jours
- Menace suspension
- Canal : Email + WhatsApp

**Niveau 3 : Mise en Demeure**
- Document juridique formel
- Délai légal 15 jours
- Menace contentieux
- Génération auto PDF
- Canal : Email AR + WhatsApp

#### Templates
Variables auto :
- `{{invoice.number}}`
- `{{invoice.amountTTC}}`
- `{{invoice.dueDate}}`
- `{{client.name}}`

Personnalisation possible avant envoi.

#### Envoi Multi-Canal
- **Email** : HTML professionnel
- **WhatsApp** : Format texte + émojis
- Détection canal disponible (email prioritaire)

#### Actions Serveur
```typescript
sendRelance({
  invoiceId, type, customMessage, channel
})

generateMiseEnDemeure(invoiceId)
// → Crée document dans dossier

calculateClientRiskScore(clientId)
// → Retourne 0-100
```

#### Utilisation
1. Aller `/recouvrement`
2. Sélectionner onglet (Récent/Moyen/Critique)
3. Cliquer "Relancer" sur facture
4. Choisir type relance
5. Personnaliser message (optionnel)
6. Envoyer

### 3. Calculateur Succession Professionnel ⚖️

**Route :** `/succession`

**Public :** Avocats Famille, Notaires

#### 10 Méthodes Juridiques

**1. Liquidation Régime Matrimonial**
- Séparation de Biens
- Communauté de Biens (Sénégal)
- Participation aux Acquêts

**2. Masse de Calcul**
- Rapport fictif donations
- Exclusion présents d'usage

**3. Réserve Héréditaire**
Barème Code Famille :
- 1 enfant : 1/2
- 2 enfants : 2/3
- 3+ enfants : 3/4
- Parents : 1/3

**4. Ordre Héritiers**
- Ordre 1 : Descendants
- Ordre 2 : Ascendants + Frères/Sœurs
- Ordre 3 : Autres collatéraux
- Conjoint en concours

**5. Calcul Parts**
Options conjoint :
- Usufruit total (défaut)
- Pleine propriété 1/4

**6. Réduction Libéralités**
Si Legs > Quotité disponible :
- Réduction proportionnelle
- Ordre (legs → donations récentes)

**7. Droits Succession**
Barème Sénégal :
- Conjoint/Enfants : 5% (abattement 50M)
- Parents : 5% (abattement 30M)
- Frères/Sœurs : 10% (abattement 10M)
- Autres : 20% (0 abattement)

**8. Valorisation Démembrement**
Barème fiscal :
- <30 ans : Usufruit 80%
- 30-50 ans : 60-70%
- 50-70 ans : 40-50%
- >70 ans : 20-30%

**9. Masse à Partager**
Imputation donations reçues :
```
À recevoir = Part théorique - Donations
```

**10. Soulte**
```
Soulte = Valeur bien attribué - Part
```

#### Interface

**Onglet 1 : Calculs**
- Masse liquidation
- Masse de calcul
- Réserve héréditaire
- Quotité disponible
- Détails patrimoine

**Onglet 2 : Partage**
- Démembrement (si usufruit)
- Liste parts par héritier
- 3 colonnes :
  - Pleine propriété
  - Usufruit (violet)
  - Nue-propriété (bleu)

**Onglet 3 : Fiscalité**
Pour chaque héritier :
- Part brute
- Abattement
- Base imposable
- Taux
- **Droits dus**

Total général affiché.

**Onglet 4 : Libéralités**
- Donations rapportables (liste)
- Legs testamentaires (types)
- **Alerte excès** avec réduction auto

#### Configuration

**Situation Familiale :**
- Régime matrimonial (select)
- Conjoint survivant (checkbox)
- Testament existant (checkbox)

**Héritiers :**
- Ajout illimité
- Types : Conjoint, Enfant, Père, Mère, Frère, Sœur, Autre
- Nom personnalisable
- Age (pour usufruit)

**Patrimoine :**

Actifs :
- Type : Immobilier, Financier, Mobilier, Autre
- Description
- Valeur FCFA

Dettes :
- Description
- Montant FCFA

**Résultats :**
- Actif Net = Total Actifs - Total Dettes
- Affiché en temps réel

#### Utilisation

**Cas Pratique :**
1. Accéder `/succession`
2. Configurer régime (Communauté)
3. Ajouter héritiers (Épouse + 3 enfants)
4. Saisir patrimoine :
   - Villa 100M
   - Compte 30M
   - Prêt -20M
5. Onglet Calculs :
   - Masse : 110M
   - Réserve (3 enfants) : 82,5M
   - Quotité : 27,5M
6. Onglet Partage :
   - Épouse : Usufruit 110M (val. 55M si 55 ans)
   - Enfant 1 : Nue-prop 36,7M (val. 18,3M)
   - Enfant 2 : Nue-prop 36,7M (val. 18,3M)
   - Enfant 3 : Nue-prop 36,7M (val. 18,3M)
7. Onglet Fiscal :
   - Total droits : ~3,4M FCFA
8. Exporter rapport PDF

#### Documentation
Consulter `METHODES_SUCCESSION.md` pour :
- Détails juridiques
- Exemples complets
- Références légales
- Cas limites

---

## 🤖 Intelligence Artificielle

### Configuration IA

**Route :** `/admin` → Paramètres IA

**Modèles Supportés :**
- DeepSeek (recommandé - rapport qualité/prix)
- OpenAI GPT-4
- GPT-3.5 Turbo

**Clés API :**
Variables d'environnement :
```
DEEPSEEK_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx
```

### Cas d'Usage IA

#### 1. Rédaction Contrats
**Input :** Description projet + parties
**IA :** Génère contrat complet OHADA
**Output :** Document Word éditable

#### 2. Analyse Documents
**Input :** PDF contrat adverse
**IA :** Extrait clauses + risques
**Output :** Rapport analyse + recommandations

#### 3. Recherche Jurisprudence
**Input :** "divorce pour faute Sénégal"
**IA :** Scraping + analyse
**Output :** Décisions pertinentes + synthèse

#### 4. Prédiction Résultat
**Input :** Description litige + juridiction
**IA :** Analyse probabiliste
**Output :** % succès + arguments

#### 5. Résumé Dossier
**Input :** ID Dossier
**IA :** Lecture docs + historique
**Output :** Synthèse 4 points (statut, urgences, actions, finance)

### Limites IA

⚠️ **Disclaimer Obligatoire :**
> L'IA est un **outil d'assistance** et ne remplace pas le jugement juridique de l'avocat. Toujours vérifier.

✅ **Bon Usage :**
- Rédaction brouillons
- Recherche préliminaire
- Suggestions arguments

❌ **Mauvais Usage :**
- Confiance aveugle
- Skip vérification humaine
- Conseils directs clients sans relecture

---

## 📊 Comptabilité OHADA

### SYSCOHADA Intégré

**Plan Comptable :**
- Classe 1-8 (OHADA)
- 500+ comptes pré-configurés
- Nomenclature officielle

**Journaux :**
- Achats (AC)
- Ventes (VT)
- Banque (BQ)
- Caisse (CA)
- Opérations Diverses (OD)

### Écritures Automatiques

**Facture Client :**
```
Débit 411 - Clients
Crédit 706 - Prestations services
Crédit 443 - TVA collectée
```

**Paiement Reçu :**
```
Débit 521 - Banque
Crédit 411 - Clients
```

**Débours :**
```
Débit 461 - Débours à refacturer
Crédit 521 - Banque
```

**CARPA (Fonds Tiers) :**
```
Dépôt :
Débit 521 - Banque CARPA
Crédit 467 - Fonds gérés

Retrait :
Débit 467 - Fonds gérés
Crédit 521 - Banque CARPA
```

### États Financiers

**Accessibles :** `/comptabilite`

**1. Balance Générale**
- Tous comptes
- Soldes débiteurs/créditeurs
- Export Excel

**2. Grand Livre**
- Par compte
- Détail écritures
- Période personnalisable

**3. Journal**
- Chronologique
- Par journal
- Filtrable

**4. Bilan (Simplifié)**
- Actif / Passif
- Conformité SYSCOHADA

**5. Compte de Résultat**
- Charges / Produits
- Résultat net

### Clôture Exercice

**Assisté IA :**
1. Vérification écritures (équilibre)
2. Génération écritures régularisation
3. Détermination résultat
4. À-nouveaux automatiques

---

## ❓ FAQ & Dépannage

### Questions Fréquentes

**Q1 : Puis-je utiliser LexPremium hors ligne ?**
R : Non, c'est une application cloud. Connexion internet requise. PWA prévu pour cache offline partiel.

**Q2 : Mes données sont-elles sécurisées ?**
R : Oui. Hébergement Vercel (SSL), base MongoDB chiffrée, backups quotidiens, conformité RGPD.

**Q3 : Combien coûte l'IA ?**
R : DeepSeek : ~0,50€/million tokens. Budget moyen cabinet : 20-50€/mois.

**Q4 : Puis-je importer mes anciens dossiers ?**
R : Oui, via import Excel (template fourni) ou migration assistée (sur devis).

**Q5 : Combien d'utilisateurs simultanés ?**
R : Illimité selon votre abonnement (base : 3 avocats, pro : 10, enterprise : illimité).

**Q6 : Support technique disponible ?**
R : Oui. Email : support@lexpremium.sn, Réponse < 24h, Hotline téléphonique (heures bureau).

**Q7 : Les calculs de succession sont-ils fiables ?**
R : Oui, conformes au Code de la Famille. Mais **validation avocat senior requise** pour actes officiels.

**Q8 : Export des données possible ?**
R : Oui. Format : Excel, PDF, ZIP (tous documents). Pas de lock-in.

**Q9 : Langues supportées ?**
R : Français (100%), Wolof (partiel - en cours).

**Q10 : Intégration Mobile Money ?**
R : Oui. Orange Money et Wave API (Sénégal).

### Dépannage

**Problème : OCR ne fonctionne pas**
Solution :
1. Vérifier format fichier (PDF, JPG, PNG supportés)
2. Qualité image suffisante (>300 DPI recommandé)
3. Si échec persistant : Contacter support

**Problème : Email relance non envoyé**
Solution :
1. Vérifier email client dans fiche
2. Vérifier config SMTP cabinet (`/admin`)
3. Checker logs (Admin → Système)

**Problème : Graphiques dashboard vides**
Solution :
1. Au moins une facture émise requise
2. Rafraîchir page (Ctrl+R)
3. Vider cache navigateur

**Problème : Calcul succession incorrect**
Solution :
1. Vérifier saisie patrimoine (actifs/dettes)
2. Confirmer régime matrimonial
3. Consulter documentation `METHODES_SUCCESSION.md`
4. Si doute : Valider avec avocat senior

---

## 📞 Support & Contact

### Équipe LexPremium

**Support Technique :**  
📧 support@lexpremium.sn  
📱 WhatsApp : +221 77 XXX XX XX  
⏰ Lun-Ven 9h-18h GMT

**Commercial :**  
📧 commercial@lexpremium.sn  
📱 +221 77 XXX XX XX

**Adresse :**  
LexPremium SARL  
Dakar, Plateau - Sénégal

### Ressources

**Documentation :**
- Guide Utilisateur (ce document)
- API Docs : `/docs/api`
- Vidéos tutoriels : YouTube LexPremium

**Communauté :**
- Forum : community.lexpremium.sn
- LinkedIn : LexPremium Sénégal
- Twitter : @LexPremiumSN

---

## 📜 Mentions Légales

**LexPremium** est une marque déposée.

**Éditeur :** LexPremium SARL  
**RCCM :** SN-DKR-2025-XXXXX  
**NINEA :** XXXXXXXXX

**Conformité :**
- Code de la Famille (Loi 72-61)
- OHADA (Actes Uniformes)
- RGPD / Loi Protection Données Sénégal

**Garanties :**
> Les calculs juridiques sont fournis à titre indicatif et ne se substituent pas au conseil personnalisé d'un avocat.

---

**Version :** 2.0  
**Date :** Janvier 2026  
**Auteur :** Équipe LexPremium

---

🇸🇳 **Made with ❤️ in Senegal**
