
# 🧠 Guide d'Utilisation : Intelligence Juridique & RAG (LexAI 2.0)

Ce module permet d'étendre les connaissances de votre assistant juridique ("LexAI") en lui fournissant vos propres textes de loi, jurisprudence et doctrines. En version 2.0, ce système alimente également les analyses stratégiques et le pilotage des dossiers.

---

## 1. Architecture du Système

Le système repose sur une architecture **RAG (Retrieval-Augmented Generation)** :
1.  **Retrieval (Récupération)** : Quand vous posez une question ou analysez un document adverse, le système cherche d'abord les documents pertinents dans votre *Base de Connaissance interne*.
2.  **Generation (Génération)** : Il fournit ces documents à l'IA pour qu'elle formule une réponse précise, sourcée et fiable.

Ceci garantit la **souveraineté de vos données** et évite les "hallucinations" de l'IA.

---

## 2. Alimenter la Base de Connaissance (V2.0)

Il existe trois méthodes principales pour enrichir l'IA :

### A. Ajout Manuel avec OCR Réel (Nouveau)
*   Allez dans **Recherche** > Bouton **"Ajouter Document (RAG)"**.
*   Uploadez directement un PDF scanné ou une photo de texte.
*   **L'OCR intégré** extrait automatiquement le texte.
*   Validez les métadonnées (Titre, Acte Uniforme, Juridiction).

### B. Import de Documents de Dossiers
*   Tout document (assignation, contrat) versé dans un dossier et validé par l'avocat peut être "indexé" dans la base de connaissance globale pour servir de précédent.

### C. Le "Crawler" (Veille Automatique)
*   Entrez l'URL d'un texte de loi officiel (ex: page `jo.gouv.sn` ou `ohada.com`).
*   Le système extrait le texte et le place en **File d'Attente** pour validation humaine.

---

## 3. Workflow de Validation & Intelligence

Pour garantir la qualité des réponses, tout texte doit être validé :

1.  **Nettoyage IA** : L'IA pré-nettoie les captures (suppression des menus web, publicités).
2.  **Validation Avocat** : Un associé examine et clique sur **"Approuver & Intégrer"**.
3.  **Vectorisation** : Le document devient instantanément une source pour toutes les analyses futures.

---

## 4. Utilisation de l'Assistant 2.0

### A. Analyse de Pièces Adverses
*   Uploadez les conclusions de la partie adverse.
*   LexAI les compare à votre base de jurisprudence validée.
*   L'IA identifie les contradictions et suggère des répliques basées sur vos sources.

### B. Rédaction d'Actes & Pilotage
*   Générez des clauses basées sur vos propres précédents.
*   L'IA s'appuie sur la "Bible des Modèles" du cabinet pour assurer la continuité du style et de la rigueur.

---

## 5. Recherche Sémantique & Performance

Le système utilise désormais un **Cache Intelligent** qui mémorise les recherches fréquentes pour économiser les ressources et accélérer les réponses (temps de réponse < 2s pour les sources connues).

---
**Version** : 2.0.0 | **Mis à jour** : Janvier 2026 | **LexPremium Intelligence**
