
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- DÉBUT DE LA POPULATION DE LA BIBLIOTHÈQUE DES ACTES ---')

    const templates = [
        // === AFFAIRES & OHADA ===
        {
            name: "Statuts SARL (Modèle Harmonisé OHADA)",
            category: "AFFAIRES",
            content: `
                <h1>STATUTS DE LA SOCIETE {{NOM_SOCIETE}}</h1>
                <p><b>FORME :</b> Société à Responsabilité Limitée</p>
                <p><b>CAPITAL :</b> {{CAPITAL}} FCFA</p>
                <p><b>SIEGE SOCIAL :</b> {{SIEGE_SOCIAL}}</p>
                
                <h2>ARTICLE 1 - FORME</h2>
                <p>Il est formé entre les propriétaires des parts sociales ci-après créées et de celles qui pourraient l'être ultérieurement, une Société à Responsabilité Limitée régie par l'Acte Uniforme de l'OHADA relatif au droit des sociétés commerciales et du GIE.</p>
                
                <h2>ARTICLE 2 - OBJET</h2>
                <p>La société a pour objet, au Sénégal et à l'étranger : {{OBJET_SOCIAL}}</p>
                
                <h2>ARTICLE 3 - GERANCE</h2>
                <p>La société est gérée par {{NOM_GERANT}} pour une durée de {{DUREE_MANDAT}}.</p>
            `,
            variables: JSON.stringify(["NOM_SOCIETE", "CAPITAL", "SIEGE_SOCIAL", "OBJET_SOCIAL", "NOM_GERANT", "DUREE_MANDAT"])
        },
        {
            name: "Procès-verbal d'Assemblée Générale Ordinaire",
            category: "AFFAIRES",
            content: `
                <h1>PROCES-VERBAL DE L'ASSEMBLEE GENERALE ORDINAIRE</h1>
                <p><b>SOCIETE :</b> {{NOM_SOCIETE}}</p>
                <p><b>DATE :</b> {{DATE_AGO}}</p>
                
                <p>L'an deux mille {{ANNEE}}, le {{JOUR}} à {{HEURE}}, les associés de la société {{NOM_SOCIETE}} se sont réunis en Assemblée Générale Ordinaire au siège social.</p>
                
                <h2>ORDRE DU JOUR</h2>
                <ul>
                    <li>Rapport de gestion du gérant ;</li>
                    <li>Approbation des comptes de l'exercice clos le 31 décembre {{ANNEE_PRECEDENTE}} ;</li>
                    <li>Affectation du résultat ;</li>
                    <li>Quitus au gérant.</li>
                </ul>
            `,
            variables: JSON.stringify(["NOM_SOCIETE", "DATE_AGO", "ANNEE", "JOUR", "HEURE", "ANNEE_PRECEDENTE"])
        },
        {
            name: "Bail Commercial (Audit conforme OHADA)",
            category: "AFFAIRES",
            content: `
                <h1>CONTRAT DE BAIL COMMERCIAL</h1>
                <p>Entre les soussignés :</p>
                <p><b>LE BAILLEUR :</b> {{NOM_BAILLEUR}}</p>
                <p><b>LE PRENEUR :</b> {{NOM_PRENEUR}}</p>
                
                <h2>ARTICLE 1 - OBJET DU BAIL</h2>
                <p>Le bailleur loue au preneur les locaux situés à {{ADRESSE_LOCAUX}} destinés à l'usage de {{ACTIVITE_COMMERCIALE}}.</p>
                
                <h2>ARTICLE 2 - DUREE</h2>
                <p>Le présent bail est consenti pour une durée de {{DUREE_BAIL}} ans commençant à courir le {{DATE_DEBUT}}.</p>
                
                <h2>ARTICLE 3 - LOYER</h2>
                <p>Le loyer mensuel est fixé à la somme de {{LOYER_MENSUEL}} FCFA payable d'avance.</p>
            `,
            variables: JSON.stringify(["NOM_BAILLEUR", "NOM_PRENEUR", "ADRESSE_LOCAUX", "ACTIVITE_COMMERCIALE", "DUREE_BAIL", "DATE_DEBUT", "LOYER_MENSUEL"])
        },

        // === TRAVAIL (Droit Sénégalais) ===
        {
            name: "Contrat de Travail à Durée Indéterminée (CDI)",
            category: "TRAVAIL",
            content: `
                <h1>CONTRAT DE TRAVAIL A DUREE INDETERMINEE</h1>
                <p>Entre l'employeur {{NOM_EMPLOYEUR}} et le salarié {{NOM_SALARIE}}.</p>
                
                <h2>ARTICLE 1 - ENGAGEMENT</h2>
                <p>M./Mme {{NOM_SALARIE}} est engagé(e) en qualité de {{POSTE}} à compter du {{DATE_EMBAUCHE}}.</p>
                
                <h2>ARTICLE 2 - PERIODE D'ESSAI</h2>
                <p>Le présent contrat comporte une période d'essai de {{DUREE_ESSAI}} mois.</p>
                
                <h2>ARTICLE 3 - REMUNERATION</h2>
                <p>La rémunération mensuelle brute est fixée à {{SALAIRE_BRUT}} FCFA.</p>
            `,
            variables: JSON.stringify(["NOM_EMPLOYEUR", "NOM_SALARIE", "POSTE", "DATE_EMBAUCHE", "DUREE_ESSAI", "SALAIRE_BRUT"])
        },

        // === PROCEDURE & LITIGE ===
        {
            name: "Mise en demeure de payer",
            category: "PROCEDURE",
            content: `
                <h1>MISE EN DEMEURE DE PAYER</h1>
                <p>A l'attention de {{NOM_DEBITEUR}}</p>
                <p><b>OBJET :</b> Dernier rappel avant poursuites judiciaires</p>
                
                <p>Monsieur/Madame,</p>
                <p>Sauf erreur ou omission de notre part, nous constatons qu'à ce jour, vous restez redevable de la somme de {{MONTANT_DU}} FCFA au titre de {{MOTIF_DETTE}}.</p>
                <p>Nous vous mettons formellement en demeure de nous régler cette somme sous un délai de {{DELAI_JOURS}} jours à compter de la réception de la présente.</p>
                <p>A défaut de règlement dans ce délai, nous serons contraints d'engager une procédure devant le {{TRIBUNAL_COMPETENT}}.</p>
            `,
            variables: JSON.stringify(["NOM_DEBITEUR", "MONTANT_DU", "MOTIF_DETTE", "DELAI_JOURS", "TRIBUNAL_COMPETENT"])
        },
        {
            name: "Assignation en paiement (Tribunal de Commerce)",
            category: "PROCEDURE",
            content: `
                <h1>EXPLOIT D'ASSIGNATION DEVANT LE TRIBUNAL DE COMMERCE</h1>
                <p>L'AN DEUX MILLE {{ANNEE}}, LE {{DATE_EXPLOIT}}</p>
                <p>A LA REQUETE DE : {{REQUERANT}}</p>
                
                <p>J'AI, {{NOM_HUISSIER}}, Huissier de Justice, ASSIGNE :</p>
                <p>{{NOM_DEFENDEUR}}</p>
                
                <p>A COMPARAITRE LE {{DATE_AUDIENCE}} A {{HEURE_AUDIENCE}} DEVANT LE TRIBUNAL DE COMMERCE DE {{VILLE}}.</p>
                
                <h2>OBJET DE LA DEMANDE</h2>
                <p>Il est demandé la condamnation au paiement de la somme de {{MONTANT_PRINCIPAL}} FCFA majorée des intérêts de droit.</p>
            `,
            variables: JSON.stringify(["ANNEE", "DATE_EXPLOIT", "REQUERANT", "NOM_HUISSIER", "NOM_DEFENDEUR", "DATE_AUDIENCE", "HEURE_AUDIENCE", "VILLE", "MONTANT_PRINCIPAL"])
        },

        // === FONCIER ===
        {
            name: "Promesse Unilatérale de Vente Immobilière",
            category: "FONCIER",
            content: `
                <h1>PROMESSE UNILATERALE DE VENTE</h1>
                <p><b>LE PROMETTANT :</b> {{NOM_VENDEUR}}</p>
                <p><b>LE BENEFICIAIRE :</b> {{NOM_ACQUEREUR}}</p>
                
                <h2>ARTICLE 1 - OBJET</h2>
                <p>Le promettant s'engage irrévocablement à vendre au bénéficiaire le terrain situé à {{ADRESSE_TERRAIN}} d'une superficie de {{SUPERFICIE}} m².</p>
                
                <h2>ARTICLE 2 - PRIX</h2>
                <p>Le prix est fixé à {{PRIX_VENTE}} FCFA.</p>
                
                <h2>ARTICLE 3 - INDEMNITE D'IMMOBILISATION</h2>
                <p>Le bénéficiaire verse ce jour une indemnité de {{INDEMNITE}} FCFA.</p>
            `,
            variables: JSON.stringify(["NOM_VENDEUR", "NOM_ACQUEREUR", "ADRESSE_TERRAIN", "SUPERFICIE", "PRIX_VENTE", "INDEMNITE"])
        }
    ]

    for (const template of templates) {
        await prisma.template.create({
            data: template
        })
        console.log(`✅ Ajouté : ${template.name}`)
    }

    console.log('--- POPULATION TERMINÉE ---')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
