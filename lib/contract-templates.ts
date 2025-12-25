/**
 * Modèles de Contrats pour le Générateur IA
 * Droit Sénégalais & OHADA - Bibliothèque Étendue Pro
 */

export interface ContractQuestion {
    id: string
    label: string
    type: 'TEXT' | 'NUMBER' | 'SELECT' | 'DATE' | 'BOOLEAN'
    options?: { label: string, value: string }[]
    placeholder?: string
    help?: string
}

export interface ContractTemplate {
    id: string
    name: string
    description: string
    category: 'COMMERCIAL' | 'TRAVAIL' | 'FONCIER' | 'SOCIETES' | 'LITIGES' | 'MINES' | 'FAMILLE'
    questions: ContractQuestion[]
    standardClauses: string[]
    advancedFeatures?: string[]
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
    {
        id: 'bail-commercial',
        name: 'Bail Commercial (OHADA)',
        description: 'Bail conforme à l\'Acte Uniforme sur le Droit Commercial Général (AUDCG). Prise en compte du droit au renouvellement.',
        category: 'COMMERCIAL',
        questions: [
            { id: 'bailleur_identite', label: 'Identité du Bailleur', type: 'TEXT', placeholder: 'Nom/Dénomination et adresse' },
            { id: 'preneur_identite', label: 'Identité du Preneur', type: 'TEXT', placeholder: 'Nom/Dénomination et RCCM' },
            { id: 'adresse_local', label: 'Désignation des Lieux', type: 'TEXT', placeholder: 'Adresse précise, surface, description' },
            { id: 'loyer_montant', label: 'Loyer Mensuel (FCFA)', type: 'NUMBER' },
            {
                id: 'periodicite_paiement', label: 'Périodicité de paiement', type: 'SELECT', options: [
                    { label: 'Mensuelle', value: 'MENSUEL' },
                    { label: 'Trimestrielle', value: 'TRIMESTRIEL' }
                ]
            },
            { id: 'depot_garantie', label: 'Dépôt de Garantie (mois)', type: 'NUMBER', placeholder: 'Max 2 mois au Sénégal (Loi 2014)' },
            { id: 'activite', label: 'Destination des Lieux', type: 'TEXT', placeholder: 'Ex: Commerce de gros' }
        ],
        standardClauses: [
            "Application rigoureuse de l'Acte Uniforme OHADA sur le Droit Commercial Général.",
            "Clause de révision du loyer conformément à la législation locale (Sénégal/Loi sur les loyers).",
            "Droit au renouvellement après deux ans d'exploitation effective (Art 123 AUDCG).",
            "Clause résolutoire en cas de non-paiement après mise en demeure de 30 jours."
        ],
        advancedFeatures: ["Option de caution solidaire", "Indexation sur l'indice du coût de la construction"]
    },
    {
        id: 'cdi-cadre-senegal',
        name: 'Contrat de Travail (Cadre)',
        description: 'CDI pour personnel d\'encadrement conforme au Code du Travail Sénégalais et à la Convention Collective Nationale Interprofessionnelle (CCNI).',
        category: 'TRAVAIL',
        questions: [
            { id: 'employeur', label: 'Société Employeuse', type: 'TEXT' },
            { id: 'salarie_nom', label: 'Nom Complet du Salarié', type: 'TEXT' },
            { id: 'poste_titre', label: 'Titre et Grade', type: 'TEXT', placeholder: 'Ex: Directeur Technique, Catégorie 11' },
            { id: 'salaire_base', label: 'Salaire de Base Mensuel', type: 'NUMBER' },
            { id: 'indemnite_logement', label: 'Indemnité de Logement', type: 'NUMBER' },
            { id: 'clause_noncompte', label: 'Clause de Non-Concurrence', type: 'BOOLEAN' },
            { id: 'voiture_fonction', label: 'Véhicule de Fonction', type: 'BOOLEAN' }
        ],
        standardClauses: [
            "Conformité au Code du Travail Sénégalais (Loi 97-17).",
            "Respect de la hiérarchie des normes (Convention Collective vs Contrat).",
            "Clause de secret professionnel et de confidentialité renforcée.",
            "Gestion des heures supplémentaires pour cadres (régime dérogatoire)."
        ]
    },
    {
        id: 'cession-parts-sarl',
        name: 'Cession de Parts Sociales (SARL)',
        description: 'Acte de cession sous seing privé conforme à l\'AUSCGIE OHADA.',
        category: 'SOCIETES',
        questions: [
            { id: 'societe_denomination', label: 'Dénomination de la SARL', type: 'TEXT' },
            { id: 'cedant_nom', label: 'Nom du Cédant', type: 'TEXT' },
            { id: 'cessionnaire_nom', label: 'Nom du Cessionnaire', type: 'TEXT' },
            { id: 'nb_parts', label: 'Nombre de parts cédées', type: 'NUMBER' },
            { id: 'prix_part', label: 'Prix par part (FCFA)', type: 'NUMBER' },
            { id: 'agrement_date', label: 'Date de l\'Assemblée d\'agrément', type: 'DATE' }
        ],
        standardClauses: [
            "Transfert de propriété et des risques.",
            "Déclaration sur la capacité et le titre de propriété des parts.",
            "Garantie d'actif et de passif (GAP) simplifiée.",
            "Formalité d'enregistrement et opposabilité à la société (Art 317 AUSCGIE)."
        ]
    },
    {
        id: 'reconnaissance-dette-ohada',
        name: 'Reconnaissance de Dette',
        description: 'Acte juridique constatant une créance certaine, liquide et exigible. Utile pour procédure d\'Injonction de Payer.',
        category: 'COMMERCIAL',
        questions: [
            { id: 'debiteur', label: 'Identité du Débiteur', type: 'TEXT' },
            { id: 'creancier', label: 'Identité du Créancier', type: 'TEXT' },
            { id: 'montant', label: 'Montant de la dette (FCFA)', type: 'NUMBER' },
            { id: 'cause_dette', label: 'Cause de la dette', type: 'TEXT', placeholder: 'Ex: Prêt d\'argent, Factures impayées' },
            { id: 'echeance', label: 'Date limite de remboursement', type: 'DATE' },
            { id: 'taux_interet', label: 'Taux d\'intérêt conventionnel (%)', type: 'NUMBER', placeholder: 'Attention au taux d\'usure (BCEAO)' }
        ],
        standardClauses: [
            "Engagement inconditionnel de remboursement.",
            "Clause d'échéance du terme en cas de défaut partiel.",
            "Élection de domicile pour signification.",
            "Reconnaissance du caractère exécutoire pour mise en œuvre de l'Acte Uniforme sur les Procédures Simplifiées de Recouvrement (AUPREVE)."
        ]
    },
    {
        id: 'sous-traitance-miniere',
        name: 'Sous-traitance Minière (Local Content)',
        description: 'Contrat spécifique pour les prestataires miniers, intégrant les obligations de "contenu local" (Sénégal/Guinée/Mali).',
        category: 'MINES',
        questions: [
            { id: 'donneur_ordre', label: 'Compagnie Minière', type: 'TEXT' },
            { id: 'prestataire', label: 'Sous-traitant Local', type: 'TEXT' },
            { id: 'objet_mission', label: 'Objet des travaux/services', type: 'TEXT' },
            { id: 'duree_contrat', label: 'Durée de la mission', type: 'TEXT' },
            {
                id: 'hSE_standards', label: 'Normes Environnementales & Sécurité', type: 'SELECT', options: [
                    { label: 'Standards Internationaux (IFC)', value: 'IFC' },
                    { label: 'Code Minier Local', value: 'LOCAL' }
                ]
            }
        ],
        standardClauses: [
            "Obligations de respect du Code Minier local.",
            "Clauses de contenu local (transfert de technologie, emploi local).",
            "Audit de conformité éthique (Anti-corruption/FCPA/UKBA).",
            "Assurances minières obligatoires."
        ]
    },
    {
        id: 'promesse-vente-immobiliere',
        name: 'Promesse de Vente Immobilière',
        description: 'Avant-contrat pour la vente de terrain ou d\'immeuble bâti, avec clause pénale.',
        category: 'FONCIER',
        questions: [
            { id: 'vendeur_nom', label: 'Le Promettant (Vendeur)', type: 'TEXT' },
            { id: 'acheteur_nom', label: 'Le Bénéficiaire (Acheteur)', type: 'TEXT' },
            { id: 'titre_foncier', label: 'Numéro du Titre Foncier (TF)', type: 'TEXT' },
            { id: 'prix_vente', label: 'Prix de vente convenu', type: 'NUMBER' },
            { id: 'indemnite_immobilisation', label: 'Indemnité d\'immobilisation (%)', type: 'NUMBER' },
            { id: 'delai_notaire', label: 'Délai pour acte authentique (jours)', type: 'NUMBER' }
        ],
        standardClauses: [
            "Conditions suspensives (obtention de prêt, état d'urbanisme).",
            "Garantie d'éviction et de vices cachés.",
            "Clause pénale en cas de désistement injustifié.",
            "Mention du caractère obligatoire de l'acte notarié pour transfert de propriété."
        ]
    },
    {
        id: 'divorce-consentement-mutuel',
        name: 'Convention de Divorce (CM)',
        description: 'Accord amiable sur les conséquences du divorce (Garde, Pension, Partage).',
        category: 'FAMILLE',
        questions: [
            { id: 'epoux_nom', label: 'Nom de l\'Époux', type: 'TEXT' },
            { id: 'epouse_nom', label: 'Nom de l\'Épouse', type: 'TEXT' },
            { id: 'date_mariage', label: 'Date du mariage', type: 'DATE' },
            { id: 'enfants_mineurs', label: 'Nombre d\'enfants mineurs', type: 'NUMBER' },
            { id: 'pension_alimentaire', label: 'Montant pension/enfant (FCFA)', type: 'NUMBER' },
            { id: 'residence_enfants', label: 'Résidence habituelle des enfants', type: 'TEXT' }
        ],
        standardClauses: [
            "Accord sur le principe de la rupture du lien matrimonial.",
            "Modalités de l'exercice de l'autorité parentale.",
            "Liquidation du régime matrimonial (communauté ou séparation).",
            "Prestation compensatoire (le cas échéant)."
        ]
    },
    {
        id: 'nantissement-fonds-commerce',
        name: 'Nantissement de Fonds de Commerce',
        description: 'Garantie réelle mobilière pour sécuriser un prêt bancaire (Art 162 AUS) - OHADA.',
        category: 'COMMERCIAL',
        questions: [
            { id: 'constituant', label: 'Le Débiteur (Constituant)', type: 'TEXT' },
            { id: 'creancier_inscrit', label: 'La Banque (Créancier)', type: 'TEXT' },
            { id: 'elements_nantis', label: 'Éléments inclus (Enseigne, Clientèle, Matériel)', type: 'BOOLEAN' },
            { id: 'montant_garanti', label: 'Montant de la créance garantie', type: 'NUMBER' },
            { id: 'rccm_numero', label: 'Numéro RCCM du fonds', type: 'TEXT' }
        ],
        standardClauses: [
            "Droit de suite et droit de préférence au profit du créancier.",
            "Obligation d'entretien du fonds par le débiteur.",
            "Déchéance du terme en cas de déplacement du fonds sans accord.",
            "Inscription obligatoire au RCCM dans les 15 jours (Art 51 AUS)."
        ]
    },
    {
        id: 'agregation-agricole',
        name: 'Contrat d\'Agrégation Agricole',
        description: 'Sécurisation de la relation entre une agro-industrie et des petits producteurs (Sénégal/Côte d\'Ivoire).',
        category: 'COMMERCIAL',
        questions: [
            { id: 'agregateur', label: 'L\'Agrégateur (Acheteur)', type: 'TEXT' },
            { id: 'producteur', label: 'Le Producteur (Vendeur)', type: 'TEXT' },
            { id: 'culture_type', label: 'Type de Culture', type: 'TEXT', placeholder: 'Ex: Arachide, Riz, Mangue' },
            { id: 'surface_ha', label: 'Surface engagée (Hectares)', type: 'NUMBER' },
            { id: 'prix_plancher', label: 'Prix Plancher garanti (FCFA/kg)', type: 'NUMBER' }
        ],
        standardClauses: [
            "Engagement d'achat exclusif de la production.",
            "Spécification technique et standards de qualité (normes d'exportation).",
            "Modalités de fourniture d'intrants et de préfinancement.",
            "Clause de force majeure (risques climatiques)."
        ]
    },
    {
        id: 'agent-mobile-money',
        name: 'Contrat d\'Agent Mobile Money',
        description: 'Contrat de distribution de services financiers mobiles (Orange Money, Wave, Free Money).',
        category: 'COMMERCIAL',
        questions: [
            { id: 'distributeur', label: 'Le Distributeur Principal', type: 'TEXT' },
            { id: 'agent_point_vente', label: 'L\'Agent (Sous-distributeur)', type: 'TEXT' },
            { id: 'emplacement', label: 'Localisation du point de vente', type: 'TEXT' },
            { id: 'caution_flotte', label: 'Caution de démarrage (FCFA)', type: 'NUMBER' }
        ],
        standardClauses: [
            "Conformité aux directives de la BCEAO sur la monnaie électronique.",
            "Obligations KYC (connaissance client) et lutte contre le blanchiment.",
            "Modalités de commissionnement et de rétrocession.",
            "Responsabilité en cas de transactions frauduleuses."
        ]
    },
    {
        id: 'installation-solaire',
        name: 'Contrat de Maintenance Solaire',
        description: 'Contrat de service pour parcs solaires ou installations domestiques hybrides.',
        category: 'COMMERCIAL',
        questions: [
            { id: 'client_final', label: 'Le Maître d\'Ouvage', type: 'TEXT' },
            { id: 'installateur', label: 'L\'Installateur/Maintenicien', type: 'TEXT' },
            { id: 'puissance_kwp', label: 'Puissance de l\'installation (kWp)', type: 'NUMBER' },
            {
                id: 'frequence_visite', label: 'Fréquence de maintenance', type: 'SELECT', options: [
                    { label: 'Trimestrielle', value: '3_MOIS' },
                    { label: 'Semestrielle', value: '6_MOIS' }
                ]
            }
        ],
        standardClauses: [
            "Garantie de performance énergétique (PR - Performance Ratio).",
            "Délai d'intervention en cas de panne critique.",
            "Sécurité au travail et habilitations électriques.",
            "Responsabilité décennale sur les équipements."
        ]
    }
]
