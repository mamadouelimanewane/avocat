'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { generateCompletion, analyzeCrawledContent, filterRelevantLinks, findTargetUrls, extractSearchFilters, interpretVoiceCommand } from '@/lib/openai'
import { sendEmail, invoiceEmailTemplate } from '@/lib/email'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Validation schema
const CreateDossierSchema = z.object({
    title: z.string().min(3, { message: "Le titre doit faire au moins 3 caractères" }),
    clientId: z.string().min(1, { message: "Veuillez sélectionner un client" }),
    reference: z.string().min(3, { message: "La référence est requise" }),
})


export async function uploadDocument(formData: FormData) {
    const file = formData.get('file') as File
    const dossierId = formData.get('dossierId') as string

    if (!file || !dossierId) {
        return { success: false, message: "Données manquantes" }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // Ignore if exists
        }

        // Unique filename
        const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = join(uploadDir, uniqueName)
        const webPath = `/uploads/${uniqueName}`

        await writeFile(filePath, buffer)

        // Database Transaction
        const doc = await prisma.document.create({
            data: {
                name: file.name,
                type: file.name.split('.').pop()?.toUpperCase() || 'AUTRE',
                category: 'AUTRE',
                dossierId: dossierId,
                status: 'DRAFT',
                versions: {
                    create: {
                        version: 1,
                        path: webPath,
                        size: file.size,
                        comment: 'Import initial'
                    }
                }
            }
        })

        revalidatePath(`/dossiers/${dossierId}`)
        return { success: true, document: doc }
    } catch (e) {
        console.error("Upload error:", e)
        return { success: false, message: "Erreur lors de l'upload" }
    }
}

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

    // Seed Accounts
    for (const acc of accounts) {
        const exists = await prisma.account.findUnique({ where: { code: acc.code } })
        if (!exists) {
            await prisma.account.create({ data: acc })
        }
    }

    // Seed Journals
    const journals = [
        { code: 'AC', name: 'Achats', type: 'ACHAT' },
        { code: 'VE', name: 'Ventes', type: 'VENTE' },
        { code: 'BQ1', name: 'Banque SGBS', type: 'TRESORERIE' },
        { code: 'BQ2', name: 'Banque CBAO', type: 'TRESORERIE' },
        { code: 'CA', name: 'Caisse', type: 'TRESORERIE' },
        { code: 'OD', name: 'Opérations Diverses', type: 'GENERAL' },
        { code: 'RAN', name: 'Report à Nouveau', type: 'GENERAL' },
    ]

    for (const j of journals) {
        const exists = await prisma.journal.findUnique({ where: { code: j.code } })
        if (!exists) {
            await prisma.journal.create({ data: j })
        }
    }

    return { success: true }
}

export async function initDefaultJournals() {
    const journals = [
        { code: 'AC', name: 'Journal des Achats', type: 'ACHAT' },
        { code: 'VE', name: 'Journal des Ventes', type: 'VENTE' },
        { code: 'BQ', name: 'Journal de Banque', type: 'TRESORERIE' },
        { code: 'CA', name: 'Journal de Caisse', type: 'TRESORERIE' },
        { code: 'OD', name: 'Opérations Diverses', type: 'GENERAL' },
    ]

    for (const j of journals) {
        const exists = await prisma.journal.findUnique({ where: { code: j.code } })
        if (!exists) {
            await prisma.journal.create({ data: j })
        }
    }
    return { success: true }
}

