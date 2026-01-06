
# 🚀 Guide de Déploiement : GitHub & Vercel (V2.0)

Ce guide vous accompagne pour mettre en ligne votre application **LexPremium 2.0** afin de réaliser des démonstrations sur Desktop et Mobile avec toutes les fonctionnalités d'IA et de pilotage.

## 1. GitHub (Code Source)
Le code est prêt et inclut les nouveaux modules (Executive, Recouvrement, Succession).
1.  Allez sur [GitHub.com/new](https://github.com/new).
2.  Copiez l'URL du repo.
3.  Dans votre terminal :
    ```bash
    git push -u origin main
    ```

## 2. Base de Données (MongoDB Atlas)
1.  Utilisez votre Cluster MongoDB Atlas existant ou créez-en un nouveau.
2.  Récupérez la chaîne de connexion `DATABASE_URL`.

## 3. Vercel (Configuration App 2.0)

1.  Importez votre projet sur Vercel.
2.  **Variables d'Environnement (Crucial pour la V2.0) :**
    Ajoutez ces variables dans les paramètres du projet Vercel :
    *   `DATABASE_URL` : Votre lien MongoDB Atlas.
    *   `DEEPSEEK_API_KEY` : Votre clé DeepSeek (prioritaire).
    *   `OPENAI_API_KEY` : Votre clé OpenAI (fallback).
    *   `NEXT_PUBLIC_APP_URL` : L'URL de votre site (ex: `https://lex-app.vercel.app`).
    *   `TWILIO_ACCOUNT_SID` & `TWILIO_AUTH_TOKEN` : Si vous activez les relances WhatsApp.

3.  Cliquez sur **"Deploy"**.

## 4. Initialisation des Données Stratégiques (Seed)
Pour que votre cockpit exécutif et vos calculs successoraux soient probants, peuplez la base avec les nouveaux scripts :

1.  Dans votre terminal local connecté à la base distante :
    ```bash
    npx prisma generate
    npx prisma db push
    # Scripts de peuplement stratégique
    node scripts/seed-executive.mjs
    node scripts/seed-recouvrement.mjs
    node scripts/seed-succession.mjs
    ```

## 5. Expérience "War Room" sur Tablette/Mobile
LexPremium 2.0 est optimisé pour les tablettes au tribunal.
*   **Accès Hors Ligne** : Les pièces consultées sont mises en cache pour le mode "Palais de Justice".
*   **Responsive Pro** : Interface optimisée pour iPad et tablettes Android en mode paysage.

---
**Version** : 2.0.0 | **Mis à jour** : Janvier 2026
