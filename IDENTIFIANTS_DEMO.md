# Identifiants de Connexion - Environnement de Démo LexPremium

## 1. Espace Cabinet (Avocats & Staff)
**URL :** `http://localhost:3000/login`

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@lexpremium.sn` | `demo123` |
| **Avocat Associé** | `avocat@lexpremium.sn` | `demo123` |
| **Assistant** | `assistant@lexpremium.sn` | `demo123` |

---

## 2. Portail Client (Accès Sécurisé)
**URL :** `http://localhost:3000/portal/login`

| Client | Email | Code d'Accès (PIN) |
| :--- | :--- | :--- |
| **Moussa Diallo** | `client@exemple.com` | `1234` |
| **TechCorp SA** | `contact@techcorp.sn` | `1234` |
| **Banque Atlantique** | `juridique@banque.sn` | `1234` |

*Note : Les codes d'accès sont définis dans le script de seed de la base de données.*

---

## 3. Accès Base de Données (Prisma Studio)
Pour visualiser ou modifier les comptes en temps réel :
**Commande :** `npx prisma studio`
**URL :** `http://localhost:5555`
