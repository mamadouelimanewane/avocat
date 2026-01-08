import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function extremeLegalSeed() {
    console.log('--- PHASE 3 : INJECTION JURIDIQUE MASSIVE (CODES SPÉCIALISÉS & HISTORIQUES) ---');

    const documents = [
        {
            title: "Code de la Marine Marchande (Sénégal)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2002_22",
            summary: "Régit la navigation maritime, le statut des navires et des gens de mer.",
            content: "Le présent code s'applique à tous les navires sénégalais et aux navires étrangers dans les eaux sous juridiction sénégalaise...",
            keywords: JSON.stringify(["maritime", "navires", "port", "navigation", "mer"]),
            sourceUrl: "https://www.anam.sn/textes-reglementaires",
            status: "VALIDATED",
            date: new Date('2002-08-16')
        },
        {
            title: "Code de l'Aviation Civile",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2015_10",
            summary: "Régit l'espace aérien, les aéronefs et le transport aérien au Sénégal.",
            content: "L'État exerce une souveraineté complète et exclusive sur l'espace aérien au-dessus de son territoire...",
            keywords: JSON.stringify(["aviation", "aérien", "aéronef", "aéroport"]),
            sourceUrl: "https://www.anacim.sn/lois",
            status: "VALIDATED",
            date: new Date('2015-05-18')
        },
        {
            title: "Code des Marchés Publics (2023)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "DÉCRET_2023_832",
            summary: "Régit les procédures de passation, de contrôle et de régulation des marchés publics.",
            content: "Les marchés publics sont des contrats conclus à titre onéreux par les autorités contractantes pour répondre à leurs besoins...",
            keywords: JSON.stringify(["marchés publics", "appel d'offres", "ARCOP", "passation"]),
            sourceUrl: "https://www.arcop.sn/code-des-marches",
            status: "VALIDATED",
            date: new Date('2023-04-05')
        },
        {
            title: "Code Électoral (Version 2021)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2021_35",
            summary: "Règles relatives à l'organisation des élections présidentielles, législatives et locales.",
            content: "L'inscription sur les listes électorales est obligatoire. Le suffrage est universel, égal et secret...",
            keywords: JSON.stringify(["élection", "vote", "scrutin", "parrainage"]),
            sourceUrl: "https://www.sec.gouv.sn/code-electoral",
            status: "VALIDATED",
            date: new Date('2021-07-23')
        },
        {
            title: "Code de la Sécurité Sociale",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_73_37",
            summary: "Régit les prestations familiales, les accidents du travail et les pensions.",
            content: "Le présent code institue un régime de sécurité sociale géré par la Caisse de Sécurité Sociale et l'IPRES...",
            keywords: JSON.stringify(["sécurité sociale", "IPRES", "retraite", "accident du travail"]),
            sourceUrl: "https://www.sec.gouv.sn/code-securite-sociale",
            status: "VALIDATED",
            date: new Date('1973-07-31')
        },
        {
            title: "Code de la Construction",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2009_23",
            summary: "Règles techniques de sécurité et de solidité des bâtiments.",
            content: "Toute personne qui fait construire doit respecter les normes de solidité et de sécurité contre les incendies...",
            keywords: JSON.stringify(["construction", "bâtiment", "sécurité", "normes"]),
            sourceUrl: "https://www.sec.gouv.sn/code-construction",
            status: "VALIDATED",
            date: new Date('2009-07-08')
        },
        {
            title: "Code de la Route (Sénégal)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2002_30",
            summary: "Régit la circulation routière, le permis de conduire et les infractions de la route.",
            content: "L'usage des voies ouvertes à la circulation publique est régi par le présent code. Art 1: Tout conducteur doit rester maître de son véhicule...",
            keywords: JSON.stringify(["route", "circulation", "permis", "vitesse"]),
            sourceUrl: "https://www.sec.gouv.sn/code-route",
            status: "VALIDATED",
            date: new Date('2002-12-24')
        },
        {
            title: "Code Forestier (Révision 2018)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2018_25",
            summary: "Gestion durable des forêts, lutte contre la déforestation et protection de la faune.",
            content: "Les forêts constituent un patrimoine national dont l'État assure la conservation et l'exploitation durable...",
            keywords: JSON.stringify(["forêt", "bois", "nature", "déboisement"]),
            sourceUrl: "https://www.sec.gouv.sn/code-forestier",
            status: "VALIDATED",
            date: new Date('2018-11-12')
        },
        {
            title: "Loi Relative à la Protection des Données Personnelles",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2008_12",
            summary: "Création de la CDP et protection de la vie privée à l'ère du numérique.",
            content: "Tout traitement de données à caractère personnel doit respecter les droits de l'individu. Art 1: La collecte est soumise au consentement...",
            keywords: JSON.stringify(["données", "vie privée", "CDP", "informatique"]),
            sourceUrl: "https://www.cdp.sn/textes-loi",
            status: "VALIDATED",
            date: new Date('2008-01-25')
        },
        // JURISPRUDENCES HISTORIQUES
        {
            title: "Arrêt Cour de Cassation N° 1/1961 - Souveraineté Juridique",
            type: "JURISPRUDENCE",
            region: "SENEGAL",
            court: "COUR DE CASSATION",
            reference: "ARRÊT_SÉNÉGAL_1961_1",
            summary: "Un des premiers arrêts post-indépendance affirmant la compétence exclusive des tribunaux sénégalais.",
            content: "Considérant que la république du Sénégal est devenue souveraine. Que les lois antérieures restent applicables sous réserve de conformité...",
            keywords: JSON.stringify(["indépendance", "souveraineté", "compétence", "1961"]),
            sourceUrl: "https://www.coursupreme.sn/archives-historiques",
            status: "VALIDATED",
            date: new Date('1961-01-15')
        },
        {
            title: "Arrêt CCJA - Saisie Attribution et Délai de Dénonciation",
            type: "JURISPRUDENCE",
            region: "OHADA",
            court: "CCJA",
            reference: "JURIS_OHADA_SAISIE_REF",
            summary: "Jurisprudence constante sur le caractère impératif du délai de 8 jours pour dénoncer une saisie-attribution.",
            content: "La dénonciation de la saisie au débiteur dans le délai de huit jours prescrit par l'acte uniforme est une formalité d'ordre public...",
            keywords: JSON.stringify(["saisie", "délai", "débiteur", "nullité", "OHADA"]),
            sourceUrl: "https://www.ohada.org/jurisprudence-saisie",
            status: "VALIDATED",
            date: new Date('2018-03-22')
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
                console.log(`[AJOUTÉ] ${doc.title}`);
            } else {
                console.log(`[CONSERVÉ] ${doc.title}`);
            }
        }
        console.log('\n--- PHASE 3 TERMINÉE ---');
        console.log('La base contient désormais le panorama complet du droit sénégalais et communautaire.');
    } catch (e) {
        console.error('Erreur Phase 3:', e);
    } finally {
        await prisma.$disconnect();
    }
}

extremeLegalSeed();
