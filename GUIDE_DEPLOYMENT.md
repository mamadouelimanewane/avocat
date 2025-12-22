
# 🚀 Guide de Déploiement : GitHub & Vercel

Ce guide vous accompagne pour mettre en ligne votre application **LexPremium** afin de réaliser des démonstrations sur Desktop et Mobile.

## 1. GitHub (Code Source)
Le code est prêt et "commité" localement. Vous devez maintenant l'envoyer sur le cloud.

1.  Allez sur [GitHub.com/new](https://github.com/new) et créez un nouveau répertoire (ex: `lexpremium-erp`).
2.  Ne cochez **pas** "Initialize with README".
3.  Copiez l'URL HTTPS du repo (ex: `https://github.com/votre-user/lexpremium-erp.git`).
4.  Dans votre terminal local (ou demandez-moi), lancez :
    ```bash
    git remote add origin https://github.com/VOTRE_USER/lexpremium-erp.git
    git branch -M main
    git push -u origin main
    ```

## 2. Base de Données (MongoDB Atlas)
Pour que la démonstration fonctionne sur Vercel (Cloud), vous ne pouvez pas utiliser votre base locale.

1.  Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Créez un Cluster (M0 Sandbox est gratuit).
3.  Créez un utilisateur Database (ex: `app_user` / `password123`).
4.  Récupérez la chaîne de connexion ("Connect" > "Drivers" > "Node.js").
    *   Format : `mongodb+srv://app_user:password123@cluster0.p8xyz.mongodb.net/lexpremium?retryWrites=true&w=majority`

## 3. Vercel (Hébergement)

1.  Allez sur [Vercel.com](https://vercel.com) et connectez-vous avec GitHub.
2.  Cliquez sur **"Add New..."** > **"Project"**.
3.  Importez le répertoire `lexpremium-erp` depuis votre liste GitHub.
4.  **Important : Configuration des variables d'environnement**
    *   Dans la section "Environment Variables", ajoutez :
        *   `DATABASE_URL` = (Votre chaîne de connexion MongoDB Atlas ci-dessus)
5.  Cliquez sur **"Deploy"**.

## 4. Finalisation (Seed)
Une fois déployé, votre base de données sera vide. Pour la remplir avec les données de démonstration (CRM, RH, Dossiers) :

1.  Sur votre machine locale, modifiez votre fichier `.env` pour mettre temporairement l'URL de MongoDB Atlas.
2.  Lancez la commande de validation qui va peupler la base distante :
    ```bash
    npx prisma db push
    node check-system.mjs
    node prisma/seed-crm.mjs
    node prisma/seed-directory.mjs
    node prisma/seed-audiences.mjs
    ```
3.  Vos données sont maintenant dans le Cloud et visibles sur l'URL Vercel !

## 5. Démo Mobile
L'application est "Responsive".
*   Ouvrez l'URL Vercel (ex: `lexpremium.vercel.app`) sur votre smartphone.
*   Le menu latéral est masqué et accessible via le bouton "Menu" en haut à gauche.