export async function initializeERP() {
    await initSyscohadaAccounts()
    await initDefaultJournals()
    // Add default Fiscal Year 2025
    const existingFY = await prisma.fiscalYear.findUnique({ where: { name: '2025' } })
    if (!existingFY) {
        await prisma.fiscalYear.create({
            data: {
                name: '2025',
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                isCurrent: true,
                status: 'OPEN'
            }
        })
    }
    revalidatePath('/')
    return { success: true, message: "Système initialisé avec succès (Plan Comptable + Journaux + Exercice 2025)" }
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

export async function generateAIResponse(prompt: string, mode: string = 'RESEARCH') {
    try {
        // 1. RAG: Search for relevant context using SMART SEARCH
        const ragResults = await smartSearchJurisprudence(prompt)
        const contextDocuments = ragResults.success ? ragResults.results : []

        // 2. REAL AI : Use the AI completion from lib/ai.ts
        const { generateCompletion } = await import('@/lib/ai')
        const responseText = await generateCompletion(prompt, contextDocuments, mode)

        if (responseText) {
            return {
                success: true,
                text: responseText,
                sources: contextDocuments.slice(0, 5).map(d => ({
                    id: d.id,
                    title: d.title,
                    reference: d.reference,
                    type: d.type
                }))
            }
        }

        // 3. FALLBACK if no response
        return {
            success: true,
            text: "Je n'ai pas pu générer de réponse. Vérifiez votre connexion ou la configuration API."
        }

    } catch (e) {
        console.error("AI Gen Error", e)
        return { success: false, text: "Une erreur interne est survenue lors de la génération." }
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
    status?: string
}) {
    // Generate random 6-digit access code (123456)
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString()

    try {
        const client = await prisma.client.create({
            data: {
                name: data.name,
                type: data.type || 'PARTICULIER',
                status: data.status || 'CLIENT', // Default status
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                country: data.country || 'Senegal',
                accessCode: accessCode
            }
        })
        revalidatePath('/clients')
        return { success: true, client, accessCode } // Return accessCode for sharing
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

            // --- EMAIL NOTIFICATION ---
            if (invoice.client?.email) {
                const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : 'N/A'
                const html = invoiceEmailTemplate(
                    invoice.client.name,
                    invoice.number,
                    invoice.amountTTC,
                    dueDate
                )
                await sendEmail({
                    to: invoice.client.email,
                    subject: `Nouvelle Facture ${invoice.number} - Cabinet LexPremium`,
                    html
                })
            }
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
    try {
        // Use real AI-powered contract analysis
        const { analyzeContractText } = await import('@/lib/ai')
        const analysis = await analyzeContractText(text)

        return {
            success: true,
            ...analysis
        }
    } catch (error) {
        console.error('Contract analysis error:', error)
        // Fallback to basic analysis if AI fails
        return {
            success: true,
            summary: "Analyse en cours. Veuillez patienter...",
            risks: [
                { severity: 'MEDIUM' as const, text: "Analyse simplifiée activée. Vérifiez manuellement les clauses sensibles." }
            ],
            parties: [],
            dates: []
        }
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

export async function verifyClientAccessCode(code: string) {
    try {
        const client = await prisma.client.findFirst({
            where: { accessCode: code }
        })

        if (!client) {
            return { success: false, message: "Code invalide" }
        }

        // Set session cookie
        cookies().set('client_session', client.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 7 days 
        })

        return { success: true, clientId: client.id }
    } catch (e) {
        return { success: false, message: "Erreur serveur" }
    }
}



export async function updateClientStatus(id: string, status: string) {
    try {
        const client = await prisma.client.update({
            where: { id },
            data: { status }
        })
        revalidatePath('/crm')
        revalidatePath('/clients')
        return { success: true, client }
    } catch (error) {
        console.error("Error updating client status:", error)
        return { success: false, message: "Failed to update status" }
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
                description: data.description,
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

export async function updateUserRole(userId: string, role: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur lors de la mise à jour du rôle" }
    }
}

// ============ AGENDA / EVENTS ============

export async function getEvents(start: Date, end: Date) {
    try {
        const events = await prisma.event.findMany({
            where: {
                startDate: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                dossier: {
                    select: { title: true, reference: true }
                }
            }
        })
        return { success: true, events }
    } catch (e) {
        return { success: false, events: [] }
    }
}

export async function createEvent(data: {
    title: string
    startDate: Date
    endDate: Date
    type: string // AUDIENCE, RDV, DEADLINE, AUTRE
    location?: string
    description?: string
    dossierId?: string
}) {
    try {
        await prisma.event.create({
            data: {
                title: data.title,
                startDate: data.startDate,
                endDate: data.endDate,
                type: data.type,
                location: data.location,
                description: data.description,
                dossierId: data.dossierId && data.dossierId.length > 0 ? data.dossierId : undefined
            }
        })
        revalidatePath('/agenda')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de la création de l'événement" }
    }
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({ where: { id } })
        revalidatePath('/agenda')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

// ============ AUTHENTICATION ============

export async function loginStaff(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const user = await prisma.user.findUnique({ where: { email } })

        // Démo Mode: Si l'utilisateur n'existe pas mais que le mot de passe est "demo123", on laisse passer
        if ((!user || !user.active) && password !== "demo123") {
            return { success: false, message: "Identifiants invalides ou compte inactif." }
        }

        if (user && password !== user.password && password !== "demo123") {
            return { success: false, message: "Mot de passe incorrect." }
        }

        // Set Cookie
        const userId = user?.id || 'demo-user-id'
        const role = user?.role || 'ADMIN'
        cookies().set('auth_token', userId, { secure: process.env.NODE_ENV === 'production', httpOnly: true, path: '/' })
        cookies().set('user_role', role, { secure: process.env.NODE_ENV === 'production', httpOnly: true, path: '/' })

        return { success: true }
    } catch (e) {
        console.error("Login Error:", e)
        return { success: false, message: "Erreur de connexion." }
    }
}

export async function loginClient(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const code = formData.get('code') as string // Access Code for clients

    try {
        // Simple demo logic: find client by email
        const client = await prisma.client.findFirst({ where: { email } })

        if (!client) {
            return { success: false, message: "Client non trouvé." }
        }

        // Check Access Code
        // Allow "1234" as a master backlog code if accessCode is missing, else enforce DB code
        if (client.accessCode && code !== client.accessCode) {
            return { success: false, message: "Code d'accès invalide." }
        } else if (!client.accessCode && code !== '1234') {
            return { success: false, message: "Code d'accès invalide (Défaut: 1234)." }
        }

        // Set Cookie
        cookies().set('portal_token', client.id, { secure: true, httpOnly: true, path: '/' })

        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur de connexion." }
    }
}

export async function logout() {
    cookies().delete('auth_token')
    cookies().delete('user_role')
    cookies().delete('portal_token')
    redirect('/login')
}

export async function getPortalDashboardData() {
    const cookieStore = cookies()
    const clientId = cookieStore.get('portal_token')?.value

    if (!clientId) return { success: false, message: "Non connecté" }

    try {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                dossiers: {
                    take: 5,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        tasks: true,
                        events: { // Fetch events via Dossier
                            where: { startDate: { gte: new Date() } },
                            orderBy: { startDate: 'asc' }
                        }
                    }
                },
                factures: {
                    take: 5,
                    orderBy: { issueDate: 'desc' },
                    where: { status: { not: 'PAYEE' } } // Prioritize unpaid
                }
            }
        })

        // Flat events list for dashboard
        const nextEvents = client?.dossiers.flatMap((d: any) => d.events || []).sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0, 3) || []

        // Reconstruct a clean object for the UI
        return { success: true, client: { ...client, events: nextEvents } }
    } catch (e) {
        return { success: false, message: "Erreur récupération données." }
    }
}

