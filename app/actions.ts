'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema
const CreateDossierSchema = z.object({
    title: z.string().min(3, { message: "Le titre doit faire au moins 3 caractères" }),
    clientId: z.string().min(1, { message: "Veuillez sélectionner un client" }),
    reference: z.string().min(3, { message: "La référence est requise" }),
})

export async function createDossier(prevState: any, formData: FormData) {
    const rawFormData = {
        title: formData.get('title') as string,
        clientId: formData.get('clientId') as string,
        reference: formData.get('reference') as string,
    }

    const validatedFields = CreateDossierSchema.safeParse(rawFormData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Erreur de validation. Veuillez vérifier les champs.',
        }
    }

    const { title, clientId, reference } = validatedFields.data

    try {
        const newDossier = await prisma.dossier.create({
            data: {
                title,
                reference,
                clientId,
                status: 'OUVERT',
            },
        })

    } catch (error) {
        return {
            message: 'Erreur base de données: Impossible de créer le dossier.',
        }
    }

    revalidatePath('/dossiers')
    return { message: 'Dossier créé avec succès !', success: true }
}

export async function createDocumentFromTemplate(dossierId: string, templateId: string, values: Record<string, string>) {
    try {
        // 1. Fetch Template
        const template = await prisma.template.findUnique({ where: { id: templateId } })
        if (!template) throw new Error("Modèle introuvable")

        // 2. Merge Content
        let content = template.content
        Object.entries(values).forEach(([key, value]) => {
            // Replace {{key}}
            const regex = new RegExp(`{{${key}}}`, 'g')
            content = content.replace(regex, value)
        })

        // 3. Create Document Record
        // In a real app, generate the file (PDF/Docx) and upload it to Blob Storage here.
        // For now, we simulate it by saving the content to a new record or just a 'mock' file path.

        const newDoc = await prisma.document.create({
            data: {
                name: `${template.name} - Généré.txt`, // Simple text file for now
                type: 'ACTE',
                category: template.category,
                status: 'DRAFT',
                dossierId: dossierId,
                ocrContent: content, // Store content here for "OCR" search
                versions: {
                    create: {
                        version: 1,
                        size: content.length,
                        path: '/mock/storage/path.txt', // Fake path
                        comment: 'Généré depuis le modèle ' + template.name,
                    }
                }
            }
        })

        revalidatePath(`/dossiers/${dossierId}`)
        return { success: true, message: 'Document généré avec succès', documentId: newDoc.id }

    } catch (e) {
        console.error(e)
        return { success: false, message: 'Erreur lors de la génération' }
    }
}

export async function checkConflicts(query: string) {
    if (!query || query.length < 2) return { matches: [] };

    const lowerQuery = query.toLowerCase();

    // 1. Search Clients
    const clients = await prisma.client.findMany({
        where: {
            name: { contains: query, mode: 'insensitive' }
        },
        select: { id: true, name: true, type: true }
    });

    // 2. Search Opposing Parties in Dossiers
    const dossiers = await prisma.dossier.findMany({
        where: {
            OR: [
                { opposingParty: { contains: query, mode: 'insensitive' } },
                { opposingCounsel: { contains: query, mode: 'insensitive' } }
            ]
        },
        select: { id: true, reference: true, title: true, opposingParty: true, opposingCounsel: true, client: { select: { name: true } } }
    });

    return {
        matches: [
            ...clients.map((c: any) => ({ type: 'CLIENT', name: c.name, details: c.type, id: c.id })),
            ...dossiers.map((d: any) => {
                if (d.opposingParty && d.opposingParty.toLowerCase().includes(lowerQuery)) {
                    return { type: 'PARTIE_ADVERSE', name: d.opposingParty, details: `Contre: ${d.client.name} (Dossier ${d.reference})`, id: d.id }
                }
                if (d.opposingCounsel && d.opposingCounsel.toLowerCase().includes(lowerQuery)) {
                    return { type: 'CONFRERE_ADVERSE', name: d.opposingCounsel, details: `Dossier: ${d.reference}`, id: d.id }
                }
                return null;
            }).filter(Boolean)
        ]
    }
}

export async function getUsers() {
    return await prisma.user.findMany({ orderBy: { name: 'asc' } })
}

export async function createUser(data: any) {
    try {
        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
                hourlyRate: parseFloat(data.hourlyRate || '200'),
                password: 'password123', // Default password
                active: true
            }
        })
        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        return { success: false, message: 'Erreur création utilisateur' }
    }
}

export async function updateUserStatus(userId: string, active: boolean) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { active }
        })
        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function getCabinetSettings() {
    return await prisma.cabinetSettings.upsert({
        where: { id: '6765f0e698823528f1455555' },
        update: {},
        create: {
            id: '6765f0e698823528f1455555',
            name: 'Cabinet Avocats Associés',
            address: 'Dakar, Sénégal',
            phone: '+221 33 000 00 00',
            email: 'contact@cabinet.sn',
            defaultHourlyRate: 200.0,
            tvaRate: 18.0
        }
    })
}

