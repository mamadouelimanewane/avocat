import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function tagFoncier() {
    console.log('--- TAGGING DES DOCUMENTS FONCIERS ---');
    const keywords = ["Urbanisme", "Domaine National", "Expropriation", "Loyer", "Construction", "Foncier"];

    try {
        const docs = await prisma.jurisprudence.findMany({
            where: {
                OR: keywords.map(k => ({ title: { contains: k, mode: 'insensitive' } }))
            }
        });

        for (const doc of docs) {
            await prisma.jurisprudence.update({
                where: { id: doc.id },
                data: { category: "FONCIER" }
            });
            console.log(`[TAGGÉ FONCIER] ${doc.title}`);
        }
        console.log('Terminé.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

tagFoncier();
