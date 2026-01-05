
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🏛️ EXTRACTION PROFONDE DES CODES DU SÉNÉGAL (FIXED)...')

    const deepCodes = [
        {
            title: "Code Pénal Sénégalais - Mise à jour 2024",
            type: "LOI",
            court: "MINISTÈRE DE LA JUSTICE",
            date: new Date("2024-02-09"),
            reference: "Loi n° 2024-06",
            summary: "Révision majeure intégrant de nouvelles dispositions sur la cybercriminalité, la corruption et le renforcement des sanctions pénales.",
            content: `Le Code Pénal réprime les infractions. 
            MAJ 2024 : 
            1. Cyber-terrorisme : Nouvelles qualifications.
            2. Blanchiment : Alinement avec les directives du GIABA.
            3. Peines : Révision des amendes minimales pour les délits économiques.`,
            region: "SENEGAL",
            category: "PENAL",
            keywords: JSON.stringify(["pénal", "sanction", "cybercriminalité", "justice"])
        },
        {
            title: "Code de l'Urbanisme - Partie Réglementaire 2025",
            type: "DECRET",
            court: "SENEGAL",
            date: new Date("2025-07-17"),
            reference: "Décret n° 2025-1194",
            summary: "Décret d'application de la loi 2023-20. Définit les modalités précises du permis de construire et le certificat de conformité.",
            content: `Précise les conditions d'octroi des autorisations d'occupper :
            - Guichet unique 'Teledac' : Obligations de réponse sous 45 jours.
            - Sanction : Démolition d'office pour défaut de permis sur les zones ZAC.`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["urbanisme", "décret", "permis", "Teledac"])
        },
        {
            title: "Code Électoral 2025 - Réforme Post-Assises",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2024-11-15"),
            reference: "Loi Electorale 2025",
            summary: "Réorganisation des circonscriptions et mise à jour suite aux Assises de la Justice de 2024.",
            content: `Définit les règles de parrainage et de participation aux scrutins :
            - Répartition des sièges : Adaptation démographique 2025.
            - Contentieux : Compétence renforcée du Conseil Constitutionnel.`,
            region: "SENEGAL",
            category: "PUBLIC",
            keywords: JSON.stringify(["élection", "parrainage", "conseil constitutionnel"])
        },
        {
            title: "Code de l'Environnement 2024",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2024-01-10"),
            reference: "Code Environnement",
            summary: "Intègre les principes du développement durable et de la responsabilité élargie des producteurs (REP).",
            content: `Protection du patrimoine naturel :
            - Études d'impact environnemental (EIE) : Plus strictes pour les projets extractifs.
            - Taxe plastique : Renforcement des contrôles douaniers.`,
            region: "SENEGAL",
            category: "ENVIRONNEMENT",
            keywords: JSON.stringify(["écologie", "EIE", "pollution", "développement durable"])
        },
        {
            title: "Code de l'Électricité 2024",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2021-07-01"),
            reference: "Loi 2021-31 Actualisée",
            summary: "Libéralisation du secteur et régulation des énergies renouvelables (EnR).",
            content: `Cadre régulé par la CRSE :
            - Autoproduction : Facilitée pour les industriels via injection sur le réseau SENELEC.
            - Électrification rurale : Nouveaux partenariats public-privé (PPP).`,
            region: "SENEGAL",
            category: "ENERGIE",
            keywords: JSON.stringify(["électricité", "CRSE", "EnR", "SENELEC"])
        },
        {
            title: "Code de la Construction - Mise à jour Décembre 2023",
            type: "LOI",
            court: "ARCHIVES SN",
            date: new Date("2023-12-29"),
            reference: "Acte de Construction",
            summary: "Normes de sécurité incendie, accessibilité et matériaux locaux obligatoires dans le secteur public.",
            content: `Définit les standards techniques :
            - Assurance décennale : Obligatoire pour tout promoteur.
            - Matériaux locaux (Typha, brique de terre compressée) : Encouragement via abattements fiscaux.`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["construction", "sécurité", "assurance", "matériaux"])
        }
    ];

    for (const code of deepCodes) {
        const existing = await prisma.jurisprudence.findFirst({
            where: { title: code.title }
        });

        if (existing) {
            await prisma.jurisprudence.update({
                where: { id: existing.id },
                data: code
            });
            console.log(`🔄 Updated : ${code.title}`);
        } else {
            await prisma.jurisprudence.create({
                data: code
            });
            console.log(`✅ Created : ${code.title}`);
        }
    }

    console.log('🚀 EXTRACTION PROFONDE TERMINÉE.');
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