export async function updateCabinetSettings(data: any) {
    try {
        const settings = await prisma.cabinetSettings.findFirst()
        await prisma.cabinetSettings.update({
            where: { id: settings?.id || '6765f0e698823528f1455555' },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                defaultHourlyRate: parseFloat(data.defaultHourlyRate),
                tvaRate: parseFloat(data.tvaRate),
                taxConfig: data.taxConfig,
                legalForm: data.legalForm,
                tradeRegister: data.tradeRegister,
                ninea: data.ninea,
                capital: data.capital
            }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        return { success: false, message: 'Erreur mise à jour paramètres' }
    }
}

export async function updateUserPermissions(userId: string, permissions: string[]) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { permissions: JSON.stringify(permissions) }
        })
        revalidatePath('/admin/users')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function initSyscohadaAccounts() {
    const accounts = [
        { code: '1010', name: 'Capital Social', type: 'PASSIF' },
        { code: '1310', name: 'Résultat Net', type: 'PASSIF' },
        { code: '2440', name: 'Matériel de Bureau', type: 'ACTIF' },
        { code: '4011', name: 'Fournisseurs', type: 'PASSIF' },
        { code: '4111', name: 'Clients (Honoraires)', type: 'ACTIF' },
        { code: '4411', name: 'État - TVA Facturée', type: 'PASSIF' },
        { code: '4451', name: 'État - TVA Récupérable', type: 'ACTIF' },
        { code: '5121', name: 'Banque - SGBS', type: 'ACTIF' },
        { code: '5122', name: 'Banque - CBAO', type: 'ACTIF' },
        { code: '5711', name: 'Caisse', type: 'ACTIF' },
        { code: '6010', name: 'Fournitures', type: 'CHARGE' },
        { code: '6050', name: 'Électricité / Eau', type: 'CHARGE' },
        { code: '6110', name: 'Transports', type: 'CHARGE' },
        { code: '6220', name: 'Honoraires (Huisier/Notaire)', type: 'CHARGE' },
        { code: '6610', name: 'Salaires', type: 'CHARGE' },
        { code: '7061', name: 'Honoraires Conseil', type: 'PRODUIT' },
        { code: '7062', name: 'Honoraires Contentieux', type: 'PRODUIT' },
    ]

    for (const acc of accounts) {
        const exists = await prisma.account.findUnique({ where: { code: acc.code } })
        if (!exists) {
            await prisma.account.create({ data: acc })
        }
    }
    return { success: true }
}

// ... existing methods

export async function createAccount(code: string, name: string, type: string) {
    // Basic validation
    if (!code || !name) return { success: false, message: "Code et Nom requis" }

    // Check duplication
    const existing = await prisma.account.findUnique({ where: { code } })
    if (existing) return { success: false, message: "Ce code compte existe déjà" }

    await prisma.account.create({
        data: { code, name, type, balance: 0 }
    })
    revalidatePath('/comptabilite')
    return { success: true }
}

export async function getBilan() {
    const assets = await prisma.account.findMany({ where: { type: 'ACTIF' }, orderBy: { code: 'asc' } })
    const liabilities = await prisma.account.findMany({ where: { type: 'PASSIF' }, orderBy: { code: 'asc' } })

    const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0)
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0)

    // Calculate Result (Income - Expenses) to balance the sheet
    const income = await prisma.account.aggregate({ where: { type: 'PRODUIT' }, _sum: { balance: true } })
    const expenses = await prisma.account.aggregate({ where: { type: 'CHARGE' }, _sum: { balance: true } })
    const netResult = (income._sum.balance || 0) - (expenses._sum.balance || 0)

    return { assets, liabilities, totalAssets, totalLiabilities, netResult }
}

export async function getCompteResultat() {
    const products = await prisma.account.findMany({ where: { type: 'PRODUIT' }, orderBy: { code: 'asc' } })
    const charges = await prisma.account.findMany({ where: { type: 'CHARGE' }, orderBy: { code: 'asc' } })

    const totalProd = products.reduce((s, a) => s + a.balance, 0)
    const totalChar = charges.reduce((s, a) => s + a.balance, 0)

    return { products, charges, totalProd, totalChar, result: totalProd - totalChar }
}

export async function getAccounts() {
    return await prisma.account.findMany({ orderBy: { code: 'asc' } })
}

// ... existing createTransaction ...

export async function getJournals() {
    return await prisma.journal.findMany({ orderBy: { code: 'asc' } })
}

export async function getLedgerEntries(journalId?: string, startDate?: Date, endDate?: Date) {
    const whereClause: any = {}

    if (journalId && journalId !== 'ALL') {
        whereClause.transaction = { journalId: journalId }
    }

    // Add date filter if needed
    // if (startDate) ...

    const entries = await prisma.transactionLine.findMany({
        where: whereClause,
        include: {
            transaction: {
                include: { journal: true }
            },
            account: true
        },
        orderBy: {
            transaction: { date: 'desc' }
        }
    })

    return entries
}

// ... existing methods

export async function getJournalStats() {
    const journals = await prisma.journal.findMany({ orderBy: { code: 'asc' } })
    const stats = []

    for (const j of journals) {
        const entryCount = await prisma.transaction.count({ where: { journalId: j.id } })
        const draftCount = await prisma.transaction.count({
            where: { journalId: j.id, status: 'DRAFT' }
        })
        stats.push({ ...j, entryCount, draftCount })
    }
    return stats
}

