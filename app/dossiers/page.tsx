
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Search, FolderOpen, Calendar, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from '@/lib/utils'
import { NewDossierDialog } from '@/components/dossier/NewDossierDialog'

export default async function DossiersPage() {
    const dossiers = await prisma.dossier.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
            client: true,
            _count: {
                select: { documents: true, events: true, timeEntries: true }
            }
        }
    })

    const clientsList = await prisma.client.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dossiers</h1>
                    <p className="text-slate-500 mt-1">Gérez vos affaires juridiques.</p>
                </div>
                <NewDossierDialog clients={clientsList} />
            </div>

            <div className="flex items-center space-x-2">
                {/* Search Input Placeholder */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                        type="search"
                        placeholder="Rechercher un dossier..."
                        className="pl-9 h-10 w-[300px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                    />
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                            <TableHead className="w-[300px] border border-slate-200 font-bold text-slate-700">Référence / Titre</TableHead>
                            <TableHead className="border border-slate-200 font-bold text-slate-700">Client</TableHead>
                            <TableHead className="border border-slate-200 font-bold text-slate-700">Statut</TableHead>
                            <TableHead className="border border-slate-200 font-bold text-slate-700">Mise à jour</TableHead>
                            <TableHead className="border border-slate-200 font-bold text-slate-700">Contenu</TableHead>
                            <TableHead className="text-right border border-slate-200 font-bold text-slate-700">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dossiers.map((dossier) => (
                            <TableRow key={dossier.id} className="hover:bg-slate-50 group border-b border-slate-200">
                                <TableCell className="border border-slate-200">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900 flex items-center gap-2">
                                            <FolderOpen className="h-4 w-4 text-amber-500" />
                                            {dossier.reference}
                                        </span>
                                        <span className="text-slate-500 text-sm truncate max-w-[250px]">{dossier.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    <Link href={`/clients/${dossier.clientId}`} className="text-primary hover:underline font-medium">
                                        {dossier.client.name}
                                    </Link>
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    <Badge variant={
                                        dossier.status === 'OUVERT' ? 'success' :
                                            dossier.status === 'CLOTURE' ? 'secondary' :
                                                dossier.status === 'EN_ATTENTE' ? 'warning' : 'default'
                                    }>
                                        {dossier.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm border border-slate-200">
                                    {formatDate(dossier.updatedAt)}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    <div className="flex gap-3 text-slate-400 text-xs">
                                        <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {dossier._count.timeEntries}h</span>
                                        <span className="flex items-center"><Calendar className="mr-1 h-3 w-3" /> {dossier._count.events}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right border border-slate-200">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/dossiers/${dossier.id}`}>
                                            Ouvrir <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
