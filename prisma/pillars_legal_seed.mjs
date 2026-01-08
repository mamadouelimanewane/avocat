import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function finalPillarsSeed() {
    console.log('--- PHASE FINALE : LES 4 PILIERS CODES DU SÉNÉGAL ---');

    const documents = [
        {
            title: "Code du Travail du Sénégal",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_97_17",
            summary: "Régit les relations entre employeurs et travailleurs, les contrats de travail, les syndicats et les conflits du travail.",
            content: "Le présent code est applicable sur tout le territoire de la République du Sénégal. Art 1: Le travailleur est toute personne qui s'engage à mettre son activité professionnelle sous la direction d'une autre personne...",
            keywords: JSON.stringify(["travail", "salarié", "contrat", "licenciement", "syndicat", "confrontation"]),
            sourceUrl: "https://www.sec.gouv.sn/code-travail",
            status: "VALIDATED",
            date: new Date('1997-12-01')
        },
        {
            title: "Code de la Famille (Sénégal)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_72_61",
            summary: "Régit l'état civil, le mariage, le divorce, la filiation et les successions.",
            content: "La famille est la cellule de base de la société. Le mariage est l'union de l'homme et de la femme. Art 1: Tout Sénégalais jouit des droits civils...",
            keywords: JSON.stringify(["famille", "mariage", "divorce", "succession", "héritage", "tutelle"]),
            sourceUrl: "https://www.sec.gouv.sn/code-famille",
            status: "VALIDATED",
            date: new Date('1972-06-12')
        },
        {
            title: "Code Pénal du Sénégal",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_65_60",
            summary: "Définit les infractions (crimes, délits, contraventions) et les peines applicables.",
            content: "Nulle infraction ne peut être punie de peines qui n'étaient pas prononcées par la loi avant qu'elle fût commise. Art 1: L'infraction que les lois punissent de peines de police est une contravention...",
            keywords: JSON.stringify(["pénal", "crime", "délit", "peine", "prison", "amende"]),
            sourceUrl: "https://www.sec.gouv.sn/code-penal",
            status: "VALIDATED",
            date: new Date('1965-07-21')
        },
        {
            title: "Code de Procédure Pénale",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_65_61",
            summary: "Règles relatives à l'enquête, à l'instruction et au jugement des infractions pénales.",
            content: "La procédure pénale doit être juste et équitable. Art 1: L'action publique pour l'application des peines est dirigée par le procureur de la République...",
            keywords: JSON.stringify(["procédure pénale", "enquête", "instruction", "jugement", "procureur", "garde à vue"]),
            sourceUrl: "https://www.sec.gouv.sn/code-procedure-penale",
            status: "VALIDATED",
            date: new Date('1965-07-21')
        }
    ];

    try {
        for (const doc of documents) {
            const existing = await prisma.jurisprudence.findFirst({
                where: { reference: doc.reference }
            });

            if (!existing) {
                await prisma.jurisprudence.create({
                    data: doc
                });
                console.log(`[PILLIER AJOUTÉ] ${doc.title}`);
            } else {
                console.log(`[PASSÉ] ${doc.title}`);
            }
        }
        console.log('\n--- TOUS LES PILIERS SONT EN PLACE ---');
    } catch (e) {
        console.error('Erreur Phase Finale:', e);
    } finally {
        await prisma.$disconnect();
    }
}

finalPillarsSeed();