export async function createTransaction(description: string, date: Date, lines: any[], journalId: string, status: 'DRAFT' | 'VALIDATED' = 'DRAFT') {
    // Basic double-entry validation ONLY for Validation, drafts can be unbalanced if we wanted, but Sage enforces balance per piece usually.
    const debit = lines.reduce((s, l) => s + (l.debit || 0), 0)
    const credit = lines.reduce((s, l) => s + (l.credit || 0), 0)

    if (Math.abs(debit - credit) > 0.01) {
        return { success: false, message: 'Écriture déséquilibrée (Débit != Crédit)' }
    }

    try {
        const fiscalYear = await prisma.fiscalYear.findFirst({ where: { isCurrent: true } })
        // If getting reference number logic is needed (e.g. VE-2025-001), do it here.

        const tx = await prisma.transaction.create({
            data: {
                description,
                date: new Date(date),
                status: status, // DRAFT aka "Brouillard" or VALIDATED "Grand Livre"
                journalId: journalId,
                fiscalYearId: fiscalYear?.id
            }
        })

        // Create Lines 
        for (let line of lines) {
            await prisma.transactionLine.create({
                data: {
                    transactionId: tx.id,
                    accountId: line.accountId,
                    debit: parseFloat(line.debit || 0),
                    credit: parseFloat(line.credit || 0)
                }
            })

            // Only update Account Balance if Validated
            if (status === 'VALIDATED') {
                const acc = await prisma.account.findUnique({ where: { id: line.accountId } })
                if (acc) {
                    let newBal = acc.balance
                    if (acc.type === 'ACTIF' || acc.type === 'CHARGE') {
                        newBal = newBal + parseFloat(line.debit || 0) - parseFloat(line.credit || 0)
                    } else {
                        newBal = newBal + parseFloat(line.credit || 0) - parseFloat(line.debit || 0)
                    }
                    await prisma.account.update({ where: { id: line.accountId }, data: { balance: newBal } })
                }
            }
        }

        revalidatePath('/comptabilite')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de l'enregistrement" }
    }
}

export async function getDraftTransactions(journalId: string) {
    return await prisma.transaction.findMany({
        where: { journalId, status: 'DRAFT' },
        include: { lines: { include: { account: true } } },
        orderBy: { date: 'desc' }
    })
}

export async function validateJournalEntries(journalId: string) {
    try {
        const drafts = await prisma.transaction.findMany({
            where: { journalId, status: 'DRAFT' },
            include: { lines: true }
        })

        for (const tx of drafts) {
            // Update Transaction Status
            await prisma.transaction.update({
                where: { id: tx.id },
                data: { status: 'VALIDATED' }
            })

            // Update Account Balances
            for (const line of tx.lines) {
                const acc = await prisma.account.findUnique({ where: { id: line.accountId } })
                if (acc) {
                    let newBal = acc.balance
                    if (acc.type === 'ACTIF' || acc.type === 'CHARGE') {
                        newBal = newBal + line.debit - line.credit
                    } else {
                        newBal = newBal + line.credit - line.debit
                    }
                    await prisma.account.update({ where: { id: line.accountId }, data: { balance: newBal } })
                }
            }
        }

        revalidatePath('/comptabilite')
        return { success: true, count: drafts.length }
    } catch (e) {
        return { success: false, message: "Erreur lors de la validation" }
    }
}


// ... existing methods

export async function getAccountHistory(accountId: string) {
    const entries = await prisma.transactionLine.findMany({
        where: { accountId },
        include: {
            transaction: { include: { journal: true } }
        },
        orderBy: { transaction: { date: 'asc' } }
    })

    // Calculate running balance
    let runningBalance = 0
    const history = entries.map(e => {
        const accType = e.transaction.status === 'VALIDATED' ? 'VALID' : 'DRAFT' // We include drafts in interrogation usually but mark them
        // Note: For display logic of running balance, we need account type, but here we prioritize raw flow
        // Standard convention: Debit is +, Credit is - for Assets/Expenses.
        // Let's return raw debit/credit and let UI handle display.
        return e
    })

    return entries
}

// ... existing methods

export async function getTiers(type: 'CLIENT' | 'FOURNISSEUR') {
    const prefix = type === 'CLIENT' ? '411' : '401'
    const accounts = await prisma.account.findMany({
        where: { code: { startsWith: prefix } },
        orderBy: { code: 'asc' }
    })
    return accounts
}

