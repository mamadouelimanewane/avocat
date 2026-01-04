
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DossierDetailClient from '@/components/dossier/DossierDetailClient'

export default async function DossierDetailPage({ params }: { params: { id: string } }) {
    const dossier = await prisma.dossier.findUnique({
        where: { id: params.id },
        include: {
            client: true,
            documents: {
                include: {
                    versions: {
                        orderBy: { version: 'desc' },
                        take: 1,
                        include: { uploadedBy: { select: { name: true } } }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            },
            timeEntries: true,
            carpaTransactions: {
                orderBy: { date: 'desc' }
            },
            factures: {
                include: { payments: true }
            }
        }
    })

    if (!dossier) {
        notFound()
    }

    const templates = await prisma.template.findMany({
        orderBy: { name: 'asc' }
    })

    const expenses = await prisma.expense.findMany({
        where: { dossierId: params.id },
        orderBy: { date: 'desc' }
    })

    return (
        <DossierDetailClient
            dossier={dossier}
            templates={templates}
            expenses={expenses}
        />
    )
}
