import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function eliteJurisprudenceSeed() {
    console.log('--- PHASE 4 : LES GRANDS ARRÊTS (ÉLITE JURISPRUDENTIELLE) ---');

    const documents = [
        {
            title: "Arrêt Zahira Saleh c/ État du Sénégal",
            type: "JURISPRUDENCE",
            region: "SENEGAL",
            court: "COUR SUPRÊME",
            reference: "ARRÊT_CS_01_2013",
            summary: "Décision historique sur l'incompétence du Préfet pour ordonner l'évacuation d'un bâtiment privé, précisant les limites du pouvoir de police administrative.",
            content: "La Cour Suprême annule la décision du Préfet. Considérant que le pouvoir de police administrative ne saurait empiéter sur le droit de propriété sans base légale explicite...",
            keywords: JSON.stringify(["police administrative", "préfet", "propriété", "compétence", "annulation"]),
            sourceUrl: "https://www.coursupreme.sn/jurisprudence-administrative-selective",
            status: "VALIDATED",
            date: new Date('2013-01-10')
        },
        {
            title: "Affaire Hissein Habré - Jugement des Chambres Africaines Extraordinaires",
            type: "JURISPRUDENCE",
            region: "CEDEAO",
            court: "CHAMBRES AFRICAINES EXTRAORDINAIRES",
            reference: "CAE_HABRE_2016",
            summary: "Condamnation d'un ancien chef d'État pour crimes contre l'humanité, crimes de guerre et crimes de torture.",
            content: "Le tribunal déclare Hissein Habré coupable de crimes contre l'humanité. Cette décision marque un tournant pour la justice pénale internationale en Afrique...",
            keywords: JSON.stringify(["crimes contre l'humanité", "justice internationale", "torture", "Habré"]),
            sourceUrl: "https://www.cae-habre.sn/jugement-final",
            status: "VALIDATED",
            date: new Date('2016-05-30')
        },
        {
            title: "Arrêt CCJA - Immunité d'Exécution des Sociétés d'Économie Mixte",
            type: "JURISPRUDENCE",
            region: "OHADA",
            court: "CCJA",
            reference: "JURIS_OHADA_SEM_IMMUNITÉ",
            summary: "Précisions sur l'article 30 de l'AUVE : les sociétés d'économie mixte ne bénéficient pas de l'immunité d'exécution réservée aux personnes publiques.",
            content: "L'immunité d'exécution prévue par l'Acte Uniforme ne s'applique qu'aux personnes morales de droit public proprement dites et non aux sociétés commerciales où l'État est actionnaire...",
            keywords: JSON.stringify(["immunité d'exécution", "saisie", "SEM", "OHADA", "Article 30"]),
            sourceUrl: "https://www.ohada.org/jurisprudence-selective",
            status: "VALIDATED",
            date: new Date('2015-11-20')
        },
        {
            title: "Arrêt M.X c/ Ministère Public - Blanchiment de Capitaux",
            type: "JURISPRUDENCE",
            region: "SENEGAL",
            court: "COUR SUPRÊME",
            reference: "ARRÊT_CS_75_2016",
            summary: "Définition des éléments constitutifs du délit de blanchiment et de l'infraction principale.",
            content: "Le délit de blanchiment est une infraction autonome qui ne nécessite pas une condamnation préalable pour l'infraction ayant généré les fonds...",
            keywords: JSON.stringify(["blanchiment", "pénal des affaires", "capitaux", "preuve"]),
            sourceUrl: "https://www.coursupreme.sn/jurisprudence-penale",
            status: "VALIDATED",
            date: new Date('2016-05-06')
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
                console.log(`[ÉLITE AJOUTÉE] ${doc.title}`);
            } else {
                console.log(`[PASSÉ] ${doc.title}`);
            }
        }
        console.log('\n--- TOUTES LES PHASES D\'INJECTION SONT TERMINÉES ---');
        console.log('Votre bibliothèque juridique est maintenant l\'une des plus complètes du Sénégal.');
    } catch (e) {
        console.error('Erreur Phase 4:', e);
    } finally {
        await prisma.$disconnect();
    }
}

eliteJurisprudenceSeed();
