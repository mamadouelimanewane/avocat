
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Contract Templates...')

    const templates = [
        // --- AFFAIRES ---
        {
            name: "Statuts SARL (OHADA)",
            category: "AFFAIRES",
            content: `<h1>STATUTS DE LA SOCIETE A RESPONSABILITE LIMITEE "[DENOMINATION_SOCIALE]"</h1>
            <p><strong>ENTRE LES SOUSSIGNES :</strong></p>
            <p>[ASSOCIE_1], demeurant à [ADRESSE_1], de nationalité [NATIONALITE_1].</p>
            <p>[ASSOCIE_2], demeurant à [ADRESSE_2], de nationalité [NATIONALITE_2].</p>
            <p><strong>IL A ETE CONVENU ET ARRETE CE QUI SUIT :</strong></p>
            <h2>TITRE I : FORME - OBJET - DENOMINATION - SIEGE - DUREE</h2>
            <h3>ARTICLE 1 : FORME</h3>
            <p>Il est formé entre les propriétaires des parts ci-après créées et de celles qui pourraient l'être ultérieurement, une Société à Responsabilité Limitée régie par l'Acte Uniforme de l'OHADA relatif au droit des sociétés commerciales et du GIE, et par les présents statuts.</p>
            <h3>ARTICLE 2 : OBJET</h3>
            <p>La société a pour objet : [OBJET_SOCIAL]</p>
            <!-- ... -->`,
            variables: JSON.stringify(["DENOMINATION_SOCIALE", "ASSOCIE_1", "ADRESSE_1", "OBJET_SOCIAL"])
        },
        {
            name: "Contrat de Prestation de Services",
            category: "AFFAIRES",
            content: `<h1>CONTRAT DE PRESTATION DE SERVICES</h1>
            <p><strong>ENTRE :</strong></p>
            <p><strong>[CLIENT]</strong>, ci-après dénommé "Le Client",</p>
            <p><strong>ET :</strong></p>
            <p><strong>[PRESTATAIRE]</strong>, ci-après dénommé "Le Prestataire".</p>
            <p><strong>IL EST CONVENU CE QUI SUIT :</strong></p>
            <h3>ARTICLE 1 : OBJET</h3>
            <p>Le Prestataire s'engage à réaliser pour le Client les missions suivantes : [DESCRIPTION_MISSION].</p>
            <h3>ARTICLE 2 : PRIX</h3>
            <p>En contrepartie, le Client versera la somme de [PRIX] FCFA.</p>`,
            variables: JSON.stringify(["CLIENT", "PRESTATAIRE", "DESCRIPTION_MISSION", "PRIX"])
        },
        {
            name: "Pacte d'Actionnaires (Simplifié)",
            category: "AFFAIRES",
            content: `<h1>PACTE D'ACTIONNAIRES</h1>
            <p>Conclu pour organiser les relations entre les associés de la société [SOCIETE]...</p>`,
            variables: JSON.stringify(["SOCIETE"])
        },

        // --- FONCIER ---
        {
            name: "Contrat de Bail à Usage Commercial",
            category: "FONCIER",
            content: `<h1>CONTRAT DE BAIL COMMERCIAL</h1>
            <p>Soumis aux dispositions de l'Acte Uniforme OHADA portant Droit Commercial Général.</p>
            <p><strong>BAILLEUR :</strong> [BAILLEUR]</p>
            <p><strong>PRENEUR :</strong> [PRENEUR]</p>
            <h3>ARTICLE 1 : DESIGNATION DES LIEUX</h3>
            <p>Le Bailleur donne en location des locaux situés à [ADRESSE_LOCAUX]...</p>
            <h3>ARTICLE 2 : LOYER</h3>
            <p>Le loyer mensuel est fixé à la somme de [MONTANT_LOYER] FCFA.</p>`,
            variables: JSON.stringify(["BAILLEUR", "PRENEUR", "ADRESSE_LOCAUX", "MONTANT_LOYER"])
        },
        {
            name: "Promesse de Vente Immobilière",
            category: "FONCIER",
            content: `<h1>PROMESSE SYNALLAGMATIQUE DE VENTE</h1>
            <p><strong>LE PROMETTANT (Vendeur) :</strong> [VENDEUR]</p>
            <p><strong>LE BENEFICIAIRE (Acquéreur) :</strong> [ACQUEREUR]</p>
            <p>Le Promettant s'engage à vendre le bien immobilier sis à [ADRESSE_BIEN], TF N°[TITRE_FONCIER].</p>`,
            variables: JSON.stringify(["VENDEUR", "ACQUEREUR", "ADRESSE_BIEN", "TITRE_FONCIER"])
        },

        // --- TRAVAIL ---
        {
            name: "Contrat de Travail à Durée Indéterminée (CDI)",
            category: "TRAVAIL",
            content: `<h1>CONTRAT DE TRAVAIL A DUREE INDETERMINEE</h1>
            <p><strong>ENTRE :</strong></p>
            <p>La Société [EMPLOYEUR], représentée par [REPRESENTANT].</p>
            <p><strong>ET :</strong></p>
            <p>M./Mme [EMPLOYE], demeurant à [ADRESSE_EMPLOYE].</p>
            <h3>ARTICLE 1 : ENGAGEMENT</h3>
            <p>M./Mme [EMPLOYE] est engagé(e) en qualité de [POSTE], Classification [CATEGORIE], à compter du [DATE_DEBUT].</p>
            <h3>ARTICLE 2 : REMUNERATION</h3>
            <p>Le salaire mensuel brut est fixé à [SALAIRE] FCFA.</p>`,
            variables: JSON.stringify(["EMPLOYEUR", "REPRESENTANT", "EMPLOYE", "POSTE", "DATE_DEBUT", "SALAIRE"])
        },
        {
            name: "Lettre de Licenciement pour Faute Grave",
            category: "TRAVAIL",
            content: `<h1>NOTIFICATION DE LICENCIEMENT POUR FAUTE GRAVE</h1>
            <p>A [LIEU], le [DATE]</p>
            <p>A l'attention de [EMPLOYE]</p>
            <p>Objet : Notification de licenciement</p>
            <p>Monsieur/Madame,</p>
            <p>Nous avons le regret de vous notifier par la présente votre licenciement pour faute grave, suite à l'entretien préalable du [DATE_ENTRETIEN]...</p>`,
            variables: JSON.stringify(["LIEU", "DATE", "EMPLOYE", "DATE_ENTRETIEN"])
        }
    ]

    for (const tmpl of templates) {
        // Upsert by name to check existence
        const exists = await prisma.template.findFirst({ where: { name: tmpl.name } })
        if (!exists) {
            await prisma.template.create({ data: tmpl })
            console.log(`Created template: ${tmpl.name}`)
        } else {
            // Update content just in case
            await prisma.template.update({
                where: { id: exists.id },
                data: { content: tmpl.content, variables: tmpl.variables, category: tmpl.category }
            })
            console.log(`Updated template: ${tmpl.name}`)
        }
    }

    console.log('Templates seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
