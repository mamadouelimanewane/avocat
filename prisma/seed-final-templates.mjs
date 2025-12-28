
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding even more specialized African/OHADA templates...')

    const templates = [
        // --- ADMINISTRATIF ---
        {
            name: "Recours pour Excès de Pouvoir (Cour Suprême)",
            category: "ADMINISTRATIF",
            variables: JSON.stringify(["autorite_administrative", "decision_date", "decision_ref", "moyens_annulation"]),
            content: `
                <div style="font-family: serif; line-height: 1.6;">
                    <h2 style="text-align: center;">RECOURS POUR EXCES DE POUVOIR</h2>
                    <p>A Monsieur le Premier Président et Messieurs les Conseillers de la Chambre Administrative de la Cour Suprême.</p>
                    <p>Pour : <strong>{{requerant_nom}}</strong>, demeurant à ..., ayant pour conseil Maître..., Avocat à la Cour.</p>
                    <p>Contre : La décision du <strong>{{autorite_administrative}}</strong> en date du {{decision_date}} sous la référence {{decision_ref}}.</p>
                    <hr/>
                    <h3>MOYENS D'ANNULATION</h3>
                    <p>Considérant que la capture de l'acte attaqué révèle un vice de forme...</p>
                    <p>{{moyens_annulation}}</p>
                </div>
            `
        },
        // --- AFFAIRES / PROFESSIONNEL ---
        {
            name: "Contrat de Bail Professionnel (OHADA)",
            category: "AFFAIRES",
            variables: JSON.stringify(["bailleur", "locataire_pro", "destination_locaux", "loyer_trimestriel", "date_entree"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CONTRAT DE BAIL A USAGE PROFESSIONNEL</h2>
                    <p>(Régit par l'Acte Uniforme OHADA portant Droit Commercial Général)</p>
                    <p>Bailleur : <strong>{{bailleur}}</strong></p>
                    <p>Preneur : <strong>{{locataire_pro}}</strong></p>
                    <p><strong>Destination :</strong> Les locaux sont destinés exclusivement à l'usage de {{destination_locaux}}.</p>
                    <p><strong>Loyer :</strong> Le loyer est payable par trimestre d'avance pour un montant de {{loyer_trimestriel}} FCFA.</p>
                </div>
            `
        },
        {
            name: "Acte de Nantissement de Fonds de Commerce",
            category: "AFFAIRES",
            variables: JSON.stringify(["creancier", "debiteur", "description_fonds", "montant_garanti", "rccm_ref"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">ACTE DE NANTISSEMENT</h2>
                    <p>Entre le créancier {{creancier}} et le débiteur {{debiteur}}.</p>
                    <p>Le débiteur affecte en garantie de sa dette de {{montant_garanti}} FCFA, le nantissement de son fonds de commerce sis à {{description_fonds}}.</p>
                    <p>Inscrit au RCCM sous le n° {{rccm_ref}}.</p>
                </div>
            `
        },
        // --- SOCIAL / FAMILLE ---
        {
            name: "Requête en Liquidation de Succession",
            category: "SOCIAL",
            variables: JSON.stringify(["defunt_nom", "date_deces", "heritiers_liste", "tribunal_ville"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">REQUETE AUX FINS DE LIQUIDATION DE SUCCESSION</h2>
                    <p>A Monsieur le Président du Tribunal de Grande Instance de {{tribunal_ville}}.</p>
                    <p>Exposants : {{heritiers_liste}}.</p>
                    <p>Suite au décès de Monsieur/Madame {{defunt_nom}} survenu le {{date_deces}}, les héritiers sollicitent la nomination d'un liquidateur...</p>
                </div>
            `
        },
        // --- PENAL ---
        {
            name: "Mémoire en Défense (Tribunal Correctionnel)",
            category: "PENAL",
            variables: JSON.stringify(["prevenu_nom", "infraction_poursuivie", "date_infraction", "arguments_defense"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">MEMOIRE EN DEFENSE</h2>
                    <p>Tribunal Correctionnel de...</p>
                    <p>Pour : <strong>{{prevenu_nom}}</strong>, prévenu de {{infraction_poursuivie}}.</p>
                    <p><strong>Rappel des faits :</strong> Les faits reprochés datent du {{date_infraction}}.</p>
                    <p><strong>Discussion :</strong> {{arguments_defense}}</p>
                    <p><strong>Par ces motifs :</strong> Relâcher le prévenu des fins de la poursuite sans peine ni dépens...</p>
                </div>
            `
        },
        // --- PROCEDES COMMERCIAUX ---
        {
            name: "Sommation de Payer (Acte d'Huissier)",
            category: "PROCEDURE",
            variables: JSON.stringify(["huissier_nom", "creancier_nom", "debiteur_nom", "montant_total"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">SOMMATION DE PAYER</h2>
                    <p>L'an deux mille..., le... </p>
                    <p>A la requête de <strong>{{creancier_nom}}</strong>, j'ai, Me {{huissier_nom}}, fait sommation à <strong>{{debiteur_nom}}</strong> d'avoir à payer la somme de {{montant_total}} FCFA.</p>
                    <p>Faute de quoi, il y sera contraint par toutes les voies de droit.</p>
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

    console.log('Final seeding finished.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
