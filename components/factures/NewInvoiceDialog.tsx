
"use client"

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus, Download, MoreHorizontal, FileText, Wallet } from 'lucide-react'
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatCurrency, formatDate } from '@/lib/utils'
import { createInvoice } from '@/app/actions'

// We need to fetch clients for the dropdown. Ideally this is done in the Server Component and passed down, 
// but for now we will assume the page fetches it or we mock it, OR we refactor 'FacturesPage' to be a Server Component that passes data to a Client Component.
// The existing file 'app/factures/page.tsx' IS a Server Component. 
// So I will update 'app/factures/page.tsx' instead of just creating this client component isolated.
// But wait, the user wants me to UPDATE the page.

// Let's create a Client Component for the "New Invoice" Dialog to handle interaction.

export function NewInvoiceDialog({ clients }: { clients: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [type, setType] = useState('FACTURE')
    const [clientId, setClientId] = useState('')
    const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }])

    const handleCreate = async () => {
        // Validate
        if (!clientId) return alert('Veuillez sélectionner un client')

        const res = await createInvoice({
            clientId,
            items,
            type
        })

        if (res.success) {
            setIsOpen(false)
            setStep(1)
            setItems([{ description: '', quantity: 1, unitPrice: 0 }])
        } else {
            alert('Erreur: ' + res.message)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Facture / Provision
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle pièce comptable</DialogTitle>
                    <DialogDescription>Facture d'honoraires ou demande de provision.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Type de document</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FACTURE">Facture d'Honoraires</SelectItem>
                                <SelectItem value="PROVISION">Demande de Provision</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Client</Label>
                        <Select value={clientId} onValueChange={setClientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un client..." />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <Label className="mb-2 block">Lignes de la facture</Label>
                        {items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 mb-2 items-end">
                                <div className="col-span-6">
                                    <Input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={e => {
                                            const newItems = [...items]
                                            newItems[idx].description = e.target.value
                                            setItems(newItems)
                                        }}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        placeholder="Qté"
                                        value={item.quantity}
                                        onChange={e => {
                                            const newItems = [...items]
                                            newItems[idx].quantity = parseFloat(e.target.value)
                                            setItems(newItems)
                                        }}
                                    />
                                </div>
                                <div className="col-span-4">
                                    <Input
                                        type="number"
                                        placeholder="Prix Unitaire"
                                        value={item.unitPrice}
                                        onChange={e => {
                                            const newItems = [...items]
                                            newItems[idx].unitPrice = parseFloat(e.target.value)
                                            setItems(newItems)
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])}>
                            + Ajouter une ligne
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleCreate}>Créer {type === 'PROVISION' ? 'la Provision' : 'la Facture'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
