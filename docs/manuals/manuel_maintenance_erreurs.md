# Guide de Maintenance et Bibliothèque des Erreurs

## 1. Procédures de Maintenance
Pour garantir la pérennité du système LexPremium, effectuez ces actions périodiquement :

- **Sauvegarde** : Les sauvegardes sont gérées automatiquement par MongoDB Atlas. En cas de migration, utilisez `mongodump`.
- **Mise à jour** : Exécutez `npm update` pour maintenir les bibliothèques de sécurité.
- **Indexation** : En cas de lenteur de recherche, vérifiez les index dans le dashboard MongoDB.

## 2. Bibliothèque des Erreurs Communes

### Erreur : Identifiants invalides (Login)
- **Cause** : Email inexistant ou mot de passe incorrect.
- **Action** : Vérifiez l'existence de l'utilisateur dans l'onglet Admin > Utilisateurs.

### Erreur : PrismaClientInitializationError
- **Cause** : Impossible de se connecter à la base de données.
- **Action** : Vérifiez la variable `DATABASE_URL` et l'accès réseau (IP Whitelist) dans MongoDB Atlas.

### Erreur : Resend / Missing API Key
- **Cause** : La clé RESEND_API_KEY est absente ou expirée.
- **Action** : Mettez à jour la variable d'environnement sur Vercel.

### Erreur : PDF Generation Failure
- **Cause** : Caractères spéciaux non supportés ou surcharge mémoire.
- **Action** : Simplifiez le contenu textuel ou vérifiez les polices enregistrées dans `InvoicePDF.tsx`.

## 3. Logs et Monitoring
- **Vercel Logs** : Accédez à l'onglet "Logs" sur le dashboard Vercel pour voir les erreurs serveur en temps réel.
- **Monitoring IA** : Consultez l'onglet "Monitoring IA" dans l'application pour suivre la consommation des jetons OpenAI.

## 4. Support et Escalade
Si une erreur persiste au-delà des solutions proposées, contactez le support technique avec le code d'erreur spécifique et l'heure du déclenchement.
