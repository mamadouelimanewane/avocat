# Manuel d'Architecture Système - LexPremium ERP

## 1. Vue d'Ensemble de l'Écosystème
LexPremium est conçu comme une architecture distribuée moderne centrée sur la donnée. Le système repose sur trois piliers : la persistance (MongoDB), le traitement serverless (Vercel) et l'intelligence augmentée (OpenAI).

## 2. Couche de Persistance et Schémas (Prisma)
### 2.1 Modélisation NoSQL Relational-Like
Bien que nous utilisions MongoDB (NoSQL), Prisma nous permet de définir des relations strictes. Par exemple, un `Dossier` possède une relation obligatoire avec un `Client` et optionnelle avec un `User` (l'avocat assigné).
### 2.2 Arborescence des Documents (GED)
Les fichiers physiques sont stockés sur Vercel Blob ou un stockage S3 compatible. La base de données ne stocke que les métadonnées et les chemins d'accès, garantissant une base de données légère et performante.

## 3. Flux d'Intelligence Artificielle (RAG)
### 3.1 Mécanisme de Recherche Augmentée
Lorsqu'une question est posée à LexA :
1. Le système extrait les mots-clés de la question.
2. Il interroge la collection `Jurisprudence` pour trouver les textes de loi pertinents.
3. Il injecte ces textes dans le "prompt" envoyé à l'IA.
Cela garantit que l'IA ne "hallucine" pas et se base sur le droit réel.
### 3.2 Traitement des Documents (OCR)
Pour les scan PDF, nous utilisons `Tesseract.js` en arrière-plan pour convertir les images en texte exploitable par l'IA de résumé.

## 4. Architecture de Sécurité
### 4.1 Authentification Stateless
Nous n'utilisons pas de serveur de session centralisé. Chaque requête est authentifiée par un jeton sécurisé présent dans les cookies, ce qui permet à l'application d'être extrêmement résiliente aux pics de charge.
### 4.2 Isolation des Données
Chaque cabinet (ou instance) dispose de sa propre chaîne de connexion, assurant qu'aucune donnée ne peut fuiter d'un environnement à un autre.