export async function createTier(name: string, type: 'CLIENT' | 'FOURNISSEUR', customCode?: string) {
    const prefix = type === 'CLIENT' ? '411' : '401'

    let finalCode = customCode
    if (!finalCode) {
        // Auto-generate next code
        const last = await prisma.account.findFirst({
            where: { code: { startsWith: prefix } },
            orderBy: { code: 'desc' }
        })
        if (last) {
            const num = parseInt(last.code.substring(3)) || 0
            finalCode = prefix + (num + 1).toString().padStart(5, '0') // e.g. 41100001
        } else {
            finalCode = prefix + "00001"
        }
    }

    // Validation
    if (!finalCode.startsWith(prefix)) return { success: false, message: `Le code doit commencer par ${prefix}` }

    try {
        await prisma.account.create({
            data: {
                code: finalCode,
                name: name,
                type: type === 'CLIENT' ? 'ACTIF' : 'PASSIF', // Simplified typing
                balance: 0
            }
        })
        revalidatePath('/comptabilite')
        return { success: true, code: finalCode }
    } catch (e) {
        return { success: false, message: "Code existant ou erreur." }
    }
}
export async function initJurisprudenceLibrary() {
    const data = [
        {
            title: "Arrêt n° 152/2023 - Compétence CCJA et Ordre Public",
            court: "CCJA",
            date: new Date('2023-06-29'),
            reference: "Arrêt N°152/2023",
            summary: "La Cour rappelle que la violation d'une règle d'ordre public international de l'espace OHADA peut être soulevée d'office.",
            category: "COMMERCIAL",
            keywords: JSON.stringify(["ordre public", "compétence", "cassation"]),
            sourceUrl: "https://www.ohada.org/jurisprudence"
        },
        {
            title: "Arrêt n° 083/2023 - Validité Clause Compromissoire",
            court: "CCJA",
            date: new Date('2023-04-27'),
            reference: "Arrêt N°083/2023",
            summary: "L'autonomie de la clause compromissoire survit à la nullité du contrat principal, sauf preuve de l'inexistence du consentement.",
            category: "COMMERCIAL",
            keywords: JSON.stringify(["arbitrage", "clause compromissoire", "validité"]),
            sourceUrl: "https://www.ohada.org/jurisprudence"
        },
        {
            title: "Arrêt n° 42 - Chambre Sociale: Licenciement abusif",
            court: "COUR_SUPREME",
            date: new Date('2022-03-15'),
            reference: "CS-SN-SOC-42-2022",
            summary: "La charge de la preuve du motif légitime incombe à l'employeur. Le seul témoignage verbal ne suffit pas.",
            category: "SOCIAL",
            keywords: JSON.stringify(["licenciement", "preuve", "social"]),
            sourceUrl: "https://coursupreme.gouv.sn/arrets"
        },
        {
            title: "Arrêt n° 13-14 - Litige Foncier Guédiawaye",
            court: "COUR_SUPREME",
            date: new Date('2021-11-10'),
            reference: "CS-SN-CIV-105-2021",
            summary: "Confirmation des droits coutumiers en l'absence de titre foncier définitif, sous réserve d'occupation continue.",
            category: "FONCIER",
            keywords: JSON.stringify(["foncier", "domaine national", "occupation"]),
            sourceUrl: "https://coursupreme.gouv.sn/arrets"
        },
        {
            title: "Recueil Jurisprudence OHADA N°36",
            court: "CCJA",
            date: new Date('2020-04-01'),
            reference: "RECUEIL-36",
            summary: "Compilation des arrêts d'Avril 2020 sur les procédures simplifiées de recouvrement.",
            category: "COMMERCIAL",
            keywords: JSON.stringify(["recouvrement", "injonction de payer", "saisie"]),
            sourceUrl: "https://www.ohada.org/publications"
        }
    ]

    let count = 0
    for (const item of data) {
        const exists = await prisma.jurisprudence.findFirst({ where: { reference: item.reference } })
        if (!exists) {
            await prisma.jurisprudence.create({ data: item })
            count++
        }
    }
    return { success: true, count }
}

import { searchIndex, rebuildSearchIndex } from '@/lib/search'

export async function searchJurisprudence(query: string) {
    if (!query) {
        // Init index in background if empty
        rebuildSearchIndex().catch(console.error)
        return await prisma.jurisprudence.findMany({ orderBy: { date: 'desc' }, take: 50 })
    }

    // Use SOLR/LUNR Index
    const searchResults = await searchIndex(query)

    if (searchResults.total === 0) {
        // Fallback or empty
        return []
    }

    // Fetch full objects for matched IDs
    const items = await prisma.jurisprudence.findMany({
        where: { id: { in: searchResults.jurisprudenceIds } }
    })

    return items
}