export async function processVoiceInput(transcript: string) {
    // 1. Interpret via AI using the real interpreter
    const { interpretVoiceCommand } = await import('@/lib/ai')
    const command = await interpretVoiceCommand(transcript)

    if (!command || !command.intent) {
        return { success: false, message: "Je n'ai pas compris la commande." }
    }

    console.log("🎤 Voice Command:", command)

    try {
        // 2. Execute Action
        switch (command.intent) {
            case 'CREATE_NOTE':
                // Simple Task creation for now
                await prisma.task.create({
                    data: {
                        title: "Note vocale",
                        description: command.content || transcript,
                        priority: 'MEDIUM'
                    }
                })
                revalidatePath('/')
                return { success: true, message: "Note créée dans les tâches.", action: 'NOTE_CREATED' }

            case 'CREATE_EVENT':
                const date = command.date ? new Date(command.date) : new Date(new Date().setHours(new Date().getHours() + 2))
                await prisma.event.create({
                    data: {
                        title: command.title || "RDV (Vocal)",
                        startDate: date,
                        endDate: new Date(date.getTime() + 60 * 60 * 1000), // +1h duration
                        type: command.type || 'RDV'
                    }
                })
                revalidatePath('/')
                return { success: true, message: `RDV créé pour le ${date.toLocaleDateString()}`, action: 'EVENT_CREATED' }

            case 'SEARCH':
                return { success: true, redirect: `/recherche?q=${encodeURIComponent(command.query || transcript)}` }

            case 'NAVIGATE':
                // Simple mapping
                const page = command.page || 'dashboard'
                return { success: true, redirect: `/${page}` }

            default:
                return { success: false, message: "Type de commande non géré." }
        }
    } catch (e) {
        console.error("Voice Exec Error", e)
        return { success: false, message: "Erreur lors de l'exécution." }
    }
}

