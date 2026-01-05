
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('📚 ENRICHISSEMENT DE LA BIBLIOTHÈQUE JURIDIQUE (CODES SÉNÉGAL 2024-2025)...')

    const codes = [
        {
            title: "Code Général des Impôts (CGI) - Actualisation 2025",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2024-12-28"),
            reference: "Loi de Finances 2025",
            summary: "Version actualisée incluant la facturation électronique obligatoire, la réforme de la Contribution Globale Unique (CGU) et les nouvelles mesures sur l'économie numérique.",
            content: `Le Code Général des Impôts du Sénégal régit l'assiette, le taux et les modalités de recouvrement des impôts. 
            Mises à jour 2025 : 
            1. Facturation électronique : Obligations pour les grandes et moyennes entreprises.
            2. Statut EFE : Prorogation des avantages jusqu'en fin 2025.
            3. IS : Taux maintenu à 30%, mais incitations pour l'industrie locale via le nouveau Code des Investissements.`,
            region: "SENEGAL",
            category: "FISCALITE",
            keywords: JSON.stringify(["impôts", "TVA", "IS", "facture électronique", "finances 2025"])
        },
        {
            title: "Nouveau Code des Investissements 2025",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2025-09-27"),
            reference: "Loi n°2025-16",
            summary: "Nouveau cadre attractif visant à booster l'industrialisation et la souveraineté économique. Crédit d'impôt recherche et exonérations zone spéciale.",
            content: `Ce code définit les garanties accordées aux investisseurs. 
            Points clés :
            - Liberté de transfert des capitaux et des revenus.
            - Protection contre l'expropriation.
            - Crédit d'impôt spécial pour les investissements dans les régions de l'intérieur.
            - Guichet unique APIX renforcé.`,
            region: "SENEGAL",
            category: "ECONOMIE",
            keywords: JSON.stringify(["investissement", "exonération", "APIX", "garantie", "industrie"])
        },
        {
            title: "Code des Marchés Publics - Réforme 2024",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2024-03-01"),
            reference: "Décret 2024-ARCOP",
            summary: "Nouvelles règles sur la commande publique, transparence accrue et digitalisation totale des procédures d'appel d'offres.",
            content: `Régit la passation, l'exécution et le contrôle des marchés publics. 
            Actualité :
            - Dématérialisation sur la plateforme ARCOP.
            - Part réservée aux PME localisées (Contenu Local).
            - Renforcement des sanctions en cas de pratiques frauduleuses.`,
            region: "SENEGAL",
            category: "ADMINISTRATIF",
            keywords: JSON.stringify(["marchés publics", "ARCOP", "appel d'offres", "commande publique"])
        },
        {
            title: "Code des Obligations Civiles et Commerciales (COCC) 2024",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2024-01-15"),
            reference: "COCC Actualisé",
            summary: "Texte fondamental régissant les contrats, la responsabilité civile et les spécificités commerciales non couvertes par l'OHADA.",
            content: `Le COCC reste le socle du droit des obligations. 
            Notes 2024 : Adaptation aux preuves numériques et validité de la signature électronique pour les actes sous seing privé.`,
            region: "SENEGAL",
            category: "CIVIL",
            keywords: JSON.stringify(["contrat", "obligation", "responsabilité", "preuve numérique"])
        },
        {
            title: "Nouveau Code Minier (Projet 2025)",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2025-11-01"),
            reference: "Code Minier 2025",
            summary: "Réforme visant à accroître les parts de l'État dans les exploitations minières et renforcer le contenu local.",
            content: `Orientations majeures :
            - Redevances progressives basées sur les cours mondiaux.
            - Obligation de transformation locale des minerais (ex: Or, Phosphate).
            - Fonds social minier pour les communautés locales.`,
            region: "SENEGAL",
            category: "MINES",
            keywords: JSON.stringify(["mines", "redevance", "contenu local", "or", "phosphate"])
        },
        {
            title: "Code du Travail Sénégalais - Mise à jour 2024",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2024-06-20"),
            reference: "Loi 97-17 Actualisée",
            summary: "Intégration du cadre légal pour le télétravail et renforcement de la protection contre le harcèlement en milieu pro.",
            content: `Régit les relations entre employeurs et salariés.
            Réformes 2024 :
            - Cadre spécifique pour le travail à distance.
            - Durée légale du travail et flexibilité sectorielle.
            - Procédures de licenciement économique plus encadrées.`,
            region: "SENEGAL",
            category: "SOCIAL",
            keywords: JSON.stringify(["travail", "CDI", "télétravail", "licenciement", "salarié"])
        },
        {
            title: "Code de l'Urbanisme & Construction 2024",
            type: "LOI",
            court: "SENEGAL",
            date: new Date("2023-12-30"),
            reference: "Code Urbanisme 2024",
            summary: "Normes de construction durable, gestion des zones inondables et simplification du permis de construire.",
            content: `Règles d'occupation du sol et normes techniques du bâtiment.
            Priorité 2024 : Contrôle strict des autorisations de construire sur le littoral et zones ZAC.`,
            region: "SENEGAL",
            category: "FONCIER",
            keywords: JSON.stringify(["urbanisme", "construction", "permis", "littoral", "immobilier"])
        },
        {
            title: "Recueil des Actes Uniformes OHADA 2024",
            type: "ACTE_UNIFORME",
            court: "OHADA",
            date: new Date("2024-02-15"),
            reference: "OHADA 2024",
            summary: "Dernières versions des actes sur le Droit Commercial Général (AUDCG) et les Sûretés (AUS).",
            content: `Harmonisation du droit des affaires dans 17 pays. 
            Actualité : Renforcement des procédures de liquidation et sauvegarde des entreprises en difficulté.`,
            region: "OHADA",
            category: "COMMERCIAL",
            keywords: JSON.stringify(["OHADA", "commercial", "GIE", "SARL", "sûretés", "audit"])
        }
    ]

    for (const code of codes) {
        // Upsert by title to avoid duplicates
        const existing = await prisma.jurisprudence.findFirst({
            where: { title: code.title }
        })

        if (!existing) {
            await prisma.jurisprudence.create({
                data: code
            })
            console.log(`✅ Code ajouté : ${code.title}`)
        } else {
            await prisma.jurisprudence.update({
                where: { id: existing.id },
                data: code
            })
            console.log(`🔄 Code mis à jour : ${code.title}`)
        }
    }

    console.log('🚀 ENRICHISSEMENT TERMINÉ AVEC SUCCÈS.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
