
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
import { initSyscohadaAccounts, getAccounts, createTransaction, getJournals } from "@/app/actions"
import Link from "next/link"

export default function AccountingPage() {
    const [accounts, setAccounts] = useState<any[]>([])
    const [journals, setJournals] = useState<any[]>([])
    const [isTransactionOpen, setIsTransactionOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // New Transaction State
    const [desc, setDesc] = useState("")
    const [date, setDate] = new Date().toISOString().split('T')[0])
    const [selectedJournal, setSelectedJournal] = useState("")
    const [line1, setLine1] = useState({ accountId: "", debit: 0, credit: 0 })
    const [line2, setLine2] = useState({ accountId: "", debit: 0, credit: 0 })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const [accRes, jnlRes] = await Promise.all([getAccounts(), getJournals()])

        if (accRes.length === 0) {
            await initSyscohadaAccounts()
            const retried = await getAccounts()
            setAccounts(retried)
        } else {
            setAccounts(accRes)
        }
        setJournals(jnlRes)
        setIsLoading(false)
    }

    const handleSaveTransaction = async () => {
        if (!selectedJournal) {
            alert("Veuillez sélectionner un journal (VE, AC, BQ...)")
            return
        }

        const lines = []
        if (line1.debit || line1.credit) lines.push(line1)
        if (line2.debit || line2.credit) lines.push(line2)

        const res = await createTransaction(desc, new Date(date), lines, selectedJournal)
        if (res.success) {
            setIsTransactionOpen(false)
            loadData() // Refresh balances
            alert("Écriture enregistrée avec succès")
            // Reset form
            setDesc("")
            setSelectedJournal("")
            setLine1({ accountId: "", debit: 0, credit: 0 })
            setLine2({ accountId: "", debit: 0, credit: 0 })
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
                    <Link href="/comptabilite/journaux">
                        <Button variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200">
                            <FileText className="mr-2 h-4 w-4" /> Journaux
                        </Button>
                    </Link>
                    <Link href="/comptabilite/tiers">
                        <Button variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                            <Users className="mr-2 h-4 w-4" /> Tiers
                        </Button>
                    </Link>
                    <Link href="/comptabilite/interrogation">
                        <Button variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                            <Search className="mr-2 h-4 w-4" /> Interrogation
                        </Button>
                    </Link>
                    <Link href="/comptabilite/editions">
                        <Button variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">
                            <Printer className="mr-2 h-4 w-4" /> Éditions
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={loadData}><RefreshCcw className="mr-2 h-4 w-4" /> Actualiser (F5)</Button>

                    {/* Add Account Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary"><Building className="mr-2 h-4 w-4" /> Nouveau Compte</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Ajouter au Plan Comptable</DialogTitle>
                            </DialogHeader>
                            <form action={async (formData) => {
                                const code = formData.get('code') as string
                                const name = formData.get('name') as string
                                const type = formData.get('type') as string
                                await createAccount(code, name, type)
                                loadData()
                            }}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Code</Label>
                                        <Input id="code" name="code" placeholder="Ex: 6061" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Intitulé</Label>
                                        <Input id="name" name="name" placeholder="Ex: Fournitures de bureau" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Type</Label>
                                        <Select name="type">
                                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIF">ACTIF (Bilan)</SelectItem>
                                                <SelectItem value="PASSIF">PASSIF (Bilan)</SelectItem>
                                                <SelectItem value="CHARGE">CHARGE (Compte Résultat)</SelectItem>
                                                <SelectItem value="PRODUIT">PRODUIT (Compte Résultat)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter><Button type="submit">Créer le compte</Button></DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <Label>Journal</Label>
                                        <Select onValueChange={setSelectedJournal}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un journal..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {journals.map((j) => (
                                                    <SelectItem key={j.id} value={j.id}>
                                                        {j.code} - {j.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Date</Label>
                                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Libellé de l'opération</Label>
                                    <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Paiement Facture F2024-001" />
                                </div>

                                {/* Line 1 */}
                                <div className="grid grid-cols-12 gap-2 items-end border p-2 rounded bg-slate-50">
                                    <div className="col-span-6">
                                        <Label className="text-xs">Compte (Débit)</Label>
                                        <Select onValueChange={v => setLine1({ ...line1, accountId: v })}>
                                            <SelectTrigger className="h-8"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                            <SelectContent>
                                                {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-xs">Débit</Label>
                                        <Input className="h-8" type="number" onChange={e => setLine1({ ...line1, debit: parseFloat(e.target.value || '0'), credit: 0 })} />
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-xs">Crédit</Label>
                                        <Input className="h-8 bg-slate-100" type="number" disabled value={0} />
                                    </div>
                                </div>

                                {/* Line 2 */}
                                <div className="grid grid-cols-12 gap-2 items-end border p-2 rounded bg-slate-50">
                                    <div className="col-span-6">
                                        <Label className="text-xs">Compte (Crédit)</Label>
                                        <Select onValueChange={v => setLine2({ ...line2, accountId: v })}>
                                            <SelectTrigger className="h-8"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                            <SelectContent>
                                                {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-xs">Débit</Label>
                                        <Input className="h-8 bg-slate-100" type="number" disabled value={0} />
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-xs">Crédit</Label>
                                        <Input className="h-8" type="number" onChange={e => setLine2({ ...line2, credit: parseFloat(e.target.value || '0'), debit: 0 })} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveTransaction}>Enregistrer l'écriture</Button>
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

                <TabsContent value="grandlivre" className="mt-4">
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white border border-dashed rounded-lg">
                        <Building className="h-12 w-12 mb-4 opacity-20" />
                        <p className="mb-4">Consultez le Grand Livre complet avec le détail chronologique.</p>
                        <Link href="/comptabilite/grand-livre">
                            <Button variant="outline">Ouvrir le Grand Livre Complet</Button>
                        </Link>
                    </div>
                </TabsContent>

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

                <TabsContent value="bilan" className="mt-4">
                    <div className="grid grid-cols-2 gap-6">
                        {/* ACTIF */}
                        <Card>
                            <CardHeader className="bg-slate-50 border-b pb-2">
                                <CardTitle className="text-base font-bold text-emerald-800">ACTIF (Emplois)</CardTitle>
                            </CardHeader>
                            <Table>
                                <TableBody>
                                    {accounts.filter(a => a.type === 'ACTIF').map(acc => (
                                        <TableRow key={acc.id}>
                                            <TableCell className="font-mono">{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right text-slate-800 font-bold">{acc.balance.toLocaleString('fr-FR')}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-slate-100 font-bold">
                                        <TableCell colSpan={2}>TOTAL ACTIF</TableCell>
                                        <TableCell className="text-right">{totalActif.toLocaleString('fr-FR')}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>

                        {/* PASSIF */}
                        <Card>
                            <CardHeader className="bg-slate-50 border-b pb-2">
                                <CardTitle className="text-base font-bold text-red-800">PASSIF (Ressources)</CardTitle>
                            </CardHeader>
                            <Table>
                                <TableBody>
                                    {accounts.filter(a => a.type === 'PASSIF').map(acc => (
                                        <TableRow key={acc.id}>
                                            <TableCell className="font-mono">{acc.code}</TableCell>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell className="text-right text-slate-800 font-bold">{acc.balance.toLocaleString('fr-FR')}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-yellow-50 font-bold text-amber-700">
                                        <TableCell colSpan={2}>RÉSULTAT NET (Bénéfice/Perte)</TableCell>
                                        <TableCell className="text-right">{resultat.toLocaleString('fr-FR')}</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-slate-100 font-bold">
                                        <TableCell colSpan={2}>TOTAL PASSIF + RÉSULTAT</TableCell>
                                        <TableCell className="text-right">{(totalPassif + resultat).toLocaleString('fr-FR')}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
```
