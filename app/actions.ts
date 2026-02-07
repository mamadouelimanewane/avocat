'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { generateCompletion, analyzeCrawledContent, filterRelevantLinks, findTargetUrls, extractSearchFilters, interpretVoiceCommand, classifyDocument, openai, predictCaseOutcome, analyzeAdverseDocumentStrategy } from '@/lib/openai'
import { sendEmail, invoiceEmailTemplate, deadlineAlertEmailTemplate, paymentReminderEmailTemplate, clientAccessEmailTemplate } from '@/lib/email'
import { sendWhatsApp, formatDeadlineWhatsAppMessage, formatClientAccessWhatsAppMessage } from '@/lib/whatsapp'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { join } from 'path'
import mammoth from 'mammoth'
import { createWorker } from 'tesseract.js'
import bcrypt from 'bcryptjs'

// --- NOTES MANAGEMENT ---

export async function createNote(data: any) {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get('auth_token')?.value
        if (!userId) return { success: false, message: "Non connecté" }

        await prisma.note.create({
            data: {
                title: data.title || (data.type === 'AUDIO' ? 'Note Audio' : 'Sans titre'),
                content: data.content,
                audioContent: data.audioContent,
                type: data.type || 'TEXT',
                color: data.color || 'blue',
                isPinned: data.isPinned || false,
                userId: userId,
                tags: JSON.stringify(data.tags || [])
            }
        })
        revalidatePath('/notes')
        return { success: true }
    } catch (e) {
        console.error("Create note error:", e)
        return { success: false, message: "Erreur lors de la création de la note" }
    }
}

export async function getUserNotes() {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get('auth_token')?.value
        if (!userId) return []

        return await prisma.note.findMany({
            where: { userId },
            orderBy: [
                { isPinned: 'desc' },
                { updatedAt: 'desc' }
            ]
        })
    } catch (e) {
        return []
    }
}

export async function deleteNote(noteId: string) {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get('auth_token')?.value
        if (!userId) return { success: false, message: "Non connecté" }

        await prisma.note.delete({
            where: { id: noteId, userId } // Ensure ownership
        })
        revalidatePath('/notes')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur suppression" }
    }
}

