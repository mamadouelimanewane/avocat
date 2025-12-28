# Manuel Technique Exhaustif - LexPremium ERP

## 1. Stack Technologique Pro-Grade
LexPremium repose sur une architecture moderne conçue pour la performance et la sécurité des données juridiques.

### 1.1 Le Framework : Next.js 14
Nous utilisons le **App Router** pour bénéficier de :
- **Server Components** : Réduction du Javascript envoyé au navigateur pour une rapidité record.
- **Streaming & Suspense** : Chargement progressif de l'interface, crucial pour les listes de dossiers volumineuses.
- **Server Actions** : Communication sécurisée avec la base de données sans exposer d'API REST publiques.

### 1.2 Persistance : MongoDB Atlas
Le choix du NoSQL est stratégique :
- **Souplesse du Schéma** : Permet d'ajouter des champs spécifiques (audiences, pièces jointes) sans migration lourde.
- **Scalabilité** : Capacité à gérer des millions de documents GED.
- **Prisma ORM** : Couche d'abstraction typée garantissant que chaque transaction respecte les règles métier du cabinet.

## 2. Structure et Organisation du Code
L'application suit une structure modulaire stricte :
- `/app` : Définition des routes, composants serveurs et logique métier (Server Actions).
- `/components` : Bibliothèque de composants atomiques (Layout, UI, AI features).
- `/lib` : Singletons de connexion (Prisma, OpenAI, Resend) et utilitaires de formatage.
- `/prisma` : La "Source de Vérité" de la donnée (Schema et Scripts d'initialisation).

## 3. Logique d'Intelligence Artificielle (AI Engine)
L'intelligence est injectée via deux moteurs :
1. **Chat Engine** : Basé sur GPT-4o ou DeepSeek, il gère le dialogue contextuel avec l'avocat.
2. **Analysis Engine** : Spécialisé dans l'extraction de données structurées depuis les pièces de procédure (PDF/Images).

## 4. Sécurité et Conformité RGPD/Afrique
- **Encryption au Repos** : Toutes les données sur MongoDB Atlas sont chiffrées (AES-256).
- **Isolation des Sessions** : Utilisation de cookies HTTP-Only protégés contre les attaques XSS et CSRF.
- **Audit Logs** : Chaque suppression de document ou modification de facture laisse une trace indélébile en base de données.

## 5. Intégrations Tierces (Third-party)
- **Resend** : Service de messagerie haute délivrabilité pour les factures.
- **WhatsApp API** : Intégration via protocole wa.me simplifié pour une adoption immédiate sans frais d'API complexes.
- **xlsx** : Moteur de génération de fichiers Excel haute performance côté client.

## 6. Guide de Build et Déploiement
Le pipeline CI/CD est automatisé sur **Vercel** :
1. Validation statique via TypeScript.
2. Linting des composants UI.
3. Optimisation des polices et images.
4. Déploiement sur Edge Network pour une latence minimale en Afrique.
