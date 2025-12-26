
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Building2, User, Phone, MapPin, MoreHorizontal, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExportButton } from '@/components/ui/ExportButton'

interface ClientWithDetails {
    id: string
    name: string
    type: string
    email: string | null
    phone: string | null
    city: string | null
    country: string | null
    accessCode: string | null
    createdAt: Date
    _count: {
        dossiers: number
    }
}

interface ClientsListProps {
    initialClients: ClientWithDetails[]
}

export function ClientsList({ initialClients }: ClientsListProps) {
    const [search, setSearch] = useState('')

    const filteredClients = initialClients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
        (c.phone && c.phone.includes(search))
    )

    const exportData = filteredClients.map(c => ({
        Nom: c.name,
        Type: c.type,
        Email: c.email || '',
        Telephone: c.phone || '',
        Ville: c.city || '',
        Pays: c.country || '',
        Dossiers: c._count.dossiers,
        Code_Acces: c.accessCode || '',
        Cree_le: c.createdAt
    }))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                        type="search"
                        placeholder="Rechercher un client..."
                        className="pl-9 h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ExportButton
                    data={exportData}
                    filename="Liste_Clients"
                    sheetName="Clients"
                    label="Exporter Excel"
                    variant="outline"
                />
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b">
                            <TableHead className="w-[300px]">Nom / Raison Sociale</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Localisation</TableHead>
                            <TableHead>Dossiers</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.map((client) => (
                            <TableRow key={client.id} className="cursor-pointer hover:bg-slate-50">
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${client.type === 'ENTREPRISE' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                            {client.type === 'ENTREPRISE' ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-semibold">{client.name}</span>
                                            <span className="text-xs text-slate-500">{client.type === 'ENTREPRISE' ? 'Entreprise' : 'Particulier'}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col space-y-1 text-sm text-slate-600">
                                        {client.email && <span>{client.email}</span>}
                                        {client.phone && <span className="flex items-center text-xs"><Phone className="mr-1 h-3 w-3" /> {client.phone}</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-slate-600">
                                        <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                                        {client.city}, {client.country}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10">
                                        {client._count.dossiers} Dossiers
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                const url = `https://avocatos.app/portal/login?email=${encodeURIComponent(client.email || '')}`
                                                const text = `Bonjour ${client.name},\n\nVoici votre accès sécurisé au portail du cabinet :\n🔗 ${url}\n\n🔑 Code d'accès : ${client.accessCode || 'Non défini'}`
                                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                                            }}>
                                                <Share2 className="mr-2 h-4 w-4" />
                                                Envoyer accès WhatsApp
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