export async function updateNote(noteId: string, data: any) {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get('auth_token')?.value
        if (!userId) return { success: false }

        await prisma.note.update({
            where: { id: noteId, userId },
            data: {
                ...data, // Allow updating any field passed
                tags: data.tags ? JSON.stringify(data.tags) : undefined
            }
        })
        revalidatePath('/notes')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

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

export async function runOCR(documentId: string) {
    try {
        const doc = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                versions: { orderBy: { version: 'desc' }, take: 1 },
                dossier: { include: { assignedTo: true } }
            }
        })

        if (!doc || !doc.versions?.[0]) {
            return { success: false, message: "Document non trouvé" }
        }

        const latestVersion = doc.versions[0]
        const absolutePath = join(process.cwd(), 'public', latestVersion.path)
        const fileBuffer = await readFile(absolutePath)
        const extension = doc.name.split('.').pop()?.toLowerCase() || ''

        // --- NEW OCR ENGINE INTEGRATION (Tesseract + PDFParse) ---
        // Dynamically import to avoid server-side bundling issues if any
        const { extractTextFromPDF, extractTextFromImage, improveOCRText } = await import('@/lib/ocr')
        const mammoth = await import('mammoth')

        let extractedText = ""
        let status = "DONE"
        let confidence = 0

        console.log(`[OCR PIPELINE] Processing ${doc.name} (${extension})...`)

        try {
            if (extension === 'pdf') {
                const result = await extractTextFromPDF(fileBuffer)
                if (result.success) {
                    extractedText = result.text
                    confidence = result.confidence
                } else {
                    extractedText = result.error || "Erreur extraction PDF"
                    status = "FAILED"
                }

                // If PDF text is very short/garbage, it might be a scan.
                // In a V2 we would convert PDF pages to images here and run Tesseract.
                if (status === "DONE" && extractedText.length < 50) {
                    extractedText += "\n\n[NOTE: Ce document semble être un scan image. Pour une analyse complète, veuillez le convertir en JPG/PNG.]"
                    status = "REQUIRES_FIX"
                }

            } else if (['png', 'jpg', 'jpeg', 'tiff', 'bmp'].includes(extension)) {
                const result = await extractTextFromImage(fileBuffer)
                if (result.success) {
                    extractedText = improveOCRText(result.text) // Apply specific legal french corrections
                    confidence = result.confidence
                } else {
                    extractedText = result.error || "Erreur OCR Image"
                    status = "FAILED"
                }
            } else if (extension === 'docx') {
                const result = await mammoth.extractRawText({ buffer: fileBuffer })
                extractedText = result.value
            } else if (extension === 'txt') {
                extractedText = fileBuffer.toString('utf-8')
            } else {
                extractedText = "[Format non supporté pour l'OCR automatique]"
                status = "SKIPPED"
            }
        } catch (error: any) {
            console.error("Critical OCR Pipeline Error:", error)
            extractedText = `Erreur critique lors de l'analyse: ${error.message}`
            status = "FAILED"
        }

        console.log(`[OCR PIPELINE] Result: ${status}, Length: ${extractedText.length}, Conf: ${confidence}`)

        // Auto-Classification with AI (Existing Logic Preserved)
        let updates: any = {
            ocrContent: extractedText,
            ocrStatus: status
        }

        if (status === "DONE" && extractedText.trim().length > 20) {
            const classification = await classifyDocument(extractedText)
            if (classification) {
                updates.category = classification.category
                updates.folder = classification.folder
                updates.tags = JSON.stringify(classification.tags)

                // --- NEW : ANALYSE JURIDIQUE PROFONDE SI CONTRAT ---
                if (classification.category === 'ACTE' || extractedText.toLowerCase().includes('contrat')) {
                    const { analyzeContractText } = await import('@/lib/ai')
                    const analysis = await analyzeContractText(extractedText)

                    // Stocker l'analyse dans le contenu OCR ou des métadonnées étendues
                    updates.ocrContent = `[ANALYSE LEXAI]\nRésumé: ${analysis.summary}\n\nRisques:\n${analysis.risks.map(r => `- [${r.severity}] ${r.text}`).join('\n')}\n\n--- TEXTE BRUT ---\n${extractedText}`
                }

                // Handle Detected Deadline
                if (classification.detectedDeadline) {
                    const { date, type, reason } = classification.detectedDeadline
                    try {
                        await prisma.event.create({
                            data: {
                                title: `[IA] ${type} : ${reason}`,
                                description: `Alerte générée automatiquement par LexAI après analyse du document "${doc.name}"`,
                                startDate: new Date(date),
                                endDate: new Date(new Date(date).getTime() + 3600000), // +1h
                                type: type === 'CONVOCATION' ? 'AUDIENCE' : 'ECHEANCE',
                                dossierId: doc.dossierId
                            }
                        })

                        // 🔔 TRIGGER NOTIFICATIONS (Mobile & Email)
                        if (doc.dossier.assignedTo) {
                            const lawyer = doc.dossier.assignedTo
                            const dateStr = new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

                            // 1. Email Alert
                            await sendEmail({
                                to: lawyer.email,
                                subject: `🚨 ALERTE LEXAI : ${type} détectée`,
                                html: deadlineAlertEmailTemplate(
                                    lawyer.name || 'Maître',
                                    doc.name,
                                    type,
                                    dateStr,
                                    reason,
                                    doc.dossier.title
                                )
                            })

                            // 2. WhatsApp Alert
                            // Use a placeholder number if no phone is set for the lawyer
                            const phone = "221770000000" // Simulated or lawyer.phone if role exists
                            await sendWhatsApp({
                                phone: phone,
                                message: formatDeadlineWhatsAppMessage(
                                    lawyer.name || 'Maître',
                                    doc.dossier.title,
                                    type,
                                    dateStr,
                                    reason
                                )
                            })
                        }
                    } catch (err) {
                        console.error("Auto-Event Creation Error:", err)
                    }
                }
            }
        }

        await prisma.document.update({
            where: { id: documentId },
            data: updates
        })

        revalidatePath(`/dossiers/${doc.dossierId}`)
        return {
            success: true,
            text: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
            category: updates.category
        }

    } catch (error) {
        console.error("OCR Error:", error)
        return { success: false, message: "Erreur lors du traitement OCR" }
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
        // 1. Fetch Template (Flexible lookup for demo)
        let template;
        if (templateId.length === 24) {
            template = await prisma.template.findUnique({ where: { id: templateId } })
        }

        if (!template) {
            // Fallback for demo: find by partial name match if ID is a slug
            template = await prisma.template.findFirst({
                where: {
                    OR: [
                        { name: { contains: templateId.split('_').pop() || '', mode: 'insensitive' } },
                        { category: { contains: templateId.split('_')[1] || '', mode: 'insensitive' } }
                    ]
                }
            })
        }

        if (!template) throw new Error("Modèle introuvable")

        // 2. Merge Content
        let content = template.content
        Object.entries(values).forEach(([key, value]) => {
            // Replace {{key}}
            const regex = new RegExp(`{{${key}}}`, 'g')
            content = content.replace(regex, value)
        })

        // 3. Generate Real File & Create Record
        const fileName = `${template.name.replace(/\s+/g, '_')}_${Date.now()}.txt`
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        const filePath = join(uploadDir, fileName)
        const webPath = `/uploads/${fileName}`

        try {
            await mkdir(uploadDir, { recursive: true })
            await writeFile(filePath, content)
        } catch (e) {
            console.error("File write error:", e)
        }

        const newDoc = await prisma.document.create({
            data: {
                name: `${template.name} - Généré.txt`,
                type: 'ACTE',
                category: template.category || 'AUTRE',
                status: 'DRAFT',
                dossierId: dossierId,
                ocrContent: content,
                versions: {
                    create: {
                        version: 1,
                        size: Buffer.byteLength(content, 'utf8'),
                        path: webPath,
                        comment: 'Généré automatiquement depuis le modèle ' + template.name,
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

export async function generateAIDocument(dossierId: string, description: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { client: true }
        })

        const otherDocs = await prisma.document.findMany({
            where: {
                dossierId: dossierId,
                ocrContent: { not: null }
            },
            select: { name: true, ocrContent: true, category: true }
        })

        const contextDocs = otherDocs.map((d: any) => ({
            title: d.name,
            content: d.ocrContent,
            reference: d.category || 'DOCUMENT'
        }))

        const prompt = `Rédige un brouillon de document juridique pour le dossier suivant :
        Titre du dossier : ${dossier?.title}
        Référence : ${dossier?.reference}
        Client : ${dossier?.client?.name}
        
        Description du document demandée par l'avocat : "${description}"
        
        CONSIGNE : Utilise les informations des documents déjà présents dans le dossier (fournis en contexte) pour être le plus précis possible (noms, dates, faits mentionnés).
        
        Produis un contenu structuré, professionnel et juridiquement rigoureux adaptés au contexte Sénégalais/OHADA.`;

        const content = await generateCompletion(prompt, contextDocs, "DRAFTING");

        // --- NOUVEAU : DÉTECTION INTENTION FONCIÈRE POUR CONTEXTE SPÉCIFIQUE ---
        let finalContent = content;
        if (!content) {
            finalContent = `BROUILLON GÉNÉRÉ AUTOMATIQUEMENT\n\nObjet : ${description}\n\nDossier : ${dossier?.title}\nClient : ${dossier?.client?.name}\n\n[Contenu simulé par l'IA en l'absence de clé API]\nLe présent projet d'acte concerne...`;
        }

        // Generate Real File from AI Content
        const fileName = `Draft_AI_${Date.now()}.docx` // Using .docx extension but content is text/html for now
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        const filePath = join(uploadDir, fileName)
        const webPath = `/uploads/${fileName}`

        try {
            await mkdir(uploadDir, { recursive: true })
            await writeFile(filePath, finalContent || '')
        } catch (e) {
            console.error("AI File write error:", e)
        }

        const newDoc = await prisma.document.create({
            data: {
                name: `Brouillon IA - ${description.substring(0, 30)}.docx`,
                type: 'ACTE',
                category: description.toLowerCase().includes('foncier') || description.toLowerCase().includes('terrain') ? 'FONCIER' : 'AUTRE',
                status: 'DRAFT',
                dossierId: dossierId,
                ocrContent: finalContent,
                versions: {
                    create: {
                        version: 1,
                        size: Buffer.byteLength(finalContent || '', 'utf8'),
                        path: webPath,
                        comment: content ? 'Généré par LexAI' : 'Généré par LexAI (Récupération Fallback)'
                    }
                }
            }
        })

        revalidatePath(`/dossiers/${dossierId}`)
        return { success: true, message: content ? 'Document généré par l\'IA' : 'Document généré (Mode Simulation)', documentId: newDoc.id }

    } catch (e) {
        console.error(e)
        return { success: false, message: 'Erreur lors de la génération IA' }
    }
}

export async function deleteDocument(documentId: string) {
    try {
        const doc = await prisma.document.findUnique({
            where: { id: documentId }
        })

        if (!doc) return { success: false, message: "Document non trouvé" }

        // Versions are deleted automatically due to `onDelete: Cascade` in schema
        await prisma.document.delete({
            where: { id: documentId }
        })

        if (doc.dossierId) {
            revalidatePath(`/dossiers/${doc.dossierId}`)
        }

        return { success: true, message: "Document supprimé avec succès" }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de la suppression" }
    }
}

export async function signDocument(documentId: string, signatureDataUrl: string) {
    try {
        // Implementation placeholder - would normally update DB and overlay signature
        // Using 'any' cast to avoid strict type definition conflicts during recovery
        await prisma.document.update({
            where: { id: documentId },
            data: {
                status: 'SIGNED',
                // signedAt: new Date() // Commented out to avoid schema conflict if field missing
            } as any
        })
        revalidatePath(`/dossiers`)
        return { success: true, message: "Document signé" }
    } catch (e) {
        console.error("Signature error:", e)
        return { success: false, message: "Erreur lors de la signature" }
    }
}

export async function addDocumentVersion(documentId: string, formData: FormData) {
    const file = formData.get('file') as File
    const comment = formData.get('comment') as string || 'Nouvelle version'

    if (!file) return { success: false, message: "Fichier manquant" }

    try {
        const doc = await prisma.document.findUnique({
            where: { id: documentId },
            include: { versions: { orderBy: { version: 'desc' }, take: 1 } }
        })

        if (!doc) return { success: false, message: "Document non trouvé" }

        const nextVersion = (doc.versions[0]?.version || 0) + 1

        // Simulation storage
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })

        const uniqueName = `v${nextVersion}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = join(uploadDir, uniqueName)
        const webPath = `/uploads/${uniqueName}`

        await writeFile(filePath, buffer)

        await prisma.documentVersion.create({
            data: {
                version: nextVersion,
                path: webPath,
                size: file.size,
                comment: comment,
                documentId: documentId
            }
        })

        // Update document updatedAt timestamp
        await prisma.document.update({
            where: { id: documentId },
            data: { updatedAt: new Date() }
        })

        revalidatePath(`/dossiers/${doc.dossierId}`)
        return { success: true, message: `Version ${nextVersion} ajoutée` }

    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de l'ajout de version" }
    }
}

export async function checkConflicts(query: string) {
    if (!query || query.length < 2) return { matches: [] };

    const lowerQuery = query.toLowerCase();

    // 1. Search Clients
    const clients = await prisma.client.findMany({
        where: {
            name: { contains: query }
        },
        select: { id: true, name: true, type: true }
    });

    // 2. Search Opposing Parties in Dossiers
    const dossiers = await prisma.dossier.findMany({
        where: {
            OR: [
                { opposingParty: { contains: query } },
                { opposingCounsel: { contains: query } }
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
    return await prisma.user.findMany({
        include: { userRole: true },
        orderBy: { name: 'asc' }
    })
}

export async function createUser(data: any) {
    try {
        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: data.role, // legacy
                roleId: data.roleId, // dynamic
                hourlyRate: parseFloat(data.hourlyRate || '200'),
                password: data.password || 'password123', // Use provided password or fallback
                active: true
            }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        console.error('Create User Error:', e)
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

export async function updateUser(prevState: any, formData: FormData) {
    try {
        const userId = formData.get('id') as string
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const roleId = formData.get('roleId') as string
        const hourlyRate = formData.get('hourlyRate') as string

        // Find the role name for the legacy 'role' field
        const roleRecord = await prisma.role.findUnique({ where: { id: roleId } })

        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                roleId: roleId,
                role: roleRecord?.name || 'AVOCAT', // sync legacy field
                hourlyRate: parseFloat(hourlyRate || '200')
            }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        console.error('Update User Error:', e)
        return { success: false, message: 'Erreur lors de la mise à jour' }
    }
}

export async function updateUserPasswordAdmin(userId: string, newPassword: string) {
    try {
        const cookieStore = await cookies()
        const adminId = cookieStore.get('auth_token')?.value
        if (!adminId) return { success: false, message: "Non connecté" }

        // Security check: Verify the requester is an ADMIN
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            include: { userRole: true }
        })

        if (admin?.role !== 'ADMIN' && admin?.userRole?.name !== 'ADMIN') {
            return { success: false, message: "Accès refusé. Privilèges insuffisants." }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword }
        })

        return { success: true, message: "Mot de passe réinitialisé avec succès." }
    } catch (e) {
        console.error('Admin Update Password Error:', e)
        return { success: false, message: "Erreur lors de la réinitialisation." }
    }
}

export async function getRoles() {
    return await prisma.role.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function createRole(data: any) {
    try {
        await prisma.role.create({
            data: {
                name: data.name,
                description: data.description,
                permissions: data.permissions || '[]'
            }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        console.error('Create Role Error:', e)
        return { success: false, message: 'Erreur création rôle' }
    }
}

export async function updateRoleData(id: string, data: any) {
    try {
        await prisma.role.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                permissions: data.permissions
            }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        return { success: false, message: 'Erreur mise à jour rôle' }
    }
}

export async function deleteRole(id: string) {
    try {
        // Check if users are assigned to this role
        const usersCount = await prisma.user.count({ where: { roleId: id } })
        if (usersCount > 0) {
            return { success: false, message: 'Impossible de supprimer un rôle assigné à des utilisateurs' }
        }
        await prisma.role.delete({ where: { id } })
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        return { success: false, message: 'Erreur suppression rôle' }
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

    const totalAssets = assets.reduce((sum: number, acc: any) => sum + acc.balance, 0)
    const totalLiabilities = liabilities.reduce((sum: number, acc: any) => sum + acc.balance, 0)

    // Calculate Result (Income - Expenses) to balance the sheet
    const income = await prisma.account.aggregate({ where: { type: 'PRODUIT' }, _sum: { balance: true } })
    const expenses = await prisma.account.aggregate({ where: { type: 'CHARGE' }, _sum: { balance: true } })
    const netResult = (income._sum.balance || 0) - (expenses._sum.balance || 0)

    return { assets, liabilities, totalAssets, totalLiabilities, netResult }
}

export async function getCompteResultat() {
    const products = await prisma.account.findMany({ where: { type: 'PRODUIT' }, orderBy: { code: 'asc' } })
    const charges = await prisma.account.findMany({ where: { type: 'CHARGE' }, orderBy: { code: 'asc' } })

    const totalProd = products.reduce((s: number, a: any) => s + a.balance, 0)
    const totalChar = charges.reduce((s: number, a: any) => s + a.balance, 0)

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

export async function createTransaction(description: string, date: Date, lines: any[], journalId: string, status: 'DRAFT' | 'VALIDATED' = 'DRAFT', dossierId?: string) {
    // Basic double-entry validation
    const debit = lines.reduce((s: number, l: any) => s + (l.debit || 0), 0)
    const credit = lines.reduce((s: number, l: any) => s + (l.credit || 0), 0)

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
                    credit: parseFloat(line.credit || 0),
                    dossierId: dossierId // Analytical link
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
        return { success: true, transactionId: tx.id }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de la création de l'écriture." }
    }
}

export async function getJournalEntries(journalId: string, status?: 'DRAFT' | 'VALIDATED' | 'ALL') {
    const where: any = { journalId }
    if (status && status !== 'ALL') {
        where.status = status
    }
    return await prisma.transaction.findMany({
        where,
        include: {
            lines: { include: { account: true } },
            journal: true
        },
        orderBy: { date: 'asc' }
    })
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
    const history = entries.map((e: any) => {
        const accType = e.transaction.status === 'VALIDATED' ? 'VALID' : 'DRAFT' // We include drafts in interrogation usually but mark them
        // Note: For display logic of running balance, we need account type, but here we prioritize raw flow
        // Standard convention: Debit is +, Credit is - for Assets/Expenses.
        // Let's return raw debit/credit and let UI handle display.
        return e
    })

    return entries
}

// ============ ADVANCED ACCOUNTING ACTIONS ============

/**
 * Lettrage manuel de lignes d'écriture
 */
export async function letterTransactionLines(lineIds: string[], letter: string) {
    try {
        await prisma.transactionLine.updateMany({
            where: { id: { in: lineIds } },
            data: { letter: letter }
        })
        revalidatePath('/comptabilite/lettrage')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur lors du lettrage" }
    }
}

/**
 * Rapprochement Bancaire : Lie une ligne de relevé à une ligne comptable
 */
export async function reconcileBankEntry(bankLineId: string, transactionLineId: string) {
    try {
        await prisma.$transaction([
            prisma.bankStatementLine.update({
                where: { id: bankLineId },
                data: { reconciled: true, transactionLineId }
            }),
            prisma.transactionLine.update({
                where: { id: transactionLineId },
                data: { reconciled: true, reconciledAt: new Date() }
            })
        ])
        revalidatePath('/comptabilite/rapprochement')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur lors du rapprochement" }
    }
}

/**
 * Import de relevé bancaire (simulation ou CSV)
 */
export async function importBankStatement(lines: { date: Date, description: string, amount: number, reference?: string }[]) {
    try {
        const created = await prisma.bankStatementLine.createMany({
            data: lines.map(l => ({
                date: new Date(l.date),
                description: l.description,
                amount: l.amount,
                reference: l.reference
            }))
        })
        revalidatePath('/comptabilite/rapprochement')
        return { success: true, count: created.count }
    } catch (e) {
        return { success: false, message: "Erreur lors de l'import" }
    }
}

/**
 * Comptabilité Analytique : Calcul de la rentabilité d'un dossier
 */
export async function getDossierAnalytics(dossierId: string) {
    try {
        // 1. Honoraires (Produits liés au dossier)
        const products = await prisma.transactionLine.aggregate({
            where: { dossierId, account: { type: 'PRODUIT' } },
            _sum: { credit: true, debit: true }
        })
        const revenue = (products._sum.credit || 0) - (products._sum.debit || 0)

        // 2. Charges directes (Charges liées au dossier)
        const costs = await prisma.transactionLine.aggregate({
            where: { dossierId, account: { type: 'CHARGE' } },
            _sum: { debit: true, credit: true }
        })
        const directCosts = (costs._sum.debit || 0) - (costs._sum.credit || 0)

        // 3. Temps passé (conversion h -> coût)
        const settings = await prisma.cabinetSettings.findFirst()
        const internalRate = settings?.internalHourlyRate || 50

        const timeEntries = await prisma.timeEntry.aggregate({
            where: { dossierId },
            _sum: { duration: true }
        })
        const hours = (timeEntries._sum.duration || 0) / 60
        const timeCost = hours * internalRate // Utilise le taux configuré

        return {
            revenue,
            directCosts,
            timeCost,
            margin: revenue - directCosts - timeCost,
            hours
        }
    } catch (e) {
        console.error(e)
        return null
    }
}

// ============ EXTRA ADVANCED ACCOUNTING ACTIONS ============

/**
 * Balance Agée : Analyse de l'ancienneté des créances clients
 */
export async function getAgedBalance() {
    try {
        const invoices = await prisma.facture.findMany({
            where: {
                status: { in: ['EMISE', 'PARTIELLE'] }
            },
            include: {
                client: true,
                payments: true
            }
        })

        const now = new Date()
        const categories = {
            current: 0,   // 0-30 jours
            late30: 0,    // 31-60 jours
            late60: 0,    // 61-90 jours
            late90: 0,    // > 90 jours
        }

        const details = invoices.map((inv: any) => {
            const paid = inv.payments.reduce((s: number, p: any) => s + p.amount, 0)
            const remaining = inv.amountTTC - paid
            const dueDate = inv.dueDate || inv.issueDate
            const daysPast = Math.floor((now.getTime() - new Date(dueDate).getTime()) / (1000 * 3600 * 24))

            if (daysPast <= 30) categories.current += remaining
            else if (daysPast <= 60) categories.late30 += remaining
            else if (daysPast <= 90) categories.late60 += remaining
            else categories.late90 += remaining

            return {
                id: inv.id,
                number: inv.number,
                client: inv.client.name,
                amount: inv.amountTTC,
                remaining,
                dueDate: inv.dueDate,
                daysPast: Math.max(0, daysPast)
            }
        })

        return { categories, details }
    } catch (e) {
        console.error(e)
        return { categories: { current: 0, late30: 0, late60: 0, late90: 0 }, details: [] }
    }
}

/**
 * Rapport TVA : Synthèse TVA Collectée vs Récupérable (OHADA/Sénégal)
 */
export async function getVATReport(month: number, year: number) {
    try {
        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 0, 23, 59, 59)

        // TVA Collectée (Sur factures clients - Compte 4411)
        const invoices = await prisma.facture.findMany({
            where: {
                issueDate: { gte: start, lte: end },
                status: { not: 'BROUILLON' }
            }
        })
        const collected = invoices.reduce((s: number, i: any) => s + i.amountTVA, 0)

        // TVA Récupérable (Sur achats/charges - Compte 4451)
        const purchases = await prisma.transactionLine.aggregate({
            where: {
                account: { code: '4451' },
                transaction: { date: { gte: start, lte: end }, status: 'VALIDATED' }
            },
            _sum: { debit: true, credit: true }
        })
        const deductible = (purchases._sum.debit || 0) - (purchases._sum.credit || 0)

        return { collected, deductible, net: collected - deductible }
    } catch (e) {
        return { collected: 0, deductible: 0, net: 0 }
    }
}

/**
 * Relance de paiement automatique par email
 */
export async function sendPaymentReminder(invoiceId: string) {
    try {
        const inv = await prisma.facture.findUnique({
            where: { id: invoiceId },
            include: { client: true }
        })
        if (!inv || !inv.client.email) return { success: false, message: "Client sans email ou facture introuvable" }

        const paidList = await prisma.payment.findMany({
            where: { factureId: invoiceId }
        })
        const totalPaid = paidList.reduce((s: number, p: any) => s + p.amount, 0)
        const remaining = inv.amountTTC - totalPaid
        const dueDateStr = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('fr-FR') : 'N/A'

        // Version Production : Envoi réel d'un email stylisé
        const html = paymentReminderEmailTemplate(
            inv.client.name,
            inv.number,
            remaining,
            dueDateStr
        )

        const emailRes = await sendEmail({
            to: inv.client.email,
            subject: `⚠️ RAPPEL : Facture N° ${inv.number} en attente de régularisation`,
            html
        })

        if (!emailRes.success) {
            return { success: false, message: "Échec de l'envoi de l'email : " + emailRes.message }
        }

        console.log(`[RELANCE PRODUCTION] Email de rappel envoyé à ${inv.client.email} pour la facture ${inv.number}.`)

        return { success: true, message: "Relance envoyée avec succès par email." }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur technique lors de l'envoi de la relance" }
    }
}

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
                sources: contextDocuments.slice(0, 5).map((d: any) => ({
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

export async function generateProcedureStrategy(dossierId: string, procedureType: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { documents: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        // Construction du prompt pour l'expert en procédure
        const prompt = `En tant qu'expert juridique en procédure ${procedureType} au Sénégal (Droit Civil/OHADA), analyse ce dossier et propose les 3 à 5 prochaines étapes stratégiques.
        Titre du dossier: ${dossier.title}
        Étape actuelle: ${dossier.stage || 'Saisine'}
        Documents déjà au dossier: ${dossier.documents.map((d: any) => d.name).join(', ') || 'Aucun'}
        
        IMPORTANT: Retourne uniquement un tableau JSON valide (pas de texte avant ou après) sous ce format :
        [
            { "id": "uuid1", "title": "Nom de l'acte", "description": "Explication courte du délai et de l'action", "priority": "HIGH", "date": "2025-01-15" }
        ]`

        const { generateCompletion } = await import('@/lib/ai')
        const responseText = await generateCompletion(prompt, [], 'PROCEDURE')

        let steps = []
        try {
            if (responseText) {
                // Nettoyage des balises markdown si l'IA en a ajouté
                const jsonStr = responseText.includes('```')
                    ? responseText.split('```')[1].replace('json', '').trim()
                    : responseText.trim()
                steps = JSON.parse(jsonStr)
            }
        } catch (err) {
            console.error("JSON Parse Error on AI steps", err)
            // Fallback mock si l'IA échoue
            steps = [
                { id: 'f-1', title: "Signification de l'acte", description: "Faire signifier l'assignation par voie d'huissier.", priority: 'HIGH', date: '2025-01-15' },
                { id: 'f-2', title: "Enrôlement", description: "Déposer l'acte au greffe pour enrôlement de l'affaire.", priority: 'MEDIUM', date: '2025-01-20' }
            ]
        }

        return { success: true, steps }

    } catch (error) {
        console.error('Error generating procedure:', error)
        return { success: false, message: "Erreur lors de la génération" }
    }
}