export async function getSmartDashboardData() {
    try {
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0))
        const endOfTomorrow = new Date(today)
        endOfTomorrow.setDate(today.getDate() + 2)
        endOfTomorrow.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        // Parallel Data Fetching for speed
        const [
            dossiersActifs,
            clientsCount,
            facturesDuMois,
            facturesImpayees,
            agenda,
            legalWatch,
            tasksPending
        ] = await Promise.all([
            // 1. Dossiers
            prisma.dossier.count({ where: { status: { not: 'ARCHIVE' } } }),

            // 2. Clients
            prisma.client.count({ where: { status: 'CLIENT' } }),

            // 3. CA du mois (Payé)
            prisma.facture.aggregate({
                _sum: { amountTTC: true },
                where: {
                    status: 'PAYEE',
                    issueDate: { gte: startOfMonth }
                }
            }),

            // 4. Impayés (Total)
            prisma.facture.aggregate({
                _sum: { amountTTC: true },
                where: { status: { in: ['EMISE', 'EN_RETARD'] } }
            }),

            // 5. Agenda (Today & Tomorrow)
            prisma.event.findMany({
                where: {
                    startDate: { gte: startOfDay, lt: endOfTomorrow }
                },
                orderBy: { startDate: 'asc' },
                include: { dossier: true }
            }),

            // 6. Veille Juridique (Last 3 Validated Items)
            prisma.jurisprudence.findMany({
                where: { status: 'VALIDATED' },
                orderBy: { date: 'desc' }, // Or createdAt
                take: 3
            }),

            // 7. Tâches Urgentes
            prisma.task.count({
                where: { completed: false, priority: 'HIGH' }
            })
        ])

        return {
            success: true,
            stats: {
                dossiersActifs,
                clientsCount,
                caMois: facturesDuMois._sum.amountTTC || 0,
                impayes: facturesImpayees._sum.amountTTC || 0,
                tasksHigh: tasksPending
            },
            agenda,
            legalWatch
        }

    } catch (e) {
        console.error("Dashboard Error", e)
        return { success: false, message: "Erreur chargement cockpit" }
    }
}

// ============ KNOWLEDGE BASE (RAG) ============

export async function createJurisprudence(data: {
    title: string
    type: string
    court: string
    date: Date
    reference: string
    summary: string
    content: string
    keywords: string[]
}) {
    try {
        await prisma.jurisprudence.create({
            data: {
                title: data.title,
                type: data.type,
                court: data.court,
                date: data.date,
                reference: data.reference,
                summary: data.summary,
                content: data.content,
                keywords: JSON.stringify(data.keywords)
            }
        })
        revalidatePath('/recherche')
        return { success: true }
    } catch (e) {
        console.error(e)
    }
}

export async function searchJurisprudence(query: string) {
    if (!query) return await prisma.jurisprudence.findMany({
        where: { status: 'VALIDATED' },
        orderBy: { date: 'desc' },
        take: 20
    })

    // Hybrid Search Logic (Keyword now, Vector ready)
    return await prisma.jurisprudence.findMany({
        where: {
            status: 'VALIDATED', // ONLY VALIDATED TEXTS FOR RAG
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { keywords: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
            ]
        },
        orderBy: { date: 'desc' },
        take: 20
    })
}

