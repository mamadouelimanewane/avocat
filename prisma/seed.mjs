
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clean DB
    try {
        await prisma.invoiceItem.deleteMany()
        await prisma.payment.deleteMany()
        await prisma.facture.deleteMany()
        await prisma.documentVersion.deleteMany()
        await prisma.document.deleteMany()
        await prisma.event.deleteMany()
        await prisma.task.deleteMany()
        await prisma.timeEntry.deleteMany()
        await prisma.expense.deleteMany()
        await prisma.carpaTransaction.deleteMany()
        await prisma.meeting.deleteMany()
        await prisma.communicationLog.deleteMany()
        await prisma.dossier.deleteMany()
        await prisma.client.deleteMany()
        await prisma.user.deleteMany()
        await prisma.template.deleteMany()
        await prisma.account.deleteMany()
        await prisma.journal.deleteMany()
        await prisma.jurisprudence.deleteMany()
    } catch (e) {
        console.log('Error cleaning DB:', e)
    }

    // 1. Create Users (Staff)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lexpremium.sn' },
        update: {},
        create: {
            email: 'admin@lexpremium.sn',
            name: 'Maître Principal',
            role: 'ADMIN',
            password: 'demo123',
            hourlyRate: 300.0,
            active: true
        }
    })

    const avocat = await prisma.user.upsert({
        where: { email: 'avocat@lexpremium.sn' },
        update: {},
        create: {
            email: 'avocat@lexpremium.sn',
            name: 'Maître Diop',
            role: 'AVOCAT',
            password: 'demo123',
            hourlyRate: 200.0,
            active: true
        }
    })

    const assistant = await prisma.user.upsert({
        where: { email: 'assistant@lexpremium.sn' },
        update: {},
        create: {
            email: 'assistant@lexpremium.sn',
            name: 'Assistant Ndiaye',
            role: 'ASSISTANT',
            password: 'demo123',
            hourlyRate: 0.0,
            active: true
        }
    })

    console.log('Users upserted')

    // 2. Create Clients
    const clientsData = [
        { type: 'ENTREPRISE', name: 'TechCorp SA', email: 'contact@techcorp.sn', phone: '+221 77 000 00 01', city: 'Dakar', address: 'Plateau, 15 avenue Roume' },
        { type: 'PARTICULIER', name: 'Moussa Diallo', email: 'client@exemple.com', phone: '+221 77 000 00 02', city: 'Dakar', address: 'Mermoz' }, // Demo login email
        { type: 'ENTREPRISE', name: 'Banque Atlantique', email: 'juridique@banque.sn', phone: '+221 33 800 00 00', city: 'Dakar', address: 'Place de l\'Indépendance' },
        { type: 'PARTICULIER', name: 'Famille Ndiaye', email: 'ndiaye@gmail.com', phone: '+221 76 000 00 03', city: 'Saint-Louis', address: 'Nord' },
        { type: 'ENTREPRISE', name: 'Immobilier Plus', email: 'direction@immo-plus.sn', phone: '+221 70 100 00 00', city: 'Saly', address: 'Route de la Plage' },
    ]

    const clients = []
    for (const c of clientsData) {
        const client = await prisma.client.create({ data: c })
        clients.push(client)
    }
    console.log('Clients created')

    // 3. Create Dossiers
    const dossiersData = [
        { title: 'Audit Contrat TechCorp', reference: 'DOS-2024-001', status: 'CLOTURE', clientId: clients[0].id, description: 'Audit complet des contrats de travail.' },
        { title: 'Affaire Diallo c. Construction SA', reference: 'DOS-2024-002', status: 'OUVERT', clientId: clients[1].id, opposingParty: 'Construction SA', description: 'Litige pour licenciement abusif.' },
        { title: 'Recouvrement Créance BA', reference: 'DOS-2024-003', status: 'EN_ATTENTE', clientId: clients[2].id, opposingParty: 'Société Import-Export', description: 'Recouvrement de 50M FCFA.' },
        { title: 'Succession Famille Ndiaye', reference: 'DOS-2024-004', status: 'OUVERT', clientId: clients[3].id, description: 'Partage successoral immeuble Saint-Louis.' },
        { title: 'Vente Villa Saly', reference: 'DOS-2024-005', status: 'EN_COURS', clientId: clients[4].id, description: 'Transaction immobilière villa R+1.' },
    ]

    const dossiers = []
    for (const d of dossiersData) {
        const dossier = await prisma.dossier.create({ data: d })
        dossiers.push(dossier)
    }
    console.log('Dossiers created')

    // 4. Create Events (Agenda)
    const today = new Date()
    await prisma.event.createMany({
        data: [
            {
                title: 'Audience TGI - Aff. Diallo',
                startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0),
                endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
                type: 'AUDIENCE',
                location: 'Palais de Justice, Salle 3',
                dossierId: dossiers[1].id,
                description: 'Plaidoirie sur le fond.'
            },
            {
                title: 'RDV Signature TechCorp',
                startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
                endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
                type: 'RDV',
                location: 'Cabinet',
                dossierId: dossiers[0].id,
                description: 'Signature de la convention.'
            },
            {
                title: 'Échéance Conclusions',
                startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 12, 0),
                endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 12, 0),
                type: 'DEADLINE',
                dossierId: dossiers[2].id,
                description: 'Dépôt des conclusions en défense.'
            }
        ]
    })
    console.log('Events created')

    // 5. Create Factures (Invoices)
    const f1 = await prisma.facture.create({
        data: {
            number: 'FACT-2024-001',
            status: 'PAYEE',
            amountHT: 500000,
            amountTVA: 90000,
            amountTTC: 590000,
            clientId: clients[0].id,
            dossierId: dossiers[0].id,
            dueDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            items: {
                create: [
                    { description: 'Honoraires Audit', quantity: 10, unitPrice: 50000, totalPrice: 500000 }
                ]
            }
        }
    })

    const f2 = await prisma.facture.create({
        data: {
            number: 'FACT-2024-002',
            status: 'EMISE', // Unpaid
            amountHT: 1200000,
            amountTVA: 216000,
            amountTTC: 1416000,
            clientId: clients[1].id,
            dossierId: dossiers[1].id,
            dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
            items: {
                create: [
                    { description: 'Provision sur honoraires', quantity: 1, unitPrice: 1000000, totalPrice: 1000000 },
                    { description: 'Frais de dossier', quantity: 1, unitPrice: 200000, totalPrice: 200000 }
                ]
            }
        }
    })
    console.log('Factures created')



    // 6. Create Templates
    const templatesData = [
        // --- AFFAIRES & OHADA ---
        {
            name: 'Statuts SARL (Standard OHADA)',
            category: 'AFFAIRES',
            content: '<h1>STATUTS DE LA SOCIETE {{NOM_SOCIETE}}</h1><p>Au capital de {{CAPITAL_SOCIAL}} FCFA...</p>',
            variables: JSON.stringify(['NOM_SOCIETE', 'CAPITAL_SOCIAL', 'SIEGE_SOCIAL', 'DUREE', 'CO_GERANTS'])
        },
        {
            name: 'Contrat de Bail Commercial OHADA',
            category: 'AFFAIRES',
            content: '<p>Entre le Bailleur {{BAILLEUR}} et le Preneur {{PRENEUR}}...</p>',
            variables: JSON.stringify(['BAILLEUR', 'PRENEUR', 'LOYER', 'DOSSIER_ID', 'DESTINATION'])
        },
        {
            name: 'Convention de Compte Courant d\'Associé',
            category: 'AFFAIRES',
            content: '<p>Conditions d\'avance de fonds par {{ASSOCIE}} à {{SOCIETE}}...</p>',
            variables: JSON.stringify(['ASSOCIE', 'SOCIETE', 'MONTANT_AVANCE', 'INTERETS'])
        },
        {
            name: 'Contrat de Cession de Parts Sociales',
            category: 'AFFAIRES',
            content: '<p>Cédant : {{CEDANT}}, Cessionnaire : {{CESSIONNAIRE}}...</p>',
            variables: JSON.stringify(['CEDANT', 'CESSIONNAIRE', 'NB_PARTS', 'PRIX_CESSION'])
        },

        // --- TRAVAIL ---
        {
            name: 'Contrat de Travail CDI (Cadre)',
            category: 'TRAVAIL',
            content: '<p>Engagement de M./Mme {{SALARIE}} par {{ENTREPRISE}}...</p>',
            variables: JSON.stringify(['SALARIE', 'ENTREPRISE', 'QUALIFICATION', 'REMUNERATION', 'CLAUSE_NON_CONCURRENCE'])
        },
        {
            name: 'Contrat de Stage (Convention)',
            category: 'TRAVAIL',
            content: '<p>Convention de stage entre {{ECOLE}}, {{ENTREPRISE}} et {{STAGIAIRE}}...</p>',
            variables: JSON.stringify(['ECOLE', 'ENTREPRISE', 'STAGIAIRE', 'GRATIFICATION'])
        },
        {
            name: 'Lettre de Mise en Demeure (Absence Injustifiée)',
            category: 'TRAVAIL',
            content: '<p>Objet : Mise en demeure de reprendre le travail suite à absence depuis {{DATE}}...</p>',
            variables: JSON.stringify(['SALARIE', 'DATE_DEBUT_ABSENCE'])
        },

        // --- FAMILLE & SOCIAL ---
        {
            name: 'Requête en Divorce par Consentement Mutuel',
            category: 'SOCIAL',
            content: '<h1>REQUETE EN DIVORCE</h1><p>A Monsieur le Président du Tribunal d\'Instance de {{VILLE}}...</p>',
            variables: JSON.stringify(['VILLE', 'EPOUX_A', 'EPOUX_B', 'DATE_MARIAGE'])
        },
        {
            name: 'Acte de Partage Successoral Amiable',
            category: 'SOCIAL',
            content: '<p>Succession de feu {{DE_CUJUS}} décédé le {{DATE_DECES}}...</p>',
            variables: JSON.stringify(['DE_CUJUS', 'DATE_DECES', 'MASSE_A_PARTAGER', 'LISTE_HERITIERS'])
        },
        {
            name: 'Offre d\'Achat après Calcul de Succession',
            category: 'SOCIAL',
            content: '<p>Projet de rachat de parts d\'indivision par {{ACHETEUR}} aux autres héritiers...</p>',
            variables: JSON.stringify(['ACHETEUR', 'PRIX_GLOBAL', 'DELAI_ACCEPTATION'])
        },

        // --- FONCIER ---
        {
            name: 'Contrat de Promotion Immobilière',
            category: 'FONCIER',
            content: '<p>Promoteur : {{PROMOTEUR}}, Maître d\'Ouvrage : {{CLIENT}}...</p>',
            variables: JSON.stringify(['PROMOTEUR', 'CLIENT', 'LOCALISATION_TERRAIN', 'COUT_ESTIME'])
        },
        {
            name: 'Compromis de Vente de Terrain Nu',
            category: 'FONCIER',
            content: '<p>Vente du Titre Foncier n° {{TF_NUMERO}} situé à {{ZONE}}...</p>',
            variables: JSON.stringify(['TF_NUMERO', 'ZONE', 'VENDEUR', 'ACHETEUR', 'PRIX_M_CARRE'])
        },

        // --- PROCÉDURE ---
        {
            name: 'Conclusions en Réplique (Fond)',
            category: 'PROCEDURE',
            content: '<h1>CONCLUSIONS EN REPLIQUE</h1><p>Pour : {{CLIENT_NOM}}... Contre : {{PARTIE_ADVERSE}}...</p>',
            variables: JSON.stringify(['CLIENT_NOM', 'PARTIE_ADVERSE', 'TRIBUNAL', 'FAITS'])
        },
        {
            name: 'Assignation en Référé Expertise',
            category: 'PROCEDURE',
            content: '<p>Saisine en urgence du juge des référés de {{VILLE}}...</p>',
            variables: JSON.stringify(['VILLE', 'MOTIF_URGENCE', 'MISSION_EXPERTE_DEMANDEE'])
        },

        // --- PETROLE & GAZ ---
        {
            name: 'Accord de Confidentialité (NDA Oil & Gas)',
            category: 'PETROLE_GAZ',
            content: '<p>Dans le cadre de l\'appel d\'offres pour le bloc {{BLOCK_ID}}...</p>',
            variables: JSON.stringify(['BLOCK_ID', 'DUREE_NDA', 'PARTIES_CONCERNEES'])
        },
        {
            name: 'Contrat de Sous-traitance Maintenance Offshore',
            category: 'PETROLE_GAZ',
            content: '<p>Prestations sur la plateforme {{PLATFORM_NAME}}...</p>',
            variables: JSON.stringify(['PLATFORM_NAME', 'PRESTATAIRE', 'DELAI_INTERVENTION'])
        },

        // --- TECH & DONNÉES ---
        {
            name: 'Charte Informatique Interne',
            category: 'TECH',
            content: '<p>Règles d\'utilisation des outils numériques de {{ENTREPRISE}}...</p>',
            variables: JSON.stringify(['ENTREPRISE', 'ADMIN_SYS'])
        },
        {
            name: 'Accord de Traitement des Données (DPA)',
            category: 'TECH',
            content: '<p>Conformité au règlement CDP (Sénégal) et RGPD...</p>',
            variables: JSON.stringify(['TYPE_DONNEES', 'FINALITE_TRAITEMENT', 'RESPONSABLE'])
        },

        // --- INTERNATIONAL ---
        {
            name: 'Contrat d\'Agent Commercial Export',
            category: 'INTERNATIONAL',
            content: '<p>Mission de représentation en zone {{ZONE_EXPORT}} pour {{FABRICANT}}...</p>',
            variables: JSON.stringify(['ZONE_EXPORT', 'FABRICANT', 'TAUX_COMMISSION'])
        },
        {
            name: 'Convention de Joint-Venture (International)',
            category: 'INTERNATIONAL',
            content: '<p>Alliance entre {{PARTNER_A}} et {{PARTNER_B}} pour le marché africain...</p>',
            variables: JSON.stringify(['PARTNER_A', 'PARTNER_B', 'PAYS_HOTE', 'CONTRIBUTION_TECHNOLOGIQUE'])
        },

        // --- FISCALITÉ ---
        {
            name: 'Audit de Situation Fiscale',
            category: 'FISCALITE',
            content: '<p>Analyse des risques fiscaux pour {{SOCIETE}} sur les exercices {{EXERCICES}}...</p>',
            variables: JSON.stringify(['SOCIETE', 'EXERCICES', 'TAXES_AUDITEES'])
        },
        {
            name: 'Réclamation Contentieuse (DGID)',
            category: 'FISCALITE',
            content: '<p>Contestation du redressement notifié par l\'Administration le {{DATE_REDRESSEMENT}}...</p>',
            variables: JSON.stringify(['DATE_REDRESSEMENT', 'MONTANT_CONTESTE', 'ARGUMENTS_DROIT'])
        },

        // --- ADMINISTRATIF ---
        {
            name: 'Recours pour Excès de Pouvoir (REP)',
            category: 'ADMINISTRATIF',
            content: '<p>Requête contre la décision administrative n° {{DECISION_REF}}...</p>',
            variables: JSON.stringify(['DECISION_REF', 'AUTORITE_EMETTRICE', 'MOYENS_ANNULATION'])
        }
    ]

    for (const t of templatesData) {
        await prisma.template.create({ data: t })
    }
    console.log(`Massive Template Library seeded: ${templatesData.length} new high-quality models.`)

    // 7. Create Knowledge Base (RAG Data)
    await prisma.jurisprudence.createMany({
        data: [
            {
                title: "Acte Uniforme portant Droit Commercial Général (AUDCG)",
                type: "LOI",
                court: "OHADA",
                date: new Date("2010-12-15"),
                reference: "AUDCG",
                summary: "Texte fondamental régissant le statut du commerçant, le registre du commerce et du crédit mobilier, et les contrats commerciaux.",
                content: "ARTICLE 1 : Tout commerçant, personne physique ou morale... ARTICLE 101 : Le bailleur est tenu de délivrer les locaux...",
                keywords: JSON.stringify(["bail", "commerçant", "rccm", "fonds de commerce"])
            },
            {
                title: "Arrêt N° 025/2018 CCJA - Validité Saisie-Attribution",
                type: "JURISPRUDENCE",
                court: "CCJA",
                date: new Date("2018-04-26"),
                reference: "J-2018-025",
                summary: "La CCJA précise que la signification du procès-verbal de saisie doit contenir les mentions obligatoires sous peine de nullité.",
                content: "LA COUR, ... Attendu qu'il résulte des pièces du dossier... que la saisie pratiquée ne mentionnait pas le décompte distinct des sommes...",
                keywords: JSON.stringify(["saisie", "nullité", "signification", "banque"])
            },
            {
                title: "Code des Obligations Civiles et Commerciales (Partie 1)",
                type: "LOI",
                court: "SENEGAL",
                date: new Date("1976-10-22"),
                reference: "COCC",
                summary: "Loi régissant les contrats et la responsabilité civile au Sénégal.",
                content: "ARTICLE 42 : Le contrat est la convention par laquelle une ou plusieurs personnes s'obligent...",
                keywords: JSON.stringify(["contrat", "responsabilité", "obligation", "faute"])
            }
        ]
    })
    console.log('Knowledge Base seeded')

    console.log('Seeding finished successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
