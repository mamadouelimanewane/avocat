'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

        // Set Cookie
        const cookieStore = await cookies()
        cookieStore.set('client_access', client.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        })

        return { success: true, clientId: client.id, name: client.name }
    } catch (e) {
        console.error("Login Portal Error:", e)
        return { success: false, message: "Erreur de connexion technique." }
    }
}

export async function getPortalDashboardData() {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('client_access')?.value
    if (!clientId) {
        return { client: null }
    }

    try {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                dossiers: {
                    include: {
                        events: true,
                        documents: true,
                        factures: true
                    }
                },
                factures: true
            }
        })

        return { client }
    } catch (e) {
        return { client: null }
    }
}

export async function getPortalAllInvoices() {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('client_access')?.value
    if (!clientId) return { success: false, message: "Non connecté" }

    try {
        const factures = await prisma.facture.findMany({
            where: { clientId: clientId },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, factures }
    } catch (e) {
        return { success: false, message: "Erreur récupération factures." }
    }
}

export async function getPortalAllDossiers() {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('client_access')?.value
    if (!clientId) return { success: false, message: "Non connecté" }

    try {
        const dossiers = await prisma.dossier.findMany({
            where: { clientId: clientId },
            include: {
                _count: {
                    select: {
                        documents: true,
                        events: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, dossiers }
    } catch (e) {
        return { success: false, message: "Erreur récupération dossiers." }
    }
}

export async function getPortalAllDocuments() {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('client_access')?.value
    if (!clientId) return { success: false, message: "Non connecté" }

    try {
        const dossiers = await prisma.dossier.findMany({
            where: { clientId: clientId },
            select: {
                documents: true
            }
        })
        const documents = dossiers.flatMap(d => d.documents)
        return { success: true, documents }
    } catch (e) {
        return { success: false, message: "Erreur récupération documents." }
    }
}

export async function logoutClient() {
    const cookieStore = await cookies()
    cookieStore.delete('client_access')
    redirect('/portal/login')
}