export async function generateAIResponse(message: string, mode: 'RESEARCH' | 'DRAFTING') {
    // Simulator for AI response
    // In a real scenario, this would call an LLM API (OpenAI, Anthropic, etc.)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

    let text = "";

    if (mode === 'RESEARCH') {
        // Real Jurisprudence Search
        const results = await prisma.jurisprudence.findMany({
            where: {
                OR: [
                    { title: { contains: message } },
                    { summary: { contains: message } },
                    { keywords: { contains: message } }
                ]
            },
            take: 3
        });

        const jurisprudenceText = results.length > 0
            ? results.map(r => `- ${r.title} (${r.reference}) : ${r.summary}`).join('\n\n')
            : "Aucune jurisprudence spécifique trouvée dans la base locale pour ces termes exacts.";

        text = `Sur la base de votre requête "${message}", voici les éléments juridiques pertinents issus de votre bibliotheque :\n\n${jurisprudenceText}\n\n1. Référence OHADA suggérée : L'Acte Uniforme portant Droit Commercial Général (AUDCG).\n\n2. Droit Sénégalais : Vérifier le Code des Obligations Civiles et Commerciales (COCC) sur ce point précis.`;
    } else {
        // Drafting Mode - Contextual Mock
        const promptLower = message.toLowerCase();
        let clause = "";
        let legalBasis = "";

        if (promptLower.includes("bail") || promptLower.includes("loyer")) {
            clause = `"Le Bailleur donne à bail, conformément aux dispositions de l'Acte Uniforme portant Droit Commercial Général (AUDCG), les locaux ci-après désignés..."`;
            legalBasis = "Art 101 et suivants AUDCG";
        } else if (promptLower.includes("concurrence") || promptLower.includes("exclusivité")) {
            clause = `"Le Salarié s'interdit formellement d'exercer, directement ou indirectement, pour son propre compte ou pour le compte d'un tiers, une activité concurrente..."`;
            legalBasis = "Jurisprudence constante Cour Suprême / Code du Travail";
        } else if (promptLower.includes("confidentialité")) {
            clause = `"Les Parties s'engagent à garder strictement confidentielles toutes les informations, documents et données échangés dans le cadre de l'exécution du présent contrat..."`;
            legalBasis = "Principe de Bonne Foi (COCC)";
        } else {
            clause = `"Les parties conviennent expressément que [DESCRIPTION DE L'OBLIGATION]... Le présent engagement est pris en considération de la personne (intuitu personae)."`;
        }

        text = `Voici une proposition de rédaction adaptée à votre demande :\n\nPROPOSITION DE CLAUSE :\n${clause}\n\nBASE LEGALE SUGGERÉE :\n${legalBasis}\n\nConseil : Adaptez cette clause aux spécificités du dossier en cours.`;
    }

    return {
        success: true,
        text: text
    }
}

export async function createMeeting(data: any) {
    // Mock implementation for meeting creation
    // In real app: integrate with Zoom/Teams API
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Creating meeting:", data);
    return { success: true, joinUrl: "https://zoom.us/j/123456789" }
}

export async function logCommunication(data: any) {
    // Mock implementation for logging
    // In real app: save to DB
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log("Logging communication:", data);
    return { success: true }
}

// ============ CLIENT MANAGEMENT ============

export async function createClient(data: {
    name: string
    type: string
    email?: string
    phone?: string
    address?: string
    city?: string
    country?: string
}) {
    try {
        const client = await prisma.client.create({
            data: {
                name: data.name,
                type: data.type || 'PARTICULIER',
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                country: data.country || 'Senegal'
            }
        })
        revalidatePath('/clients')
        return { success: true, client }
    } catch (error) {
        console.error('Error creating client:', error)
        return { success: false, message: 'Erreur lors de la création du client' }
    }
}

export async function getClients() {
    return await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { dossiers: true, factures: true }
            }
        }
    })
}

export async function deleteClient(clientId: string) {
    try {
        await prisma.client.delete({ where: { id: clientId } })
        revalidatePath('/clients')
        return { success: true }
    } catch (error) {
        return { success: false, message: 'Client lié à des dossiers existants' }
    }
}

// ============ TIME TRACKING ============

export async function createTimeEntry(data: {
    dossierId: string
    description: string
    duration: number // in minutes
    date?: Date
    billable?: boolean
    rate?: number
}) {
    try {
        const entry = await prisma.timeEntry.create({
            data: {
                dossierId: data.dossierId,
                description: data.description,
                duration: data.duration,
                date: data.date || new Date(),
                billable: data.billable ?? true,
                rate: data.rate
            }
        })
        revalidatePath(`/dossiers/${data.dossierId}`)
        return { success: true, entry }
    } catch (error) {
        console.error('Error creating time entry:', error)
        return { success: false, message: 'Erreur lors de l\'enregistrement du temps' }
    }
}

export async function getTimeEntriesByDossier(dossierId: string) {
    return await prisma.timeEntry.findMany({
        where: { dossierId },
        orderBy: { date: 'desc' }
    })
}

// ============ INVOICE CREATION ============

