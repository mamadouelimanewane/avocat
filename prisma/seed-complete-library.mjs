
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 DÉBUT DE L\'INSTALLATION MASSIVE DES ACTES (BIBLIOTHÈQUE JURIDIQUE)...')

    const templates = [
        // === AFFAIRES & OHADA ===
        {
            name: "Statuts SARL (Harmonisé OHADA 2024)",
            category: "AFFAIRES",
            variables: JSON.stringify(["NOM_SOCIETE", "CAPITAL", "SIEGE_SOCIAL", "OBJET_SOCIAL", "NOM_GERANT"]),
            content: `
                <div style="font-family: 'Times New Roman', serif; padding: 20px;">
                    <h1 style="text-align: center; color: #1a237e;">STATUTS DE LA SOCIETE "{{NOM_SOCIETE}}"</h1>
                    <p style="text-align: center;"><b>Forme : Société à Responsabilité Limitée (SARL)</b></p>
                    <p style="text-align: center;"><b>Capital Social : {{CAPITAL}} FCFA</b></p>
                    
                    <h3>ARTICLE 1 - FORME</h3>
                    <p>La Société est une Société à Responsabilité Limitée régie par l'Acte Uniforme de l'OHADA relatif au droit des sociétés commerciales et du groupement d'intérêt économique.</p>
                    
                    <h3>ARTICLE 2 - OBJET SOCIAL</h3>
                    <p>La Société a pour objet, au Sénégal et à l'étranger : {{OBJET_SOCIAL}}.</p>
                    
                    <h3>ARTICLE 3 - SIEGE SOCIAL</h3>
                    <p>Le siège social est fixé à : {{SIEGE_SOCIAL}}.</p>
                    
                    <h3>ARTICLE 4 - GERANCE</h3>
                    <p>La Société est gérée par {{NOM_GERANT}} pour une durée indéterminée.</p>
                </div>
            `
        },
        {
            name: "Pacte d'Associés (Standard Business)",
            category: "AFFAIRES",
            variables: JSON.stringify(["NOM_SOCIETE", "ASSOCIE_A", "ASSOCIE_B", "CLAUSE_SORTIE"]),
            content: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="text-align: center; border-bottom: 2px solid #000;">PACTE D'ASSOCIES - {{NOM_SOCIETE}}</h2>
                    <p>Entre : <b>{{ASSOCIE_A}}</b> et <b>{{ASSOCIE_B}}</b>.</p>
                    
                    <h3>1. GOUVERNANCE</h3>
                    <p>Les parties conviennent d'un droit de veto sur les décisions d'investissement supérieures à 10.000.000 FCFA.</p>
                    
                    <h3>2. TRANSFERT DE PARTS</h3>
                    <p>Toute cession de parts à un tiers est soumise à un droit de préemption des autres associés.</p>
                    
                    <h3>3. CLAUSE DE SORTIE</h3>
                    <p>{{CLAUSE_SORTIE}}</p>
                </div>
            `
        },
        {
            name: "Procès-Verbal d'AGO (Approbation des comptes)",
            category: "AFFAIRES",
            variables: JSON.stringify(["NOM_SOCIETE", "DATE_AG", "EXERCICE_CLOS", "RESULTAT_NET"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">PROCES-VERBAL DE L'ASSEMBLEE GENERALE ORDINAIRE</h2>
                    <p><b>SOCIETE : {{NOM_SOCIETE}}</b></p>
                    <p>Le {{DATE_AG}}, les associés se sont réunis en AGO annuelle.</p>
                    <p>L'assemblée approuve les comptes de l'exercice clos le {{EXERCICE_CLOS}} laissant apparaître un résultat de {{RESULTAT_NET}} FCFA.</p>
                    <p>Quitus entier et définitif est donné au gérant pour sa gestion.</p>
                </div>
            `
        },

        // === TRAVAIL ===
        {
            name: "Contrat de Travail CDI (Sénégal)",
            category: "TRAVAIL",
            variables: JSON.stringify(["EMPLOYEUR", "SALARIE", "POSTE", "SALAIRE_BRUT", "DATE_DEBUT"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h1 style="text-align: center;">CONTRAT DE TRAVAIL A DUREE INDETERMINEE</h1>
                    <p>Entre : <b>{{EMPLOYEUR}}</b> (L'Employeur)</p>
                    <p>Et : <b>{{SALARIE}}</b> (Le Salarié)</p>
                    
                    <h3>ARTICLE 1 - OBJET ET QUALIFICATION</h3>
                    <p>Le salarié est engagé en qualité de {{POSTE}} à compter du {{DATE_DEBUT}}.</p>
                    
                    <h3>ARTICLE 2 - REMUNERATION</h3>
                    <p>Le salaire mensuel brut est fixé à {{SALAIRE_BRUT}} FCFA.</p>
                    
                    <h3>ARTICLE 3 - LIEU DE TRAVAIL</h3>
                    <p>Le lieu de travail habituel est situé à Dakar, sauf déplacements professionnels.</p>
                </div>
            `
        },
        {
            name: "Avenant au Contrat de Travail (Promotion/Augmentation)",
            category: "TRAVAIL",
            variables: JSON.stringify(["SALARIE", "NOUVEAU_POSTE", "NOUVELLE_REMUNERATION", "DATE_EFFET"]),
            content: `
                <div style="font-family: sans-serif;">
                    <h2 style="text-align: center;">AVENANT AU CONTRAT DE TRAVAIL</h2>
                    <p>Concerne : {{SALARIE}}</p>
                    <p>À compter du {{DATE_EFFET}}, les conditions suivantes sont modifiées :</p>
                    <ul>
                        <li><b>Poste :</b> {{NOUVEAU_POSTE}}</li>
                        <li><b>Rémunération :</b> {{NOUVELLE_REMUNERATION}} FCFA brut/mois</li>
                    </ul>
                    <p>Les autres clauses du contrat initial restent inchangées.</p>
                </div>
            `
        },

        // === FONCIER ===
        {
            name: "Promesse de Vente Immobilière",
            category: "FONCIER",
            variables: JSON.stringify(["VENDEUR", "ACQUEREUR", "OBJET_TITRE_FONCIER", "PRIX_VENTE", "INDEMNITE_IMMOB"]),
            content: `
                <div style="font-family: serif;">
                    <h1 style="text-align: center;">PROMESSE UNILATERALE DE VENTE</h1>
                    <p><b>Promettant :</b> {{VENDEUR}}</p>
                    <p><b>Bénéficiaire :</b> {{ACQUEREUR}}</p>
                    
                    <h3>1. OBJET</h3>
                    <p>Vente du terrain relevant du Titre Foncier N° <b>{{OBJET_TITRE_FONCIER}}</b>.</p>
                    
                    <h3>2. PRIX</h3>
                    <p>Le prix principal est fixé à <b>{{PRIX_VENTE}} FCFA</b>.</p>
                    
                    <h3>3. INDEMNITE D'IMMOBILISATION</h3>
                    <p>Le bénéficiaire verse la somme de {{INDEMNITE_IMMOB}} FCFA à titre d'indemnité d'immobilisation.</p>
                </div>
            `
        },
        {
            name: "Bail d'Habitation (Usage Résidentiel)",
            category: "FONCIER",
            variables: JSON.stringify(["BAILLEUR", "PRENEUR", "ADRESSE", "LOYER_MENSUEL", "CAUTION"]),
            content: `
                <div style="font-family: sans-serif;">
                    <h2 style="text-align: center;">CONTRAT DE BAIL A USAGE D'HABITATION</h2>
                    <p>Entre : {{BAILLEUR}} et {{PRENEUR}}.</p>
                    <p><b>Localisation :</b> {{ADRESSE}}</p>
                    <p><b>Loyer :</b> {{LOYER_MENSUEL}} FCFA payable d'avance avant le 5 de chaque mois.</p>
                    <p><b>Dépôt de garantie :</b> {{CAUTION}} FCFA (équivalent à 2 mois de loyer).</p>
                </div>
            `
        },

        // === PROCEDURE ===
        {
            name: "Plainte Simple (Procureur de la République)",
            category: "PROCEDURE",
            variables: JSON.stringify(["PROCUREUR_VILLE", "PLAIGNANT", "AUTEUR_PRESUME", "FAITS_DESCRIPTION"]),
            content: `
                <div style="font-family: serif; padding: 20px;">
                    <p style="text-align: right;">Le {{DATE_JOUR}}</p>
                    <p>A Monsieur le Procureur de la République près le Tribunal de Grande Instance de {{PROCUREUR_VILLE}}</p>
                    <br/>
                    <p><b>OBJET : PLAINTE CONTRE {{AUTEUR_PRESUME}}</b></p>
                    <p>Monsieur le Procureur,</p>
                    <p>Je soussigné(e) {{PLAIGNANT}}, ai l'honneur de porter plainte pour les faits suivants :</p>
                    <p style="background: #f5f5f5; padding: 10px;">{{FAITS_DESCRIPTION}}</p>
                    <p>Je reste à votre disposition pour toute enquête ultérieure.</p>
                </div>
            `
        },
        {
            name: "Assignation en Paiement (Civil/Commercial)",
            category: "PROCEDURE",
            variables: JSON.stringify(["TRIBUNAL", "REQUERANT", "DEFENDEUR", "MONTANT_PRINCIPAL", "MOTIF"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">EXPLOIT D'ASSIGNATION</h2>
                    <p><b>A LA REQUETE DE :</b> {{REQUERANT}}, ayant pour conseil Maître..., Avocat à la Cour.</p>
                    <p><b>J'AI, HUISSIER SOUSSIGNE, ASSIGNE :</b> {{DEFENDEUR}}</p>
                    <p>A comparaître le ... devant le <b>{{TRIBUNAL}}</b>.</p>
                    <p><b>OBJET :</b> Condamnation au paiement de la somme de {{MONTANT_PRINCIPAL}} FCFA au titre de {{MOTIF}}.</p>
                </div>
            `
        },

        // === TECH & DONNEES ===
        {
            name: "Contrat de Développement Logiciel / SaaS",
            category: "TECH",
            variables: JSON.stringify(["CLIENT", "PRESTATAIRE", "NOM_LOGICIEL", "PRIX_TOTAL", "DELAI"]),
            content: `
                <div style="font-family: 'Courier New', monospace; padding: 15px; border: 1px solid #ccc;">
                    <h2 style="text-align: center; color: #007bff;">CONTRAT DE DEVELOPPEMENT LOGICIEL</h2>
                    <p>Prestataire : <b>{{PRESTATAIRE}}</b></p>
                    <p>Client : <b>{{CLIENT}}</b></p>
                    <hr/>
                    <p><b>LOGICIEL :</b> {{NOM_LOGICIEL}}</p>
                    <p><b>PRIX :</b> {{PRIX_TOTAL}} FCFA</p>
                    <p><b>DELAI DE LIVRAISON :</b> {{DELAI}} jours calendaires.</p>
                    <p>Le code source sera la propriété exclusive du client dès paiement intégral.</p>
                </div>
            `
        },
        {
            name: "Politique de Confidentialité (Conforme CDP Sénégal)",
            category: "TECH",
            variables: JSON.stringify(["NOM_SITE", "RESPONSABLE_DONNEES", "DUREE_CONSERVATION"]),
            content: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h1 style="color: #2c3e50;">Politique de Confidentialité - {{NOM_SITE}}</h1>
                    <p>Conformément à la Loi n° 2008-12 du 25 janvier 2008 relative à la protection des données à caractère personnel au Sénégal.</p>
                    <h3>1. Collecte des données</h3>
                    <p>Le responsable de traitement est {{RESPONSABLE_DONNEES}}.</p>
                    <h3>2. Vos droits</h3>
                    <p>Vous disposez d'un droit d'accès, de rectification et d'opposition auprès de notre DPO.</p>
                    <h3>3. Conservation</h3>
                    <p>Vos données sont conservées pendant {{DUREE_CONSERVATION}}.</p>
                </div>
            `
        },

        // === INTERNATIONAL ===
        {
            name: "Contrat de Distribution Internationale",
            category: "INTERNATIONAL",
            variables: JSON.stringify(["PRODUCTEUR", "DISTRIBUTEUR", "TERRITOIRE", "DUREE", "LOI_APPLICABLE"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h1 style="text-align: center;">INTERNATIONAL DISTRIBUTION AGREEMENT</h1>
                    <p><b>Manufacturer:</b> {{PRODUCTEUR}}</p>
                    <p><b>Distributor:</b> {{DISTRIBUTEUR}}</p>
                    <hr/>
                    <p><b>Territory:</b> {{TERRITOIRE}}</p>
                    <p><b>Duration:</b> {{DUREE}} years.</p>
                    <p><b>Applicable Law:</b> {{LOI_APPLICABLE}} (e.g. OHADA Law / French Law).</p>
                    <p><b>Arbitration:</b> Any dispute shall be settled by the CCJA (Abidjan).</p>
                </div>
            `
        },
        {
            name: "Clause de Juridiction et Loi Applicable (Bilingue)",
            category: "INTERNATIONAL",
            variables: JSON.stringify(["PAYS_LOI", "VILLE_TRIBUNAL"]),
            content: `
                <div style="padding: 10px; border: 1px dashed #666;">
                    <p><b>FR:</b> Le présent contrat est régi par la loi de {{PAYS_LOI}}. Tout litige sera porté devant les tribunaux de {{VILLE_TRIBUNAL}}.</p>
                    <p><b>EN:</b> This agreement is governed by the laws of {{PAYS_LOI}}. Any dispute shall be submitted to the courts of {{VILLE_TRIBUNAL}}.</p>
                </div>
            `
        },

        // === ADMINISTRATIF ===
        {
            name: "Recours pour Excès de Pouvoir (Conseil d'Etat / Cour Suprême)",
            category: "ADMINISTRATIF",
            variables: JSON.stringify(["AUTORITE_ATTAQUEE", "ACTE_REFERENCE", "MOYENS_ANNULATION"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">REQUETE EN ANNULATION POUR EXCES DE POUVOIR</h2>
                    <p>A Monsieur le Premier Président de la Cour Suprême (Chambre Administrative).</p>
                    <p>Objet : Annulation de l'acte {{ACTE_REFERENCE}} pris par {{AUTORITE_ATTAQUEE}}.</p>
                    <h3>DISCUSSION</h3>
                    <p>L'acte attaqué est entaché d'illégalité externe et interne pour les motifs suivants :</p>
                    <p><b>Moyens :</b> {{MOYENS_ANNULATION}}</p>
                    <p>Plaise à la Cour d'annuler ledit acte avec toutes conséquences de droit.</p>
                </div>
            `
        },
        {
            name: "Accord de Joint Venture (Pétrole & Gaz)",
            category: "PETROLE_GAZ",
            variables: JSON.stringify(["COMPAGNIE_A", "COMPAGNIE_B", "PERIMETRE_RECHERCHE", "PART_PARTICIPATION"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">JOINT OPERATING AGREEMENT (JOA)</h2>
                    <p>Entre : {{COMPAGNIE_A}} and {{COMPAGNIE_B}}.</p>
                    <p><b>Périmètre :</b> {{PERIMETRE_RECHERCHE}} (Sénégal Offshore).</p>
                    <p><b>Parts :</b> {{PART_PARTICIPATION}}% pour l'opérateur.</p>
                    <p>Conforme aux standards de l'AIPN et au Code Pétrolier du Sénégal.</p>
                </div>
            `
        },
        {
            name: "Protocole de Reciprocal Tax Agreement (UEMOA/CEDEAO)",
            category: "FISCALITE",
            variables: JSON.stringify(["ENTREPRISE", "ETAT_RESIDENCE", "IMPOT_RECLAME"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CONVENTION FISCALE DE NON-DOUBLE IMPOSITION</h2>
                    <p>Requérant : {{ENTREPRISE}}</p>
                    <p>État de résidence : {{ETAT_RESIDENCE}}</p>
                    <p><b>Objet :</b> Demande d'exonération de l'impôt {{IMPOT_RECLAME}} en vertu du traité de l'UEMOA.</p>
                </div>
            `
        }
        ,
        // === NOUVEAUX AJOUTS POUR COMPLÉTER ===
        {
            name: "Contrat de Franchise (International/Local)",
            category: "INTERNATIONAL",
            variables: JSON.stringify(["FRANCHISEUR", "FRANCHISE", "MARQUE", "DROIT_ENTREE", "ROYALTIES"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CONTRAT DE FRANCHISE COMMERCIAL</h2>
                    <p>Entre : <b>{{FRANCHISEUR}}</b> et <b>{{FRANCHISE}}</b>.</p>
                    <p><b>MARQUE :</b> {{MARQUE}}</p>
                    <p><b>DROIT D'ENTREE :</b> {{DROIT_ENTREE}} FCFA</p>
                    <p><b>REDEVANCES (ROYALTIES) :</b> {{ROYALTIES}}% du CA mensuel HT.</p>
                    <p>Le franchisé s'engage à respecter scrupuleusement le concept et le savoir-faire transmis.</p>
                </div>
            `
        },
        {
            name: "Reconnaissance de Dette (Modèle Notarié/Avocat)",
            category: "CIVIL",
            variables: JSON.stringify(["DEBITEUR", "CREANCIER", "MONTANT", "ECHEANCE"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">RECONNAISSANCE DE DETTE</h2>
                    <p>Je soussigné(e) <b>{{DEBITEUR}}</b>, reconnais par la présente devoir la somme de :</p>
                    <h3 style="text-align: center;">{{MONTANT}} FCFA</h3>
                    <p>À Monsieur/Madame <b>{{CREANCIER}}</b>.</p>
                    <p>Je m'engage irrévocablement à rembourser ladite somme au plus tard le {{ECHEANCE}}.</p>
                </div>
            `
        },
        {
            name: "Accord de Confidentialité (NDA) - Sénégal",
            category: "TECH",
            variables: JSON.stringify(["PARTIE_A", "PARTIE_B", "OBJET_DISCUSSIONS", "DUREE_SECRET"]),
            content: `
                <div style="font-family: sans-serif; border: 2px solid #333; padding: 20px;">
                    <h2 style="text-align: center;">ACCORD DE NON-DIVULGATION (NDA)</h2>
                    <p>Entre : {{PARTIE_A}} et {{PARTIE_B}}.</p>
                    <p><b>OBJET :</b> {{OBJET_DISCUSSIONS}}</p>
                    <p>Toutes les informations échangées sont strictement confidentielles.</p>
                    <p><b>DUREE DE L'OBLIGATION :</b> {{DUREE_SECRET}} ans après la fin des discussions.</p>
                </div>
            `
        },
        {
            name: "Statuts de GIE (Groupement d'Intérêt Économique)",
            category: "AFFAIRES",
            variables: JSON.stringify(["NOM_GIE", "MEMBRE_1", "MEMBRE_2", "OBJET_COORDINATION"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">STATUTS DU GIE "{{NOM_GIE}}"</h2>
                    <p>Membres fondateurs : {{MEMBRE_1}} et {{MEMBRE_2}}.</p>
                    <p><b>OBJET :</b> Mettre en œuvre tous les moyens propres à faciliter ou à développer l'activité économique de ses membres : {{OBJET_COORDINATION}}.</p>
                    <p>Le GIE est régi par l'Acte Uniforme de l'OHADA y relatif.</p>
                </div>
            `
        },
        {
            name: "Demande d'Autorisation de Construire",
            category: "FONCIER",
            variables: JSON.stringify(["MAIRE_VILLE", "DEMANDEUR", "PARCELLE_REF", "TYPE_CONSTRUCTION"]),
            content: `
                <div style="font-family: sans-serif;">
                    <p>Dakar, le {{DATE}}</p>
                    <p>A Monsieur le Maire de la Commune de {{MAIRE_VILLE}}</p>
                    <p><b>Objet : Demande de Permis de Construire</b></p>
                    <p>Monsieur le Maire,</p>
                    <p>J'ai l'honneur de solliciter votre autorisation pour l'édification d'un(e) {{TYPE_CONSTRUCTION}} sur ma parcelle sis à {{PARCELLE_REF}}.</p>
                    <p>Veuillez trouver ci-joint le dossier technique complet.</p>
                </div>
            `
        }

    ]

    for (const t of templates) {
        const existing = await prisma.template.findFirst({
            where: { name: t.name }
        })

        if (!existing) {
            await prisma.template.create({
                data: t
            })
            console.log(`✅ Créé : ${t.name}`)
        } else {
            await prisma.template.update({
                where: { id: existing.id },
                data: t
            })
            console.log(`🔄 Mis à jour : ${t.name}`)
        }
    }

    console.log('✅ INSTALLATION DES ACTES TERMINÉE AVEC SUCCÈS.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
