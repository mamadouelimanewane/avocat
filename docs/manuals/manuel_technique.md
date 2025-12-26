# Manuel Technique et de Maintenance Approfondi

## 1. Architecture Logicielle et Choix Techniques
### 1.1 Frontend : Next.js 14 App Router
L'application utilise les "Server Components" par défaut pour optimiser le SEO et la vitesse de chargement. Les composants "Client side" (annotés `'use client'`) sont réservés aux interactions dynamiques comme le chronomètre ou l'assistant LexA.
### 1.2 Backend : Server Actions
Au lieu d'API routes classiques, nous utilisons les `Server Actions` (dans `app/actions.ts`). Cela permet un typage de bout en bout (End-to-end type safety) entre la base de données et l'interface.
### 1.3 Base de Données : MongoDB & Prisma
Le choix de MongoDB permet de stocker des structures de documents variées (GED). Prisma sert de pont typé, garantissant que chaque transaction respecte le schéma défini dans `prisma/schema.prisma`.

## 2. Structure de Données Détaillée
### 2.1 Modèle User (Le Cabinet)
Contient les rôles (ADMIN, AVOCAT, COLLABORATEUR). Le champ `permissions` est un tableau JSON permettant de masquer/afficher certains modules (ex: Comptabilité réservée aux admins).
### 2.2 Modèle Dossier (L'Affaire)
C'est l'objet pivot. Il lie :
- Les `TransactionLines` pour le coût.
- Les `Events` pour l'agenda.
- Les `Documents` pour la GED.
### 2.3 Modèle Facture (La Finance)
Gère le calcul automatique de la TVA (18% par défaut au Sénégal) et génère l'écriture comptable en classe 7 (Produits) lors de l'émission.

## 3. Guide de Maintenance et Débogage
### 3.1 Gestion des Clés API
L'application dépend de trois clés vitales dans Vercel :
- `DATABASE_URL` : Connexion MongoDB Atlas.
- `OPENAI_API_KEY` : Cerveau de LexA.
- `RESEND_API_KEY` : Envoi des emails de facturation.
### 3.2 Bibliothèque des erreurs connues (KB)
**Erreur : "PrismaClientKnownRequestError"**
- *Description* : Souvent dû à un ID MongoDB mal formaté ou une référence inexistante.
- *Solution* : Vérifier que l'objet lié (Client ou Dossier) n'a pas été supprimé.
**Erreur : "Resend configuration missing"**
- *Description* : Les emails ne partent pas.
- *Solution* : Vérifier que le domaine `lexpremium.sn` est bien validé dans votre compte Resend.
**Erreur : "Hydration Mismatch"**
- *Description* : Différence entre le rendu serveur et client (souvent sur les dates).
- *Solution* : Utiliser le composant `<NoSSR>` pour les éléments dépendant de l'heure locale.

## 4. Procédures de mise à jour (CI/CD)
Pour mettre à jour le système :
1. Faites vos modifications en local.
2. Testez le build avec `npm run build`.
3. Poussez sur GitHub : `git push origin main`.
4. Vercel déploie automatiquement la nouvelle version.
