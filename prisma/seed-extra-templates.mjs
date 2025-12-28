
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Senegalese/OHADA specialized templates...')

    const templates = [
        {
            name: "Assignation devant le TGI (Sénégal)",
            category: "LITIGE",
            variables: JSON.stringify(["tribunal_ville", "demandeur_nom", "demandeur_adresse", "defendeur_nom", "objet_demande", "date_audience", "heure_audience"]),
            content: `
                <div style="font-family: 'Times New Roman', serif; line-height: 1.5;">
                    <p style="text-align: right;"><strong>ANNEE {{annee}}</strong></p>
                    <h2 style="text-align: center; text-decoration: underline;">ASSIGNATION EN JUSTICE</h2>
                    <p>A la requête de : <strong>{{demandeur_nom}}</strong>, demeurant à {{demandeur_adresse}}, élisant domicile en l'Etude de Maître..., Avocat à la Cour.</p>
                    <p>J'ai, Huissier de Justice soussigné, assigné :</p>
                    <p><strong>{{defendeur_nom}}</strong>, demeurant à...</p>
                    <p>A comparaître par devant le <strong>Tribunal de Grande Instance de {{tribunal_ville}}</strong>, siégeant au Palais de Justice de ladite ville, à l'audience du {{date_audience}} à {{heure_audience}}.</p>
                    <hr/>
                    <h3>OBJET DE LA DEMANDE</h3>
                    <p>{{objet_demande}}</p>
                    <p>SOUS TOUTES RESERVES</p>
                </div>
            `
        },
        {
            name: "Contrat de Travail (Modèle Sénégal)",
            category: "TRAVAIL",
            variables: JSON.stringify(["employeur", "salarie", "poste", "salaire_base", "date_debut", "duree_essai"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CONTRAT DE TRAVAIL A DUREE INDETERMINEE</h2>
                    <p>Entre les soussignés :<br/>1. <strong>{{employeur}}</strong> (L'Employeur)<br/>2. <strong>{{salarie}}</strong> (Le Salarié)</p>
                    <p>Il a été convenu ce qui suit conformément au Code du Travail Sénégalais :</p>
                    <p><strong>Article 1 : Engagement</strong><br/>Le salarié est engagé en qualité de {{poste}} à compter du {{date_debut}}.</p>
                    <p><strong>Article 2 : Période d'essai</strong><br/>Le présent contrat est soumis à une période d'essai de {{duree_essai}}.</p>
                    <p><strong>Article 3 : Rémunération</strong><br/>Le salaire de base est fixé à {{salaire_base}} FCFA brut par mois.</p>
                </div>
            `
        },
        {
            name: "Statuts SARL (OHADA Sénégal)",
            category: "AFFAIRES",
            variables: JSON.stringify(["denomination_sociale", "capital_social", "siege_social", "objet_social", "gerant_nom"]),
            content: `
                <div style="font-family: serif;">
                    <h1 style="text-align: center;">STATUTS DE LA SOCIETE {{denomination_sociale}}</h1>
                    <p>Société à Responsabilité Limitée au capital de {{capital_social}} FCFA.</p>
                    <p><strong>Article 1 : Forme</strong><br/>Il est formé entre les soussignés une SARL régie par l'Acte Uniforme OHADA.</p>
                    <p><strong>Article 2 : Siège Social</strong><br/>Le siège est fixé à {{siege_social}}.</p>
                    <p><strong>Article 3 : Objet</strong><br/>La société a pour objet : {{objet_social}}.</p>
                    <p><strong>Article 4 : Gérance</strong><br/>Le premier gérant est Monsieur/Madame {{gerant_nom}}.</p>
                </div>
            `
        },
        {
            name: "Contrat de Bail à usage d'habitation",
            category: "FONCIER",
            variables: JSON.stringify(["bailleur", "preneur", "adresse_bien", "loyer_mensuel", "caution_nb_mois"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CONTRAT DE BAIL A USAGE D'HABITATION</h2>
                    <p>(Conforme à la Loi sur la baisse des loyers au Sénégal)</p>
                    <p>Bailleur : <strong>{{bailleur}}</strong></p>
                    <p>Preneur : <strong>{{preneur}}</strong></p>
                    <p><strong>Objet :</strong> Local sis à {{adresse_bien}}.</p>
                    <p><strong>Loyer :</strong> Le loyer mensuel est fixé à {{loyer_mensuel}} FCFA.</p>
                    <p><strong>Caution :</strong> Le preneur verse un dépôt de garantie correspondant à {{caution_nb_mois}} mois de loyer.</p>
                </div>
            `
        },
        {
            name: "Mise en demeure de payer",
            category: "LITIGE",
            variables: JSON.stringify(["destinataire", "montant_du", "delai_jours", "date_facture"]),
            content: `
                <div style="font-family: sans-serif;">
                    <p style="text-align: right;">Dakar, le {{date_aujourdhui}}</p>
                    <p>Objet : <strong>DERNIERE MISE EN DEMEURE AVANT POURSUITES</strong></p>
                    <p>A l'attention de {{destinataire}}</p>
                    <p>Monsieur/Madame,</p>
                    <p>Sauf erreur ou omission de notre part, le montant de {{montant_du}} FCFA relatif à la facture du {{date_facture}} reste impayé.</p>
                    <p>A défaut de règlement sous {{delai_jours}} jours, nous nous verrons dans l'obligation d'engager des poursuites judiciaires à votre encontre, dont les frais seront à votre charge.</p>
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
            console.log(`Created template: ${t.name}`)
        } else {
            await prisma.template.update({
                where: { id: existing.id },
                data: t
            })
            console.log(`Updated template: ${t.name}`)
        }
    }

    console.log('Seeding finished.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
