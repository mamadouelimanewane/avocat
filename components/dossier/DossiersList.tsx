
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, FolderOpen, Clock, Calendar, ArrowRight, ShieldCheck, Scale, MousePointer2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
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
        <div className="space-y-6">
            {/* Header / Search Area */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Rechercher par référence, titre ou client..."
                        className="pl-12 pr-4 h-12 w-full rounded-2xl border-none bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">
                        {filteredDossiers.length} Dossiers
                    </div>
                    <ExportButton
                        data={exportData}
                        filename="Liste_Dossiers"
                        sheetName="Dossiers"
                        label="Exporter Excel"
                        variant="outline"
                        className="rounded-xl border-slate-200"
                    />
                </div>
            </div>

            {/* Grid View (Alternative to Table for Mobile/Premium Feel) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDossiers.map((dossier) => (
                    <Link
                        key={dossier.id}
                        href={`/dossiers/${dossier.id}`}
                        className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
                    >
                        {/* Status Accent Bar */}
                        <div className={cn(
                            "absolute top-0 right-10 h-10 w-2 rounded-b-full transition-transform group-hover:scale-y-110",
                            dossier.status === 'OUVERT' ? 'bg-emerald-500' :
                                dossier.status === 'CLOTURE' ? 'bg-slate-300' :
                                    'bg-amber-500'
                        )} />

                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <Badge variant="secondary" className="mb-3 bg-slate-100 text-slate-600 font-black tracking-widest text-[10px] uppercase px-3 py-1 rounded-full border-none">
                                    {dossier.reference}
                                </Badge>
                                <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {dossier.title}
                                </h3>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <Scale className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    <span className="font-bold text-slate-700">{dossier.client.name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <div className="text-[10px] text-slate-500 font-bold uppercase overflow-hidden">
                                            {formatDate(dossier.updatedAt)}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">
                                            {dossier._count.timeEntries} min
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                Inspecter Dossier
                                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredDossiers.length === 0 && (
                <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                    <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-slate-900">Aucun dossier trouvé</h4>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Affinez vos critères de recherche ou créez une nouvelle affaire.</p>
                </div>
            )}
        </div>
    )
}
