
"use client"

import { useState } from 'react'
import { Plus, Receipt, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createExpense } from '@/app/actions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'


interface Expense {
    id: string
    description: string
    amount: number
    category: string
    date: Date
    status: string
    type?: string
    billable?: boolean
}

export default function ExpensesTab({ dossierId, expenses = [] }: { dossierId: string, expenses?: Expense[] }) {
    const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isBillable, setIsBillable] = useState(true)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const data = {
            dossierId,
            description: formData.get('description') as string,
            amount: parseFloat(formData.get('amount') as string),
            category: formData.get('category') as string,
            type: formData.get('type') as string,
            billable: isBillable,
            date: new Date()
        }

        const res = await createExpense(data)
        setLoading(false)

        if (res.success && res.expense) {
            setLocalExpenses([res.expense as any, ...localExpenses])
            setIsOpen(false)
        } else {
            alert("Erreur lors de la création")
        }
    }

    const totalExpenses = localExpenses.reduce((sum, e) => sum + e.amount, 0)
    const debours = localExpenses.filter(e => e.type === 'DEBOURS').reduce((sum, e) => sum + e.amount, 0)
    const fraisCabinet = localExpenses.filter(e => e.type === 'FRAIS').reduce((sum, e) => sum + e.amount, 0)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Frais & Dépens</h3>
                    <p className="text-sm text-slate-500">Gérez les débours (pour le client) et les frais de fonctionnement.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Frais
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enregistrer une dépense</DialogTitle>
                            <DialogDescription>
                                Distinguez les frais refacturables (débours) des frais internes.
                            </DialogDescription>
                        </DialogHeader>
                        <form action={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">Type</Label>
                                    <Select name="type" defaultValue="DEBOURS">
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DEBOURS">Débours (Avance Client)</SelectItem>
                                            <SelectItem value="FRAIS">Frais Cabinet (Interne)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Description</Label>
                                    <Input id="description" name="description" placeholder="Ex: Enregistrement Acte" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right">Montant</Label>
                                    <Input id="amount" name="amount" type="number" placeholder="0" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">Catégorie</Label>
                                    <Select name="category" defaultValue="FRAIS_JUSTICE">
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DEPLACEMENT">Déplacement / Transport</SelectItem>
                                            <SelectItem value="FRAIS_JUSTICE">Frais de Justice (Greffe, Enregistrement)</SelectItem>
                                            <SelectItem value="HUISSIER">Huissier / Commissaire</SelectItem>
                                            <SelectItem value="TIMBRES">Timbres Fiscaux</SelectItem>
                                            <SelectItem value="REPAS">Repas / Hébergement</SelectItem>
                                            <SelectItem value="DIVERS">Divers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Facturable ?</Label>
                                    <div className="flex items-center space-x-2 col-span-3">
                                        <Checkbox id="billable" checked={isBillable} onCheckedChange={(c) => setIsBillable(!!c)} />
                                        <label htmlFor="billable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Oui, refacturer au client
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Ajout...' : 'Enregistrer'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Débours</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(debours)}</p>
                        </div>
                        <Receipt className="h-8 w-8 text-indigo-200" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Frais Cabinet</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(fraisCabinet)}</p>
                        </div>
                        <Receipt className="h-8 w-8 text-amber-200" />
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {localExpenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    Aucun frais enregistré pour ce dossier.
                                </TableCell>
                            </TableRow>
                        ) : localExpenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="whitespace-nowrap">{formatDate(expense.date)}</TableCell>
                                <TableCell>
                                    {expense.type === 'DEBOURS' ? (
                                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-200">Débours</Badge>
                                    ) : (
                                        <Badge variant="outline">Frais</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {expense.description}
                                    {!expense.billable && (
                                        <span className="ml-2 text-xs text-slate-400 italic">(Non facturable)</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs text-slate-500 uppercase">{expense.category}</span>
                                </TableCell>
                                <TableCell className="font-semibold text-slate-900">
                                    {formatCurrency(expense.amount)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={expense.status === 'BILLED' ? 'success' : 'default'} className={expense.status === 'TO_BILL' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}>
                                        {expense.status === 'BILLED' ? 'Facturé' : 'À Facturer'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
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
