"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createKanbanColumn } from '@/app/actions'
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

export function AddColumnButton() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAdd = async () => {
        if (!title.trim()) return
        setLoading(true)
        const res = await createKanbanColumn(title)
        if (res.success) {
            setOpen(false)
            setTitle('')
            window.location.reload()
        }
        setLoading(false)
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nouvelle Colonne
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouvelle Colonne</DialogTitle>
                        <DialogDescription>
                            Ajoutez une nouvelle étape à votre processus de suivi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title-header">Titre</Label>
                            <Input
                                id="title-header"
                                placeholder="Nom de la colonne"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button onClick={handleAdd} disabled={loading}>
                            {loading ? 'Création...' : 'Créer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
