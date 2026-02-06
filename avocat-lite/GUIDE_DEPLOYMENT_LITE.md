# 🚀 GUIDE DE DÉPLOIEMENT : LEXPREMIUM LITE (DUO EDITION)

## 📋 Présentation
LexPremium Lite est la version optimisée pour les avocats individuels. Conçue pour la rapidité et la simplicité, elle intègre l'intelligence artificielle LexAI au cœur de l'expérience utilisateur.

---

## 🏗️ Architecture Technique
- **Framework** : Next.js 16 (Turbopack)
- **Base de données** : MongoDB via Prisma (Modèles simplifiés)
- **Design** : Tailwind CSS v4 (Mobile-First)
- **Authentification** : Gestion hybride (Hachage Bcrypt + Support Legacy)

---

## 📱 Optimisation Mobile & Tablette
La version Lite est entièrement **Mobile-Responsive**. 
### Points clés du Mode Mobile :
1. **Menu Mobile (Sheet)** : Accessible via l'icône burger ☰ en haut à gauche.
2. **Dashboard Adaptatif** : Les statistiques s'empilent verticalement pour une lecture parfaite.
3. **Tableaux Scrollables** : Les factures et dossiers peuvent être consultés par glissement latéral.
4. **LexAI Chat** : Interface plein écran optimisée pour le clavier du smartphone.

---

## 🛠️ Étapes de Déploiement

### 1. Configuration de l'environnement
Copiez votre `DATABASE_URL` (MongoDB Atlas) dans le fichier `.env` à la racine de `avocat-lite`.

### 2. Installation des dépendances
```bash
cd c:/gravity/Avocat/avocat-lite
npm install
```

### 3. Synchronisation de la Base de Données
```bash
npx prisma generate
npx prisma db push
```

### 4. Build de Production
```bash
npm run build
```

### 5. Lancement Local (Test)
```bash
npm start
```

---

## 📦 Structure des Fichiers Clés
- `src/app/` : Routes et pages de l'application.
- `src/components/` : Composants UI réutilisables (Sidebar, MobileSidebar).
- `src/lib/` : Utilitaires (Prisma, CN).
- `prisma/` : Schéma de base de données Lite.

---

## 🎯 Recommandations Commerciales
- **Hébergement** : Déployez sur **Vercel** pour bénéficier des performances edge et du HTTPS automatique.
- **Accès Client** : Désactivez la "Vercel Deployment Protection" pour permettre aux prospects de tester directement.
- **Support** : Fournissez le lien direct vers le **Manuel d'Utilisation Lite** (à venir).

---

**Version** : 1.0.0 (Janvier 2026)  
**Auteur** : LexPremium Engineering  
**Statut** : ✅ PRÊT POUR DÉPLOIEMENT
