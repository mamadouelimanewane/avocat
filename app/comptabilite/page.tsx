
"use client"

import { useState, useEffect } from "react"
import { Building, Wallet, TrendingUp, TrendingDown, RefreshCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { initSyscohadaAccounts, getAccounts, createTransaction } from "@/app/actions"

export default function AccountingPage() {
    const [accounts, setAccounts] = useState<any[]>([])
    const [isTransactionOpen, setIsTransactionOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // New Transaction State
    const [desc, setDesc] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [line1, setLine1] = useState({ accountId: "", debit: 0, credit: 0 })
    const [line2, setLine2] = useState({ accountId: "", debit: 0, credit: 0 })

    useEffect(() => {
        loadAccounts()
    }, [])

    const loadAccounts = async () => {
        setIsLoading(true)
        const res = await getAccounts()
        if (res.length === 0) {
            await initSyscohadaAccounts()
            const retried = await getAccounts()
            setAccounts(retried)
        } else {
            setAccounts(res)
        }
        setIsLoading(false)
    }

    const handleSaveTransaction = async () => {
        const lines = []
        if (line1.debit || line1.credit) lines.push(line1)
        if (line2.debit || line2.credit) lines.push(line2)

        const res = await createTransaction(desc, new Date(date), lines)
        if (res.success) {
            setIsTransactionOpen(false)
            loadAccounts() // Refresh balances
            alert("Écriture enregistrée")
        } else {
            alert("Erreur: " + res.message)
        }
    }

    const totalActif = accounts.filter(a => a.type === 'ACTIF').reduce((s, a) => s + a.balance, 0)
    const totalPassif = accounts.filter(a => a.type === 'PASSIF').reduce((s, a) => s + a.balance, 0)
    const totalProduit = accounts.filter(a => a.type === 'PRODUIT').reduce((s, a) => s + a.balance, 0)
    const totalCharge = accounts.filter(a => a.type === 'CHARGE').reduce((s, a) => s + a.balance, 0)
    const resultat = totalProduit - totalCharge

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Comptabilité Générale</h1>
                    <p className="text-slate-500 mt-1">Plan Comptable SYSCOHADA & États Financiers</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadAccounts}><RefreshCcw className="mr-2 h-4 w-4" /> Actualiser</Button>
                    <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-slate-900 text-white"><Wallet className="mr-2 h-4 w-4" /> Saisir Écriture</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Nouvelle Écriture Journal</DialogTitle>
                                <DialogDescription>Saisie standard débit/crédit.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <Label>Libellé</Label>
                                        <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Paiement Loyer Mars" />
                                    </div>
                                    <div>
                                        <Label>Date</Label>
                                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                                    </div>
                                </div>

                                {/* Line 1 */}
                                <div className="grid grid-cols-12 gap-2 items-end border p-2 rounded bg-slate-50">
                                    <div className="col-span-6">
                                        <Label>Compte (Débit)</Label>
                                        <Select onValueChange={v => setLine1({ ...line1, accountId: v })}>
                                            <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                            <SelectContent>
                                                {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <Label>Débit</Label>
                                        <Input type="number" onChange={e => setLine1({ ...line1, debit: parseFloat(e.target.value || '0'), credit: 0 })} />
                                    </div>
                                    <div className="col-span-3">
                                        <Label>Crédit</Label>
                                        <Input type="number" disabled value={0} />
                                    </div>
                                </div>

                                {/* Line 2 */}
                                <div className="grid grid-cols-12 gap-2 items-end border p-2 rounded bg-slate-50">
                                    <div className="col-span-6">
                                        <Label>Compte (Crédit)</Label>
                                        <Select onValueChange={v => setLine2({ ...line2, accountId: v })}>
                                            <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                            <SelectContent>
                                                {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <Label>Débit</Label>
                                        <Input type="number" disabled value={0} />
                                    </div>
                                    <div className="col-span-3">
                                        <Label>Crédit</Label>
                                        <Input type="number" onChange={e => setLine2({ ...line2, credit: parseFloat(e.target.value || '0'), debit: 0 })} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveTransaction}>Enregistrer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trésorerie (Actif)</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalActif.toLocaleString('fr-FR')} FCFA</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Charges (6xxx)</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCharge.toLocaleString('fr-FR')} FCFA</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produits (7xxx)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProduit.toLocaleString('fr-FR')} FCFA</div>
                    </CardContent>
                </Card>
                <Card className={resultat >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Résultat Net</CardTitle>
                        <Building className="h-4 w-4 text-slate-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${resultat >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                            {resultat.toLocaleString('fr-FR')} FCFA
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="balance" className="w-full">
                <TabsList>
                    <TabsTrigger value="balance">Balance Générale</TabsTrigger>
                    <TabsTrigger value="grandlivre">Grand Livre</TabsTrigger>
                    <TabsTrigger value="bilan">Bilan (OHADA)</TabsTrigger>
                </TabsList>

                <TabsContent value="balance" className="mt-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Code</TableHead>
                                    <TableHead>Intitulé du Compte</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Solde</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accounts.map((acc) => (
                                    <TableRow key={acc.id}>
                                        <TableCell className="font-mono font-medium">{acc.code}</TableCell>
                                        <TableCell>{acc.name}</TableCell>
                                        <TableCell><span className="text-xs bg-slate-100 px-2 py-1 rounded">{acc.type}</span></TableCell>
                                        <TableCell className={`text-right font-mono ${acc.balance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                            {acc.balance.toLocaleString('fr-FR')} FCFA
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="grandlivre" className="mt-4">
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white border border-dashed rounded-lg">
                        <Building className="h-12 w-12 mb-4 opacity-20" />
                        <p>Sélectionnez un compte pour voir le détail des écritures.</p>
                        <p className="text-xs">(Fonctionnalité détaillée à venir)</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
