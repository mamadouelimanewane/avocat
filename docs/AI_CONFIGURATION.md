# 🤖 Configuration de l'Intelligence Artificielle

## Vue d'ensemble

Avocat Premium intègre des fonctionnalités d'IA avancées pour assister les avocats dans leurs tâches quotidiennes :

- ✅ **LexAI Assistant** : Chatbot juridique expert en droit Sénégalais et OHADA
- ✅ **Analyse Contractuelle** : Détection automatique de risques juridiques
- ✅ **Rédaction d'Actes** : Génération d'assignations, conclusions, contrats
- ✅ **Assistant de Plaidoirie** : Aide à la préparation d'arguments juridiques
- ✅ **Commandes Vocales** : Dictée et exécution de commandes par la voix
- ✅ **Recherche Intelligente** : Recherche en langage naturel dans la base juridique

## Configuration des Clés API

### Option 1 : DeepSeek (Recommandé) 💰

**Pourquoi DeepSeek ?**
- ✅ Prix : ~5x moins cher qu'OpenAI
- ✅ Performances excellentes sur les tâches juridiques
- ✅ Spécialisé dans le raisonnement complexe
- ✅ Support multilingue (Français impeccable)

**Étapes :**
1. Créez un compte sur [https://platform.deepseek.com](https://platform.deepseek.com)
2. Générez une clé API (environ 5$ de crédit gratuit)
3. Ajoutez dans votre fichier `.env.local` :
   ```bash
   DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxx"
   ```

**Tarifs DeepSeek (Jan 2025)** :
- Modèle `deepseek-chat` : ~$0.14 / 1M tokens input
- 1M tokens ≈ 750,000 mots ≈ 2000 pages de texte juridique

### Option 2 : OpenAI (Fallback)

**Si DeepSeek n'est pas disponible**, l'application bascule automatiquement sur OpenAI.

**Étapes :**
1. Créez un compte sur [https://platform.openai.com](https://platform.openai.com)
2. Ajoutez des crédits (minimum 5$)
3. Générez une clé API
4. Ajoutez dans `.env.local` :
   ```bash
   OPENAI_API_KEY="sk-xxxxxxxxxxxxx"
   ```

**Tarifs OpenAI (GPT-4o-mini)** :
- Input : $0.15 / 1M tokens
- Output : $0.60 / 1M tokens

### Option 3 : Mode Dégradé (Sans API)

Si aucune clé n'est configurée, l'application fonctionne en **mode dégradé** :
- ✅ Recherche RAG (Retrieval-Augmented Generation) dans la base locale
- ✅ Réponses basées sur les documents existants
- ✅ Analyses simplifiées (regex + règles)
- ⚠️ Pas de génération de texte avancée
- ⚠️ Pas de raisonnement juridique complexe

## Fonctionnalités par Mode

| Fonctionnalité | Avec API IA | Sans API (Dégradé) |
|----------------|-------------|---------------------|
| LexAI Chat | ✅ Réponses contextuelles | ✅ Sources + réponses simples |
| Analyse Contrats | ✅ Détection avancée | ✅ Regex basique |
| Rédaction Actes | ✅ Génération complète | ✅ Templates préremplis |
| Commandes Vocales | ✅ NLP avancé | ✅ Patterns basiques |
| Recherche Intelligente | ✅ Sémantique | ✅ Mots-clés |

## Fichiers Modifiés

### Backend (`lib/ai.ts`)
```typescript
// ✅ Nouvelles fonctions implémentées
export async function generateCompletion() // Génération IA réelle
export async function interpretVoiceCommand() // Interprétation vocale
export async function analyzeContractText() // Analyse contractuelle
export async function extractSearchFilters() // Parsing NLP
```

### Actions Mises à Jour
- `generateAIResponse()` → Utilise maintenant `lib/ai.ts`
- `analyzeContract()` → Analyse réelle avec détection de risques
- `processVoiceInput()` → Interprétation NLP des commandes
- `smartSearchJurisprudence()` → Extraction intelligente de filtres

## Test des Fonctionnalités

### 1. Tester LexAI Assistant
1. Cliquez sur le bouton **Bot** en bas à droite
2. Posez une question juridique : *"Quel est le délai d'appel en droit OHADA ?"*
3. Vérifiez que vous obtenez une réponse contextualisée avec sources

### 2. Tester l'Analyse Contractuelle
1. Allez dans **LexAI Assistant** > Onglet **Analyse Contractuelle**
2. Collez un texte de contrat ou cliquez sur Upload (OCR simulé)
3. Cliquez **Analyser avec LexAI**
4. Vérifiez les risques détectés (clauses abusives, dates, parties)

### 3. Tester les Commandes Vocales
1. Cliquez sur le **micro** en bas à gauche
2. Dites : *"Créer une note : Rappeler le client Dupont"*
3. Vérifiez qu'une tâche est créée dans le dashboard

### 4. Tester le Calculateur d'Indemnités
1. Allez dans **Outils & Ressources** > Onglet **Indemnités**
2. Configurez :
   - Type : Licenciement
   - Salaire : 500 000 FCFA
   - Ancienneté : 5 ans
3. Vérifiez le calcul automatique selon le Code du Travail

## Débogage

### Erreur : "Je n'ai pas pu générer de réponse"
- ✅ Vérifiez que `DEEPSEEK_API_KEY` ou `OPENAI_API_KEY` est dans `.env.local`
- ✅ Redémarrez le serveur : `npm run dev`
- ✅ Vérifiez les logs console pour voir les erreurs d'API

### Mode Dégradé Activé Automatiquement
- ℹ️ C'est normal si aucune clé API n'est configurée
- ℹ️ Les fonctionnalités basiques marchent toujours
- ℹ️ Un message "🤖 Mode dégradé actif" apparaît dans les réponses

### Commandes Vocales Ne Marchent Pas
- ✅ Vérifiez que vous utilisez **Chrome** ou **Edge** (Safari non supporté)
- ✅ Autorisez l'accès au micro dans votre navigateur
- ✅ Parlez clairement en français

## Sécurité & Performance

### Bonnes Pratiques
1. **JAMAIS** commit les clés API dans Git
2. Utilisez des variables d'environnement séparées pour dev/prod
3. Limitez les quotas API pour éviter les surcoûts
4. Activez le rate limiting pour les appels IA

### Optimisations
- ✅ Cache des réponses fréquentes (TODO)
- ✅ RAG local avant appel API (déjà implémenté)
- ✅ Streaming des réponses longues (TODO)
- ✅ Compression des prompts (TODO)

## Support

Pour toute question sur la configuration IA :
1. Consultez la documentation DeepSeek : https://docs.deepseek.com
2. Consultez la documentation OpenAI : https://platform.openai.com/docs
3. Vérifiez les logs dans `_dev` folder (si activé)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024
