
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding advanced/modern African legal templates...')

    const templates = [
        // --- INTERNATIONAL / CEDEAO ---
        {
            name: "Requête devant la Cour de Justice de la CEDEAO",
            category: "INTERNATIONAL",
            variables: JSON.stringify(["etat_defendeur", "droits_violes", "faits_recapitulatifs", "mesures_sollicitees"]),
            content: `
                <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
                    <h2 style="text-align: center;">REQUETE INTRODUCTIVE D'INSTANCE</h2>
                    <p>A Messieurs les Président et Juge de la Cour de Justice de la CEDEAO siégeant à Abuja (Nigéria).</p>
                    <p>REQUERANT : <strong>{{requerant_nom}}</strong>, ayant pour Conseil Maître..., Avocat à la Cour.</p>
                    <p>CONTRE : <strong>L'ETAT DE {{etat_defendeur}}</strong>.</p>
                    <p><strong>OBJET :</strong> Violation des Droits de l'Homme, notamment {{droits_violes}}.</p>
                    <hr/>
                    <h3>EXPOSE DES FAITS</h3>
                    <p>{{faits_recapitulatifs}}</p>
                    <h3>MOYENS DE DROIT</h3>
                    <p>Violation de la Charte Africaine des Droits de l'Homme et des Peuples...</p>
                    <h3>PAR CES MOTIFS</h3>
                    <p>Dire et juger que l'Etat de {{etat_defendeur}} a violé les droits du requérant... Ordonner {{mesures_sollicitees}}.</p>
                </div>
            `
        },
        // --- AFFAIRES / CORPORATE ADVANCED ---
        {
            name: "Pacte d'Actionnaires (Venture Capital/PME)",
            category: "AFFAIRES",
            variables: JSON.stringify(["societe_nom", "investisseurs_noms", "clauses_veto", "duree_pacte"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">PACTE D'ACTIONNAIRES</h2>
                    <p>Conclu entre les fondateurs de la société <strong>{{societe_nom}}</strong> et les investisseurs : {{investisseurs_noms}}.</p>
                    <p><strong>Article 1 : Gouvernance</strong><br/>Certaines décisions stratégiques sont soumises à un droit de veto : {{clauses_veto}}.</p>
                    <p><strong>Article 2 : Transfert de Titres</strong><br/>Droit de préemption, Clause Tag-Along et Drag-Along.</p>
                    <p><strong>Article 3 : Durée</strong><br/>Le présent pacte est conclu pour une durée de {{duree_pacte}} ans.</p>
                </div>
            `
        },
        {
            name: "Contrat de Cession de Marque (OAPI)",
            category: "AFFAIRES",
            variables: JSON.stringify(["cedant", "cessionnaire", "marque_nom", "numero_enregistrement", "prix_cession"]),
            content: `
                <div style="font-family: sans-serif;">
                    <h2 style="text-align: center;">ACTE DE CESSION DE MARQUE</h2>
                    <p>(Conforme à l'Accord de Bangui révisé - OAPI)</p>
                    <p>Le Cédant : <strong>{{cedant}}</strong> cède au Cessionnaire : <strong>{{cessionnaire}}</strong>.</p>
                    <p>La marque dénommée : <strong>{{marque_nom}}</strong>, enregistrée à l'OAPI sous le n° {{numero_enregistrement}}.</p>
                    <p>La présente cession est faite moyennant le prix de {{prix_cession}} FCFA.</p>
                </div>
            `
        },
        // --- ADMINISTRATIF / MARCHES PUBLICS ---
        {
            name: "Recours gracieux ARCOP (Marchés Publics)",
            category: "ADMINISTRATIF",
            variables: JSON.stringify(["autorite_contractante", "marche_identifiant", "griefs_rejet", "arguments_techniques"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">RECOURS GRACIEUX / CONTESTATION DE REJET</h2>
                    <p>A l'attention de Monsieur le Responsable du Marché de {{autorite_contractante}}.</p>
                    <p>Objet : Contestation de la décision d'attribution du marché {{marche_identifiant}}.</p>
                    <p>Monsieur, nous contestons le rejet de notre offre pour les motifs suivants : {{griefs_rejet}}.</p>
                    <p><strong>Arguments :</strong> {{arguments_techniques}}</p>
                </div>
            `
        },
        // --- TECH / RGPD AFRIQUE ---
        {
            name: "Politique de Confidentialité (Loi CDP Sénégal)",
            category: "TECH",
            variables: JSON.stringify(["site_web", "responsable_traitement", "donnees_collectees", "finalite_traitement"]),
            content: `
                <div style="font-family: sans-serif; line-height: 1.4;">
                    <h2>POLITIQUE DE PROTECTION DES DONNEES PERSONNELLES</h2>
                    <p>Conformément à la Loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel au Sénégal.</p>
                    <p><strong>Responsable :</strong> {{responsable_traitement}} pour le site {{site_web}}.</p>
                    <p><strong>Données :</strong> Nous collectons les données suivantes : {{donnees_collectees}}.</p>
                    <p><strong>Finalité :</strong> {{finalite_traitement}}.</p>
                    <p>Déclaration effectuée auprès de la CDP sous le numéro...</p>
                </div>
            `
        },
        // --- TRAVAIL SPECIFIQUE ---
        {
            name: "Convention de Stage (Sénégal)",
            category: "TRAVAIL",
            variables: JSON.stringify(["entreprise_nom", "stagiaire_nom", "ecole_nom", "indemnite_mensuelle", "date_fin"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CONVENTION DE STAGE</h2>
                    <p>Entre <strong>{{entreprise_nom}}</strong>, <strong>{{stagiaire_nom}}</strong> de l'école {{ecole_nom}}.</p>
                    <p><strong>Mission :</strong> Apprentissage en milieu professionnel jusqu'au {{date_fin}}.</p>
                    <p><strong>Indemnité :</strong> Une gratification de {{indemnite_mensuelle}} FCFA sera versée mensuellement.</p>
                    <p>Le stagiaire reste sous statut étudiant.</p>
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

    console.log('Creative seeding finished.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
