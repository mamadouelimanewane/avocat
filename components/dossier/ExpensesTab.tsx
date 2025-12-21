
"use client"

import { useState } from 'react'
import { Plus, Receipt, Trash2 } from 'lucide-react'
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
}

export default function ExpensesTab({ dossierId, expenses = [] }: { dossierId: string, expenses?: Expense[] }) {
    const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const data = {
            dossierId,
            description: formData.get('description') as string,
            amount: parseFloat(formData.get('amount') as string),
            category: formData.get('category') as string,
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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Frais & Dépens</h3>
                    <p className="text-sm text-slate-500">Gérez les frais engagés pour ce dossier (Déplacements, Greffe, Timbres...)</p>
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
                            <DialogTitle>Ajouter un frais</DialogTitle>
                            <DialogDescription>
                                Saisissez les détails de la dépense à refacturer au client.
                            </DialogDescription>
                        </DialogHeader>
                        <form action={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Description
                                    </Label>
                                    <Input id="description" name="description" placeholder="Ex: Timbre fiscal" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right">
                                        Montant
                                    </Label>
                                    <Input id="amount" name="amount" type="number" placeholder="0" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">
                                        Catégorie
                                    </Label>
                                    <Select name="category" defaultValue="FRAIS_JUSTICE">
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DEPLACEMENT">Déplacement / Transport</SelectItem>
                                            <SelectItem value="FRAIS_JUSTICE">Frais de Justice / Greffe</SelectItem>
                                            <SelectItem value="TIMBRES">Timbres Fiscaux</SelectItem>
                                            <SelectItem value="DIVERS">Divers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Ajout...' : 'Enregistrer le frais'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-4 hidden">
                {/* Summary Card - Hidden for now to keep it clean, maybe used later */}
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Frais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
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
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    Aucun frais enregistré pour ce dossier.
                                </TableCell>
                            </TableRow>
                        ) : localExpenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>{formatDate(expense.date)}</TableCell>
                                <TableCell className="font-medium">{expense.description}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                                </TableCell>
                                <TableCell className="font-semibold text-slate-900">
                                    {formatCurrency(expense.amount)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={expense.status === 'BILLED' ? 'secondary' : 'warning'}>
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
                        {localExpenses.length > 0 && (
                            <TableRow className="bg-slate-50 font-medium">
                                <TableCell colSpan={3} className="text-right">Total :</TableCell>
                                <TableCell className="text-slate-900">{formatCurrency(totalExpenses)}</TableCell>
                                <TableCell colSpan={2}></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
