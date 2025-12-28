
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('--- Peuplement de la Veille Juridique ---')

    const news = [
        {
            title: "Nouvelle Jurisprudence de la CCJA sur la Saisie-Attribution",
            summary: "La CCJA clarifie les conditions de validité du procès-verbal de saisie en l'absence de mention du décompte des intérêts.",
            region: "OHADA",
            court: "CCJA",
            date: new Date(),
            status: "VALIDATED"
        },
        {
            title: "Réforme du Code du Travail au Sénégal : Impact sur les CDD",
            summary: "Analyse des nouvelles dispositions relatives au renouvellement des contrats à durée déterminée et aux indemnités de fin de contrat.",
            region: "Sénégal",
            court: "TRIBUNAL_TRAVAIL",
            date: new Date(),
            status: "VALIDATED"
        },
        {
            title: "Régime fiscal des avocats : Nouvelles directives de la DGID",
            summary: "Détail de la circulaire 2024 concernant la déclaration de TVA et les retenues à la source pour les cabinets.",
            region: "Sénégal",
            court: "DGID",
            date: new Date(),
            status: "VALIDATED"
        }
    ]

    for (const item of news) {
        await prisma.jurisprudence.create({
            data: item
        })
    }

    console.log('✅ Veille Juridique restaurée.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
