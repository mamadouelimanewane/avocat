# Manuel de Maintenance et Bibliothèque des Erreurs (Pro-Guide)

## 1. Monitoring du Système
Le maintien en condition opérationnelle (MCO) de LexPremium nécessite une surveillance sur trois niveaux.

### 1.1 Niveau Infrastucture (Vercel)
Vérifiez régulièrement l'onglet **"Runtime Logs"**. Recherchez les codes 5xx qui indiquent un échec de fonction serverless (souvent dû à un timeout lors d'une analyse IA trop longue).
### 1.2 Niveau Base de Données (Atlas)
Surveillez le **"Logical Size"** et le **"Throughput"**. Si le nombre de connexions simultanées approche de la limite de votre tier, envisagez une mise à l'échelle.
### 1.3 Niveau API Externes
- **Resend** : Vérifiez le taux de rebond (Bounce rate). Un taux élevé indique des emails de clients mal saisis.
- **OpenAI** : Suivez les limites de jetons (Usage limits) pour éviter une interruption du service LexA en fin de mois.

## 2. Procédures de Maintenance Préventive
- **Hebdomadaire** : Vérification des logs de facturation pour identifier d'éventuels échecs d'envoi mail.
- **Mensuelle** : Audit des utilisateurs actifs. Désactivez les accès des stagiaires ou collaborateurs ayant quitté le cabinet.
- **Trimestrielle** : Mise à jour des dépendances (`npm update`) pour intégrer les derniers patchs de sécurité.

## 3. Bibliothèque des Erreurs et Solutions (Troubleshooting)

### 3.1 Erreurs d'Authentification
- **Erreur** : "Session Expired" ou redirection constante vers `/login`.
- **Cause** : Cookies bloqués ou heure du système décalée.
- **Solution** : Vérifiez que les cookies tiers sont autorisés et que votre ordinateur est à l'heure du réseau.

### 3.2 Erreurs de Base de Données
- **Erreur** : `PrismaClientInitializationError` (Authentication failed).
- **Cause** : Mauvais mot de passe dans `DATABASE_URL` ou IP non autorisée.
- **Solution** : Dans MongoDB Atlas > Network Access, ajoutez `0.0.0.0/0` (ou les IP spécifiques de Vercel).

### 3.3 Erreurs de l'Assistant IA
- **Erreur** : LexA ne répond pas ou affiche "Erreur Interne".
- **Cause** : Document trop lourd ou clé API OpenAI invalide.
- **Solution** : Vérifiez la balance de votre compte OpenAI et assurez-vous que le document fait moins de 20 Mo.

### 3.4 Erreurs de Génération PDF
- **Erreur** : Facture blanche ou caractères étranges.
- **Cause** : Caractères emojis ou polices non standard dans l'adresse.
- **Solution** : Utilisez uniquement des caractères alphanumériques standard pour les coordonnées du cabinet.

## 4. Procédures de Secours (Disaster Recovery)
1. **Perte de données** : Allez dans le dashboard MongoDB Atlas > Backups > Restore. Choisissez le "Point-in-time" souhaité.
2. **Site Down** : Vérifiez [Vercel Status](https://www.vercel-status.com/). Si Vercel est opérationnel, redéployez la dernière version stable via `vercel --prod`.

## 5. Contact du Support Escalade
Pour toute erreur non répertoriée, préparez un "Incident Report" contenant :
- L'URL de la page concernée.
- Une capture d'écran du message d'erreur.
- Si possible, le log correspondant extrait du dashboard Vercel.
