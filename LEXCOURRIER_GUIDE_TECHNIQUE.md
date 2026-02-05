# 📧 Système de Gestion Dynamique du Courrier (LexCourrier)

LexCourrier est un module de gestion de courrier de "haut niveau" conçu pour les cabinets d'avocats modernes. Il permet de transformer la réception de courrier physique ou numérique en un processus de workflow structuré, collaboratif et supervisé.

## 🚀 Fonctionnalités Clés

### 1. Workflows Dynamiques en Cascade
*   **Modèles de Procédures :** Le système supporte des workflows personnalisés pour différents types de courrier (ex: Courrier Entrant, Courrier Sortant, Mise en Demeure).
*   **Étapes Personnalisées :** Chaque workflow est composé d'étapes (Réception, Analyse, Validation, Signature, etc.) avec des couleurs et des ordres spécifiques.
*   **Validation Hiérarchique :** Possibilité de restreindre certaines étapes à des rôles spécifiques (ex: Validation par Associé).

### 2. Suivi en Temps Réel (Visual Tracking)
*   **Barre de Progression :** Une visualisation claire de l'avancement du courrier dans son cycle de vie.
*   **Journal d'Audit :** Chaque action (transition, commentaire) est enregistrée avec l'utilisateur et l'horodatage pour une traçabilité totale.
*   **Priorisation :** Gestion des niveaux de priorité (Urgent, Haute, Normale) avec alertes visuelles.

### 3. Intégration Écosystème (LexPremium)
*   **Lien Dossiers/Clients :** Chaque courrier peut être rattaché à un dossier spécifique et à un client pour une centralisation de l'information.
*   **LexAI Readiness :** Conçu pour intégrer l'OCR et la synthèse automatique (prêt à être activé).

## 🛠️ Architecture Technique

### Modèles Prisma (MongoDB)
*   `Mail` : L'entité centrale contenant les métadonnées du courrier.
*   `MailWorkflow` : Définit le squelette de la procédure.
*   `MailStep` : Les étapes individuelles d'un workflow.
*   `MailActivity` : Le log historique des transitions.

### Server Actions (`app/actions.ts`)
*   `getMails()` / `getMailDetails(id)` : Récupération data.
*   `createMail(data)` : Initialisation d'un courrier dans son workflow.
*   `transitionMail(mailId, nextStepId, comment)` : Moteur de transition d'étape.

## 🎨 Design System
*   **Aesthetics :** Utilisation du thème "Slate & Indigo" avec des effets de verre (Glassmorphism) et des animations `framer-motion`.
*   **UX :** Focus sur la lisibilité et la rapidité d'exécution des actions de transition.

---
*LexCourrier - Part of LexPremium Suite 2026*
