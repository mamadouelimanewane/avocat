
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding specialized Foncier, Administratif, and Affaires templates...')

    const templates = [
        // --- FONCIER (REAL ESTATE / LAND LAW) ---
        {
            name: "Requête en inscription au Livre Foncier",
            category: "FONCIER",
            variables: JSON.stringify(["conservateur_ville", "titre_foncier", "nom_proprietaire", "acte_date"]),
            content: `
                <div style="font-family: serif; line-height: 1.6;">
                    <h2 style="text-align: center;">REQUETE AUX FINS D'INSCRIPTION</h2>
                    <p>A Monsieur le Conservateur de la Propriété et des Droits Fonciers de <strong>{{conservateur_ville}}</strong>.</p>
                    <p>Exposant : <strong>{{nom_proprietaire}}</strong>, ayant pour conseil Maître..., Avocat à la Cour.</p>
                    <p>Objet : Inscription d'un droit réel sur le Titre Foncier N° <strong>{{titre_foncier}}</strong>.</p>
                    <p>Considérant que par acte en date du {{acte_date}}, le requérant a acquis...</p>
                    <p>Qu'il plaise au Conservateur de procéder aux inscriptions requises...</p>
                </div>
            `
        },
        {
            name: "Sommation de déguerpir (Expulsion)",
            category: "FONCIER",
            variables: JSON.stringify(["huissier_nom", "occupant_nom", "adresse_immeuble", "delai_expulsion"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">SOMMATION DE DEGUERPIR</h2>
                    <p>A la requête de Maître..., Avocat à la Cour, agissant pour le compte de...</p>
                    <p>J'ai, Me {{huissier_nom}}, Huissier de Justice, fait sommation à <strong>{{occupant_nom}}</strong>, occupant sans droit ni titre l'immeuble sis à {{adresse_immeuble}}.</p>
                    <p>D'avoir à vider les lieux et à libérer l'immeuble dans un délai de <strong>{{delai_expulsion}}</strong> jours.</p>
                    <p>A défaut, il y sera contraint par la force publique après ordonnance d'expulsion.</p>
                </div>
            `
        },
        // --- ADMINISTRATIF (ADMINISTRATIVE LAW) ---
        {
            name: "Recours Hiérarchique (Préliminaire)",
            category: "ADMINISTRATIF",
            variables: JSON.stringify(["ministre_nom", "decision_ref", "decision_date", "arguments_annulation"]),
            content: `
                <div style="font-family: sans-serif;">
                    <p style="text-align: right;">Dakar, le {{date_aujourdhui}}</p>
                    <p>A Monsieur le <strong>{{ministre_nom}}</strong></p>
                    <p>Objet : Recours hiérarchique contre la décision {{decision_ref}} du {{decision_date}}.</p>
                    <p>Monsieur le Ministre,</p>
                    <p>Nous avons l'honneur de porter à votre attention la décision citée en objet qui nous porte grief...</p>
                    <p><strong>Arguments :</strong> {{arguments_annulation}}</p>
                    <p>Dans l'attente d'une suite favorable à notre recours...</p>
                </div>
            `
        },
        {
            name: "Requête en Référé-Suspension",
            category: "ADMINISTRATIF",
            variables: JSON.stringify(["tribunal_administratif", "acte_attaque", "urgence_motif", "doute_serieux"]),
            content: `
                <div style="font-family: serif; line-height: 1.5;">
                    <h2 style="text-align: center;">REQUETE EN REFERE-SUSPENSION</h2>
                    <p>A Monsieur le Président du Tribunal Administratif de <strong>{{tribunal_administratif}}</strong>.</p>
                    <p>Pour : <strong>{{requerant_nom}}</strong>.</p>
                    <p>Objet : Demande de suspension de l'acte {{acte_attaque}}.</p>
                    <hr/>
                    <h3>DISCUSSION</h3>
                    <p><strong>1. Sur l'urgence :</strong> {{urgence_motif}}</p>
                    <p><strong>2. Sur le doute sérieux :</strong> {{doute_serieux}}</p>
                    <p>PAR CES MOTIFS : Ordonner la suspension de l'exécution de l'acte.</p>
                </div>
            `
        },
        // --- AFFAIRES (BUSINESS LAW / OHADA) ---
        {
            name: "Contrat d'Agent Commercial (OHADA)",
            category: "AFFAIRES",
            variables: JSON.stringify(["mandant_nom", "agent_nom", "secteur_geographique", "commission_taux", "duree_contrat"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CONTRAT D'AGENT COMMERCIAL</h2>
                    <p>(Conforme à l'Acte Uniforme OHADA sur le Droit Commercial Général)</p>
                    <p>Entre <strong>{{mandant_nom}}</strong> (Le Mandant) et <strong>{{agent_nom}}</strong> (L'Agent).</p>
                    <p><strong>Article 1 : Mandat</strong><br/>L'agent est chargé de vendre les produits du mandant sur le secteur de {{secteur_geographique}}.</p>
                    <p><strong>Article 2 : Rémunération</strong><br/>La commission est fixée à {{commission_taux}}% sur le chiffre d'affaires réalisé.</p>
                    <p><strong>Article 3 : Durée</strong><br/>Le contrat est conclu pour une durée de {{duree_contrat}}.</p>
                </div>
            `
        },
        {
            name: "Acte de cession de parts sociales (SARL)",
            category: "AFFAIRES",
            variables: JSON.stringify(["societe_nom", "cedant", "cessionnaire", "nombre_parts", "prix_part"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">ACTE DE CESSION DE PARTS SOCIALES</h2>
                    <p>Dans la société <strong>{{societe_nom}}</strong>, SARL au capital de ...</p>
                    <p>Monsieur <strong>{{cedant}}</strong> cède à Monsieur <strong>{{cessionnaire}}</strong>, {{nombre_parts}} parts sociales.</p>
                    <p>Le prix de cession par part est consenti à {{prix_part}} FCFA.</p>
                    <p>Les présents statuts seront modifiés en conséquence et enregistrés au RCCM.</p>
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

    console.log('Specialized seeding finished.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
