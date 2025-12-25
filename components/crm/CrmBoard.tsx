'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, ArrowRight, MoreHorizontal, CheckCircle2 } from "lucide-react"
import { updateClientStatus } from "@/app/actions"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

type Client = {
    id: string
    name: string
    type: string
    status: string
    phone?: string | null
    email?: string | null
    notes?: string
}

const COLUMNS = [
    { id: 'PROSPECT', title: 'Nouveaux Contacts', color: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-600' },
    { id: 'NEGOTIATION', title: 'Discussion / Devis', color: 'bg-indigo-50/30', border: 'border-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-600' },
    { id: 'TO_CONVERT', title: 'A Convertir', color: 'bg-emerald-50/30', border: 'border-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-600' }
]

export function CrmBoard({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState<Client[]>(initialClients)
    const [draggedClientId, setDraggedClientId] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    const getColumnClients = (status: string) => clients.filter(c => c.status === status)

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('clientId', id)
        setDraggedClientId(id)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault()
        const clientId = e.dataTransfer.getData('clientId')

        if (!clientId) return

        // Optimistic Update
        const updatedClients = clients.map(c =>
            c.id === clientId ? { ...c, status: targetStatus } : c
        )
        setClients(updatedClients)
        setDraggedClientId(null)

        // API Call
        const result = await updateClientStatus(clientId, targetStatus)
        if (!result.success) {
            // Revert on failure
            setClients(initialClients) // Or previous state (simplified)
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de déplacer le prospect." })
        } else {
            toast({ title: "Succès", description: "Statut mis à jour." })
            router.refresh()
        }
    }

    const handleMove = async (id: string, targetStatus: string) => {
        // Validation for "Convertir" logic if needed
        if (targetStatus === 'CLIENT') {
            // Logic to create dossier perhaps? For now just status update
        }

        const updatedClients = clients.map(c =>
            c.id === id ? { ...c, status: targetStatus } : c
        )
        setClients(updatedClients)

        const result = await updateClientStatus(id, targetStatus)
        if (!result.success) {
            setClients(initialClients)
            toast({ variant: "destructive", title: "Erreur", description: "Mise à jour échouée." })
        } else {
            router.refresh()
            toast({ title: "K", description: targetStatus === 'CLIENT' ? "Prospect converti en Client !" : "Statut mis à jour" })
            if (targetStatus === 'CLIENT') {
                // Remove from board visually if we don't have a 'CLIENT' column
                setClients(prev => prev.filter(c => c.id !== id))
            }
        }
    }

    return (
        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            {COLUMNS.map(col => (
                <div
                    key={col.id}
                    className={`flex flex-col h-full rounded-lg border ${col.color} ${col.border}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                    <CardHeader className="pb-3 border-b border-white/50 bg-white/50 rounded-t-lg backdrop-blur-sm">
                        <CardTitle className={`text-sm font-bold uppercase tracking-wider flex justify-between items-center ${col.text}`}>
                            {col.title}
                            <Badge className={col.badge}>{getColumnClients(col.id).length}</Badge>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
                        {getColumnClients(col.id).map(client => (
                            <Card
                                key={client.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, client.id)}
                                className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 border-l-4 ${draggedClientId === client.id ? 'opacity-50 scale-95' : 'opacity-100'
                                    } ${col.id === 'PROSPECT' ? 'border-l-slate-400' :
                                        col.id === 'NEGOTIATION' ? 'border-l-indigo-500' :
                                            'border-l-emerald-500'
                                    }`}
                            >
                                <CardContent className="p-4 relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleMove(client.id, 'PROSPECT')}>Nouveau Contact</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleMove(client.id, 'NEGOTIATION')}>En Négociation</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleMove(client.id, 'TO_CONVERT')}>A Convertir</DropdownMenuItem>
                                                <DropdownMenuItem className="text-emerald-600 font-bold" onClick={() => handleMove(client.id, 'CLIENT')}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Convertir en Client
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex justify-between items-start mb-2 pr-6">
                                        <div>
                                            <h3 className="font-semibold text-slate-800 text-sm">{client.name}</h3>
                                            <Badge variant="outline" className="text-[10px] mt-1">{client.type}</Badge>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-500 space-y-1 mb-3">
                                        {client.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {client.phone}</div>}
                                        {client.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {client.email}</div>}
                                    </div>

                                    {col.id === 'TO_CONVERT' && (
                                        <div className="mt-3">
                                            <Button
                                                size="sm"
                                                className="w-full h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                                onClick={() => handleMove(client.id, 'CLIENT')}
                                            >
                                                Convertir maintenant <ArrowRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        {getColumnClients(col.id).length === 0 && (
                            <div className="text-center text-slate-400 py-10 text-xs italic opacity-50 border-2 border-dashed border-slate-200 rounded">
                                Glissez des prospects ici
                            </div>
                        )}
                    </CardContent>
                </div>
            ))}
        </div>
    )
}
