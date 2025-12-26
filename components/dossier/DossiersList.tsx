
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, FolderOpen, Clock, Calendar, ArrowRight } from 'lucide-react'
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
import { ExportButton } from '@/components/ui/ExportButton'

interface DossierWithDetails {
    id: string
    reference: string
    title: string
    status: string
    updatedAt: Date
    clientId: string
    client: {
        name: string
    }
    _count: {
        documents: number
        events: number
        timeEntries: number
    }
}

interface DossiersListProps {
    initialDossiers: DossierWithDetails[]
}

export function DossiersList({ initialDossiers }: DossiersListProps) {
    const [search, setSearch] = useState('')

    const filteredDossiers = initialDossiers.filter(d =>
        d.reference.toLowerCase().includes(search.toLowerCase()) ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.client.name.toLowerCase().includes(search.toLowerCase())
    )

    const exportData = filteredDossiers.map(d => ({
        Reference: d.reference,
        Titre: d.title,
        Client: d.client.name,
        Statut: d.status,
        Documents: d._count.documents,
        Evenements: d._count.events,
        Temps_Minutes: d._count.timeEntries,
        Derniere_MAJ: d.updatedAt
    }))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                        type="search"
                        placeholder="Rechercher un dossier..."
                        className="pl-9 h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ExportButton
                    data={exportData}
                    filename="Liste_Dossiers"
                    sheetName="Dossiers"
                    label="Exporter Excel"
                    variant="outline"
                />
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
                        {filteredDossiers.map((dossier) => (
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
                                        <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {dossier._count.timeEntries}</span>
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
                        {filteredDossiers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                    Aucun dossier trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