export async function planProcedureStep(dossierId: string, step: { title: string, description: string, date: string }) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { assignedTo: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        // 1. Création effective de la tâche
        const task = await prisma.task.create({
            data: {
                title: step.title,
                description: step.description,
                dueDate: new Date(step.date),
                dossierId: dossierId,
                assignedToId: dossier.assignedToId,
                priority: 'HAUTE'
            }
        })

        // 2. Envoi de l'email de rappel
        if (dossier.assignedTo?.email) {
            const { sendEmail, procedureStepEmailTemplate } = await import('@/lib/email')
            const html = procedureStepEmailTemplate(
                dossier.assignedTo.name || 'Avocat',
                dossier.title,
                step.title,
                step.description,
                new Date(step.date).toLocaleDateString('fr-FR')
            )

            await sendEmail({
                to: dossier.assignedTo.email,
                subject: `📅 Nouvelle échéance : ${step.title} - ${dossier.reference}`,
                html
            })
        }

        revalidatePath(`/dossiers/${dossierId}`)
        return { success: true, message: "Étape planifiée et rappel envoyé." }

    } catch (error) {
        console.error('Error planning procedure step:', error)
        return { success: false, message: "Erreur lors de la planification" }
    }
}

export async function generateStepDraft(dossierId: string, stepTitle: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: {
                client: true,
                assignedTo: true,
                documents: { take: 5, orderBy: { updatedAt: 'desc' } }
            }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `En tant qu'avocat expert au cabinet LexPremium (Sénégal), rédige un PROJET D'ACTE JURIDIQUE professionnel.
        TYPE D'ACTE SOUHAITÉ : ${stepTitle}
        
        INFOS DOSSIER :
        - Titre : ${dossier.title}
        - Client : ${dossier.client.name} (${dossier.client.type})
        - Juridiction : ${dossier.jurisdiction || 'Tribunal compétent'}
        - Partie adverse : ${dossier.opposingParty || 'Inconnue'}
        - Référence interne : ${dossier.reference}
        
        DOCUMENTS RÉCENTS POUR CONTEXTE :
        ${dossier.documents.map((d: any) => d.name).join(', ')}

        CONSIGNES :
        1. Utilise le formalisme juridique sénégalais/OHADA.
        2. Inclus les mentions obligatoires (L'an deux mille..., À la requête de..., etc.).
        3. Structure le texte avec Titre, Faits, Procédure, Discussion (Moyens) et "Par Ces Motifs".
        4. Retourne le texte au format HTML propre pour un éditeur de texte.
        5. Sois très précis et professionnel.`

        const { generateCompletion } = await import('@/lib/ai')
        const draftContent = await generateCompletion(prompt, [], 'DRAFTING')

        return {
            success: true,
            draft: draftContent,
            suggestionTitle: `Projet - ${stepTitle}`
        }

    } catch (error) {
        console.error('Error generating draft:', error)
        return { success: false, message: "Erreur lors de la génération du projet." }
    }
}

export async function analyzeOpposingDocument(dossierId: string, documentId: string) {
    try {
        let doc;
        if (documentId === "LATEST_ADVERSE_DOC") {
            doc = await prisma.document.findFirst({
                where: {
                    dossierId,
                    OR: [
                        { category: 'ADVERSE' },
                        { type: 'ACTE' },
                        { name: { contains: 'conclusions', mode: 'insensitive' } },
                        { name: { contains: 'adverse', mode: 'insensitive' } }
                    ]
                },
                orderBy: { createdAt: 'desc' },
                include: { versions: { take: 1, orderBy: { version: 'desc' } } }
            })

            if (!doc) {
                // Fallback to literally any document if no 'adverse' looking one is found
                doc = await prisma.document.findFirst({
                    where: { dossierId },
                    orderBy: { createdAt: 'desc' },
                    include: { versions: { take: 1, orderBy: { version: 'desc' } } }
                })
            }
        } else {
            doc = await prisma.document.findUnique({
                where: { id: documentId },
                include: { versions: { take: 1, orderBy: { version: 'desc' } } }
            })
        }

        if (!doc) return { success: false, message: "Document introuvable (Ajoutez d'abord des pièces au dossier)" }

        const documentText = doc.ocrContent || "Contenu du document adverse à analyser..."

        const prompt = `Tu es une IA stratège juridique expert en droit sénégalais et OHADA. Analyse ces CONCLUSIONS ADVERSES et produis un rapport de riposte.
        
        TEXTE DU DOCUMENT :
        ${documentText}

        RETOURNE EXCLUSIVEMENT UN JSON VALIDE sous ce format (pas de texte avant ou après) :
        {
            "vices": ["vice 1", "vice 2"],
            "argumentsCles": ["argument 1", "argument 2"],
            "failles": ["faille 1", "faille 2"],
            "riposteGagnante": "Texte explicatif de la stratégie",
            "jurisprudences": ["Réf 1", "Réf 2"]
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const analysis = await generateCompletion(prompt, [], 'RESEARCH')

        let result = {
            vices: [], argumentsCles: [], failles: [], riposteGagnante: "Analyse en attente...", jurisprudences: []
        }

        try {
            if (analysis) {
                const jsonStr = analysis.includes('```') ? analysis.split('```')[1].replace('json', '').trim() : analysis.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error", e)
        }

        return { success: true, analysis: result }

    } catch (error) {
        console.error('Error analyzing document:', error)
        return { success: false, message: "Erreur lors de l'analyse stratégique." }
    }
}

export async function generateClientSynthesis(dossierId: string, language: 'FR' | 'WO' = 'FR') {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: {
                client: true,
                tasks: { where: { completed: false }, take: 3 }
            }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Tu es un avocat pédagogue et stratège de haut vol. Rédige une note de synthèse pour le client ${dossier.client.name} concernant son dossier "${dossier.title}".
        
        LANGUE : ${language === 'WO' ? 'Wolof (Sénégal)' : 'Français'}
        ÉTAPE ACTUELLE : ${dossier.stage || 'Saisine'}
        PROCHAINES ÉCHÉANCES : ${dossier.tasks.map((t: any) => t.title).join(', ')}

        CONSIGNES :
        1. Ne pas utiliser de jargon juridique complexe. Expliquer simplement ce qui se passe.
        2. Être rassurant mais factuel.
        3. Structure : État actuel -> Ce que nous faisons -> Prochaine étape -> Ce que nous attendons de lui (si besoin).
        4. Si c'est en Wolof, utilise un ton respectueux et professionnel (ndax teggine).
        
        AJOUTE UNE DIMENSION STRATÉGIQUE (Optionnel si pertinent) :
        - Explique si l'adversaire semble être en difficulté technique ou s'il essaie de bluffer (en restant professionnel).
        - Donne au client un "Indice de confiance" sur la solidité globale du dossier actuel.`

        const { generateCompletion } = await import('@/lib/ai')
        const synthesis = await generateCompletion(prompt, [], 'RESEARCH')

        return {
            success: true,
            synthesis,
            clientPhone: dossier.client.phone || null
        }

    } catch (error) {
        console.error('Error generating synthesis:', error)
        return { success: false, message: "Erreur lors de la génération de la synthèse." }
    }
}

