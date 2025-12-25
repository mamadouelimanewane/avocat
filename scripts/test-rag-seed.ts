
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTestRAG() {
    console.log("🌱 Seeding Test Data for RAG...")

    // 1. Un Arrêt CCJA crucial sur le bail commercial
    await prisma.jurisprudence.create({
        data: {
            title: "Arrêt N° 028/2024 de la CCJA : Rupture de Bail Commercial",
            type: "JURISPRUDENCE",
            court: "CCJA",
            region: "OHADA",
            date: new Date("2024-03-15"),
            reference: "Arrêt N° 028/2024",
            status: "VALIDATED",
            keywords: JSON.stringify(["bail", "rupture", "mise en demeure", "dommages-interets"]),
            summary: "La Cour rappelle que la rupture du bail commercial sans mise en demeure préalable est nulle et de nul effet.",
            content: `LA COUR COMMUNE DE JUSTICE ET D'ARBITRAGE (CCJA),
            
            Vu le Traité relatif à l'harmonisation du droit des affaires en Afrique ;
            Vu le Règlement de procédure de la Cour Commune de Justice et d'Arbitrage de l'OHADA ;
            
            Attendu qu'il résulte des dispositions des articles 101 et 133 de l'Acte Uniforme portant Droit Commercial Général que le bailleur ne peut résilier le contrat de bail sans avoir préalablement servi une mise en demeure au preneur d'avoir à respecter les clauses du bail.
            
            Attendu qu'en l'espèce, la Société Immobilière BAMA a expulsé le locataire sans respecter ce formalisme protecteur.
            
            PAR CES MOTIFS :
            
            Casse et annule l'arrêt de la Cour d'Appel de Dakar...
            Dit que la rupture est abusive.`
        }
    })

    // 2. Un Article du Code du Travail Sénégalais
    await prisma.jurisprudence.create({
        data: {
            title: "Article L.56 du Code du Travail (Sénégal) : Licenciement pour motif économique",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("2022-01-01"),
            reference: "L.56",
            status: "VALIDATED",
            keywords: JSON.stringify(["licenciement", "economique", "inspecteur", "travail"]),
            summary: "Procédure obligatoire de consultation de l'inspecteur du travail en cas de licenciement collectif.",
            content: `ARTICLE L.56 :
            
            Tout licenciement individuel ou collectif fondé sur un motif économique, d'ordre structurel ou technologique, est subordonné à l'autorisation de l'Inspecteur du Travail et de la Sécurité Sociale.
            
            L'employeur doit réunir les délégués du personnel pour rechercher toutes les alternatives possibles au licenciement.`
        }
    })

    console.log("✅ Données injectées avec succès (Arrêt CCJA + Code Travail).")
}

seedTestRAG()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