export async function createInvoice(data: {
    clientId: string
    dossierId?: string
    items: { description: string, quantity: number, unitPrice: number }[]
    type?: string
    tvaRate?: number
}) {
    try {
        // Calculate totals
        const amountHT = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
        const tvaRate = data.tvaRate ?? 18
        const amountTVA = amountHT * (tvaRate / 100)
        const amountTTC = amountHT + amountTVA

        // Generate invoice number
        const year = new Date().getFullYear()
        const count = await prisma.facture.count()
        const prefix = data.type === 'PROVISION' ? 'PROV' : 'FAC'
        const number = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`

        const facture = await prisma.facture.create({
            data: {
                number,
                type: data.type || 'FACTURE',
                clientId: data.clientId,
                dossierId: data.dossierId,
                amountHT,
                amountTVA,
                amountTTC,
                status: 'BROUILLON',
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                items: {
                    create: data.items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.quantity * item.unitPrice
                    }))
                }
            },
            include: { items: true }
        })

        revalidatePath('/factures')
        return { success: true, facture }
    } catch (error) {
        console.error('Error creating invoice:', error)
        return { success: false, message: 'Erreur lors de la création de la facture' }
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
    try {
        const invoice = await prisma.facture.findUnique({
            where: { id: invoiceId },
            include: { client: true }
        })
        if (!invoice) return { success: false, message: "Facture introuvable" }

        // Update Status
        await prisma.facture.update({
            where: { id: invoiceId },
            data: { status }
        })

        // --- ACCOUNTING INTEGRATION ---
        if (status === 'EMISE') {
            await generateInvoiceAccounting(invoice)
        }

        // Note: Payment (PAYEE) is usually handled by a specific 'registerPayment' action
        // rather than just status toggle, to capture date/method.

        revalidatePath('/factures')
        revalidatePath('/comptabilite') // Update account balances
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Erreur lors de la mise à jour' }
    }
}

// Helper to generate Accounting Entry for Invoice
async function generateInvoiceAccounting(invoice: any) {
    const journal = await prisma.journal.findUnique({ where: { code: 'VE' } })
    if (!journal) return // Journal Ventes must exist

    // Check if entry already exists
    const exists = await prisma.transaction.findFirst({
        where: { reference: invoice.number, journalId: journal.id }
    })
    if (exists) return

    // 1. Get/Create Client Account (411)
    let clientAccountCode = invoice.client.accountingCode
    if (!clientAccountCode) {
        // Generate code
        const count = await prisma.account.count({ where: { code: { startsWith: '411' } } })
        const suffix = String(count + 1).padStart(5, '0') // 41100001
        clientAccountCode = `411${suffix}`

        // Save to Client and Create Account
        await prisma.client.update({ where: { id: invoice.client.id }, data: { accountingCode: clientAccountCode } })
        await prisma.account.create({
            data: {
                code: clientAccountCode,
                name: invoice.client.name,
                type: 'ACTIF',
                balance: 0
            }
        })
    }

    // 2. Create Transaction
    // Debit 411 (TTC)
    // Credit 706 (HT) - Services
    // Credit 443 (TVA) - TVA Collectée

    // Ensure 706 and 443 exist
    // Simple check/create for demo
    const serviceAccount = await ensureAccount('70600000', 'Prestations de Services', 'PRODUIT')
    const tvaAccount = await ensureAccount('44300000', 'TVA Facturée', 'PASSIF')

    await prisma.transaction.create({
        data: {
            journalId: journal.id,
            description: `Facture N° ${invoice.number} - ${invoice.client.name}`,
            date: invoice.issueDate || new Date(), // Use issue date properly
            reference: invoice.number,
            status: 'VALIDATED', // Direct validation
            lines: {
                create: [
                    {
                        accountId: (await prisma.account.findUnique({ where: { code: clientAccountCode } }))!.id,
                        debit: invoice.amountTTC,
                        credit: 0
                    },
                    {
                        accountId: serviceAccount.id,
                        debit: 0,
                        credit: invoice.amountHT
                    },
                    {
                        accountId: tvaAccount.id,
                        debit: 0,
                        credit: invoice.amountTVA
                    }
                ]
            }
        }
    })

    // Update Account Balances
    // Debit increases Actif, Credit increases Produit (or decreases Actif).
    // We use the helper 'incrementBalance' which just adds to the stored balance.

    const clientAcc = await prisma.account.findUnique({ where: { code: clientAccountCode } })
    if (clientAcc) await incrementBalance(clientAcc.id, invoice.amountTTC)

    await incrementBalance(serviceAccount.id, -invoice.amountHT)
    await incrementBalance(tvaAccount.id, -invoice.amountTVA)
}

async function ensureAccount(code: string, name: string, type: string) {
    let acc = await prisma.account.findUnique({ where: { code } })
    if (!acc) {
        acc = await prisma.account.create({
            data: { code, name, type, balance: 0 }
        })
    }
    return acc
}

async function incrementBalance(accountId: string, amount: number) {
    await prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } }
    })
}

// ============ EXPENSE MANAGEMENT ============

export async function createExpense(data: {
    dossierId: string
    description: string
    amount: number
    category: string
    type?: string
    billable?: boolean
    date?: Date
}) {
    try {
        const expense = await prisma.expense.create({
            data: {
                dossierId: data.dossierId,
                description: data.description,
                amount: data.amount,
                category: data.category,
                type: data.type || 'FRAIS',
                billable: data.billable ?? true,
                date: data.date || new Date(),
                status: 'TO_BILL'
            }
        })
        revalidatePath(`/dossiers/${data.dossierId}`)
        return { success: true, expense }
    } catch (error) {
        console.error('Error creating expense:', error)
        return { success: false, message: 'Erreur lors de l\'enregistrement du frais' }
    }
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
    const [
        dossiersOuverts,
        totalClients,
        facturesPayees,
        facturesEnAttente,
        heuresThisMois
    ] = await Promise.all([
        prisma.dossier.count({ where: { status: 'OUVERT' } }),
        prisma.client.count(),
        prisma.facture.aggregate({
            _sum: { amountTTC: true },
            where: { status: 'PAYEE' }
        }),
        prisma.facture.aggregate({
            _sum: { amountTTC: true },
            where: { status: 'EMISE' }
        }),
        prisma.timeEntry.aggregate({
            _sum: { duration: true },
            where: {
                date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        })
    ])

    return {
        dossiersOuverts,
        totalClients,
        caEncaisse: facturesPayees._sum.amountTTC || 0,
        caEnAttente: facturesEnAttente._sum.amountTTC || 0,
        heuresMois: Math.round((heuresThisMois._sum.duration || 0) / 60) // Convert to hours
    }
}

// ============ TEMPLATE MANAGEMENT ============

export async function createTemplate(data: {
    name: string
    category: string
    content: string
    variables: string[]
}) {
    try {
        const template = await prisma.template.create({
            data: {
                name: data.name,
                category: data.category,
                content: data.content,
                variables: JSON.stringify(data.variables)
            }
        })
        revalidatePath('/modeles')
        return { success: true, template }
    } catch (error) {
        console.error('Error creating template:', error)
        return { success: false, message: 'Erreur lors de la création du modèle' }
    }
}

export async function updateTemplate(id: string, data: {
    name: string
    category: string
    content: string
    variables: string[]
}) {
    try {
        const template = await prisma.template.update({
            where: { id },
            data: {
                name: data.name,
                category: data.category,
                content: data.content,
                variables: JSON.stringify(data.variables)
            }
        })
        revalidatePath('/modeles')
        return { success: true, template }
    } catch (error) {
        return { success: false, message: 'Erreur mise à jour modèle' }
    }
}

export async function deleteTemplate(id: string) {
    try {
        await prisma.template.delete({ where: { id } })
        revalidatePath('/modeles')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function updateDossierStatus(dossierId: string, columnId: string) {
    try {
        await prisma.dossier.update({
            where: { id: dossierId },
            data: { columnId: columnId }
        })
        revalidatePath('/workflows')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function analyzeContract(text: string) {
    // Mock implementation for Contract Analysis (Logic to be replaced by LLM)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing

    const risks = [
        { severity: 'HIGH', text: "Clause de non-concurrence excessive (Durée > 2 ans)", section: "Article 12" },
        { severity: 'MEDIUM', text: "Loi applicable non définie explicitement", section: "Dispositions Finales" },
        { severity: 'LOW', text: "Délai de paiement non conforme aux usages (60 jours)", section: "Conditions Financières" }
    ];

    const summary = "Ce contrat de prestation de services semble globalement équilibré mais présente un risque majeur concernant la clause de non-concurrence qui pourrait être requalifiée. La juridiction compétente doit être clarifiée.";

    return {
        success: true,
        summary,
        risks
    }
}

export async function registerPayment(data: {
    factureId: string
    amount: number
    method: string
    reference?: string
    date?: Date
}) {
    try {
        const invoice = await prisma.facture.findUnique({
            where: { id: data.factureId },
            include: { client: true, payments: true }
        })
        if (!invoice) return { success: false, message: "Facture introuvable" }

        // 1. Create Payment
        await prisma.payment.create({
            data: {
                factureId: data.factureId,
                amount: data.amount,
                method: data.method,
                reference: data.reference,
                date: data.date || new Date()
            }
        })

        // 2. Check totals to update Status
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount
        let newStatus = invoice.status
        if (totalPaid >= invoice.amountTTC) {
            newStatus = 'PAYEE'
        } else if (totalPaid > 0) {
            newStatus = 'PARTIELLE'
        }

        if (newStatus !== invoice.status) {
            await prisma.facture.update({
                where: { id: data.factureId },
                data: { status: newStatus }
            })
        }

        // 3. Accounting Integration
        const journalCode = (data.method === 'ESPECES') ? 'CA' : 'BQ'
        const journal = await prisma.journal.findUnique({ where: { code: journalCode } })

        if (journal) {
            // Debit Bank/Cash (521/571)
            // Credit Client (411)
            const bankAccountCode = (data.method === 'ESPECES') ? '57110000' : '52110000'

            // Ensure Bank account exists
            const bankAccount = await ensureAccount(bankAccountCode, (data.method === 'ESPECES') ? 'Caisse Principale' : 'Banque Principale', 'ACTIF')
            const clientAccount = (await prisma.account.findUnique({ where: { code: invoice.client.accountingCode || '41100000' } }))
                || (await ensureAccount('41100000', 'Clients Divers', 'ACTIF'))

            await prisma.transaction.create({
                data: {
                    journalId: journal.id,
                    description: `Paiement - Facture ${invoice.number} - ${invoice.client.name}`,
                    date: data.date || new Date(),
                    reference: data.reference || `PAY-${invoice.number}`,
                    status: 'VALIDATED',
                    lines: {
                        create: [
                            {
                                accountId: bankAccount.id,
                                debit: data.amount,
                                credit: 0
                            },
                            {
                                accountId: clientAccount.id,
                                debit: 0,
                                credit: data.amount
                            }
                        ]
                    }
                }
            })

            // Update Balances
            await incrementBalance(bankAccount.id, data.amount) // Debit increases Actif (Available Cash)
            await incrementBalance(clientAccount.id, -data.amount) // Credit decreases Actif (Receivable)
        }

        revalidatePath('/factures')
        revalidatePath(`/factures/${data.factureId}`)
        revalidatePath('/comptabilite')
        return { success: true }

    } catch (error) {
        console.error(error)
        return { success: false, message: "Erreur lors de l'enregistrement du paiement" }
    }
}

export async function updateDossierDetails(dossierId: string, data: {
    opposingParty?: string,
    opposingCounsel?: string,
    judge?: string,
    jurisdiction?: string,
    procedureType?: string,
    stage?: string,
    nextHearingDate?: Date
}) {
    try {
        await prisma.dossier.update({
            where: { id: dossierId },
            data: data
        })
        revalidatePath(`/dossiers/${dossierId}`)
        revalidatePath('/dossiers')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur lors de la mise à jour" }
    }
}

// ============ JURISPRUDENCE MANAGEMENT ============

export async function createJurisprudence(data: {
    title: string,
    court: string,
    date: Date,
    summary: string,
    reference?: string,
    type?: string,
    content?: string,
    keywords?: string[]
}) {
    try {
        await prisma.jurisprudence.create({
            data: {
                title: data.title,
                court: data.court,
                date: data.date,
                summary: data.summary,
                reference: data.reference,
                type: data.type || 'JURISPRUDENCE',
                content: data.content,
                keywords: data.keywords ? JSON.stringify(data.keywords) : '[]'
            }
        })
        revalidatePath('/recherche')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur sauvegarde" }
    }
}

export async function triggerWebWatch(keywords: string) {
    // Simulate Web Agent crawling
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock findings
    const findings = [
        {
            title: "Arrêt CCJA N° 12/2024 - Cassation rejetée",
            summary: "La Cour Commune rejette le pourvoi faute de moyen sérieux relatif à l'interprétation de l'Acte Uniforme sur les Procédures Collectives (AUPC).",
            court: "CCJA",
            date: new Date(),
            reference: "CCJA-2024-12",
            url: "https://ohada.org/recents"
        },
        {
            title: "Audience Solennelle de Rentrée 2025 - Dakar",
            summary: "Le discours du Premier Président met l'accent sur la digitalisation des procédures et le respect du délai raisonnable.",
            court: "COUR_SUPREME",
            date: new Date(),
            reference: "DISC-2025",
            url: "https://coursupreme.sn"
        }
    ]

    // Filter based on keywords if needed, for now return all
    return { success: true, findings }
}

// ============ HR MANAGEMENT ============

export async function getCollaborators() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' }
        })
        return { success: true, users }
    } catch (e) {
        return { success: false, users: [] }
    }
}

export async function getLeaveRequests() {
    try {
        const requests = await prisma.leaveRequest.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, requests }
    } catch (e) {
        return { success: false, requests: [] }
    }
}

export async function createLeaveRequest(data: {
    userId: string,
    type: string,
    startDate: Date,
    endDate: Date,
    reason: string
}) {
    try {
        await prisma.leaveRequest.create({
            data: {
                userId: data.userId,
                type: data.type,
                startDate: data.startDate,
                endDate: data.endDate,
                reason: data.reason
            }
        })
        revalidatePath('/rh')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur enregistrement demande" }
    }
}

export async function reviewLeaveRequest(id: string, status: string) {
    try {
        await prisma.leaveRequest.update({
            where: { id },
            data: { status }
        })
        revalidatePath('/rh')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

// ============ AUDIENCES ============

export async function createAudience(data: {
    title: string
    date: Date
    location?: string
    dossierId?: string
    description?: string
}) {
    try {
        await prisma.event.create({
            data: {
                title: data.title,
                startDate: data.date,
                endDate: new Date(data.date.getTime() + 60 * 60 * 1000), // Default 1h
                type: 'AUDIENCE',
                location: data.location,
                dossierId: data.dossierId,
                description: data.description
            }
        })
        revalidatePath('/audiences')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur création audience" }
    }
}

export async function getDossiersList() {
    return await prisma.dossier.findMany({
        select: { id: true, title: true, reference: true },
        orderBy: { updatedAt: 'desc' }
    })
}

// ============ TASKS MANAGEMENT ============

export async function getTasks() {
    return await prisma.task.findMany({
        include: {
            assignedTo: true,
            dossier: true
        },
        orderBy: { dueDate: 'asc' }
    })
}

export async function createTask(data: {
    title: string
    description?: string
    dossierId?: string
    assignedToId?: string
    dueDate?: Date
    priority?: string
}) {
    try {
        await prisma.task.create({
            data: {
                title: data.title,
                dossierId: data.dossierId || undefined,
                assignedToId: data.assignedToId || undefined,
                dueDate: data.dueDate,
                priority: data.priority || 'NORMAL'
            }
        })
        revalidatePath('/taches')
        return { success: true }
    } catch (error) {
        return { success: false }
    }
}

export async function toggleTask(id: string, completed: boolean) {
    await prisma.task.update({
        where: { id },
        data: { completed }
    })
    revalidatePath('/taches')
    return { success: true }
}

export async function exportDatabase() {
    // Export critical data for backup
    const data = {
        timestamp: new Date().toISOString(),
        clients: await prisma.client.findMany(),
        dossiers: await prisma.dossier.findMany(),
        factures: await prisma.facture.findMany(),
        expenses: await prisma.expense.findMany(),
        events: await prisma.event.findMany(),
        documents: await prisma.document.findMany(),
        users: await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } }) // Exclude passwords
    }
    return { success: true, data: JSON.stringify(data, null, 2) }
}
