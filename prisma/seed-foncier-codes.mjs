
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🏗️ INSTALLATION DES TEXTES DE LOI SUR LE FONCIER (SÉNÉGAL)...')

    const landLaws = [
        {
            title: "Loi n° 64-46 relative au Domaine National",
            type: "LOI",
            court: "ASSEMBLEE NATIONALE",
            date: new Date("1964-06-17"),
            reference: "Loi 64-46",
            summary: "Texte fondamental régissant les terres non immatriculées au Sénégal. Classement en zones urbaines, classées, de terroir et pionnières.",
            content: `La Loi 64-46 constitue le pilier du droit foncier sénégalais.
            - Article 1 : Toutes les terres non immatriculées font partie du Domaine National.
            - Article 2 : L'État détient ces terres pour en assurer l'utilisation rationnelle.
            - Article 15 : Les droits de jouissance ne peuvent être cédés qu'avec autorisation.
            - Zones de Terroir : Gérées par les Communes (anciennes Communautés Rurales).`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["domaine national", "terroir", "immatriculation", "affectation"])
        },
        {
            title: "Loi n° 76-67 relative à l'expropriation pour cause d'utilité publique",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("1976-07-02"),
            reference: "Loi 76-67",
            summary: "Procédure d'expropriation, enquête de commodo et incommodo, et fixation des indemnités d'éviction.",
            content: `Régit le transfert forcé de propriété pour les projets d'intérêt général.
            - Phase Administrative : Déclaration d'Utilité Publique (DUP).
            - Indemnisation : Doit être juste et préalable.
            - Contentieux : Compétence du Tribunal de Grande Instance pour la fixation du prix en cas de désaccord.`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["expropriation", "DUP", "indemnité", "utilité publique"])
        },
        {
            title: "Décret n° 2023-382 sur la Baisse des Loyers",
            type: "DECRET",
            court: "GOUVERNEMENT",
            date: new Date("2023-02-24"),
            reference: "Décret 2023-382",
            summary: "Mesures impératives de réduction des prix des loyers au Sénégal (15% pour les petits loyers).",
            content: `Réglementation des baux à usage d'habitation :
            - Réduction : 15% (loyers < 300k), 10% (300k-500k), 5% (> 500k).
            - Caution : Limitée à 2 mois.
            - Honoraires Agence : Plafonnés.
            - Contentieux : Commission de régulation des loyers.`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["loyer", "bail", "réduction", "habitation"])
        },
        {
            title: "Loi n° 2011-06 sur la transformation des titres précaires",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2011-03-30"),
            reference: "Loi 2011-06",
            summary: "Permet la mutation des permis d'habiter et titres précaires en Titres Fonciers définitifs.",
            content: `Accélère l'immatriculation foncière :
            - Transformation gratuite ou à coût réduit selon les zones.
            - Objectif : Sécurisation foncière des occupants de bonne foi.
            - Procédure simplifiée devant la Conservation foncière.`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["titre foncier", "permis d'habiter", "sécurisation", "mutation"])
        },
        {
            title: "Décret de 1932 sur le Régime de la Propriété Foncière",
            type: "DECRET",
            court: "AFRIQUE OCCIDENTALE",
            date: new Date("1932-07-26"),
            reference: "Décret 1932",
            summary: "Base historique et toujours en vigueur du système du Livre Foncier et de l'immatriculation.",
            content: `Établit le système des livres fonciers (Torrens system).
            - L'immatriculation est définitive et inattaquable.
            - Le certificat de propriété atteste des droits inscrits.
            - Principe de publicité foncière obligatoire.`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["livre foncier", "immatriculation", "propriété", "publicité"])
        }
    ]

    for (const law of landLaws) {
        const existing = await prisma.jurisprudence.findFirst({
            where: { title: law.title }
        })

        if (existing) {
            await prisma.jurisprudence.update({
                where: { id: existing.id },
                data: law
            })
            console.log(`🔄 Mis à jour : ${law.title}`)
        } else {
            await prisma.jurisprudence.create({
                data: law
            })
            console.log(`✅ Créé : ${law.title}`)
        }
    }

    console.log('🚀 INSTALLATION FONCIÈRE TERMINÉE.')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
