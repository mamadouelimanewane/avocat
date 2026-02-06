# LexPremium Lite - Duo Edition

## Vision
Une version simplifiée, rapide et accessible de LexPremium, spécialement conçue pour les avocats individuels accompagnés d'un(e) assistant(e). 

## Objectifs
- **Simplicité** : Interface épurée, centrée sur l'essentiel.
- **Intelligence** : Accès complet à LexAI pour la recherche de jurisprudence.
- **Mobilité** : Performance optimisée pour une utilisation sur smartphone et tablette.
- **Efficacité** : Alertes automatiques pour ne jamais manquer un délai.

## Modules Inclus
1. **Dossiers & Clients** : Gestion simplifiée des fiches et documents.
2. **Rédaction Assistée** : Votre assistant de rédaction (Assignations, Conclusions, Contrats) basé sur des templates IA.
3. **LexAI** : Assistant juridique intelligent (RAG) sur fonds OHADA et Sénégal.
4. **Bureau Virtuel (Dashboard)** : Liste de tâches automatisées (Relances, Audiences, Préparation d'actes).
5. **Agenda** : Gestion des audiences et des délais de procédure.
6. **Facturation Express** : Génération instantanée de mémoires d'honoraires.
7. **Comptabilité Expert** : Tableau de bord financier, suivi des budgets et alertes de dépassement.
8. **Bibliothèque "Sentinelle"** : Base de données exhaustive de textes OHADA, codes sénégalais, modèles d'actes et contrats, mise à jour automatiquement par crawler.

## 🛠 Automatisation & Veille
LexPremium Lite inclut désormais un script de veille automatique (`scripts/legal_crawler.py`) conçu pour être exécuté quotidiennement (via Cron ou GitHub Actions). Ce script explore les sources officielles pour indexer les nouveaux textes et modèles directement dans votre bibliothèque.

## Différences avec la version SCPA
- Pas de comptabilité OHADA complète (Balance, TAFIRE).
- Pas de gestion multi-associés complexe.
- Pas de gestion des ressources humaines/congés avancée.
- Stockage optimisé.

## Supports & Documentation (Premium Assets)
Le projet inclut des scripts de génération de supports haute définition (Marine & Or) :
- **Brochure Premium (PDF)** : `LexPremium_Lite_Brochure_2026.pdf`
- **Présentation Commerciale (PPTX)** : `LexPremium_Lite_Presentation_2026.pptx`
- **Guide de Formation (PDF)** : `LexPremium_Lite_Guide_Formation.pdf`
- **Proposition Technique (DOCX)** : `LexPremium_Lite_Proposition_2026.docx`

*Exécutez les scripts `generate_lite_*.py` pour mettre à jour ces documents.*
## Gestion du budget & dépenses (API)

- **API budget** prête à l’emploi (GET/POST).
- **Intégration UI** possible en quelques lignes grâce aux styles déjà présents.
- **Design premium** maintenu (Marine/Or, typographies modernes).
- **Extensible** : vous pouvez ajouter des rapports financiers, des graphiques, ou des notifications IA dès que vous le souhaitez.
