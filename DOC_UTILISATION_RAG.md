
# 🧠 Guide d'Utilisation : Intelligence Juridique & RAG (LexAI)

Ce module permet d'étendre les connaissances de votre assistant juridique ("LexAI") en lui fournissant vos propres textes de loi, jurisprudence et doctrines.

---

## 1. Architecture du Système

Le système repose sur une architecture **RAG (Retrieval-Augmented Generation)** :
1.  **Retrieval (Récupération)** : Quand vous posez une question, le système cherche d'abord les documents pertinents dans votre *Base de Connaissance interne*.
2.  **Generation (Génération)** : Il fournit ces documents à l'IA pour qu'elle formule une réponse précise, sourcée et fiable.

Ceci garantit la **souveraineté de vos données** et évite les "hallucinations" de l'IA.

---

## 2. Alimenter la Base de Connaissance

Il existe deux méthodes pour enrichir l'IA :

### A. Ajout Manuel (Import PDF/Texte)
*   Allez dans **Recherche** > Bouton **"Ajouter Document (RAG)"**.
*   Remplissez les métadonnées (Titre, Acte Uniforme, Juridiction).
*   Collez le texte intégral ou le résumé.
*   *Astuce : Vous pouvez utiliser l'OCR pour extraire le texte de vos PDF scannés avant de le coller.*

### B. Le "Crawler" (Veille Automatique)
*   Allez dans **Recherche** > **Validation & Veille** (Lien caché ou admin).
*   Entrez l'URL d'un texte de loi officiel (ex: page `jo.gouv.sn` ou `ohada.com`).
*   Cliquez sur **"Lancer le Crawl"**.
*   Le système va "lire" la page, extraire le texte et le placer en **File d'Attente**.

---

## 3. Workflow de Validation

Pour garantir la qualité des réponses de l'IA, aucun texte "crawlé" n'est utilisé directement. Il doit être validé.

1.  Accédez à la page **Validation**.
2.  Consultez la liste "File d'Attente".
3.  Cliquez sur **"Examiner & Valider"**.
4.  **Nettoyez le texte** : Le robot peut avoir capturé des menus ou des publicités. Supprimez-les dans l'éditeur.
5.  Cliquez sur **"Approuver & Intégrer"**.
    *   Le document passe au statut `VALIDATED`.
    *   Il devient instantanément accessible pour l'Assistant IA.
    *   (Optionnel) Il est vectorisé pour la recherche sémantique.

---

## 4. Utilisation de l'Assistant

1.  Cliquez sur la bulle **LexAI** (en bas à droite).
2.  Choisissez le mode :
    *   **Recherche** : Pour poser une question de droit ("Quel est le délai de prescription..."). L'IA citera ses sources.
    *   **Rédaction** : Pour générer une clause ("Rédige une clause de non-concurrence basée sur l'arrêt CCJA N°25...").
3.  L'assistant vous répondra en utilisant **uniquement** ou **prioritairement** les documents validés de votre base.

---

## 5. Recherche Vectorielle (Avancé)

Le système est "Vector-Ready". Cela signifie qu'il est prêt à chercher des concepts plutôt que des mots-clés exacts.
*   *Mots-clés* : Chercher "Licenciement" ne trouve que "Licenciement".
*   *Vecteurs* : Chercher "Renvoi de l'employé" trouvera "Licenciement", "Rupture de contrat", "Démission forcée".

*Note technique : L'activation complète nécessite une clé API d'embeddings (OpenAI ou Mistral) connectée au backend.*
