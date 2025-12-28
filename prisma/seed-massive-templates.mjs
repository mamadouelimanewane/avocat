
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding massive African/OHADA/Senegal templates bank...')

    const templates = [
        // --- AFFAIRES / OHADA ---
        {
            name: "Procès-verbal d'Assemblée Générale (OHADA)",
            category: "AFFAIRES",
            variables: JSON.stringify(["societe_nom", "date_ag", "lieu_ag", "nombre_actions", "ordre_du_jour"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">PROCES-VERBAL D'ASSEMBLEE GENERALE ORDINAIRE</h2>
                    <p><strong>SOCIETE : {{societe_nom}}</strong></p>
                    <p>Le {{date_ag}}, les actionnaires se sont réunis en AGO à {{lieu_ag}}.</p>
                    <p><strong>Ordre du jour :</strong> {{ordre_du_jour}}</p>
                    <p>Les résolutions suivantes ont été adoptées à l'unanimité...</p>
                </div>
            `
        },
        {
            name: "Contrat de Prestation de Services informatique",
            category: "AFFAIRES",
            variables: JSON.stringify(["prestataire", "client_nom", "mission_description", "honoraires", "delai_livraison"]),
            content: `
                <div style="font-family: sans-serif;">
                    <h2 style="text-align: center;">CONTRAT DE PRESTATION DE SERVICES</h2>
                    <p>Entre <strong>{{prestataire}}</strong> et <strong>{{client_nom}}</strong>.</p>
                    <p><strong>Mission :</strong> {{mission_description}}</p>
                    <p><strong>Rémunération :</strong> Le client s'engage à payer {{honoraires}} FCFA.</p>
                    <p><strong>Loi applicable :</strong> Le présent contrat est soumis au droit sénégalais.</p>
                </div>
            `
        },
        // --- TRAVAIL ---
        {
            name: "Lettre de Licenciement pour Faute Grave",
            category: "TRAVAIL",
            variables: JSON.stringify(["salarie_nom", "date_entretien", "motifs_faute", "date_notification"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <p style="text-align: right;">Le {{date_notification}}</p>
                    <p>A l'attention de Monsieur/Madame {{salarie_nom}}</p>
                    <p><strong>Objet : Notification de licenciement pour faute grave</strong></p>
                    <p>Suite à notre entretien préalable du {{date_entretien}}, nous vous informons de notre décision de rompre votre contrat de travail sans préavis ni indemnités.</p>
                    <p>Les motifs retenus sont les suivants : {{motifs_faute}}.</p>
                </div>
            `
        },
        {
            name: "Certificat de Travail (Code du Travail)",
            category: "TRAVAIL",
            variables: JSON.stringify(["employeur", "salarie", "poste", "date_entree", "date_sortie"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">CERTIFICAT DE TRAVAIL</h2>
                    <p>Je soussigné {{employeur}}, certifie que Monsieur/Madame {{salarie}} a été employé(e) au sein de notre structure en qualité de {{poste}}.</p>
                    <p>Période du {{date_entree}} au {{date_sortie}}.</p>
                    <p>Le/La salarié(e) nous quitte libre de tout engagement.</p>
                </div>
            `
        },
        // --- CIVIL / SOCIAL ---
        {
            name: "Requête en Divorce (Consentement Mutuel)",
            category: "SOCIAL", // Usagé pour Famille/Social
            variables: JSON.stringify(["epoux_nom", "epouse_nom", "date_mariage", "lieu_mariage", "enfants_nb"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">REQUETE AUX FINS DE DIVORCE PAR CONSENTEMENT MUTUEL</h2>
                    <p>A Monsieur le Président du Tribunal de Grande Instance de...</p>
                    <p>Les conjoints <strong>{{epoux_nom}}</strong> et <strong>{{epouse_nom}}</strong>, mariés le {{date_mariage}} à {{lieu_mariage}}.</p>
                    <p>Déclarent par la présente souhaiter rompre leur lien matrimonial...</p>
                    <p>De cette union sont nés {{enfants_nb}} enfant(s).</p>
                </div>
            `
        },
        {
            name: "Contrat de Prêt d'Argent entre particuliers",
            category: "CIVIL",
            variables: JSON.stringify(["preteur", "emprunteur", "somme_pret", "taux_interet", "date_remboursement"]),
            content: `
                <div style="font-family: sans-serif;">
                    <h2 style="text-align: center;">RECONNAISSANCE DE DETTE</h2>
                    <p>Je soussigné <strong>{{emprunteur}}</strong>, reconnais avoir reçu de <strong>{{preteur}}</strong> la somme de {{somme_pret}} FCFA.</p>
                    <p>Je m'engage à rembourser cette somme au plus tard le {{date_remboursement}} avec un taux d'intérêt de {{taux_interet}}%.</p>
                </div>
            `
        },
        // --- PENAL ---
        {
            name: "Plainte avec Constitution de Partie Civile",
            category: "PENAL",
            variables: JSON.stringify(["plaignant_nom", "infraction", "lieu_faits", "date_faits", "prejudice_desc"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">PLAINTE AVEC CONSTITUTION DE PARTIE CIVILE</h2>
                    <p>A Monsieur le Doyen des Juges d'Instruction du Tribunal de...</p>
                    <p>Exposant : <strong>{{plaignant_nom}}</strong></p>
                    <p>Objet : Plainte pour {{infraction}}.</p>
                    <p>Les faits se sont déroulés le {{date_faits}} à {{lieu_faits}}.</p>
                    <p><strong>Préjudice subi :</strong> {{prejudice_desc}}</p>
                </div>
            `
        },
        {
            name: "Requête en Mise en Liberté Provisoire",
            category: "PENAL",
            variables: JSON.stringify(["detenu_nom", "numero_ecrou", "date_mandat", "garanties_representation"]),
            content: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">REQUETE EN MISE EN LIBERTE PROVISOIRE</h2>
                    <p>Conseil : Maître..., Avocat à la Cour</p>
                    <p>Pour : <strong>{{detenu_nom}}</strong>, écroué sous le n° {{numero_ecrou}}.</p>
                    <p>Considérant que la détention provisoire ne se justifie plus...</p>
                    <p>Le prévenu offre les garanties suivantes : {{garanties_representation}}.</p>
                </div>
            `
        },
        // --- FONCIER ---
        {
            name: "Sommation Interpellative (Foncier)",
            category: "FONCIER",
            variables: JSON.stringify(["huissier_nom", "requis_nom", "question_posee", "adresse_terrain"]),
            content: `
                <div style="font-family: serif;">
                    <h2 style="text-align: center;">SOMMATION INTERPELLATIVE</h2>
                    <p>A la requête de..., je Me {{huissier_nom}}, Huissier de justice, me suis rendu à {{adresse_terrain}}.</p>
                    <p>J'ai interpellé Monsieur/Madame <strong>{{requis_nom}}</strong> en ces termes :</p>
                    <p>"{{question_posee}}"</p>
                    <p>Réponse du requis : "..."</p>
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

    console.log('Mass seeding finished.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
