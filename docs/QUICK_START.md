# 🚀 Guide de Démarrage Rapide - Configuration IA

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

#### Option A : DeepSeek (5$ gratuits, recommandé)
1. Rendez-vous sur [https://platform.deepseek.com](https://platform.deepseek.com)
2. Créez un compte → **API Keys** → Générer
3. Ajoutez dans `.env.local` :
   ```bash
   DEEPSEEK_API_KEY="sk-votre-cle-ici"
   ```

#### Option B : OpenAI (si vous avez déjà un compte)
```bash
OPENAI_API_KEY="sk-votre-cle-openai"
```

### Étape 4 : Initialiser la Base
```bash
npx prisma db push
npm run db:seed
```

### Étape 5 : Lancer l'App
```bash
npm run dev
```
→ Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 🧪 Tester l'IA

### Test Automatique Complet
```bash
npm run test:ai
```

Vous verrez :
```
✓ Interprétation Commandes Vocales
✓ Analyse Contractuelle  
✓ Extraction Filtres de Recherche
✓ Génération IA (DeepSeek/OpenAI)

🎉 TOUS LES TESTS RÉUSSIS (4/4)
```

### Test Manuel Rapide

1. **LexAI Chat** (Coin bas-droit)
   - Cliquez sur l'icône Bot 🤖
   - Posez : *"Quel est le délai d'appel en droit OHADA ?"*
   - ✅ Vous devez avoir une réponse avec sources

2. **Commandes Vocales** (Coin bas-gauche)
   - Cliquez sur le micro 🎤
   - Dites : *"Créer une note que le client a appelé"*
   - ✅ Une tâche doit apparaître dans le dashboard

3. **Analyse Contrat**
   - Menu → **LexAI Assistant** → Onglet **Analyse Contractuelle**
   - Collez un contrat ou cliquez Upload
   - ✅ Risques juridiques détectés

4. **Calculateur Indemnités**
   - Menu → **Outils & Ressources** → Onglet **Indemnités**
   - Salaire: 500000, Ancienneté: 5 ans
   - ✅ Calcul automatique affiché

---

## 📊 Tableau de Bord IA

### Voir les Statistiques
```javascript
// Dans la console développeur (F12)
const { aiAnalytics } = await import('/lib/ai-analytics')
console.log(aiAnalytics.getStats())
```

Résultat :
```json
{
  "totalCalls": 42,
  "cacheHitRate": "65%",
  "totalCost": "0.0124 $",
  "costSaved": "0.0027 $",
  "byModel": { "deepseek": 38, "openai": 0, "fallback": 4 }
}
```

---

## 🔧 Dépannage Rapide

### "Mode dégradé actif"
**Cause** : Aucune clé API configurée  
**Solution** : 
```bash
# Ajoutez dans .env.local
DEEPSEEK_API_KEY="sk-..."  # OU
OPENAI_API_KEY="sk-..."

# Redémarrez
npm run dev
```

### "Cannot find module '@/lib/ai'"
**Cause** : Problème de build TypeScript  
**Solution** :
```bash
rm -rf .next
npm run dev
```

### Cache ne fonctionne pas
**Solution** :
```javascript
// Console F12
const { aiCache } = await import('/lib/ai-cache')
aiCache.clear()  // Vide le cache
```

### Commandes vocales non reconnues
**Cause** : Navigateur non supporté  
**Solution** : Utilisez **Chrome** ou **Edge** (pas Safari)

---

## 📈 Optimisations Activées

✅ **Cache Intelligent** :
- Durée : 24h
- Économies : ~$0.0001 par requête en cache
- Hit rate cible : >60%

✅ **Analytics Automatiques** :
- Tracking tokens
- Coûts par modèle
- Recommandations auto

✅ **Fallback Automatique** :
```
DeepSeek (1er choix, -80% coût)
    ↓ Si erreur
OpenAI (2ème choix)
    ↓ Si erreur
Mode Dégradé RAG Local (toujours marche)
```

---

## 🎯 Fonctionnalités Clés

| Fonctionnalité | Avec API | Sans API |
|----------------|----------|----------|
| LexAI Chat | ✅ IA complète | ✅ RAG local |
| Analyse Contrats | ✅ Détection avancée | ✅ Regex basique |
| Rédaction Actes | ✅ Génération | ✅ Templates |
| Commandes Vocales | ✅ NLP | ✅ Patterns |
| Recherche | ✅ Sémantique | ✅ Mots-clés |

---

## 📚 Next Steps

1. ✅ **Production** → Voir `docs/DEPLOYMENT.md` (TODO)
2. ✅ **Formation équipe** → Démo 15min avec cas pratiques
3. ✅ **Monitoring** → Dashboard analytics IA (TODO)
4. ✅ **Fine-tuning** → Modèle spécialisé (longue échéance)

---

## 💡 Astuces Pro

### Économiser des Coûts
```bash
# 1. Privilégier DeepSeek (5x moins cher)
DEEPSEEK_API_KEY="sk-..."

# 2. Augmenter TTL cache (si besoin)
# Dans lib/ai-cache.ts : ttl = 48h au lieu de 24h

# 3. Limiter max_tokens
# Dans lib/ai.ts : max_tokens: 1000 au lieu de 2000
```

### Améliorer Précision
```bash
# Questions plus précises
❌ "licenciement"
✅ "Calcul indemnité licenciement sans faute après 5 ans ancienneté"

# Spécifier le contexte
✅ "En droit sénégalais, ..."
✅ "Selon l'OHADA, ..."
```

---

**Support** : Consultez `docs/AI_CONFIGURATION.md` pour troubleshooting avancé

**Version** : 1.0.0 | **Mis à jour** : Décembre 2024
