# 🚀 Guide de Démarrage Rapide - LexPremium 2.0

## ⚡ Installation en 5 Minutes

### Étape 1 : Cloner & Installer
```bash
cd c:\gravity\Avocat
npm install
```

### Étape 2 : Configuration Base de Données
Créez `.env.local` avec :
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/avocat"
```

### Étape 3 : Configuration IA (Optionnel mais Recommandé)

#### Option A : DeepSeek (Recommandé - Économique)
1. Rendez-vous sur [https://platform.deepseek.com](https://platform.deepseek.com)
2. Créez un compte → **API Keys** → Générer
3. Ajoutez dans `.env.local` :
   ```bash
   DEEPSEEK_API_KEY="sk-votre-cle-ici"
   ```

#### Option B : OpenAI (GPT-4)
```bash
OPENAI_API_KEY="sk-votre-cle-openai"
```

### Étape 4 : Initialiser la Base
```bash
npx prisma generate
npx prisma db push
npm run db:seed  # Charge les données factices (facultatif)
```

### Étape 5 : Lancer l'App
```bash
npm run dev
```
→ Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 🔝 Nouveautés Stratégiques 2.0

### 1. **Tableau de Bord Exécutif** 📊
- Accédez à `/executive`
- Vision 360° : CA, Marge, Trésorerie à 90j.
- Alertes automatiques sur les dossiers à risque.

### 2. **Module de Recouvrement IA** 💰
- Accédez à `/recouvrement`
- Scoring client automatique (0-100).
- Relances WhatsApp & Email en un clic.

### 3. **Calculateur Succession Pro** ⚖️
- Accédez à `/succession`
- 10 méthodes conformes au Code de la Famille.
- Liquidation, Réserve, Usufruit et Partage PDF.

---

## 🧪 Tester les Fonctions Avancées

### 1. **OCR Réel (Nouveau)** 🔍
- Allez dans un **Dossier** → Onglet **Documents**.
- Uploadez un PDF scanné ou une photo.
- ✅ Le texte est extrait fidèlement via Tesseract.js.

### 2. **Analyse de Risques IA** 🤖
- Allez dans **LexAI Assistant** → **Analyse Adverse**.
- Collez les conclusions de la partie adverse.
- ✅ L'IA identifie les points faibles et suggère des répliques.

### 3. **Pilotage Financier** 📈
- Émettez une facture de test dans le menu **Factures**.
- Revenez sur le **Dashboard Exécutif** (`/executive`).
- ✅ Les graphiques et KPI se mettent à jour instantanément.

---

## 🔧 Dépannage Rapide

### "Erreur de connexion base de données"
**Solution** : Vérifiez que l'IP de votre machine est autorisée dans les paramètres "Network Access" de votre cluster MongoDB Atlas.

### "L'IA ne répond plus"
**Solution** : 
1. Vérifiez votre solde sur DeepSeek/OpenAI.
2. Vérifiez la clé dans `.env.local`.
3. Redémarrez le serveur (`Ctrl+C` puis `npm run dev`).

### "WhatsApp ne s'envoie pas"
**Cause** : Nécessite une clé API Twilio ou WhatsApp Business active.
**Solution** : Configurez les variables `TWILIO_...` dans votre fichier `.env`.

---

## 📈 Optimisations 2.0 Activées

✅ **Cache Intelligent** : Hit rate cible >65% (Économie de tokens).
✅ **Multilingual** : Support Français & Wolof (LexAI).
✅ **OCR Multi-format** : PDF, JPG, PNG, DOCX supportés nativement.
✅ **Responsive** : Utilisation fluide sur Tablette (War Room) et Mobile.

---

## 🎯 Comparatif 1.0 vs 2.0

| Fonctionnalité | Version 1.0 | Version 2.0 |
|----------------|-------------|-------------|
| **Pilotage** | Dashboard basique | **Cockpit Exécutif (KPI, Alertes)** |
| **Recouvrement** | Manuel | **Smart Recovery (Scoring IA, WhatsApp)** |
| **Succession** | Simple (Calculatrice) | **Expert (10 méthodes, Acte PDF)** |
| **OCR** | Simulé | **Réel (Extraction full-text)** |
| **IA** | Chat simple | **Analyse stratégique & Prédiction** |

---

## 📚 Ressources Utiles

1. 📘 [Guide Utilisateur Complet 2026](../LexPremium_Guide_Utilisateur_Complet_2026_V2.md)
2. 📊 [Présentation PowerPoint 2.0](../LexPremium_Presentation_Complete_2026_V2.md)
3. ⚖️ [Documentation des Méthodes de Succession](../METHODES_SUCCESSION.md)

---

**Version** : 2.0.0 | **Mis à jour** : Janvier 2026 | **Auteur** : LexPremium Team 🇸🇳

