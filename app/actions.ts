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

export async function getAccounts() {
    return await prisma.account.findMany({ orderBy: { code: 'asc' } })
}

export async function createTransaction(description: string, date: Date, lines: any[]) {
    // Basic double-entry validation
    const debit = lines.reduce((s, l) => s + (l.debit || 0), 0)
    const credit = lines.reduce((s, l) => s + (l.credit || 0), 0)

    if (Math.abs(debit - credit) > 0.01) {
        return { success: false, message: 'Écriture déséquilibrée (Débit != Crédit)' }
    }

    try {
        // Create Transaction Header
        const tx = await prisma.transaction.create({
            data: {
                description,
                date: new Date(date),
                status: 'VALIDATED'
            }
        })

        // Create Lines & Update Balances
        for (let line of lines) {
            await prisma.transactionLine.create({
                data: {
                    transactionId: tx.id,
                    accountId: line.accountId,
                    debit: parseFloat(line.debit || 0),
                    credit: parseFloat(line.credit || 0)
                }
            })

            const acc = await prisma.account.findUnique({ where: { id: line.accountId } })
            if (acc) {
                // Simplistic balance update rule
                let newBal = acc.balance
                if (acc.type === 'ACTIF' || acc.type === 'CHARGE') {
                    newBal = newBal + parseFloat(line.debit || 0) - parseFloat(line.credit || 0)
                } else {
                    newBal = newBal + parseFloat(line.credit || 0) - parseFloat(line.debit || 0)
                }
                await prisma.account.update({ where: { id: line.accountId }, data: { balance: newBal } })
            }
        }

        revalidatePath('/comptabilite')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur base de données" }
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
        text = `Voici une proposition de rédaction pour votre clause :\n\n"ARTICLE X - OBJET\n\nLes parties soussignées conviennent expressément, par la présente, de [ACTION/OBJET] conformément aux dispositions des articles [ARTICLES] du Code des Obligations Civiles et Commerciales (COCC)...\n\nCette clause reste soumise à l'appréciation souveraine des juges du fond en cas de litige."`;
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
        await prisma.facture.update({
            where: { id: invoiceId },
            data: { status }
        })
        revalidatePath('/factures')
        return { success: true }
    } catch (error) {
        return { success: false, message: 'Erreur lors de la mise à jour' }
    }
}

// ============ EXPENSE MANAGEMENT ============

export async function createExpense(data: {
    dossierId: string
    description: string
    amount: number
    category: string
    date?: Date
}) {
    try {
        const expense = await prisma.expense.create({
            data: {
                dossierId: data.dossierId,
                description: data.description,
                amount: data.amount,
                category: data.category,
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
