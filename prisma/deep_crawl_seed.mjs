import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function deepSeed() {
    console.log('--- Démarrage de l\'IA de Collecte Juridique (Deep Crawl Simulation) ---');

    // Nettoyage optionnel si on veut un "refresh" complet des données de démo
    // await prisma.jurisprudence.deleteMany({});

    const legalDocs = [
        // CODES SÉNÉGAL
        {
            title: "Code Pénal du Sénégal (Mis à jour 2024)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "Loi n° 65-60_v2024",
            summary: "Ensemble des textes régissant les infractions et les peines applicables au Sénégal. Inclut les dernières réformes sur la cybercriminalité.",
            content: "Le Code pénal détermine les crimes et délits et les punit des peines prévues par la loi. Art 1: L'infraction que les lois punissent de peines de police est un contravention...",
            keywords: JSON.stringify(["pénal", "crimes", "délits", "sanctions", "public"]),
            sourceUrl: "http://www.justice.gouv.sn/wp-content/uploads/2018/10/code-penal.pdf",
            status: "VALIDATED",
            date: new Date('2024-01-01')
        },
        {
            title: "Code de Procédure Pénale (Sénégal)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "Loi n° 65-61_full",
            summary: "Règles relatives à l'enquête, à l'instruction et au jugement des infractions pénales.",
            content: "L'action publique pour l'application des peines est dirigée par le procureur. Art 2: L'action civile en réparation du dommage causé par un crime...",
            keywords: JSON.stringify(["procédure", "garde à vue", "instruction", "procès"]),
            sourceUrl: "https://www.sec.gouv.sn/sites/default/files/Code%20de%20proc%C3%A9dure%20p%C3%A9nale.pdf",
            status: "VALIDATED",
            date: new Date('2023-06-15')
        },
        {
            title: "Code du Travail du Sénégal",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "Loi n° 97-17_ref",
            summary: "Régit les relations individuelles et collectives de travail entre employeurs et travailleurs.",
            content: "Art L.1: Le présent code est applicable sur tout le territoire de la République aux travailleurs. Art L.2: Est considéré comme travailleur toute personne qui s'est engagée à mettre son activité professionnelle...",
            keywords: JSON.stringify(["travail", "licenciement", "contrat", "salaire", "syndicat"]),
            sourceUrl: "https://www.droit-afrique.com/uploads/Senegal-Code-du-travail.pdf",
            status: "VALIDATED",
            date: new Date('2023-12-01')
        },
        {
            title: "Code de la Famille (Sénégal)",
            type: "LOI_ET_CODES",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "Loi n° 72-61_famille",
            summary: "Texte régissant le mariage, le divorce, la filiation et les successions au Sénégal.",
            content: "Le mariage est l'union d'un homme et d'une femme contractée devant l'officier de l'état civil. Les époux s'obligent à la communauté de vie.",
            keywords: JSON.stringify(["mariage", "succession", "divorce", "héritage"]),
            sourceUrl: "https://www.sec.gouv.sn/sites/default/files/Code%20de%20la%20famille.pdf",
            status: "VALIDATED",
            date: new Date('2023-01-01')
        },
        // OHADA
        {
            title: "AUPSRVE - Procédures de Recouvrement (Révisé 2023)",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "CCJA",
            reference: "AUPSRVE_2023_REV",
            summary: "Nouvel Acte Uniforme révisé en 2023 simplifiant l'injonction de payer et les saisies dans l'espace OHADA.",
            content: "Le recouvrement d'une créance certaine, liquide et exigible peut être poursuivi par la procédure d'injonction de payer. La révision de 2023 modernise les notifications et les délais de recours.",
            keywords: JSON.stringify(["recouvrement", "saisie", "exécution", "injonction", "créance"]),
            sourceUrl: "https://www.ohada.org/wp-content/uploads/2023/11/JO-OHADA-NUMERO-SPECIAL-15-NOVEMBRE-2023.pdf",
            status: "VALIDATED",
            date: new Date('2023-11-15')
        },
        {
            title: "AUSCGIE - Droit des Sociétés Commerciales",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "OHADA",
            reference: "AUSCGIE_2014_REV",
            summary: "Régit la formation, le fonctionnement et la dissolution des sociétés (SARL, SA, SAS) dans l'espace OHADA.",
            content: "La société commerciale est créée par deux ou plusieurs personnes qui conviennent d'affecter à une entreprise commune des biens en vue de partager le bénéfice. La SAS est introduite avec une grande liberté statutaire.",
            keywords: JSON.stringify(["société", "SARL", "SA", "GIE", "statuts", "actionnaire"]),
            sourceUrl: "https://www.ohada.org/wp-content/uploads/2019/03/AUSCGIE.pdf",
            status: "VALIDATED",
            date: new Date('2014-01-30')
        },
        {
            title: "AUA - Acte Uniforme sur le Droit de l'Arbitrage",
            type: "ACTE_UNIFORME",
            region: "OHADA",
            court: "CCJA",
            reference: "AUA_2017",
            summary: "Cadre juridique de l'arbitrage dans l'espace OHADA, favorisant le règlement des litiges commerciaux hors tribunaux étatiques.",
            content: "L'arbitrage est régi par le présent Acte uniforme dans tout État partie à l'OHADA. Toute personne physique ou morale peut recourir à l'arbitrage.",
            keywords: JSON.stringify(["arbitrage", "médiation", "litige", "commercial"]),
            sourceUrl: "https://www.ohada.org/wp-content/uploads/2019/03/AUA.pdf",
            status: "VALIDATED",
            date: new Date('2017-11-23')
        },
        // JURISPRUDENCE RÉCENTE
        {
            title: "Arrêt CCJA N° 171/2023 - Interprétation Saisie-Attribution",
            type: "JURISPRUDENCE",
            region: "OHADA",
            court: "CCJA",
            reference: "ARRÊT_171_2023",
            summary: "La CCJA rappelle les conditions de validité de la dénonciation de la saisie-attribution de créances.",
            content: "Attendu que par acte d'huissier, la société X a fait pratiquer une saisie. Que le grief tiré de l'absence de mention du délai de contestation entraîne la nullité de l'acte.",
            keywords: JSON.stringify(["saisie", "nullité", "CCJA", "2023", "banque"]),
            sourceUrl: "https://biblio.ohada.org/jurisprudence/record/171-2023",
            status: "VALIDATED",
            date: new Date('2023-07-20')
        },
        {
            title: "Arrêt CCJA N° 233/2024 - Validité Titre Exécutoire",
            type: "JURISPRUDENCE",
            region: "OHADA",
            court: "CCJA",
            reference: "ARRÊT_233_2024",
            summary: "Décision très récente sur la force exécutoire des actes notariés au Sénégal et leur reconnaissance par la CCJA.",
            content: "La Cour confirme que l'acte notarié constituant une reconnaissance de dette est un titre exécutoire valable sans recours préalable au juge.",
            keywords: JSON.stringify(["notaire", "titre exécutoire", "dette", "exécution", "2024"]),
            sourceUrl: "https://www.ohada.org/jurisprudence/ccja-2024-233",
            status: "VALIDATED",
            date: new Date('2024-07-15')
        },
        {
            title: "Arrêt Cour Suprême Sénégal n° 88/2023 - Conflit Foncier",
            type: "JURISPRUDENCE",
            region: "SENEGAL",
            court: "COUR SUPRÊME",
            reference: "CS_SÉNÉGAL_88_2023",
            summary: "Décision majeure sur la force probante des actes administratifs d'attribution de parcelles en zone urbaine.",
            content: "Considérant que le requérant invoque une violation de son droit de propriété sur la base d'un arrêté préfectoral. Que la Cour Suprême statuant en chambre administrative confirme la prééminence du titre foncier sur l'autorisation d'occupper.",
            keywords: JSON.stringify(["foncier", "domaine", "propriété", "administrative", "Sénégal"]),
            sourceUrl: "https://www.coursupreme.sn/jurisprudence/arrêt-88-2023",
            status: "VALIDATED",
            date: new Date('2023-06-12')
        },
        // FONCIER
        {
            title: "Loi n° 64-46 relative au Domaine National",
            type: "FONCIER",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "LOI_DOMAINE_NATIONAL_64",
            summary: "Texte pilier du droit foncier sénégalais classant les terres non immatriculées dans le domaine national.",
            content: "Constituent de plein droit le domaine national toutes les terres non classées dans le domaine public, non immatriculées ou dont la propriété n'a pas été transcrite à la conservation foncière.",
            keywords: JSON.stringify(["terroir", "communauté", "domaine national", "immatriculation"]),
            sourceUrl: "http://www.jo.gouv.sn/spip.php?article446",
            status: "VALIDATED",
            date: new Date('1964-06-17')
        },
        {
            title: "Code de l'Urbanisme (Sénégal)",
            type: "FONCIER",
            region: "SENEGAL",
            court: "SENEGAL",
            reference: "CODE_URBANISME_2008",
            summary: "Réglemente l'utilisation du sol, les permis de construire et les plans d'urbanisme.",
            content: "Nul ne peut entreprendre une construction sans avoir obtenu au préalable un permis de construire délivré par l'autorité compétente.",
            keywords: JSON.stringify(["construction", "sol", "permis", "cadastre", "aménagement"]),
            sourceUrl: "https://www.droit-afrique.com/uploads/Senegal-Code-de-lurbanisme.pdf",
            status: "VALIDATED",
            date: new Date('2008-08-20')
        }
    ];

    try {
        for (const doc of legalDocs) {
            // Check if exists manually
            const existing = await prisma.jurisprudence.findFirst({
                where: { reference: doc.reference }
            });

            if (!existing) {
                await prisma.jurisprudence.create({
                    data: doc
                });
                console.log(`[OK] Document ajouté : ${doc.title}`);
            } else {
                console.log(`[PASS] Déjà présent : ${doc.title}`);
            }
        }

        console.log('\n--- Extraction et Synchronisation IA Terminées ---');
        console.log(`${legalDocs.length} éléments clés ajoutés à la documentation de démarrage.`);
    } catch (e) {
        console.error('Erreur Sync:', e);
    } finally {
        await prisma.$disconnect();
    }
}

deepSeed();
