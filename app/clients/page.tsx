
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Plus, Search, Building2, User, Phone, MapPin, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // I need to create this maybe? Or just use raw input
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const prisma = new PrismaClient()

// Simple Input component inline if it doesn't exist, or standard HTML input
function SearchInput() {
    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
                type="search"
                placeholder="Rechercher un client..."
                className="pl-9 h-10 w-[250px] lg:w-[350px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
        </div>
    )
}

export default async function ClientsPage() {
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { dossiers: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
                    <p className="text-slate-500 mt-1">Gérez votre base de contacts et prospects.</p>
                </div>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Client
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
                <SearchInput />
                {/* Add more filters here later */}
            </div>

            {/* Clients Table */}
            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Nom / Raison Sociale</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Localisation</TableHead>
                            <TableHead>Dossiers</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
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
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
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