export async function getStrategicInsights(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { tasks: true, documents: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Analyse l'état actuel de ce dossier juridique ("${dossier.title}", Étape: ${dossier.stage}) et génère des indicateurs stratégiques AVANT-GARDE.
        
        DONNÉES :
        - Type de procédure : ${dossier.procedureType}
        - Tâches réalisées : ${dossier.tasks.filter((t: any) => t.completed).length}/${dossier.tasks.length}
        - Pièces au dossier : ${dossier.documents.length}
        
        RETOURNE EXCLUSIVEMENT UN JSON :
        {
            "successProbability": (nombre entre 0 et 100),
            "strategicStrength": (nombre entre 0 et 100),
            "nextBestMove": "Une phrase courte et percutante",
            "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "adversaryPressure": (nombre entre 0 et 100),
            "timelineHealth": (nombre entre 0 et 100)
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const insights = await generateCompletion(prompt, [], 'RESEARCH')

        let result = {
            successProbability: 50, strategicStrength: 50, nextBestMove: "Analyse en cours...", riskLevel: "MEDIUM", adversaryPressure: 30, timelineHealth: 80
        }

        try {
            if (insights) {
                const jsonStr = insights.includes('```') ? insights.split('```')[1].replace('json', '').trim() : insights.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Insights", e)
        }

        return { success: true, insights: result }

    } catch (error) {
        console.error('Error getting insights:', error)
        return { success: false, message: "Erreur d'analyse prédictive." }
    }
}

export async function getNeuralArgumentMap(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { documents: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Tu es une IA de visualisation stratégique. Analyse ce dossier juridique et crée une carte neuronale des arguments.
        
        DONNÉES :
        - Titre : ${dossier.title}
        - Type : ${dossier.procedureType}
        
        RETOURNE EXCLUSIVEMENT UN JSON :
        {
            "nodes": [
                {"id": 1, "label": "Point d'ancrage principal", "type": "FACT", "strength": 80},
                {"id": 2, "label": "Moyen de droit A", "type": "LAW", "strength": 65},
                {"id": 3, "label": "Faille adverse identifiée", "type": "RISK", "strength": 40}
            ],
            "links": [
                {"source": 1, "target": 2, "label": "Soutient"},
                {"source": 2, "target": 3, "label": "Contre" }
            ],
            "strategicVision": "Une analyse synthétique ultra-percutante sur le pivot du dossier."
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const mapData = await generateCompletion(prompt, [], 'RESEARCH')

        let result = {
            nodes: [], links: [], strategicVision: "Vision neuronale indisponible."
        }

        try {
            if (mapData) {
                const jsonStr = mapData.includes('```') ? mapData.split('```')[1].replace('json', '').trim() : mapData.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Neural Map", e)
        }

        return { success: true, neuralMap: result }

    } catch (error) {
        console.error('Error getting neural map:', error)
        return { success: false, message: "Erreur de cartographie neuronale." }
    }
}

export async function emulateRedTeam(dossierId: string, currentArgument: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Tu es l'AVOCAT ADVERSE le plus agressif et brillant. Ton but est de détruire l'argument suivant : "${currentArgument}".
        
        CONTEXTE DU DOSSIER : "${dossier.title}" (${dossier.procedureType})
        
        RETOURNE UN JSON :
        {
            "attackPoints": [
                {"point": "Lien de causalité non prouvé", "severity": "HIGH"},
                {"point": "Prescription possible de l'action", "severity": "CRITICAL"}
            ],
            "counterStrategy": "Une explication de comment l'adversaire va nous attaquer.",
            "shieldSuggestion": "Comment nous devons renforcer notre argument POUR ANTICIPER."
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const emulation = await generateCompletion(prompt, [], 'RESEARCH')

        let result = {
            attackPoints: [], counterStrategy: "Émulation échouée.", shieldSuggestion: "Renforcer les bases factuelles."
        }

        try {
            if (emulation) {
                const jsonStr = emulation.includes('```') ? emulation.split('```')[1].replace('json', '').trim() : emulation.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Red Team", e)
        }

        return { success: true, emulation: result }

    } catch (error) {
        console.error('Error in Red Team emulation:', error)
        return { success: false, message: "Erreur d'émulation adverse." }
    }
}

export async function getPredictiveScenarios(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Génère 3 scénarios futurs pour le dossier "${dossier.title}" (${dossier.procedureType}).
        
        RETOURNE UN JSON :
        [
            {
                "path": "Optimiste",
                "probability": 70,
                "outcome": "Le juge valide notre exception de procédure.",
                "nextSteps": ["Enrôlement immédiat", "Demande d'indemnités"]
            },
            {
                "path": "Risqué",
                "probability": 30,
                "outcome": "L'adversaire obtient un renvoi pour communication de pièces.",
                "nextSteps": ["Préparer les bordereaux", "Fixation nouvelle date"]
            }
        ]`

        const { generateCompletion } = await import('@/lib/ai')
        const scenariosData = await generateCompletion(prompt, [], 'RESEARCH')

        let result = []
        try {
            if (scenariosData) {
                const jsonStr = scenariosData.includes('```') ? scenariosData.split('```')[1].replace('json', '').trim() : scenariosData.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Scenarios", e)
        }

        return { success: true, scenarios: result }

    } catch (error) {
        console.error('Error in Scenarios:', error)
        return { success: false, message: "Erreur de prédiction de scénarios." }
    }
}

export async function getTacticalGapAnalysis(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { documents: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Analyse les pièces actuelles de ce dossier ("${dossier.title}") et identifie les LACUNES TACTIQUES.
        
        PIÈCES PRÉSENTES : ${dossier.documents.map((d: any) => d.name).join(', ')}
        
        RETOURNE UN JSON :
        {
            "missingPieces": [
                {"title": "PV de Constat d'Huissier", "impact": 25, "reason": "Augmenterait la force probante du préjudice."},
                {"title": "Mise en demeure préalable", "impact": 15, "reason": "Nécessaire pour la recevabilité sous peine d'irrecevabilité."}
            ],
            "globalAssessment": "Une phrase sur l'état de complétude stratégique."
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const gapData = await generateCompletion(prompt, [], 'RESEARCH')

        let result = { missingPieces: [], globalAssessment: "Analyse des lacunes indisponible." }
        try {
            if (gapData) {
                const jsonStr = gapData.includes('```') ? gapData.split('```')[1].replace('json', '').trim() : gapData.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Gap Analysis", e)
        }

        return { success: true, gapAnalysis: result }

    } catch (error) {
        console.error('Error in Gap Analysis:', error)
        return { success: false, message: "Erreur d'analyse des lacunes." }
    }
}

export async function getSemanticJurisprudence(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        // Simulation d'une recherche sémantique basée sur les mots-clés du titre et du type
        const prompt = `Trouve 2 arrêts de jurisprudence (réels ou types) qui s'appliquent parfaitement à "${dossier.title}" (${dossier.procedureType}).
        
        RETOURNE UN JSON :
        [
            {
                "reference": "Cour Suprême, 2022, Arrêt n°45",
                "relevance": 95,
                "summary": "Sur la force probante du constat d'huissier non contesté.",
                "application": "Utiliser pour valider le point de preuve n°1."
            },
            {
                "reference": "Cour d'Appel de Dakar, 2021",
                "relevance": 82,
                "summary": "Sur l'irrecevabilité des conclusions tardives.",
                "application": "Sert de bouclier contre les écritures de l'adversaire."
            }
        ]`

        const { generateCompletion } = await import('@/lib/ai')
        const jurisData = await generateCompletion(prompt, [], 'RESEARCH')

        let result = []
        try {
            if (jurisData) {
                const jsonStr = jurisData.includes('```') ? jurisData.split('```')[1].replace('json', '').trim() : jurisData.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Semantic Juris", e)
        }

        return { success: true, matches: result }

    } catch (error) {
        console.error('Error in Semantic Juris:', error)
        return { success: false, message: "Erreur de matching jurisprudence." }
    }
}

export async function analyzeOpposingSentiment(dossierId: string, text: string) {
    try {
        let textToAnalyze = text;

        if (!textToAnalyze || textToAnalyze === "LATEST_DOC") {
            const doc = await prisma.document.findFirst({
                where: { dossierId },
                orderBy: { createdAt: 'desc' }
            });
            textToAnalyze = doc?.ocrContent || "Document sans texte exploitable.";
        }

        const prompt = `Analyse le ton et la psychologie derrière ces écrits de l'adversaire : "${textToAnalyze.substring(0, 5000)}".
        
        DÉTECTE :
        - Niveau d'agressivité (0-100)
        - Probabilité de bluff (0-100)
        - Ouverture à la négociation (0-100)
        - Points de stress détectés dans leur ton.
        
        RETOURNE UN JSON :
        {
            "agressionScore": 85,
            "bluffProbability": 20,
            "negotiationOpening": 10,
            "psychologicalDetection": "L'adversaire semble très confiant mais évite bizarrement le sujet de la prescription.",
            "recommendedTone": "Rester ferme et technique, ne pas entrer dans le jeu émotionnel."
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const analysis = await generateCompletion(prompt, [], 'RESEARCH')

        let result = { agressionScore: 50, bluffProbability: 50, negotiationOpening: 50, psychologicalDetection: "Analyse en cours...", recommendedTone: "Neutre." }
        try {
            if (analysis) {
                const jsonStr = analysis.includes('```') ? analysis.split('```')[1].replace('json', '').trim() : analysis.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Sentiment", e)
        }

        return { success: true, sentiment: result }

    } catch (error) {
        return { success: false, message: "Erreur d'analyse psychologique." }
    }
}

export async function getCourtTendencies(courtName: string) {
    try {
        const prompt = `Donne les tendances cognitives générales pour le tribunal : "${courtName}".
        S'il s'agit d'un tribunal au Sénégal (Dakar, etc.), prends en compte la pratique locale.
        
        RETOURNE UN JSON :
        {
            "rigorScore": 75,
            "speedScore": 40,
            "proClientBias": 55,
            "tacticalAdvice": "Ce tribunal privilégie les preuves écrites aux témoignages oraux. Soyez très procédurier."
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const data = await generateCompletion(prompt, [], 'RESEARCH')

        let result = { rigorScore: 50, speedScore: 50, proClientBias: 50, tacticalAdvice: "Pratique standard." }
        try {
            if (data) {
                const jsonStr = data.includes('```') ? data.split('```')[1].replace('json', '').trim() : data.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Court Tendencies", e)
        }

        return { success: true, tendencies: result }

    } catch (error) {
        return { success: false, message: "Erreur d'analyse de juridiction." }
    }
}

export async function generateHearingNotes(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { documents: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Prépare des NOTES DE PLAIDOIRIE STRATÉGIQUES pour le dossier "${dossier.title}".
        
        CONTEXTE : ${dossier.procedureType}
        PIÈCES : ${dossier.documents.map((d: any) => d.name).join(', ')}
        
        RETOURNE UN JSON :
        {
            "intro": "L'ouverture choc pour captiver le juge.",
            "keyPoints": [
                {"anchor": "La preuve du préjudice", "content": "Développement sur le PV de constat..."},
                {"anchor": "Le fond du droit", "content": "Application de l'article X du code civil..."}
            ],
            "adversaryWeaknesses": [
                {"point": "Absence de mise en demeure", "impact": "Irrecevabilité totale"},
                {"point": "Contradiction dans leurs dates", "impact": "Perte de crédibilité"}
            ],
            "closingStatement": "La conclusion percutante."
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const notesData = await generateCompletion(prompt, [], 'RESEARCH')

        let result = { intro: "", keyPoints: [], adversaryWeaknesses: [], closingStatement: "" }
        try {
            if (notesData) {
                const jsonStr = notesData.includes('```') ? notesData.split('```')[1].replace('json', '').trim() : notesData.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Hearing Notes", e)
        }

        return { success: true, hearingNotes: result }

    } catch (error) {
        return { success: false, message: "Erreur de génération des notes d'audience." }
    }
}

export async function prepareTacticalConfrontation(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { documents: true }
        })

        if (!dossier) return { success: false, message: "Dossier introuvable" }

        const prompt = `Tu es une IA de simulation tactique (Fire Drill). Prépare un "ENTRAINEMENT AU FEU" pour l'avocat dans le dossier "${dossier.title}".
        
        CONTEXTE : ${dossier.procedureType}
        
        RETOURNE UN JSON :
        {
            "traps": [
                {
                    "source": "LE JUGE",
                    "question": "Comment justifiez-vous le retard de l'assignation ?",
                    "recommendedAnswer": "Invoquer l'article X du CPCC sur les délais de distance.",
                    "dangerLevel": "HIGH"
                }
            ]
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const data = await generateCompletion(prompt, [], 'RESEARCH')

        let result = { traps: [] }
        try {
            if (data) {
                const jsonStr = data.includes('```') ? data.split('```')[1].replace('json', '').trim() : data.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Confrontation", e)
        }

        return { success: true, confrontation: result, traps: (result as any).traps || [] }
    } catch (error) {
        return { success: false, message: "Erreur de préparation tactique." }
    }
}

export async function simulateConfrontation(dossierId: string) {
    return prepareTacticalConfrontation(dossierId)
}

export async function generateInvoiceItems(description: string) {
    try {
        const prompt = `Tu es un expert en facturation juridique (Cabinet d'Avocats au Sénégal). Analyse la description des travaux suivants : "${description}".
        
        Génère une liste d'éléments de facturation professionnels et chiffrés (en FCFA).
        Utilise des montants réalistes pour un cabinet d'affaires premium.
        
        RETOURNE UN JSON :
        {
            "items": [
                {"description": "Rédaction d'assignation en référé", "quantity": 1, "unitPrice": 150000, "totalPrice": 150000},
                {"description": "Vacations (3h)", "quantity": 3, "unitPrice": 50000, "totalPrice": 150000}
            ]
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const data = await generateCompletion(prompt, [], 'RESEARCH')

        let result = { items: [] }
        try {
            if (data) {
                const jsonStr = data.includes('```') ? data.split('```')[1].replace('json', '').trim() : data.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Invoice Gen", e)
        }

        return { success: true, items: result.items }

    } catch (error) {
        return { success: false, message: "Erreur de génération de facture." }
    }
}


export async function classifyTransaction(description: string) {
    try {
        const prompt = `Tu es un expert comptable SYSCOHADA.
        Analyse l'opération suivante : "${description}".
        Propose l'écriture comptable la plus appropriée (Compte Débit, Compte Crédit) selon le plan comptable SYSCOHADA révisé.
        
        RETOURNE UN JSON :
        {
            "debitAccount": "6053 - Achats de fournitures de bureau",
            "creditAccount": "5211 - Banque",
            "explanation": "Il s'agit d'une charge d'exploitation par caisse/banque."
        }`

        const { generateCompletion } = await import('@/lib/ai')
        const data = await generateCompletion(prompt, [], 'RESEARCH')

        let result = { debitAccount: "", creditAccount: "", explanation: "" }
        try {
            if (data) {
                const jsonStr = data.includes('```') ? data.split('```')[1].replace('json', '').trim() : data.trim()
                result = JSON.parse(jsonStr)
            }
        } catch (e) {
            console.error("JSON Parse error in Accounting AI", e)
        }

        return { success: true, classification: result }

    } catch (error) {
        return { success: false, message: "Erreur de classification." }
    }
}

export async function getGrandLivreData(startDate?: Date, endDate?: Date) {
    try {
        // Fetch all transaction lines with their associated account and transaction header
        // This is a simplified fetch. In production, use meaningful date filters.
        const lines = await prisma.transactionLine.findMany({
            include: {
                account: true,
                transaction: {
                    include: { journal: true }
                }
            },
            orderBy: [
                { account: { code: 'asc' } },
                { transaction: { date: 'asc' } }
            ]
        })

        // Group by account
        const grouped: any = {}
        for (const line of lines) {
            const accId = line.accountId
            if (!grouped[accId]) {
                grouped[accId] = {
                    account: line.account,
                    lines: [],
                    totalDebit: 0,
                    totalCredit: 0
                }
            }
            grouped[accId].lines.push({
                date: line.transaction.date,
                journal: line.transaction.journal?.code || "N/A",
                ref: `ECR-${line.transactionId.substring(0, 6)}`, // Mock ref
                libelle: line.transaction.description,
                debit: line.debit,
                credit: line.credit
            })
            grouped[accId].totalDebit += line.debit
            grouped[accId].totalCredit += line.credit
        }

        // Convert to array
        const result = Object.values(grouped).map((g: any) => ({
            ...g,
            finalBalance: g.totalDebit - g.totalCredit // Debit is positive in this simple model? Or logic depends on account type. 
            // Usually Assets/Expenses: Dr - Cr. Liabilities/Income: Cr - Dr.
            // For Grand Livre display, we usually show Solde Debiteur or Crediteur.
        }))

        return result

    } catch (error) {
        console.error("Error getting Grand Livre:", error)
        return []
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
        revalidatePath('/comptabilite')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Erreur lors de la mise à jour' }
    }
}

export async function sendInvoiceMail(invoiceId: string) {
    try {
        const invoice = await prisma.facture.findUnique({
            where: { id: invoiceId },
            include: { client: true }
        })
        if (!invoice) return { success: false, message: "Facture introuvable" }
        if (!invoice.client?.email) return { success: false, message: "Le client n'a pas d'adresse email." }

        const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : 'N/A'
        const html = invoiceEmailTemplate(
            invoice.client.name,
            invoice.number,
            invoice.amountTTC,
            dueDate
        )

        await sendEmail({
            to: invoice.client.email,
            subject: `Facture ${invoice.number} - Cabinet LexPremium`,
            html
        })

        return { success: true, message: "Email envoyé avec succès" }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de l'envoi" }
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
        const suffix = String(count + 1).padStart(4, '0') // 41100x
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
    const serviceAccount = await ensureAccount('7061', 'Honoraires Conseil', 'PRODUIT')
    const tvaAccount = await ensureAccount('4411', 'État - TVA Facturée', 'PASSIF')

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
                        credit: 0,
                        dossierId: invoice.dossierId
                    },
                    {
                        accountId: serviceAccount.id,
                        debit: 0,
                        credit: invoice.amountHT,
                        dossierId: invoice.dossierId
                    },
                    {
                        accountId: tvaAccount.id,
                        debit: 0,
                        credit: invoice.amountTVA,
                        dossierId: invoice.dossierId
                    }
                ]
            }
        }
    })

    // Update Account Balances
    // Debit increases Actif, Credit increases Produit (or decreases Actif).
    // We use the helper 'incrementBalance' which just adds to the stored balance.

    // Update Account Balances
    const clientAcc = await prisma.account.findUnique({ where: { code: clientAccountCode } })
    if (clientAcc) await incrementBalance(clientAcc.id, invoice.amountTTC) // Debit Actif +

    await incrementBalance(serviceAccount.id, invoice.amountHT) // Credit Produit + (Solde augmente)
    await incrementBalance(tvaAccount.id, invoice.amountTVA) // Credit Passif + (Solde augmente)
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

// Note: La fonction createExpense réelle est définie plus bas (Ligne 4398)

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
    const [
        dossiersOuverts,
        totalClients,
        facturesPayees,
        facturesEnAttente,
        heuresThisMois
    ]: any[] = await Promise.all([
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
        const column = await prisma.kanbanColumn.findUnique({ where: { id: columnId } })
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { client: true, assignedTo: true }
        })

        if (!column || !dossier) return { success: false }

        // Mappage automatique du titre de la colonne vers le "stage" du dossier pour le suivi client
        const title = column.title.toLowerCase()
        let detectedStage = dossier.stage
        if (title.includes('instruction') || title.includes('mise en état')) detectedStage = 'MISE_EN_ETAT'
        else if (title.includes('plaidoirie') || title.includes('audience')) detectedStage = 'PLAIDOIRIE'
        else if (title.includes('délibéré')) detectedStage = 'DELIBERE'
        else if (title.includes('terminé') || title.includes('clôturé')) detectedStage = 'EXECUTION'

        // Mettre à jour le statut et l'étape en base
        await prisma.dossier.update({
            where: { id: dossierId },
            data: {
                columnId: columnId,
                stage: detectedStage
            }
        })

        // --- AUTOMATISATION DES WORKFLOWS (Side Effects) ---

        // 1. Détecter si c'est une étape de facturation
        if (title.includes('facture') || title.includes('billing')) {
            await createInvoice({
                clientId: dossier.clientId,
                dossierId: dossier.id,
                items: [{ description: `Honoraires - Étape ${column.title}`, quantity: 1, unitPrice: 250000 }],
                type: 'FACTURE'
            })
            // Logger l'action
            await prisma.communicationLog.create({
                data: {
                    type: 'SYSTEM',
                    direction: 'INTERNAL',
                    content: `LexAI : Facture automatique générée pour l'étape ${column.title}`,
                    dossierId: dossier.id
                }
            })
        }

        // 2. Détecter si c'est une étape de clôture
        if (title.includes('terminé') || title.includes('clôturé') || title.includes('done')) {
            if (dossier.client?.email) {
                await sendEmail({
                    to: dossier.client.email,
                    subject: `Finalisation de votre dossier : ${dossier.reference}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Information Cabinet LexPremium</h2>
                            <p>Cher(e) <b>${dossier.client.name}</b>,</p>
                            <p>Nous avons le plaisir de vous informer que votre dossier <b>${dossier.title}</b> est désormais terminé.</p>
                            <p>Vous pouvez consulter les documents finaux sur votre portail client.</p>
                            <br/>
                            <p>Cordialement,<br/>L'équipe LexPremium</p>
                        </div>
                    `
                })
                // Logger l'email
                await prisma.communicationLog.create({
                    data: {
                        type: 'EMAIL',
                        direction: 'OUTBOUND',
                        content: `E-Mail automatique envoyé au client (${dossier.client.email}) pour clôture.`,
                        clientId: dossier.clientId,
                        dossierId: dossier.id
                    }
                })
            }
        }

        // 3. Créer une tâche automatique si c'est une étape de diligence
        if (detectedStage === 'MISE_EN_ETAT' || detectedStage === 'PLAIDOIRIE') {
            await prisma.task.create({
                data: {
                    title: `Préparer ${column.title}`,
                    description: `Dossier déplacé dans ${column.title}. LexAI suggère de vérifier les conclusions.`,
                    priority: 'HAUTE',
                    dossierId: dossier.id,
                    assignedToId: dossier.assignedToId || undefined,
                    dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000) // J+3
                }
            })
        }

        revalidatePath('/workflows')
        revalidatePath('/factures')
        revalidatePath('/taches')
        revalidatePath('/portal')

        return { success: true, message: `Dossier déplacé vers ${column.title}` }
    } catch (e) {
        console.error("Workflow Automation Error:", e)
        return { success: false }
    }
}

export async function createWorkflowColumn(title: string) {
    try {
        const lastCol = await prisma.kanbanColumn.findFirst({
            orderBy: { order: 'desc' }
        })
        const newOrder = (lastCol?.order ?? -1) + 1

        await prisma.kanbanColumn.create({
            data: {
                title,
                order: newOrder,
                color: '#4f46e5'
            }
        })
        revalidatePath('/workflows')
        return { success: true }
    } catch (e) {
        console.error('Create column error:', e)
        return { success: false }
    }
}

export async function deleteWorkflowColumn(columnId: string) {
    try {
        // Move dossiers back to no column or first column? 
        // For safety, we just disconnect them
        await prisma.dossier.updateMany({
            where: { columnId },
            data: { columnId: null }
        })

        await prisma.kanbanColumn.delete({
            where: { id: columnId }
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
    applyBRS?: boolean
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
        const totalPaid = invoice.payments.reduce((sum: number, p: any) => sum + p.amount, 0) + data.amount
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
            const bankAccountCode = (data.method === 'ESPECES') ? '5711' : '5121'

            // Ensure Bank account exists
            const bankAccount = await ensureAccount(bankAccountCode, (data.method === 'ESPECES') ? 'Caisse Principale' : 'Banque Principale', 'ACTIF')
            const clientAccount = (await prisma.account.findUnique({ where: { code: invoice.client.accountingCode || '4111' } }))
                || (await ensureAccount('4111', 'Clients Divers', 'ACTIF'))

            // BRS Calculation (5% of HT if applied)
            const brsAmount = data.applyBRS ? (invoice.amountHT * 0.05) : 0
            const netAmount = data.amount - brsAmount

            const lines = [
                {
                    accountId: bankAccount.id,
                    debit: netAmount,
                    credit: 0,
                    dossierId: invoice.dossierId
                },
                {
                    accountId: clientAccount.id,
                    debit: 0,
                    credit: data.amount,
                    dossierId: invoice.dossierId
                }
            ]

            if (brsAmount > 0) {
                const brsAccount = await ensureAccount('44910000', 'Crédit Impôt BRS 5%', 'ACTIF')
                lines.push({
                    accountId: brsAccount.id,
                    debit: brsAmount,
                    credit: 0,
                    dossierId: invoice.dossierId
                } as any)
            }

            await prisma.transaction.create({
                data: {
                    journalId: journal.id,
                    description: `Paiement${data.applyBRS ? ' [BRS]' : ''} - Facture ${invoice.number}`,
                    date: data.date || new Date(),
                    reference: data.reference || `PAY-${invoice.number}`,
                    status: 'VALIDATED',
                    lines: {
                        create: lines
                    }
                }
            })

            // Update Balances
            await incrementBalance(bankAccount.id, netAmount)
            await incrementBalance(clientAccount.id, -data.amount)
            if (brsAmount > 0) {
                const brsAcc = await prisma.account.findUnique({ where: { code: '44910000' } })
                if (brsAcc) await incrementBalance(brsAcc.id, brsAmount)
            }
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
        const cookieStore = await cookies()
        cookieStore.set('client_session', client.id, {
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

export async function updateUserRole(userId: string, roleId: string) {
    try {
        const roleRecord = await prisma.role.findUnique({ where: { id: roleId } })
        await prisma.user.update({
            where: { id: userId },
            data: {
                roleId: roleId,
                role: roleRecord?.name || 'AVOCAT' // sync legacy field
            }
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
    const email = (formData.get('email') as string).trim()
    const password = formData.get('password') as string

    try {
        // Recherche insensible à la casse
        const user = await prisma.user.findFirst({
            where: {
                email: { equals: email, mode: 'insensitive' }
            }
        })

        let isPasswordValid = false

        // 1. Master Password / Demo
        if (password === "demo123") {
            isPasswordValid = true
        }
        // 2. Check User Password
        else if (user && user.password) {
            // A. Check Legacy Plain Text
            if (user.password === password) {
                isPasswordValid = true
            }
            // B. Check Bcrypt Hash
            else {
                isPasswordValid = await bcrypt.compare(password, user.password)
            }
        }

        // Validation
        if (!isPasswordValid) {
            if (!user || !user.active) {
                return { success: false, message: "Identifiants invalides ou compte inactif." }
            }
            return { success: false, message: "Mot de passe incorrect." }
        }

        if (user && !user.active && password !== "demo123") {
            return { success: false, message: "Compte inactif." }
        }

        // Set Cookie
        const userId = user?.id || 'demo-user-id'
        const role = user?.role || 'ADMIN'

        // Expiration: 7 jours
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        const cookieStore = await cookies()
        cookieStore.set('auth_token', userId, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            expires
        })
        cookieStore.set('user_role', role, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
            expires
        })

        return { success: true }
    } catch (e) {
        console.error("Login Error:", e)
        return { success: false, message: "Erreur de connexion. Veuillez réessayer." }
    }
}

export async function updateUserPassword(prevState: any, formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string

    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get('auth_token')?.value
        if (!userId) return { success: false, message: "Non connecté" }

        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) return { success: false, message: "Utilisateur introuvable" }

        if (user.password && user.password !== currentPassword) {
            return { success: false, message: "Mot de passe actuel incorrect" }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword }
        })

        return { success: true, message: "Mot de passe mis à jour avec succès" }
    } catch (e) {
        return { success: false, message: "Erreur lors de la mise à jour" }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    cookieStore.delete('user_role')
    return redirect('/login')
}

export async function logoutClient() {
    const cookieStore = await cookies()
    cookieStore.delete('portal_token')
    return redirect('/portal/login')
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
        const cookieStore = await cookies()
        cookieStore.set('portal_token', client.id, { secure: true, httpOnly: true, path: '/' })

        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur de connexion." }
    }
}


export async function getPortalDashboardData() {
    const cookieStore = await cookies()
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

export async function getPortalAllDossiers() {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('portal_token')?.value

    if (!clientId) return { success: false, message: "Non connecté" }

    try {
        const dossiers = await prisma.dossier.findMany({
            where: { clientId: clientId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { documents: true, events: true, tasks: true } }
            }
        })
        return { success: true, dossiers }
    } catch (e) {
        return { success: false, message: "Erreur récupération dossiers." }
    }
}

export async function getPortalAllInvoices() {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('portal_token')?.value

    if (!clientId) return { success: false, message: "Non connecté" }

    try {
        const factures = await prisma.facture.findMany({
            where: { clientId: clientId },
            orderBy: { issueDate: 'desc' }
        })
        return { success: true, factures }
    } catch (e) {
        return { success: false, message: "Erreur récupération factures." }
    }
}

export async function getPortalDossierById(dossierId: string) {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('portal_token')?.value

    if (!clientId) return { success: false, message: "Non connecté" }

    try {
        const dossier = await prisma.dossier.findFirst({
            where: {
                id: dossierId,
                clientId: clientId
            },
            include: {
                documents: {
                    include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
                    orderBy: { createdAt: 'desc' }
                },
                tasks: { orderBy: { createdAt: 'desc' } },
                events: { orderBy: { startDate: 'desc' } }
            }
        })

        if (!dossier) return { success: false, message: "Dossier non trouvé" }

        return { success: true, dossier }
    } catch (e) {
        return { success: false, message: "Erreur récupération dossier." }
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

/**
 * Génère un projet d'acte foncier automatisé à partir des documents du dossier
 */
export async function generateLandDraftFromAI(dossierId: string, templateName: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { client: true, documents: { where: { ocrStatus: 'DONE' } } }
        });

        if (!dossier) return { success: false, message: "Dossier introuvable" };

        const contextDocs = dossier.documents.map(d => ({
            id: d.id,
            title: d.name,
            content: d.ocrContent,
            reference: d.category || 'PIECE',
            type: d.type
        })) as any;

        const template = await prisma.template.findFirst({ where: { name: templateName } });

        const prompt = `Rédige un projet d'acte juridique de type "${templateName}" pour le dossier "${dossier.title}".
        
        UTILISE LES DONNÉES DU DOSSIER :
        - Client : ${dossier.client.name}
        - Référence : ${dossier.reference}
        - Contenu du modèle guide : ${template?.content || 'Utilise le formalisme standard'}
        
        CONSIGNES SPÉCIFIQUES :
        1. Identifie les noms, adresses, surfaces et numéros de titres fonciers mentionnés dans les pièces jointes au dossier.
        2. Applique rigoureusement les dispositions du Domaine National (Loi 64-46) ou de la Réforme Foncière selon le cas.
        3. Produis un acte complet prêt à être relu.`;

        const { generateCompletion } = await import('@/lib/ai');
        const content = await generateCompletion(prompt, contextDocs, 'DRAFTING');

        if (!content) throw new Error("Échec de la génération IA");

        const newDoc = await prisma.document.create({
            data: {
                name: `PROJET - ${templateName}.docx`,
                type: 'ACTE',
                category: 'FONCIER',
                status: 'DRAFT',
                dossierId: dossierId,
                ocrContent: content,
                versions: {
                    create: {
                        version: 1,
                        size: Buffer.byteLength(content, 'utf8'),
                        path: '/uploads/ai-land-draft.docx',
                        comment: `Généré automatiquement par LexAI (Modèle: ${templateName})`
                    }
                }
            }
        });

        revalidatePath(`/dossiers/${dossierId}`);
        return { success: true, documentId: newDoc.id, message: "Acte foncier généré avec succès." };

    } catch (error) {
        console.error("AI Land Gen Error:", error);
        return { success: false, message: "Erreur lors de la génération automatisée." };
    }
}

// Vérificateur de Conflits d'Intérêts IA
export async function checkConflict(partyName: string) {
    try {

        // Recherche dans les dossiers
        const matchingDossiers = await prisma.dossier.findMany({
            where: {
                OR: [
                    { client: { name: { contains: partyName } } },
                    { opposingParty: { contains: partyName } },
                    { title: { contains: partyName } }
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
            matches: matchingDossiers.map((d: any) => ({
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

// Note: La fonction signDocument réelle est définie plus haut (Ligne 410)

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

// Note: Les fonctions CARPA (getCarpaTransactions, createCarpaTransaction, etc.) réelles sont définies plus bas (Ligne 4302)


export async function generateProcedureSteps(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: { client: true }
        })

        if (!dossier) return { success: false, message: "Dossier non trouvé" }

        const prompt = `Génère un calendrier de procédure juridique détaillé pour le dossier suivant au Sénégal/OHADA :
        Titre : ${dossier.title}
        Type de procédure : ${dossier.procedureType || 'CIVIL'}
        Étape actuelle : ${dossier.stage || 'SAISINE'}
        Client : ${dossier.client.name}

        Ta mission : Lister les étapes clés à venir (étapes de procédure, délais légaux, actes à signifier, audiences types) pour ce type de dossier.
        
        FORMAT JSON ATTENDU :
        {
            "steps": [
                {
                    "title": "Nom de l'étape",
                    "description": "Explication de ce qu'il faut faire",
                    "estimatedTime": "Délai estimé (ex: +15 jours)",
                    "type": "ACTION" | "AUDIENCE" | "ECHEANCE"
                }
            ]
        }
        `;

        const completion = await openai?.chat.completions.create({
            messages: [
                { role: "system", content: "Tu es un expert en procédure civile et pénale sénégalaise (Code de Procédure Civile, Code de Procédure Pénale, Actes Uniformes OHADA)." },
                { role: "user", content: prompt }
            ],
            model: "deepseek-chat",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const result = completion?.choices[0].message.content;
        const parsed = result ? JSON.parse(result) : { steps: [] };

        return { success: true, steps: parsed.steps };
    } catch (e) {
        console.error("Procedure generation error:", e);
        return { success: false, message: "Erreur lors de la génération de la procédure" };
    }
}

export async function applyProcedureSteps(dossierId: string, steps: any[]) {
    try {
        for (const step of steps) {
            if (step.type === 'ACTION' || step.type === 'ECHEANCE') {
                await prisma.task.create({
                    data: {
                        title: step.title,
                        description: step.description + (step.estimatedTime ? ` (Délai estimé : ${step.estimatedTime})` : ''),
                        dossierId: dossierId,
                        priority: 'NORMAL'
                    }
                })
            } else if (step.type === 'AUDIENCE') {
                // For audiences, we create an event but since we don't have a fixed date from AI, 
                // we set it as a milestone or a task to fix the date.
                await prisma.event.create({
                    data: {
                        title: `[A VENIR] ${step.title}`,
                        description: step.description,
                        startDate: new Date(), // Placeholder
                        endDate: new Date(new Date().getTime() + 3600000),
                        type: 'AUDIENCE',
                        dossierId: dossierId
                    }
                })
            }
        }
        revalidatePath(`/dossiers/${dossierId}`)
        return { success: true, message: `${steps.length} étapes ajoutées au dossier.` }
    } catch (e) {
        console.error("Apply steps error:", e)
        return { success: false, message: "Erreur lors de l'application des étapes" }
    }
}

// --- RECHERCHE GLOBALE ---
import { globalSearch } from '@/lib/search-engine'

export async function performGlobalSearch(query: string) {
    try {
        return await globalSearch(query)
    } catch (e) {
        console.error("Search failed", e)
        return []
    }
}
// --- TIME TRACKING ---
export async function saveTimeEntry(data: { description: string, duration: number, dossierId?: string }) {
    try {
        let targetId = data.dossierId
        if (!targetId) {
            const lastDossier = await prisma.dossier.findFirst({ orderBy: { updatedAt: 'desc' } })
            targetId = lastDossier?.id
        }
        if (targetId) {
            await prisma.timeEntry.create({
                data: {
                    description: data.description,
                    duration: Math.ceil(data.duration / 60),
                    dossierId: targetId,
                    date: new Date()
                }
            })
            revalidatePath('/dashboard')
            return { success: true }
        }
        return { success: false, message: "Aucun dossier trouvé" }
    } catch (e) {
        return { success: false }
    }
}
// --- REAL AI ACTIONS (NO SIMULATION) ---

export async function getJusticePrediction(description: string, jurisdiction: string) {
    try {
        const result = await predictCaseOutcome(description, jurisdiction)

        // If API fails (no key), we might want to return a specific error or the mock as fallback.
        // But the user requested "REMPLACER PAR UNE VERSION REELLE". 
        // If result is null, it means no key or error.

        if (!result) {
            // Fallback for demo if no API key is present, to avoid breaking the UI for the user if they haven't set the key yet.
            // But log the warning.
            console.warn("Using Fallback Prediction (No API Key)")
            return {
                success: false,
                message: "API Key manquante ou erreur. Vérifiez les logs."
                // In a stricter 'real' version, we would fail. 
                // But for user experience, let's let the UI handle the error or show mock.
                // Reverting to Returning NULL to let UI decide.
            }
        }

        return { success: true, data: result }
    } catch (e) {
        console.error("Prediction Action Error", e)
        return { success: false, message: "Erreur interne" }
    }
}

export async function getAdverseDocumentAnalysis(text: string) {
    try {
        const result = await analyzeAdverseDocumentStrategy(text)
        if (!result) return { success: false, message: "Impossible d'analyser le document (API Error)" }
        return { success: true, data: result }
    } catch (e) {
        console.error("Adverse Analysis Action Error", e)
        return { success: false, message: "Erreur interne" }
    }
}

// ============ CARPA & FONDS TIERS ============

/**
 * Récupère les transactions CARPA d'un dossier
 */
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

/**
 * Crée une transaction CARPA avec journalisation automatique
 */
export async function createCarpaTransaction(data: {
    dossierId: string,
    amount: number, // Positif = dépôt, Négatif = retrait
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

        // 1. Enregistrement CARPA
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

        // 2. Journalisation SYSCOHADA
        // Débit 521 (Banque Fonds Tiers) / Crédit 467 (Fonds Gérés)
        const journal = await prisma.journal.findUnique({ where: { code: 'BQ' } })
        if (journal) {
            const carpaAccount = await ensureAccount('46700000', 'Fonds Tiers CARPA', 'PASSIF')
            const bankAccount = await ensureAccount('52120000', 'Banque CARPA', 'ACTIF')

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
                                credit: isDeposit ? 0 : absAmount,
                                dossierId: data.dossierId
                            },
                            {
                                accountId: carpaAccount.id,
                                debit: isDeposit ? 0 : absAmount,
                                credit: isDeposit ? absAmount : 0,
                                dossierId: data.dossierId
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
        return { success: false, message: "Échec de la transaction CARPA" }
    }
}

// ============ GESTION DES DÉBOURS (EXPENSES) ============

/**
 * Enregistre un frais ou un débours
 */
export async function createExpense(data: {
    dossierId: string,
    description: string,
    amount: number,
    category: string,
    type: 'FRAIS' | 'DEBOURS',
    billable: boolean,
    date?: Date
}) {
    try {
        const expense = await prisma.expense.create({
            data: {
                ...data,
                date: data.date || new Date(),
                status: 'TO_BILL'
            }
        })

        // Si c'est un débours, on génère une écriture comptable immédiatement
        // Débit 461 (Créances sur tiers - Débours) / Crédit 512 (Banque)
        if (data.type === 'DEBOURS') {
            const journal = await prisma.journal.findUnique({ where: { code: 'BQ' } })
            if (journal) {
                const debrAccount = await ensureAccount('46110000', 'Débours à refacturer', 'ACTIF')
                const bankAccount = await ensureAccount('51210000', 'Banque', 'ACTIF')

                await prisma.transaction.create({
                    data: {
                        journalId: journal.id,
                        description: `Débours: ${data.description}`,
                        date: data.date || new Date(),
                        reference: `DEB-${expense.id.slice(-5)}`,
                        status: 'VALIDATED',
                        lines: {
                            create: [
                                { accountId: debrAccount.id, debit: data.amount, credit: 0, dossierId: data.dossierId },
                                { accountId: bankAccount.id, debit: 0, credit: data.amount, dossierId: data.dossierId }
                            ]
                        }
                    }
                })

                await incrementBalance(debrAccount.id, data.amount)
                await incrementBalance(bankAccount.id, -data.amount)
            }
        }

        revalidatePath(`/dossiers/${data.dossierId}`)
        return { success: true, expense }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de l'enregistrement du frais" }
    }
}

/**
 * Automatisation de la refacturation des débours
 */
export async function reInvoiceExpense(expenseId: string) {
    try {
        const expense = await prisma.expense.findUnique({
            where: { id: expenseId },
            include: { dossier: { include: { client: true } } }
        })

        if (!expense || expense.status !== 'TO_BILL') return { success: false, message: "Débours déjà facturé ou introuvable" }

        // Création d'une facture automatique pour ce débours
        const res = await createInvoice({
            clientId: expense.dossier.clientId,
            dossierId: expense.dossierId,
            items: [{
                description: `Refacturation : ${expense.description}`,
                quantity: 1,
                unitPrice: expense.amount
            }],
            type: 'FACTURE',
            tvaRate: 0 // Souvent les débours sont sans TVA car déjà payée
        })

        if (res.success) {
            await prisma.expense.update({
                where: { id: expenseId },
                data: { status: 'BILLED' }
            })
            return { success: true, message: "Débours ajouté à une nouvelle facture" }
        }

        return { success: false, message: "Échec de la refacturation" }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur technique" }
    }
}

// ============ TABLEAU DE BORD PILOTAGE ASSOCIÉ ============

/**
 * Récupère les indicateurs de rentabilité globale du cabinet
 */
export async function getGlobalAnalytics() {
    try {
        const dossiers = await prisma.dossier.findMany({
            include: {
                factures: { include: { payments: true } },
                expenses: true,
                timeEntries: true
            }
        })

        const settings = await prisma.cabinetSettings.findFirst()
        const internalRate = settings?.internalHourlyRate || 50.0

        let totalRevenue = 0
        let totalEncaisse = 0
        let totalExpenses = 0
        let totalTimeCost = 0
        let totalHours = 0

        const dossierStats = dossiers.map((d: any) => {
            const rev = d.factures.reduce((s: number, f: any) => s + f.amountHT, 0)
            const enc = d.factures.reduce((s: number, f: any) => s + f.payments.reduce((sp: number, p: any) => sp + p.amount, 0), 0)
            const exp = d.expenses.reduce((s: number, e: any) => s + e.amount, 0)
            const hours = d.timeEntries.reduce((s: number, t: any) => s + t.duration, 0) / 60
            const tCost = hours * internalRate

            totalRevenue += rev
            totalEncaisse += enc
            totalExpenses += exp
            totalHours += hours
            totalTimeCost += tCost

            return {
                id: d.id,
                title: d.title,
                reference: d.reference,
                revenue: rev,
                margin: rev - exp - tCost,
                profitability: rev > 0 ? ((rev - exp - tCost) / rev) * 100 : 0
            }
        })

        return {
            summary: {
                totalRevenue,
                totalEncaisse,
                totalExpenses,
                totalTimeCost,
                globalMargin: totalRevenue - totalExpenses - totalTimeCost,
                totalHours
            },
            dossiers: dossierStats.sort((a: any, b: any) => b.margin - a.margin).slice(0, 10) // Top 10 rentabilité
        }
    } catch (e) {
        console.error(e)
        return null
    }
}

// ============ PORTAIL CLIENT ============

export async function loginClientPortal(email: string, accessCode: string) {
    if (!email || !accessCode) return { success: false, message: "Email et code requis." }

    try {
        const client = await prisma.client.findFirst({
            where: {
                email: { equals: email, mode: 'insensitive' },
                accessCode
            }
        })

        if (!client) return { success: false, message: "Email ou code d'accès invalide." }

        // Set cookie for server-side layout access (await cookies() for Next.js 15+)
        const cookieStore = await cookies()
        cookieStore.set('portal_token', client.id, {
            httpOnly: false, // Allow client-side access for consistency
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return { success: true, clientId: client.id, name: client.name }
    } catch (e) {
        console.error("Login Portal Error:", e)
        return { success: false, message: "Erreur de connexion technique." }
    }
}

/**
 * Envoie les accès au portail (Email + WhatsApp)
 */
export async function sendClientPortalAccess(clientId: string) {
    try {
        const client = await prisma.client.findUnique({ where: { id: clientId } })
        if (!client || !client.email) return { success: false, message: "Client ou email manquant." }

        // Generate access code if empty
        let accessCode = client.accessCode
        if (!accessCode) {
            accessCode = Math.floor(100000 + Math.random() * 900000).toString()
            await prisma.client.update({ where: { id: clientId }, data: { accessCode } })
        }

        const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://lexapp.vercel.app'}/portal/login`

        // 1. Email
        await sendEmail({
            to: client.email,
            subject: "🔐 Vos accès sécurisés - LEXAPP",
            html: clientAccessEmailTemplate(client.name, accessCode, portalUrl)
        })

        // 2. WhatsApp
        if (client.phone) {
            await sendWhatsApp({
                phone: client.phone,
                message: formatClientAccessWhatsAppMessage(client.name, accessCode, portalUrl)
            })
        }

        return { success: true, message: "Accès envoyés par email et WhatsApp." }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de l'envoi des accès." }
    }
}

/**
 * Récupère les données pour l'espace client
 */
export async function getClientPortalData(clientId: string) {
    try {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                dossiers: {
                    include: {
                        documents: {
                            where: {
                                status: { in: ['SIGNED', 'PENDING_SIGNATURE'] }
                            }
                        },
                        factures: { include: { payments: true } },
                        communications: {
                            where: { direction: 'OUTBOUND' },
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        },
                        events: {
                            where: { type: 'AUDIENCE' },
                            orderBy: { startDate: 'asc' }
                        }
                    }
                }
            }
        })
        return client
    } catch (e) {
        return null
    }
}

// ============ ARCHIVAGE LÉGAL ============

export async function createArchiveBox(data: { code: string, location: string, description?: string }) {
    if (!data.code || !data.location) return null

    try {
        // Enforce prefix or format if needed
        return await prisma.archiveBox.create({
            data: {
                ...data,
                status: 'OPEN'
            }
        })
    } catch (e) {
        console.error("Create Archive Box Error:", e)
        return null
    }
}

export async function archiveDossier(dossierId: string, archiveBoxId: string) {
    try {
        await prisma.dossier.update({
            where: { id: dossierId },
            data: { status: 'ARCHIVE' }
        })

        await prisma.document.updateMany({
            where: { dossierId },
            data: { archiveBoxId, archivedAt: new Date(), status: 'ARCHIVED' }
        })

        revalidatePath('/dossiers')
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

// ============ LEXAI AVANT-GARDE ============

export async function generateExecutiveSummary(dossierId: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: {
                client: true,
                documents: { take: 5, orderBy: { updatedAt: 'desc' }, where: { ocrContent: { not: null } } },
                tasks: { where: { completed: false }, take: 5 },
                events: { where: { startDate: { gte: new Date() } }, take: 3, orderBy: { startDate: 'asc' } },
                carpaTransactions: true,
                expenses: true
            }
        })

        if (!dossier) return { success: false, message: "Dossier non trouvé" }

        // CACHE LOGIC: Check if summary exists and is fresh (generated AFTER last update)
        if (dossier.aiSummary && dossier.aiSummaryAt && dossier.updatedAt <= dossier.aiSummaryAt) {
            return { success: true, summary: dossier.aiSummary, cached: true }
        }

        const carpaBalance = dossier.carpaTransactions.reduce((acc: number, t: any) => acc + t.amount, 0)
        const totalExpenses = dossier.expenses.reduce((acc: number, e: any) => acc + e.amount, 0)

        const docSummaries = dossier.documents.map(d => `${d.name}: ${d.ocrContent?.substring(0, 100)}...`).join('\n')
        const taskTitles = dossier.tasks.map(t => t.title).join(', ')
        const upcomingEvents = dossier.events.map((e: any) => `${e.title} le ${e.startDate.toLocaleDateString()}`).join(', ')

        const prompt = `Génère une synthèse executive FLASH (style 60 secondes pour un avocat d'élite) :
        Dossier : ${dossier.title} | Client : ${dossier.client.name}
        Finance : Solde CARPA ${carpaBalance} CFA | Débours ${totalExpenses} CFA
        Actualité : ${docSummaries}
        Agenda : ${upcomingEvents}
        Tâches : ${taskTitles}
        
        Réponds avec :
        1. 📍 STATUT ACTUEL (1 phrase)
        2. ⚡ URGENCES & RISQUES
        3. 🎯 ACTIONS PRIORITAIRES
        4. 💰 SOLDE & RENTABILITÉ`

        const summary = await generateCompletion(prompt, [], "RESEARCH")

        if (summary) {
            // Save to Cache
            await prisma.dossier.update({
                where: { id: dossierId },
                data: {
                    aiSummary: summary,
                    aiSummaryAt: new Date()
                }
            })
        }

        return { success: true, summary: summary || "Erreur de génération.", cached: false }
    } catch (e) {
        return { success: false, message: "Erreur technique" }
    }
}

export async function askDossierAIAssistant(dossierId: string, question: string) {
    try {
        const dossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            include: {
                client: true,
                documents: {
                    where: { ocrContent: { not: null } },
                    take: 10,
                    orderBy: { updatedAt: 'desc' }
                }
            }
        })

        if (!dossier) return { success: false, message: "Dossier non trouvé" }

        const contextDocs = dossier.documents.map(d => ({
            title: d.name,
            content: d.ocrContent || "",
            reference: d.category || "DOCUMENT"
        }))

        const prompt = `En tant qu'assistant juridique d'élite travaillant sur le dossier "${dossier.title}" pour le client "${dossier.client.name}", réponds à cette question en te basant exclusivement sur les documents du dossier fournis en contexte :
        
        QUESTION : "${question}"
        
        Si l'information n'est pas dans les documents, précise-le.`

        const answer = await generateCompletion(prompt, contextDocs, "RESEARCH")
        return { success: true, answer: answer || "Désolé, je n'ai pas pu trouver l'information." }
    } catch (e) {
        return { success: false, message: "Erreur Chat IA" }
    }
}

// ============ MODULE DE RECOUVREMENT ============

/**
 * Envoie une relance de paiement (email ou WhatsApp)
 */
export async function sendRelance(data: {
    invoiceId: string
    type: 'COURTOISE' | 'FERME' | 'MISE_EN_DEMEURE'
    customMessage?: string
    channel: 'EMAIL' | 'WHATSAPP'
}) {
    try {
        const invoice = await prisma.facture.findUnique({
            where: { id: data.invoiceId },
            include: { client: true, dossier: true }
        })

        if (!invoice) return { success: false, message: "Facture introuvable" }
        if (!invoice.client) return { success: false, message: "Client introuvable" }

        const message = data.customMessage || `Rappel de paiement pour la facture ${invoice.number}`

        // Envoi selon le canal
        if (data.channel === 'EMAIL' && invoice.client.email) {
            await sendEmail({
                to: invoice.client.email,
                subject: data.type === 'MISE_EN_DEMEURE'
                    ? `⚠️ MISE EN DEMEURE - Facture ${invoice.number}`
                    : `Rappel Facture ${invoice.number}`,
                html: paymentReminderEmailTemplate(
                    invoice.client.name,
                    invoice.number,
                    invoice.amountTTC,
                    (invoice.dueDate || new Date()).toLocaleDateString('fr-FR'),
                    message
                )
            })
        } else if (data.channel === 'WHATSAPP' && invoice.client.phone) {
            await sendWhatsApp({
                phone: invoice.client.phone,
                message: `🔔 *Rappel de paiement*\n\n${message}\n\nFacture: ${invoice.number}\nMontant: ${invoice.amountTTC.toLocaleString('fr-FR')} FCFA`
            })
        }

        // Enregistrement de la relance (si table existe)
        // await prisma.relance.create({ data: { invoiceId: data.invoiceId, type: data.type } })

        revalidatePath('/factures')
        return { success: true, message: "Relance envoyée avec succès" }
    } catch (e) {
        console.error("Erreur envoi relance:", e)
        return { success: false, message: "Échec de l'envoi de la relance" }
    }
}

/**
 * Génère une mise en demeure formelle (document PDF)
 */
export async function generateMiseEnDemeure(invoiceId: string) {
    try {
        const invoice = await prisma.facture.findUnique({
            where: { id: invoiceId },
            include: { client: true, dossier: true }
        })

        if (!invoice) return { success: false, message: "Facture introuvable" }

        const settings = await prisma.cabinetSettings.findFirst()

        const content = `
MISE EN DEMEURE DE PAYER

${settings?.name || "Cabinet d'Avocats"}
${settings?.address || "Adresse du Cabinet"}
RCCM: ${settings?.tradeRegister || "N/A"}

Dakar, le ${new Date().toLocaleDateString('fr-FR')}

À l'attention de :
${invoice.client.name}
${invoice.client.address || ""}

OBJET : MISE EN DEMEURE DE PAYER - Facture N° ${invoice.number}

Madame, Monsieur,

Par la présente, nous vous mettons EN DEMEURE de procéder au règlement de la facture ci-après désignée :

- Numéro de facture : ${invoice.number}
- Date d'émission : ${invoice.issueDate.toLocaleDateString('fr-FR')}
- Date d'échéance : ${invoice.dueDate?.toLocaleDateString('fr-FR') || 'N/A'}
- Montant TTC : ${invoice.amountTTC.toLocaleString('fr-FR')} FCFA

À ce jour, et malgré nos relances, cette facture demeure impayée.

Nous vous accordons un DÉLAI DE 15 JOURS à compter de la réception de la présente pour régulariser votre situation.

À défaut de paiement dans ce délai, nous nous verrons dans l'obligation d'engager à votre encontre une procédure de recouvrement contentieux, SANS AUTRE AVIS, avec application des pénalités de retard et indemnité forfaitaire pour frais de recouvrement conformément aux articles L. 441-6 du Code de Commerce.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

${settings?.name || "Le Cabinet"}
        `

        // Créer un document dans le dossier
        const doc = await prisma.document.create({
            data: {
                name: `Mise_en_Demeure_${invoice.number}.txt`,
                type: 'MISE_EN_DEMEURE',
                category: 'JURIDIQUE',
                dossierId: invoice.dossierId || '',
                status: 'PENDING_SIGNATURE',
                ocrContent: content,
                versions: {
                    create: {
                        version: 1,
                        size: Buffer.byteLength(content, 'utf8'),
                        path: `/uploads/mise_en_demeure_${invoice.id}.txt`,
                        comment: 'Mise en demeure générée automatiquement'
                    }
                }
            }
        })

        revalidatePath('/factures')
        return { success: true, documentId: doc.id, content }
    } catch (e) {
        console.error("Erreur génération mise en demeure:", e)
        return { success: false, message: "Erreur lors de la génération" }
    }
}

/**
 * Calcule le score de risque client (0-100)
 */
export async function calculateClientRiskScore(clientId: string) {
    try {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                factures: {
                    include: { payments: true }
                },
                dossiers: true
            }
        })

        if (!client) return 0

        let score = 0

        // Facteur 1: Historique de paiement
        const totalInvoices = client.factures.length
        const paidInvoices = client.factures.filter(f => f.status === 'PAYEE').length
        const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) : 1
        score += (1 - paymentRate) * 40 // Max 40 points si jamais payé

        // Facteur 2: Délai moyen de paiement
        const avgDelay = client.factures.reduce((acc, inv) => {
            const paid = inv.payments[0]?.date
            if (!paid) return acc
            const delay = Math.max(0, Math.floor((paid.getTime() - (inv.dueDate?.getTime() || paid.getTime())) / (1000 * 60 * 60 * 24)))
            return acc + delay
        }, 0) / Math.max(totalInvoices, 1)

        if (avgDelay > 60) score += 30
        else if (avgDelay > 30) score += 15

        // Facteur 3: Montant actuel impayé
        const unpaid = client.factures
            .filter(f => f.status !== 'PAYEE')
            .reduce((sum, f) => sum + f.amountTTC, 0)

        if (unpaid > 10000000) score += 20 // > 10M
        else if (unpaid > 5000000) score += 10

        // Facteur 4: Nombre de relances
        // (Simplification - normalement on compte les relances depuis une table dédiée)
        const hasMultipleUnpaid = client.factures.filter(f => f.status !== 'PAYEE').length > 3
        if (hasMultipleUnpaid) score += 10

        return Math.min(100, Math.round(score))
    } catch (e) {
        return 50 // Score neutre en cas d'erreur
    }
}

export async function structureLegalNote(transcript: string) {
    try {
        const prompt = `Tu es un assistant juridique expert en droit sénégalais et OHADA. 
        Analyse et structure la transcription suivante en une note d'audience professionnelle :
        
        TRANSCRIPTION : "${transcript}"
        
        CONSIGNE : 
        1. Identifie les parties présentes (Conseil, Prévenu, etc.).
        2. Résume les faits et les moyens de défense invoqués.
        3. Identifie les demandes formulées (ex: Liberté Provisoire).
        4. Identifie les réquisitions du ministère public si mentionnées.
        5. Propose une liste d'actions tactiques à prévoir.
        
        Format : Markdown structuré.`;

        const result = await generateCompletion(prompt, [], "ANALYSIS");
        return { success: true, note: result };
    } catch (e) {
        console.error("Transcription structuring error:", e);
        return { success: false, message: "Erreur lors du traitement IA" };
    }
}


export async function initJurisprudenceLibrary() {
    try {
        const count = await prisma.jurisprudence.count()
        if (count === 0) {
            // Seed logic is in seed.mjs, but we can do a quick check/init here if empty
            // For now, assume seed.mjs is used.
            return { success: true, message: "Base vide. Veuillez initialiser avec seed." }
        }
        return { success: true, message: "Base chargée" }
    } catch (e) {
        return { success: false }
    }
}

export async function searchJurisprudenceAdvanced(query: string) {
    try {
        const results = await prisma.jurisprudence.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { summary: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                    { keywords: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 20
        })
        return { success: true, results }
    } catch (e) {
        return { success: false, results: [], message: "Erreur recherche" }
    }
}

export const searchJurisprudence = searchJurisprudenceAdvanced; // Alias for backward compatibility

// --- DYNAMIC MAIL & WORKFLOW ACTIONS ---

/**
 * Récupère tous les courriers avec leurs informations de workflow
 */
export async function getMails() {
    try {
        const mails = await prisma.mail.findMany({
            include: {
                client: { select: { name: true } },
                dossier: { select: { reference: true, title: true } },
                workflow: {
                    include: { steps: { orderBy: { order: 'asc' } } }
                }
            },
            orderBy: { receivedAt: 'desc' }
        })
        return mails
    } catch (e) {
        console.error("Error fetching mails:", e)
        return []
    }
}

/**
 * Récupère le détail d'un courrier spécifique
 */
export async function getMailDetails(id: string) {
    try {
        const mail = await prisma.mail.findUnique({
            where: { id },
            include: {
                client: true,
                dossier: true,
                activities: {
                    include: { user: { select: { name: true, avatarUrl: true } } },
                    orderBy: { createdAt: 'desc' }
                },
                workflow: {
                    include: { steps: { orderBy: { order: 'asc' } } }
                }
            }
        })
        return mail
    } catch (e) {
        return null
    }
}

/**
 * Récupère tous les modèles de workflows disponibles
 */
export async function getMailWorkflows() {
    try {
        const workflows = await prisma.mailWorkflow.findMany({
            where: { isActive: true },
            include: { steps: { orderBy: { order: 'asc' } } }
        })
        return workflows
    } catch (e) {
        return []
    }
}

/**
 * Crée un nouveau courrier et initialise son workflow
 */
export async function createMail(data: any) {
    try {
        const userId = cookies().get('auth_token')?.value
        if (!userId) return { success: false, message: "Non connecté" }

        // Trouver la première étape du workflow choisi
        const workflow = await prisma.mailWorkflow.findUnique({
            where: { id: data.workflowId },
            include: { steps: { orderBy: { order: 'asc' }, take: 1 } }
        })

        if (!workflow) return { success: false, message: "Workflow introuvable" }

        const mail = await prisma.mail.create({
            data: {
                reference: `COUR-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
                subject: data.subject,
                type: data.type || 'INBOUND',
                category: data.category || 'GENERAL',
                sender: data.sender,
                recipient: data.recipient,
                priority: data.priority || 'NORMAL',
                clientId: data.clientId,
                dossierId: data.dossierId,
                workflowId: data.workflowId,
                currentStepId: workflow.steps[0].id,
                content: data.content,
                activities: {
                    create: {
                        action: 'RECEPTION',
                        userId: userId,
                        comment: "Initialisation du courrier dans le système."
                    }
                }
            }
        })

        revalidatePath('/courrier')
        return { success: true, mailId: mail.id }
    } catch (e) {
        console.error("Create mail error:", e)
        return { success: false, message: "Erreur lors de la création du courrier" }
    }
}

/**
 * Fait progresser un courrier dans son workflow
 */
export async function transitionMail(mailId: string, nextStepId: string, comment?: string) {
    try {
        const userId = cookies().get('auth_token')?.value
        if (!userId) return { success: false, message: "Non connecté" }

        const mail = await prisma.mail.findUnique({
            where: { id: mailId },
            include: { workflow: { include: { steps: true } } }
        })

        if (!mail) return { success: false, message: "Courrier introuvable" }

        const fromStepId = mail.currentStepId
        const fromStep = mail.workflow?.steps.find(s => s.id === fromStepId)
        const toStep = mail.workflow?.steps.find(s => s.id === nextStepId)

        await prisma.mail.update({
            where: { id: mailId },
            data: {
                currentStepId: nextStepId,
                status: toStep?.label.includes('CLÔTURÉ') || toStep?.label.includes('ENVOI') ? 'VALIDE' : 'EN_COURS',
                activities: {
                    create: {
                        action: 'TRANSITION',
                        userId: userId,
                        fromStep: fromStep?.label || "Inconnu",
                        toStep: toStep?.label || "Inconnu",
                        comment: comment || `Passage de l'étape ${fromStep?.label} à ${toStep?.label}`
                    }
                }
            }
        })

        revalidatePath('/courrier')
        revalidatePath(`/courrier/${mailId}`)
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur lors de la transition du workflow" }
    }
}

/**
 * Statistiques rapides pour le tableau de bord courrier
 */
export async function getWorkflowStats() {
    try {
        const total = await prisma.mail.count()
        const urgent = await prisma.mail.count({ where: { priority: 'URGENT' } })
        const pending = await prisma.mail.count({ where: { status: { in: ['NOUVEAU', 'EN_COURS'] } } })

        return { total, urgent, pending }
    } catch (e) {
        return { total: 0, urgent: 0, pending: 0 }
    }
}

export async function generatePublicLegalAdvice(question: string, topic: string) {
    try {
        const systemPrompt = `Tu es LexPublic, un assistant juridique virtuel représenté par un petit enfant africain angélique. 
        Ton ton doit être extrêmement courtois, doux, protecteur et plein de sagesse. 
        Tu t'adresses au grand public pour donner des informations juridiques GRATUITES et claires sur le thème : ${topic}.
        
        CONSIGNES :
        1. Sois très poli ("Maître" pour les avocats, "Monsieur/Madame" pour le public, utilise des formules comme "J'ai l'immense honneur de vous éclairer").
        2. Donne des informations générales basées sur le droit OHADA et Sénégalais.
        3. Ne donne JAMAIS de conseil juridique ferme (précise que tu es une IA).
        4. Ton but final est d'aider l'utilisateur à comprendre sa situation tout en l'encourageant gentiment à demander un rappel d'un véritable avocat du cabinet LexPremium pour une analyse certifiée.
        
        Réponds avec bienveillance et précision.`

        const response = await generateCompletion(question, [], "DRAFTING", systemPrompt)

        return {
            success: true,
            text: response || "Je vous prie de m'excuser, mais ma sagesse rencontre une limite technique. Pourriez-vous reformuler votre demande, s'il vous plaît ?"
        }
    } catch (error) {
        console.error("LexPublic AI Error:", error)
        return { success: false, message: "Une erreur est survenue lors de ma réflexion." }
    }
}

/**
 * Assistant support intelligent pour l'utilisation de l'application
 */
export async function generateSupportResponse(question: string) {
    try {
        const systemPrompt = `Tu es LexSupport, l'assistant intelligent de l'ERP LexPremium (Gestion de Cabinet d'Avocats). 
        Ton rôle est d'aider les utilisateurs (Avocats, Assistants, Gestionnaires) à utiliser l'application.
        
        ARCHITECTURE DE L'APP :
        - Dossiers : Gestion des affaires, pièces, événements, factures liées.
        - Comptabilité : Journal VE (Ventes), AC (Achats), BQ (Banque), OD (Opérations Diverses). Conforme SYSCOHADA.
        - LexAI : Analyse de documents, Red Teaming, Oracle de jurisprudence.
        - Bibliothèque : Jurisprudence CCJA et Cour Suprême Sénégal.
        - Courrier : Workflows de validation des lettres entrantes/sortantes.
        - Portail Client : Extranet pour que les clients voient leurs dossiers.
        - RH : Gestion des collaborateurs et des congés.
        
        CONSIGNES :
        1. Sois professionnel, efficace et poli (utilise "Maître").
        2. Donne des étapes concrètes quand c'est possible.
        3. Si tu ne sais pas, propose de contacter le support technique@lexpremium.sn.
        4. Réponds toujours en français.`

        const response = await generateCompletion(question, [], "DRAFTING", systemPrompt)

        return {
            success: true,
            text: response || "Je suis désolé Maître, je n'ai pas pu générer de réponse. Un agent va vous aider sous peu."
        }
    } catch (error) {
        console.error("Support AI Error:", error)
        return { success: false, message: "Erreur technique de support." }
    }
}
