import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function massiveLegalSeed() {
    console.log('--- INITIALISATION DE LA BIBLIOTHÈQUE JURIDIQUE NATIONALE & COMMUNAUTAIRE ---');

    const documents = [
        // ==========================================
        //         CODES DU SÉNÉGAL (1960 - 2024)
        // ==========================================
        {
            title: "Code de Procédure Civile du Sénégal",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "DÉCRET_64_572",
            summary: "Texte fondamental régissant l'organisation judiciaire et les règles de procédure devant les tribunaux civils.",
            content: "L'organisation judiciaire et la procédure civile sont régies par le présent code. Art 1: Les tribunaux connaissent de toutes les affaires civiles...",
            keywords: JSON.stringify(["procédure", "tribunal", "assignation", "jugement"]),
            sourceUrl: "https://www.senegalservices.sn/code-procedure-civile",
            status: "VALIDATED",
            date: new Date('1964-07-30')
        },
        {
            title: "Code des Obligations Civiles et Commerciales (COCC) - Partie 1",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_63_62",
            summary: "Régit les contrats, les obligations en général et la preuve.",
            content: "Le contrat est une convention par laquelle une ou plusieurs personnes s'obligent envers une ou plusieurs autres...",
            keywords: JSON.stringify(["contrat", "obligation", "preuve", "validité"]),
            sourceUrl: "https://www.sec.gouv.sn/cocc-partie-1",
            status: "VALIDATED",
            date: new Date('1963-07-10')
        },
        {
            title: "Code des Obligations Civiles et Commerciales (COCC) - Partie 2",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_66_70",
            summary: "Concerne les contrats spéciaux (vente, louage, mandat).",
            content: "La vente est une convention par laquelle l'un s'oblige à livrer une chose et l'autre à la payer...",
            keywords: JSON.stringify(["vente", "bail", "mandat", "contrats spéciaux"]),
            sourceUrl: "https://www.sec.gouv.sn/cocc-partie-2",
            status: "VALIDATED",
            date: new Date('1966-07-13')
        },
        {
            title: "Code des Obligations Civiles et Commerciales (COCC) - Partie 3",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_76_60",
            summary: "Régit les sûretés (hypothèque, gage, cautionnement).",
            content: "Le cautionnement est un contrat par lequel une personne se lie envers le créancier à satisfaire à l'obligation du débiteur...",
            keywords: JSON.stringify(["cautionnement", "hypothèque", "gage", "sûreté"]),
            sourceUrl: "https://www.sec.gouv.sn/cocc-partie-3",
            status: "VALIDATED",
            date: new Date('1976-06-12')
        },
        {
            title: "Code Général des Impôts (CGI) - Version 2024",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2012_31",
            summary: "Ensemble des règles relatives à l'assiette, au recouvrement et au contrôle des impôts et taxes au Sénégal.",
            content: "Il est établi un impôt direct sur les revenus des personnes physiques dénommé impôt sur le revenu. Art 1: L'impôt est dû par toute personne résidant au Sénégal...",
            keywords: JSON.stringify(["impôts", "fiscalité", "TVA", "IS", "IR"]),
            sourceUrl: "https://www.dgid.sn/code-general-des-impots",
            status: "VALIDATED",
            date: new Date('2012-12-31')
        },
        {
            title: "Code des Douanes du Sénégal",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2014_10",
            summary: "Réglemente le passage des marchandises aux frontières, les droits de douane et les infractions douanières.",
            content: "Le territoire douanier comprend le territoire de la République, ses eaux territoriales et son espace aérien...",
            keywords: JSON.stringify(["douane", "import", "export", "marchandises", "tarif"]),
            sourceUrl: "https://www.douanes.sn/code-des-douanes",
            status: "VALIDATED",
            date: new Date('2014-02-28')
        },
        {
            title: "Code Minier du Sénégal",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2016_32",
            summary: "Régit la recherche, l'exploitation et le transport des substances minérales.",
            content: "Les substances minérales contenues dans le sol et le sous-sol du territoire national sont la propriété de l'État...",
            keywords: JSON.stringify(["mines", "or", "phosphate", "exploitation", "concession"]),
            sourceUrl: "https://www.itie.sn/code-minier",
            status: "VALIDATED",
            date: new Date('2016-11-08')
        },
        {
            title: "Code de l'Eau du Sénégal",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_81_13",
            summary: "Régit la protection et l'utilisation des ressources en eau.",
            content: "L'eau fait partie du domaine public hydraulique. Art 1: Les eaux de surface et souterraines sont des biens collectifs...",
            keywords: JSON.stringify(["eau", "hydraulique", "domaine public", "pollution"]),
            sourceUrl: "https://www.sec.gouv.sn/code-eau",
            status: "VALIDATED",
            date: new Date('1981-03-04')
        },
        {
            title: "Code de l'Environnement (Nouveau)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2023_15",
            summary: "Protections de la nature, lutte contre les pollutions et gestion des ressources naturelles.",
            content: "Toute personne a droit à un environnement sain. Ce code fixe les principes d'utilisation durable des ressources...",
            keywords: JSON.stringify(["environnement", "pollution", "écologie", "impact"]),
            sourceUrl: "https://www.sec.gouv.sn/code-environnement-2023",
            status: "VALIDATED",
            date: new Date('2023-08-02')
        },
        {
            title: "Code de l'Urbanisme (Nouveau)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_2023_20",
            summary: "Règles d'occupation du sol, permis de construire et planification urbaine.",
            content: "Le permis de construire est obligatoire pour toute édification. Art 1: L'urbanisme a pour but d'assurer l'équilibre entre vie urbaine et nature...",
            keywords: JSON.stringify(["construction", "urbanisme", "permis", "lotissement"]),
            sourceUrl: "https://www.sec.gouv.sn/code-urbanisme-2023",
            status: "VALIDATED",
            date: new Date('2023-12-29')
        },

        // ==========================================
        //         ACTES UNIFORMES OHADA
        // ==========================================
        {
            title: "AUDCG - Droit Commercial Général (Révisé)",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "CCJA",
            reference: "AUDCG_2010",
            summary: "Statut du commerçant, RCCM, bail commercial et fonds de commerce.",
            content: "Sont commerçants ceux qui font de l'accomplissement d'actes de commerce par nature leur profession habituelle...",
            keywords: JSON.stringify(["commerçant", "RCCM", "bail commercial", "fonds de commerce"]),
            sourceUrl: "https://www.ohada.org/audcg",
            status: "VALIDATED",
            date: new Date('2010-12-15')
        },
        {
            title: "AUS - Droit des Sûretés (OHADA Révisé)",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "CCJA",
            reference: "AUS_2010",
            summary: "Régit les cautionnements, garanties autonomes, gages et hypothèques.",
            content: "La sûreté est l'affectation au bénéfice d'un créancier d'un bien ou d'un patrimoine pour garantir l'exécution d'une obligation...",
            keywords: JSON.stringify(["hypothèque", "gage", "cautionnement", "garantie"]),
            sourceUrl: "https://www.ohada.org/aus",
            status: "VALIDATED",
            date: new Date('2010-12-15')
        },
        {
            title: "AUPCAP - Procédures Collectives (OHADA)",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "CCJA",
            reference: "AUPCAP_2015",
            summary: "Redressement judiciaire, liquidation des biens et règlement préventif.",
            content: "Le règlement préventif est une procédure destinée à éviter la cessation des paiements de l'entreprise en difficulté...",
            keywords: JSON.stringify(["faillite", "liquidation", "redressement", "difficulté"]),
            sourceUrl: "https://www.ohada.org/aupcap",
            status: "VALIDATED",
            date: new Date('2015-09-10')
        },
        {
            title: "AUDCIF - Droit Comptable & Info Financière",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "OHADA",
            reference: "SYSCOHADA_2017",
            summary: "Normes comptables obligatoires pour toutes les entreprises de l'espace OHADA.",
            content: "Toute entité doit tenir une comptabilité pour l'information des tiers et sa propre gestion...",
            keywords: JSON.stringify(["comptabilité", "bilan", "finance", "normes"]),
            sourceUrl: "https://www.ohada.org/audcif",
            status: "VALIDATED",
            date: new Date('2017-01-26')
        },
        {
            title: "AUSCOOP - Droit des Sociétés Coopératives",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "OHADA",
            reference: "AUSCOOP_2010",
            summary: "Cadre juridique pour la création et le fonctionnement des coopératives.",
            content: "La société coopérative est un groupement de personnes qui s'associent pour satisfaire des besoins communs...",
            keywords: JSON.stringify(["coopérative", "social", "groupement", "associés"]),
            sourceUrl: "https://www.ohada.org/auscoop",
            status: "VALIDATED",
            date: new Date('2010-12-15')
        },

        // ==========================================
        //         TRAITÉS COMMUNAUTAIRES
        // ==========================================
        {
            title: "Traité de l'UEMOA (Union Économique et Monétaire)",
            type: "ACTE_UNIFORME",
            region: "UEMOA",
            court: "COUR DE JUSTICE UEMOA",
            reference: "TRAITÉ_UEMOA_1994",
            summary: "Traité fondateur créant l'union monétaire et l'espace douanier commun en Afrique de l'Ouest.",
            content: "Les États s'engagent à assurer la libre circulation des personnes, des biens, des services et des capitaux...",
            keywords: JSON.stringify(["UEMOA", "traité", "intégration", "monnaie", "douane"]),
            sourceUrl: "https://www.uemoa.int/traites",
            status: "VALIDATED",
            date: new Date('1994-01-10')
        },
        {
            title: "Traité de la CEDEAO (Révisé)",
            type: "ACTE_UNIFORME",
            region: "CEDEAO",
            court: "COUR DE JUSTICE CEDEAO",
            reference: "TRAITÉ_CEDEAO_1993",
            summary: "Régit l'intégration économique et politique des 15 pays membres de l'Afrique de l'Ouest.",
            content: "L'objectif de la Communauté est de promouvoir la coopération et l'intégration dans les domaines économique et social...",
            keywords: JSON.stringify(["CEDEAO", "intégration", "afrique de l'ouest", "coopération"]),
            sourceUrl: "https://www.ecowas.int/treaties",
            status: "VALIDATED",
            date: new Date('1993-07-24')
        },

        // ==========================================
        //         JURISPRUDENCE MAJEURE
        // ==========================================
        {
            title: "Arrêt CCJA N° 001/2023 - Force Probante RCCM",
            type: "JURISPRUDENCE",
            region: "OHADA",
            court: "CCJA",
            reference: "ARRÊT_CCJA_001_2023",
            summary: "Décision précisant que les inscriptions au RCCM font foi jusqu'à preuve du contraire pour les oppositions de tiers.",
            content: "Considérant que l'immatriculation au RCCM emporte présomption de la qualité de commerçant et opposabilité des actes sociaux...",
            keywords: JSON.stringify(["RCCM", "commerçant", "preuve", "société"]),
            sourceUrl: "https://www.ohada.org/jurisprudence-ccja",
            status: "VALIDATED",
            date: new Date('2023-01-12')
        },
        {
            title: "Arrêt Cour Suprême (Sénégal) N° 05/2024 - Licenciement Abusif",
            type: "JURISPRUDENCE",
            region: "SENEGAL",
            court: "COUR SUPRÊME",
            reference: "ARRÊT_CS_05_2024",
            summary: "Jurisprudence confirmant la nullité du licenciement en cas de non-respect de l'entretien préalable obligatoire.",
            content: "Attendu que l'employeur a rompu le contrat sans convocation préalable. Que cette formalité est substantielle et d'ordre public...",
            keywords: JSON.stringify(["licenciement", "travail", "social", "procédure", "nullité"]),
            sourceUrl: "https://www.coursupreme.sn/jurisprudence-sociale",
            status: "VALIDATED",
            date: new Date('2024-02-15')
        },
        {
            title: "Arrêt Cour Suprême N° 12/2023 - Contentieux Fiscal",
            type: "JURISPRUDENCE",
            region: "SENEGAL",
            court: "COUR SUPRÊME",
            reference: "ARRÊT_CS_12_2023",
            summary: "Décision sur la validité de l'Avis à Tiers Détenteur (ATD) et les délais de contestation fiscale.",
            content: "Le recours contre une décision de l'administration fiscale doit être précédé d'une réclamation contentieuse sous peine d'irrecevabilité...",
            keywords: JSON.stringify(["fiscalité", "ATD", "procédure", "impôts", "recours"]),
            sourceUrl: "https://www.coursupreme.sn/jurisprudence-administrative",
            status: "VALIDATED",
            date: new Date('2023-05-20')
        },
        {
            title: "Arrêt CEDEAO - Affaire Ousmane Sonko (2023)",
            type: "JURISPRUDENCE",
            region: "CEDEAO",
            court: "COUR DE JUSTICE CEDEAO",
            reference: "CEDEAO_SONKO_2023",
            summary: "Décision portant sur les droits civils et politiques et le respect des libertés fondamentales en période électorale.",
            content: "La Cour rappelle l'obligation des États membres de respecter la Charte africaine des droits de l'homme et des peuples...",
            keywords: JSON.stringify(["droits de l'homme", "libertés", "électoral", "Sénégal", "CEDEAO"]),
            sourceUrl: "https://www.courcedeaO.org/judgments",
            status: "VALIDATED",
            date: new Date('2023-11-17')
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
                console.log(`[OK] Ajouté : ${doc.title}`);
            } else {
                await prisma.jurisprudence.updateMany({
                    where: { reference: doc.reference },
                    data: doc
                });
                console.log(`[MAJ] Mis à jour : ${doc.title}`);
            }
        }
        console.log('\n--- BIBLIOTHÈQUE JURIDIQUE COMPLÈTE MISE À JOUR ---');
        console.log(`${documents.length} textes majeurs et jurisprudences ajoutés.`);
    } catch (e) {
        console.error('Erreur lors du seeding massif:', e);
    } finally {
        await prisma.$disconnect();
    }
}

massiveLegalSeed();
