/**
 * Bibliothèque de Templates d'Emails Professionnels
 * Pour avocats (Droit Sénégalais & OHADA)
 */

export interface EmailTemplate {
    id: string
    name: string
    subject: string
    body: string
    category: 'CLIENT' | 'ADVERSE' | 'TRIBUNAL' | 'FINANCE'
    variables: string[]
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'request-docs',
        name: 'Demande de documents (Client)',
        subject: 'Demande de pièces complémentaires - Dossier {dossier_ref}',
        category: 'CLIENT',
        variables: ['client_nom', 'dossier_ref', 'liste_pieces', 'date_limite'],
        body: `Cher(e) {client_nom},

Dans le cadre du traitement de votre dossier référencé {dossier_ref}, nous avons besoin des documents complémentaires suivants :

{liste_pieces}

Je vous remercie de bien vouloir nous les faire parvenir au plus tard le {date_limite}, par retour d'email ou en les déposant directement sur votre espace client.

Restant à votre entière disposition.

Cordialement,

 Cabinet LexPremium`
    },
    {
        id: 'invoice-reminder',
        name: 'Relance Facture (Client)',
        subject: 'Rappel : Facture n°{facture_num} en attente de règlement',
        category: 'FINANCE',
        variables: ['client_nom', 'facture_num', 'montant', 'date_echeance'],
        body: `Cher(e) {client_nom},

Sauf erreur de notre part, nous n'avons pas encore reçu le règlement de la facture n°{facture_num} d'un montant de {montant}, qui était arrivée à échéance le {date_echeance}.

Nous vous prions de bien vouloir régulariser cette situation dans les plus brefs délais. Si votre règlement a déjà été envoyé, nous vous prions de ne pas tenir compte de ce message.

En vous remerciant de votre confiance.

Cordialement,

Cabinet LexPremium`
    },
    {
        id: 'meeting-invitation',
        name: 'Convocation Rendez-vous',
        subject: 'Confirmation de rendez-vous - Cabinet LexPremium',
        category: 'CLIENT',
        variables: ['client_nom', 'date_rdv', 'heure_rdv', 'lieu_rdv'],
        body: `Cher(e) {client_nom},

Nous vous confirmons votre rendez-vous avec Maître Ndiaye le {date_rdv} à {heure_rdv}.

Le rendez-vous se tiendra à : {lieu_rdv}.

En cas d'empêchement, nous vous remercions de nous prévenir au moins 24 heures à l'avance.

Cordialement,

Cabinet LexPremium`
    },
    {
        id: 'formal-notice',
        name: 'Mise en demeure (Adverse)',
        subject: 'MISE EN DEMEURE - Dossier {dossier_ref}',
        category: 'ADVERSE',
        variables: ['adverse_nom', 'votre_client', 'objet_litige', 'delai_reponse'],
        body: `Monsieur/Madame {adverse_nom},

Nous intervenons en qualité de conseil de {votre_client}.

Par la présente, nous vous mettons formellement en demeure de régler le litige relatif à {objet_litige}.

À défaut de réponse satisfaisante de votre part sous un délai de {delai_reponse} jours, nous avons reçu instruction de notre client de porter l'affaire devant les juridictions compétentes.

Cette lettre constitue une mise en demeure de nature à faire courir tous les délais, intérêts et autres conséquences que la loi, notamment le Code des Obligations Civiles et Commerciales du Sénégal, attache à une telle mise en demeure.

Sous toutes réserves.

Maître Ndiaye`
    },
    {
        id: 'update-client',
        name: 'Mise à jour Dossier',
        subject: 'Évolution de votre dossier - {dossier_ref}',
        category: 'CLIENT',
        variables: ['client_nom', 'dossier_ref', 'derniere_action', 'prochaine_etape'],
        body: `Cher(e) {client_nom},

Je reviens vers vous pour vous informer de l'état d'avancement de votre dossier {dossier_ref}.

Dernière action effectuée : {derniere_action}.

Prochaine étape prévue : {prochaine_etape}.

Nous ne manquerons pas de vous tenir informé(e) de toute nouvelle évolution.

Cordialement,

Cabinet LexPremium`
    }
]