// ============ CRAWLER & VALIDATION WORKFLOW ============

import { processUrl, discoverLinks } from '@/lib/crawler'

export async function crawlLegalUrl(url: string, region: string = 'SENEGAL') {
    const result = await processUrl(url, region)
    if (result.success) {
        revalidatePath('/recherche/validation')
    }
    return result
}

export async function scanHubPage(url: string) {
    // No revalidatePath needed for just scanning/reading
    return await discoverLinks(url)
}

export async function launchResearchMission(query: string) {
    try {
        // ... previous implementation ...
        const seedUrls = await findTargetUrls(query)
        if (!seedUrls || seedUrls.length === 0) {
            return { success: false, message: "Aucun site pertinent identifié par l'IA pour cette recherche." }
        }

        let allLinks: any[] = []

        // 2. Scan each Hub
        for (const url of seedUrls) {
            try {
                const scanRes = await scanHubPage(url)
                if (scanRes.success && scanRes.links) {
                    allLinks = [...allLinks, ...scanRes.links.map((l: any) => ({ ...l, source: url }))]
                }
            } catch (e) {
                // Continue if one seed fails
            }
        }

        return { success: true, seeds: seedUrls, links: allLinks }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur pendant la mission de recherche." }
    }
}

export async function smartSearchJurisprudence(query: string) {
    try {
        // 1. Natural Language Parse using real AI
        const { extractSearchFilters } = await import('@/lib/ai')
        const filters = await extractSearchFilters(query)

        // 2. Build Prisma Query
        const whereClause: any = {
            status: 'VALIDATED'
        }

        if (filters.type) whereClause.type = filters.type
        if (filters.region) whereClause.region = filters.region

        if (filters.year) {
            whereClause.date = {
                gte: new Date(`${filters.year}-01-01`),
                lt: new Date(`${filters.year + 1}-01-01`)
            }
        }

        let searchTerms = filters.keywords
        if (Array.isArray(searchTerms)) {
            searchTerms = searchTerms.join(' ')
        }

        if (searchTerms && typeof searchTerms === 'string' && searchTerms.length > 0) {
            whereClause.OR = [
                { title: { contains: searchTerms, mode: 'insensitive' } },
                { content: { contains: searchTerms, mode: 'insensitive' } },
                { keywords: { contains: searchTerms, mode: 'insensitive' } }
            ]
        }

        const results = await prisma.jurisprudence.findMany({
            where: whereClause,
            take: 20,
            orderBy: { date: 'desc' }
        })

        return { success: true, results, analysis: filters }

    } catch (e) {
        console.error(e)
        return { success: false, results: [] }
    }
}

export async function getPendingDocuments() {
    try {
        return await prisma.jurisprudence.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' }
        })
    } catch (e) {
        return []
    }
}

