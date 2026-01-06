# 📄 Manuel de Passation Technique - LexPremium V1.0

## 1. Introduction
Ce document détaille l'architecture et les procédures d'exploitation de la plateforme **LexPremium**, une solution LegalTech avancée pour les cabinets d'avocats, intégrant l'IA Prédictive et la Signature Électronique.

## 2. Stack Technique
- **Frontend/Backend** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Base de Données** : MongoDB (via Prisma ORM)
- **Stylisation** : Tailwind CSS + Framer Motion
- **IA** : OpenAI (Whisper/GPT-4o) + DeepSeek (RAG/Analyse Juridique)
- **OCR** : Tesseract.js (Images) + PDF-Parse (PDF)
- **Paiements** : Module LexPay (Simulateur Wave & Orange Money)

## 3. Configuration de l'Environnement (.env)
Ces variables doivent être configurées dans le dashboard Vercel de production :

```bash
# Database
DATABASE_URL="votre_url_mongodb_atlas"

# AI Services
DEEPSEEK_API_KEY="votre_cle_deepseek"
OPENAI_API_KEY="votre_cle_openai"

# Security
NEXTAUTH_SECRET="votre_secret_aleatoire"
NEXTAUTH_URL="votre_domaine_final"

# Storage (Vercel Blob ou S3 si configuré)
# Par défaut, utilise /public/uploads pour le dev
```

## 4. Architecture de la Base de Données
Le schéma Prisma a été optimisé pour le Cloud :
- **Flexible Metadata** : Utilisation de champs JSON `metadata` pour stocker les résultats IA sans migrations lourdes.
- **Sécurité** : Les signatures sont scellées avec un hash SHA-256 dans le modèle `Document`.
- **OHADA** : Le plan comptable SYSCOHADA est intégré via le script de seed.

## 5. Déploiement & Maintenance

### Déploiement Initial
1. **GitHub** : Pousser les derniers changements sur la branche `main`.
2. **MongoDB Atlas** : Autoriser l'IP `0.0.0.0/0` dans Network Access.
3. **Vercel** : Lier le repo et ajouter les variables d'environnement.

### Mise à jour du Schéma
En cas de modification du fichier `schema.prisma` :
```bash
npx prisma db push
```

### Initialisation des Données (Seed)
Pour remplir la base avec les modèles d'actes et les codes OHADA :
```bash
npx prisma db seed
```

## 6. Fonctionnalités IA (Protocoles)
- **LexAI Voice** : Utilise Whisper pour transformer la voix en commandes structurées (Navigation/Création).
- **RAG ++** : Recherche sémantique par "embeddings" simulés via DeepSeek pour trouver la jurisprudence la plus proche du cas utilisateur.
- **Predictive Engine** : Analyse neurale des dossiers pour calculer une probabilité de succès (0-100%).

## 7. Sécurité & Conformité
- **Signature Électronique** : Conforme au COCC (Sénégal) et aux Actes Uniformes OHADA.
- **Audit Trail** : Historique complet des modifications de dossiers et d'états financiers.

---
*Document certifié par Antigravity AI pour LexPremium.*
