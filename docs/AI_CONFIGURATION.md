# 🤖 Configuration de l'Intelligence Artificielle (V2.0)

## Vue d'ensemble

Avocat Premium 2.0 intègre des fonctionnalités d'IA et d'automatisation avancées :

- ✅ **LexAI Assistant** : Chatbot expert en droit Sénégalais et OHADA.
- ✅ **Analyse Stratégique** : Analyse des conclusions adverses et détection de failles.
- ✅ **OCR Réel** : Extraction full-text depuis PDF scannés et images (Nouveau).
- ✅ **Smart Recovery** : Scoring risque client et relances automatisées (Nouveau).
- ✅ **Succession Pro** : Moteur expert de liquidation successorale.
- ✅ **Commandes Vocales** : Pilotage du cabinet par la voix.

## Configuration des Clés API

### 1. Intelligence Artificielle (DeepSeek / OpenAI) 💰

L'application utilise un système de **Fallback Intelligent** : DeepSeek est privilégié pour son coût réduit (-80%), OpenAI est utilisé en secours.

**Clés dans `.env.local` :**
```bash
DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxx"
OPENAI_API_KEY="sk-xxxxxxxxxxxxx"
```

### 2. Recouvrement & WhatsApp (Twilio) 📞

Pour utiliser le module de relances par WhatsApp, vous devez configurer un compte Twilio (ou équivalent).

**Variables requises :**
```bash
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxx"
TWILIO_WHATSAPP_NUMBER="whatsapp:+221xxxxxxxxx"
```

### 3. OCR & Documents (Tesseract.js) 🔍

L'OCR est exécuté localement dans le navigateur (ou serveur via `lib/ocr.ts`). Aucune clé API externe n'est requise. Les bibliothèques `pdf-parse` et `mammoth` gèrent les formats PDF et DOCX nativement.

---

## Optimisations de Performance

### 💾 Cache Intelligent (ACTIF)
Le système de cache (`lib/ai-cache.ts`) réduit les appels API de **60 à 80%**.
- TTL : 24h par défaut.
- Monitoring : Stats disponibles dans l'onglet **Monitoring IA**.

### 📊 Analytics & Coûts
Le module `lib/ai-analytics.ts` suit en temps réel la consommation de jetons et les économies réalisées par le cache.

---

## Test des Nouveaux Modules 2.0

### 1. Tester l'OCR Réel
1. Uploadez une image de contrat dans l'onglet **Documents** d'un dossier.
2. Cliquez sur l'aperçu → Le texte est automatiquement extrait dans le champ `ocrContent`.

### 2. Tester le Scoring Client
1. Allez dans `/recouvrement`.
2. Le score de risque est calculé dynamiquement pour chaque facture impayée.

### 3. Tester la Succession Pro
1. Allez dans `/succession`.
2. Utilisez l'interface multi-onglets pour une liquidation complexe.

---

## Débogage V2.0

### WhatsApp ne s'envoie pas
- Vérifiez la validité de votre Token Twilio.
- Assurez-vous que le numéro est au format international (ex: +221).

### Erreur OCR PDF scanné
- Si le PDF est un scan de mauvaise qualité, essayez de le convertir en image (JPG) pour une meilleure reconnaissance par Tesseract.

---

**Version** : 2.0.0  
**Dernière mise à jour** : Janvier 2026