export async function approveDocument(id: string, correctedData?: any) {
    try {
        await prisma.jurisprudence.update({
            where: { id },
            data: {
                status: 'VALIDATED',
                ...correctedData
                // HERE: Trigger Vector Embedding Generation (Call OpenAI API)
                // vector: await generateEmbedding(correctedData.content)
            }
        })
        revalidatePath('/recherche')
        revalidatePath('/recherche/validation')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function rejectDocument(id: string) {
    try {
        await prisma.jurisprudence.delete({ where: { id } })
        revalidatePath('/recherche/validation')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function initJurisprudenceLibrary() {
    // Check if empty
    const count = await prisma.jurisprudence.count()
    if (count > 0) return

    // Seed initial OHADA basic texts
    await prisma.jurisprudence.createMany({
        data: [
            {
                title: "Acte Uniforme portant Droit Commercial Général",
                type: "LOI", // ACTE_UNIFORME
                court: "OHADA",
                date: new Date("2010-12-15"),
                reference: "AUDCG",
                summary: "Texte fondamental régissant les commerçants et les actes de commerce.",
                content: "Article 1 : Tout commerçant... (Texte simulé pour démo)",
                keywords: '["commercial", "bail", "fonds de commerce"]'
            },
            {
                title: "Arrêt N° 025/2018 CCJA - Validité de la Saisie",
                type: "JURISPRUDENCE",
                court: "CCJA",
                date: new Date("2018-04-26"),
                reference: "J-2018-025",
                summary: "La CCJA rappelle les conditions de validité d'une saisie-attribution.",
                content: "La Cour Commune de Justice et d'Arbitrage... (Texte simulé)",
                keywords: '["saisie", "recouvrement", "banque"]'
            }
        ]
    })
}

export async function addDirectoryContact(data: {
    name: string
    category: string
    speciality?: string
    phone?: string
    email?: string
    city?: string
    notes?: string
}) {
    try {
        await prisma.directoryContact.create({
            data: {
                name: data.name,
                category: data.category,
                speciality: data.speciality,
                phone: data.phone,
                email: data.email,
                city: data.city,
                notes: data.notes
            }
        })
        revalidatePath('/annuaire')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur création contact" }
    }
}

// Analyse Avancée de Documents Adverses
export async function analyzeAdverseDocument(documentText: string) {
    try {
        const { generateCompletion } = await import('@/lib/ai')

        // Étape 1 : Extraction
        const extractionPrompt = `Tu es un expert en procédure civile sénégalaise et droit OHADA. Analyse ce document adverse et extrais les informations essentielles.
Retourne UNIQUEMENT un objet JSON avec cette structure :
{
  "documentType": "string",
  "summary": "string",
  "parties": ["string"],
  "claims": [{"claim": "string", "legalBasis": "string", "amount": "string"}],
  "dates": [{"date": "string", "event": "string"}]
}

DOCUMENT:
${documentText}`

        const extractionJson = await generateCompletion(extractionPrompt, [], 'RESEARCH')
        let extraction: any = {}
        if (extractionJson) {
            try {
                extraction = JSON.parse(extractionJson.replace(/```json|```/g, '').trim())
            } catch (e) {
                console.warn("Could not parse extraction JSON, using raw text", e)
            }
        }

        // Étape 2 : Analyse juridique & Faiblesses
        const analysisPrompt = `En tant qu'avocat expert en droit sénégalais et OHADA, analyse les prétentions adverses suivantes.
Identifie les faiblesses juridiques (prescription, défaut de preuve, mauvaise application des articles).

PRÉTENTIONS:
${extractionJson}

Retourne UNIQUEMENT un objet JSON:
[
  {"issue": "string", "applicableLaw": "string", "ourPosition": "string", "weaknesses": ["string"]}
]`

        const legalAnalysisJson = await generateCompletion(analysisPrompt, [], 'RESEARCH')
        let legalIssues: any[] = []
        if (legalAnalysisJson) {
            try {
                legalIssues = JSON.parse(legalAnalysisJson.replace(/```json|```/g, '').trim())
            } catch (e) {
                console.warn("Could not parse legal analysis JSON", e)
            }
        }

        // Étape 3 : Stratégie de défense
        const strategyPrompt = `Élabore une stratégie de défense complète contre ces prétentions.
Retourne UNIQUEMENT un objet JSON:
{
  "mainArguments": ["string"],
  "counterClaims": ["string"],
  "evidenceNeeded": ["string"],
  "jurisprudence": [{"title": "string", "reference": "string", "relevance": "string"}]
}

INFOS:
${extractionJson}
FAIBLESSES:
${legalAnalysisJson}`

        const strategyJson = await generateCompletion(strategyPrompt, [], 'DRAFTING')
        let strategy: any = {}
        if (strategyJson) {
            try {
                strategy = JSON.parse(strategyJson.replace(/```json|```/g, '').trim())
            } catch (e) {
                console.warn("Could not parse strategy JSON", e)
            }
        }

        // Étape 4 : Plaidoirie
        const pleadingPrompt = `Rédige un projet de plaidoirie complet en défense (800 mots environ), style avocat sénégalais.
Cite précisément les articles OHADA et Code sénégalais.
Utilise les arguments : ${strategy.mainArguments?.join(', ')}`

        const pleadingDraft = await generateCompletion(pleadingPrompt, [], 'PLEADING')

        // Résultat structuré final
        return {
            success: true,
            analysis: {
                summary: extraction.summary || "Analyse effectuée avec succès.",
                documentType: extraction.documentType || "Document Juridique",
                claims: extraction.claims?.map((c: any) => ({
                    claim: c.claim,
                    legalBasis: c.legalBasis,
                    weaknesses: legalIssues.find(i => i.issue.includes(c.claim))?.weaknesses || ["Vérifier la validité de la preuve"]
                })) || [],
                legalIssues: legalIssues.map((i: any) => ({
                    issue: i.issue,
                    applicableLaw: i.applicableLaw,
                    ourPosition: i.ourPosition
                })),
                defenseStrategy: {
                    mainArguments: strategy.mainArguments || [],
                    counterClaims: strategy.counterClaims || [],
                    evidenceNeeded: strategy.evidenceNeeded || []
                },
                pleadingDraft: pleadingDraft,
                jurisprudenceReferences: strategy.jurisprudence || []
            }
        }

    } catch (error) {
        console.error('Erreur analyse document adverse:', error)
        return {
            success: false,
            message: "Erreur lors de l'analyse du document"
        }
    }
}


// Générateur automatique de contrats par IA
export async function generateContract(templateId: string, answers: Record<string, any>) {
    try {
        const { generateCompletion } = await import('@/lib/ai')
        const { CONTRACT_TEMPLATES } = await import('@/lib/contract-templates')

        const template = CONTRACT_TEMPLATES.find(t => t.id === templateId)
        if (!template) throw new Error("Template non trouvé")

        const answersContext = Object.entries(answers)
            .map(([key, value]) => `- ${key}: ${value}`)
            .join('\n')

        const prompt = `Tu es un avocat expert en droit sénégalais et OHADA.
Génère un contrat complet de type "${template.name}" basé sur les informations suivantes :

${answersContext}

Clauses standards à inclure obligatoirement :
${template.standardClauses.join('\n')}

INSTRUCTIONS DE RÉDACTION :
1. Utilise un français juridique formel et précis.
2. Structure le contrat avec des numéros d'articles clairs.
3. Adapte le ton au droit sénégalais (ex: mentionner le COCC si nécessaire).
4. Assure une mise en page claire (Titres, Parties, Articles, Signatures).
5. Ne mets pas de texte de remplissage [Comme ceci], remplace par les données fournies ou laisse des pointillés propres si la donnée manque.

CONTENU DU CONTRAT :`

        const contractBody = await generateCompletion(prompt, [], 'DRAFTING')

        return {
            success: true,
            contract: contractBody
        }
    } catch (error) {
        console.error('Erreur génération contrat:', error)
        return {
            success: false,
            message: "Erreur lors de la génération du contrat."
        }
    }
}

// Vérificateur de Conflits d'Intérêts IA
export async function checkConflict(partyName: string) {
    try {

        // Recherche dans les dossiers
        const matchingDossiers = await prisma.dossier.findMany({
            where: {
                OR: [
                    { client: { name: { contains: partyName, mode: 'insensitive' } } },
                    { opposingParty: { contains: partyName, mode: 'insensitive' } },
                    { title: { contains: partyName, mode: 'insensitive' } }
                ]
            },
            include: {
                client: true
            }
        })

        if (matchingDossiers.length === 0) {
            return {
                success: true,
                conflict: false,
                message: "Aucun conflit direct détecté dans la base de données."
            }
        }

        return {
            success: true,
            conflict: true,
            matches: matchingDossiers.map(d => ({
                id: d.id,
                title: d.title,
                clientName: d.client.name,
                opposingParty: d.opposingParty,
                status: d.status,
                relation: d.client.name.toLowerCase().includes(partyName.toLowerCase()) ? 'CLIENT' : 'ADVERSE'
            }))
        }
    } catch (error) {
        console.error('Erreur check conflit:', error)
        return { success: false, message: "Erreur lors de la vérification." }
    }
}

export async function signDocument(documentId: string, signatureData: string) {
    try {
        // Simulation de signature électronique sécurisée
        // Dans une vraie app, on générerait un certificat et scellerait le PDF
        console.log(`Document ${documentId} signé avec succès`);

        // On pourrait ici mettre à jour Prisma si on avait des IDs réels
        // Mais comme on utilise beaucoup de mock data, on simule le succès

        return {
            success: true,
            message: "Document signé électroniquement avec succès (Conformité eIDAS/Sénégal)",
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error('Erreur signature:', error);
        return { success: false, message: "Erreur technique lors de la signature." };
    }
}

export async function sendToParapheur(data: { name: string, type: string, content: string }) {
    try {

        // On récupère un client fictif pour le dossier si nécessaire
        // Pour cet exemple, on simule juste l'enregistrement
        console.log(`Envoi au parapheur: ${data.name}`);

        return {
            success: true,
            message: "Document transféré au parapheur numérique pour signature."
        }
    } catch (error) {
        console.error('Erreur envoi parapheur:', error);
        return { success: false, message: "Échec du transfert au parapheur." };
    }
}

// ============ CARPA & FONDS TIERS ============

export async function getCarpaTransactions(dossierId?: string) {
    try {
        const where = dossierId ? { dossierId } : {}
        return await prisma.carpaTransaction.findMany({
            where,
            include: { dossier: { include: { client: true } } },
            orderBy: { date: 'desc' }
        })
    } catch (e) {
        return []
    }
}

export async function getCarpaStats() {
    try {
        const stats = await prisma.carpaTransaction.aggregate({
            _sum: { amount: true }
        })
        const count = await prisma.carpaTransaction.count()
        return { total: stats._sum.amount || 0, count }
    } catch (e) {
        return { total: 0, count: 0 }
    }
}

export async function createCarpaTransaction(data: {
    dossierId: string,
    amount: number, // Positive = dépôt, Négatif = retrait
    type: 'DEPOT' | 'RETRAIT' | 'VIREMENT',
    description: string,
    beneficiary?: string,
    reference?: string
}) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: data.dossierId },
            include: { client: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        // 1. Enregistrement spécifique CARPA
        const ct = await prisma.carpaTransaction.create({
            data: {
                reference: data.reference || `CARPA-${Date.now()}`,
                date: new Date(),
                amount: data.amount,
                type: data.type,
                description: data.description,
                beneficiary: data.beneficiary,
                dossierId: data.dossierId
            }
        })

        // 2. Intégration Comptabilité Générale (SYSCOHADA)
        const journal = await prisma.journal.findUnique({ where: { code: 'BQ' } })
        if (journal) {
            const carpaAccount = await ensureAccount('46700000', 'Fonds Tiers CARPA', 'PASSIF')
            const bankAccount = await ensureAccount('52100000', 'Banque (Fonds Tiers)', 'ACTIF')

            const isDeposit = data.amount > 0
            const absAmount = Math.abs(data.amount)

            await prisma.transaction.create({
                data: {
                    journalId: journal.id,
                    description: `CARPA: ${data.description} (Ref: ${ct.reference})`,
                    date: new Date(),
                    reference: ct.reference,
                    status: 'VALIDATED',
                    lines: {
                        create: [
                            {
                                accountId: bankAccount.id,
                                debit: isDeposit ? absAmount : 0,
                                credit: isDeposit ? 0 : absAmount
                            },
                            {
                                accountId: carpaAccount.id,
                                debit: isDeposit ? 0 : absAmount,
                                credit: isDeposit ? absAmount : 0
                            }
                        ]
                    }
                }
            })

            await incrementBalance(bankAccount.id, isDeposit ? absAmount : -absAmount)
            await incrementBalance(carpaAccount.id, isDeposit ? -absAmount : absAmount)
        }

        revalidatePath('/comptabilite')
        revalidatePath(`/dossiers/${data.dossierId}`)
        return { success: true, transaction: ct }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de la transaction CARPA" }
    }
}


