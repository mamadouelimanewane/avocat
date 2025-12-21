
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Senegalese Codes...')

    const codes = [
        {
            title: "Code Pénal",
            reference: "LOI-65-60",
            date: new Date('1965-07-21'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 65-60 portant Code Pénal (modifiée). Définit les crimes, délits et contraventions ainsi que les peines applicables au Sénégal.",
            category: "PENAL",
            keywords: JSON.stringify(["pénal", "crime", "délit", "peine"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            title: "Code de Procédure Pénale",
            reference: "LOI-65-61",
            date: new Date('1965-07-21'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 65-61 portant Code de Procédure Pénale (modifiée). Organise la constatation des infractions, la poursuite de leurs auteurs et la procédure de jugement.",
            category: "PENAL",
            keywords: JSON.stringify(["procédure", "enquête", "juge d'instruction"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            title: "Code du Travail",
            reference: "LOI-97-17",
            date: new Date('1997-12-01'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 97-17 portant Code du Travail. Régit les relations entre employeurs et travailleurs, les syndicats, les conflits collectifs et l'inspection du travail.",
            category: "SOCIAL",
            keywords: JSON.stringify(["travail", "salarié", "employeur", "licenciement"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            title: "Code de la Famille",
            reference: "LOI-72-61",
            date: new Date('1972-06-12'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 72-61 portant Code de la Famille. Traite du mariage, du divorce, de la filiation, des successions, des donations et de la capacité des personnes.",
            category: "FAMILLE",
            keywords: JSON.stringify(["famille", "mariage", "succession", "filiation"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            title: "Code Général des Impôts (CGI)",
            reference: "LOI-2012-31",
            date: new Date('2012-12-31'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 2012-31 portant Code Général des Impôts. Rassemble les règles d'assiette, de liquidation et de recouvrement des impôts directs et indirects.",
            category: "FISCAL",
            keywords: JSON.stringify(["impôt", "taxe", "tva", "fiscalité"]),
            sourceUrl: "http://www.dgid.sn"
        },
        {
            title: "Code des Douanes",
            reference: "LOI-2014-10",
            date: new Date('2014-02-28'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 2014-10 portant Code des Douanes. Réglemente l'entrée et la sortie des marchandises, les régimes douaniers et le contentieux douanier.",
            category: "DOUANE",
            keywords: JSON.stringify(["douane", "import", "export", "marchandise"]),
            sourceUrl: "http://www.douanes.sn"
        },
        {
            title: "Code de l'Environnement",
            reference: "LOI-2001-01",
            date: new Date('2001-01-15'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 2001-01 portant Code de l'Environnement. Pose les principes de gestion de l'environnement, de prévention des pollutions et d'évaluation des impacts.",
            category: "ENVIRONNEMENT",
            keywords: JSON.stringify(["environnement", "pollution", "écologie"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            title: "Code Minier",
            reference: "LOI-2016-32",
            date: new Date('2016-11-08'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 2016-32 portant Code Minier. Régit la prospection, la recherche et l'exploitation des substances minérales.",
            category: "MINIER",
            keywords: JSON.stringify(["mine", "or", "phosphate", "exploitation"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            title: "Code Pétrolier",
            reference: "LOI-2019-03",
            date: new Date('2019-02-01'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 2019-03 portant Code Pétrolier. Encadre les activités pétrolières amont et aval (exploration, production, transport).",
            category: "PETROLE",
            keywords: JSON.stringify(["pétrole", "gaz", "hydrocarbures", "énergie"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            title: "Code de la Presse",
            reference: "LOI-2017-27",
            date: new Date('2017-07-13'),
            court: "SENEGAL",
            type: "LOI",
            summary: "Loi n° 2017-27 portant Code de la Presse. Définit les droits et devoirs des journalistes et entreprises de presse.",
            category: "MEDIA",
            keywords: JSON.stringify(["presse", "journaliste", "media", "information"]),
            sourceUrl: "http://www.jo.gouv.sn"
        }
    ]

    for (const item of codes) {
        const exists = await prisma.jurisprudence.findFirst({ where: { reference: item.reference } })
        if (!exists) {
            await prisma.jurisprudence.create({ data: item })
            console.log(`Created: ${item.title}`)
        } else {
            console.log(`Already exists: ${item.title}`)
        }
    }

    console.log('Codes seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
