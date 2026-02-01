# 🔐 GUIDE DE TEST - PORTAIL CLIENT

**Date :** 31 Janvier 2026  
**Statut :** ✅ Prêt pour test

---

## 📋 INFORMATIONS DE CONNEXION

### Vos Identifiants Client

| Champ | Valeur |
|-------|--------|
| **Email** | mamadouelimane@gmail.com |
| **Code d'accès (PIN)** | **777000** |
| **Nom affiché** | M. Mamadou Elimane Wane |

---

## 🚀 PROCÉDURE DE TEST

### Étape 1 : Accéder au Portail
1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:3001/portal/login**
3. Vous verrez la page de connexion sécurisée

### Étape 2 : Se Connecter
1. **Email** : Entrez `mamadouelimane@gmail.com`
2. **Code d'accès** : Entrez `777000`
3. Cliquez sur **"Accéder à mon espace"**
4. Vous serez redirigé vers votre tableau de bord personnel

### Étape 3 : Explorer Votre Espace

Une fois connecté, vous verrez :

#### A. Statistiques Personnelles
- **Dossiers en cours** : 1 (Divorce Contentieux Fall c. Diop)
- **Documents signés** : 1 (Livret de Famille)
- **Factures à régler** : 1 (Provision 295 000 FCFA)

#### B. Suivi de Votre Affaire (Timeline Interactive)
- **Référence** : DOS-2024-015
- **Titre** : Divorce Contentieux Fall c. Diop
- **Statut** : INSTRUCTION
- **Progression** : Stepper visuel Amazon-style avec 5 étapes
  - ✅ Saisine (Complétée)
  - 🔵 Mise en état (En cours)
  - ⏳ Plaidoirie (À venir)
  - ⏳ Délibéré (À venir)
  - ⏳ Clôturé (À venir)

#### C. Prochaine Audience
- **Date** : Aujourd'hui, 14:00
- **Type** : Préparation Plaidoirie
- **Lieu** : Cabinet - Salle de réunion 1

#### D. Documents Disponibles
- **Livret de Famille.pdf**
- Statut : En révision
- Action : Télécharger

#### E. Factures
- **N° PROV-2024-089**
- **Montant** : 295 000 FCFA
- **Statut** : EMISE (À payer)
- **Action** : Bouton "Payer en ligne"

---

## ✨ FONCTIONNALITÉS À TESTER

### 1. Navigation
- [x] Connexion avec vos identifiants
- [x] Affichage du tableau de bord
- [x] Visualisation du dossier
- [x] Consultation des documents
- [x] Vérification des factures

### 2. Interactions
- [ ] Cliquer sur "Contacter le Cabinet" (en-tête)
- [ ] Cliquer sur "Consulter les pièces" (dans le dossier)
- [ ] Cliquer sur "Contacter Maître" (dans le dossier)
- [ ] Cliquer sur "Télécharger" (document)
- [ ] Cliquer sur "Payer en ligne" (facture)

### 3. Sécurité
- [ ] Tester la déconnexion (bouton LogOut)
- [ ] Vérifier la redirection vers login après déconnexion
- [ ] Tester une reconnexion

---

## 🎯 SCÉNARIOS DE DÉMONSTRATION CLIENT

### Scénario 1 : Connexion Sécurisée (30 secondes)
1. Montrer la page de login professionnelle
2. Entrer les identifiants
3. Montrer la notification "Session Sécurisée" (badge vert)

### Scénario 2 : Suivi en Temps Réel (1 minute)
1. Montrer le stepper de progression
2. Expliquer l'étape actuelle (Mise en état)
3. Montrer la prochaine audience avec animation

### Scénario 3 : Transparence Financière (30 secondes)
1. Montrer la facture en attente
2. Expliquer le bouton "Payer en ligne"
3. Montrer le reçu PDF pour factures payées

---

## 📊 DONNÉES INJECTÉES POUR VOTRE COMPTE

### Dossier
- **Référence** : DOS-2024-015
- **Type** : Divorce Contentieux
- **Partie adverse** : M. Oumar Diop
- **Avocat adverse** : Me Sall
- **Étape actuelle** : INSTRUCTION

### Événements
- **Aujourd'hui 14:00** : Préparation Plaidoirie - Mme Fall
- **Lieu** : Cabinet - Salle de réunion 1

### Documents
- **Livret de Famille.pdf** (En révision)

### Finances
- **Provision** : 295 000 FCFA (À payer)
- **Date d'émission** : Il y a 30 jours
- **Échéance** : Dépassée (affichage en orange)

---

## 🔒 SÉCURITÉ & CONFIDENTIALITÉ

Le portail client implémente :
- ✅ **Authentification par code PIN** (6 chiffres)
- ✅ **Session sécurisée** (localStorage avec timeout)
- ✅ **Isolation des données** (chaque client ne voit que ses dossiers)
- ✅ **Chiffrement HTTPS** (en production)
- ✅ **Déconnexion manuelle** (bouton LogOut)

---

## 🎨 DESIGN & UX

### Points Forts
- **Timeline Amazon-style** : Progression visuelle claire
- **Animations fluides** : Pulse sur l'étape actuelle
- **Responsive** : Fonctionne sur mobile/tablette/desktop
- **Dark header** : Contraste professionnel
- **Badges colorés** : Statuts visuels (Vert = OK, Orange = Attention)

---

## 📱 ACCÈS DEPUIS MOBILE

Le portail est **100% responsive**. Pour tester sur mobile :
1. Ouvrez Chrome DevTools (F12)
2. Activez le mode "Toggle device toolbar" (Ctrl+Shift+M)
3. Sélectionnez un appareil (iPhone, Samsung, etc.)
4. Testez la navigation

---

## ✅ CHECKLIST DE VALIDATION

- [ ] Connexion réussie avec vos identifiants
- [ ] Affichage correct de votre nom
- [ ] Dossier visible avec timeline
- [ ] Prochaine audience affichée
- [ ] Document téléchargeable
- [ ] Facture visible avec montant correct
- [ ] Déconnexion fonctionnelle
- [ ] Reconnexion possible

---

## 🚀 PROCHAINES ÉTAPES

### Améliorations Possibles
1. **Paiement en ligne** : Intégration Wave/Orange Money
2. **Signature électronique** : Signer les actes depuis le portail
3. **Chat en direct** : Messagerie avec le cabinet
4. **Notifications** : Alertes SMS/Email pour audiences
5. **Upload documents** : Envoyer des pièces directement

---

## 📞 SUPPORT

En cas de problème :
- **Email** : support@lexpremium.sn
- **Téléphone** : +221 33 XXX XX XX
- **Horaires** : Lun-Ven 8h-18h

---

**Guide créé par :** Antigravity AI  
**Date** : 31 Janvier 2026, 22:05 GMT+1  
**Statut** : ✅ Prêt pour démonstration
