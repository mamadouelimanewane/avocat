
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateDossierStatus, createKanbanColumn, deleteKanbanColumn } from '@/app/actions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

interface Dossier {
    id: string
    title: string
    reference: string
    client: { name: string }
    updatedAt: Date
}

interface Column {
    id: string
    title: string
    color: string | null
    dossiers: Dossier[]
}

export function KanbanBoard({ initialColumns }: { initialColumns: Column[] }) {
    const [columns, setColumns] = useState(initialColumns)
    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDragStart = (e: React.DragEvent, dossierId: string, fromColumnId: string) => {
        e.dataTransfer.setData('dossierId', dossierId)
        e.dataTransfer.setData('fromColumnId', fromColumnId)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = async (e: React.DragEvent, toColumnId: string) => {
        e.preventDefault()
        const dossierId = e.dataTransfer.getData('dossierId')
        const fromColumnId = e.dataTransfer.getData('fromColumnId')

        if (fromColumnId === toColumnId) return

        // Optimistic Update
        const newColumns = [...columns]
        const fromCol = newColumns.find(c => c.id === fromColumnId)
        const toCol = newColumns.find(c => c.id === toColumnId)

        if (fromCol && toCol) {
            const dossierIndex = fromCol.dossiers.findIndex(d => d.id === dossierId)
            if (dossierIndex > -1) {
                const [dossier] = fromCol.dossiers.splice(dossierIndex, 1)
                toCol.dossiers.push(dossier)
                setColumns(newColumns)

                // Server Action
                await updateDossierStatus(dossierId, toColumnId)
            }
        }
    }

    const handleAddColumn = async () => {
        if (!newColumnTitle.trim()) return
        setLoading(true)
        const res = await createKanbanColumn(newColumnTitle)
        if (res.success) {
            setIsAddColumnOpen(false)
            setNewColumnTitle('')
            window.location.reload()
        }
        setLoading(false)
    }

    const handleDeleteColumn = async (columnId: string) => {
        if (confirm('Voulez-vous vraiment supprimer cette étape ?')) {
            await deleteKanbanColumn(columnId)
            window.location.reload()
        }
    }

    return (
        <div className="flex h-full gap-4 pb-4 px-2 min-w-max">
            {columns.map(col => (
                <div
                    key={col.id}
                    className="w-80 flex flex-col gap-3 h-full rounded-xl bg-slate-100/50 dark:bg-slate-900/50 p-3 border border-slate-200 dark:border-slate-800"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: col.color || '#cbd5e1' }} />
                            <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200">{col.title}</h3>
                            <Badge variant="secondary" className="text-[10px] h-5 min-w-[20px] justify-center">{col.dossiers.length}</Badge>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDeleteColumn(col.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer l'étape
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 min-h-[100px]">
                        {col.dossiers.map(d => (
                            <Card
                                key={d.id}
                                className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700"
                                draggable
                                onDragStart={(e) => handleDragStart(e, d.id, col.id)}
                                onClick={() => router.push(`/dossiers/${d.id}`)}
                            >
                                <CardContent className="p-3 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="text-[10px]">{d.reference}</Badge>
                                        <span className="text-[10px] text-slate-400">{new Date(d.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-sm font-medium leading-tight text-slate-900 dark:text-slate-100 line-clamp-2">{d.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                            {d.client.name.charAt(0)}
                                        </div>
                                        <span className="truncate max-w-[150px]">{d.client.name}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button
                            variant="ghost"
                            className="w-full text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border border-dashed border-slate-300"
                            onClick={() => router.push('/dossiers?new=true')}
                        >
                            <Plus className="mr-2 h-3 w-3" /> Ajouter Dossier
                        </Button>
                    </div>
                </div>
            ))}

            <div
                className="w-80 flex flex-col gap-3 h-full justify-center items-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer border-2 border-dashed border-slate-300 rounded-xl"
                onClick={() => setIsAddColumnOpen(true)}
            >
                <Plus className="h-8 w-8 text-slate-400" />
                <span className="text-sm font-medium text-slate-500">Ajouter une étape</span>
            </div>

            <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouvelle Étape du Workflow</DialogTitle>
                        <DialogDescription>
                            Ajoutez une nouvelle phase à votre pipeline de dossiers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre de l'étape</Label>
                            <Input
                                id="title"
                                placeholder="Ex: En attente de pièces"
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddColumnOpen(false)}>Annuler</Button>
                        <Button onClick={handleAddColumn} disabled={loading}>
                            {loading ? 'Création...' : 'Créer l\'étape'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

