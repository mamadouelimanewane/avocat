
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DocumentsTab from '@/components/dossier/DocumentsTab'
import FinanceTab from '@/components/dossier/FinanceTab'
import ExpensesTab from '@/components/dossier/ExpensesTab'
import DossierOverview from '@/components/dossier/DossierOverview'

const prisma = new PrismaClient()

export default async function DossierDetailPage({ params }: { params: { id: string } }) {
    const dossier = await prisma.dossier.findUnique({
        where: { id: params.id },
        include: { client: true }
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
        <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <Link href="/dossiers" className="hover:text-slate-900 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Dossiers
                </Link>
                <span>/</span>
                <span className="font-medium text-slate-900">{dossier.reference}</span>
            </div>

            {/* Header Info */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{dossier.title}</h1>
                        <Badge variant={dossier.status === 'OUVERT' ? 'success' : 'default'} className="mt-1">
                            {dossier.status}
                        </Badge>
                    </div>
                    <p className="text-slate-500 mt-2 text-lg">
                        Client : <span className="font-semibold text-slate-800">{dossier.client.name}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Clock className="mr-2 h-4 w-4" /> Saisir Temps
                    </Button>
                    <Button size="sm" className="bg-slate-900 text-white">Facturer</Button>
                </div>
            </div>

            {/* Main Content Tabs */}
            <div className="mt-8">
                <Tabs defaultValue="documents" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                        <TabsTrigger value="overview">Vue Global</TabsTrigger>
                        <TabsTrigger value="documents">GED & Actes</TabsTrigger>
                        <TabsTrigger value="expenses">Frais</TabsTrigger>
                        <TabsTrigger value="procedure">Procédure</TabsTrigger>
                        <TabsTrigger value="billing">Finances</TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="overview">
                            <DossierOverview dossier={dossier} />
                        </TabsContent>

                        <TabsContent value="expenses">
                            <ExpensesTab dossierId={dossier.id} expenses={expenses} />
                        </TabsContent>

                        <TabsContent value="documents">
                            <DocumentsTab dossierId={dossier.id} templates={templates} />
                        </TabsContent>

                        <TabsContent value="procedure">
                            <div className="p-4 bg-white border border-slate-200 rounded-lg h-64 flex items-center justify-center text-slate-400">
                                Calendrier de procédure...
                            </div>
                        </TabsContent>

                        <TabsContent value="billing">
                            <FinanceTab dossierId={dossier.id} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
