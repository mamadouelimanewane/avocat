"use client"

import { useState, useEffect } from "react"
import { getTiers, createTier } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Truck, Plus, Search } from "lucide-react"

export default function TiersPage() {
    const [clients, setClients] = useState<any[]>([])
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const [c, s] = await Promise.all([
            getTiers('CLIENT'),
            getTiers('FOURNISSEUR')
        ])
        setClients(c)
        setSuppliers(s)
        setIsLoading(false)
    }

    const TierTable = ({ data, type }: { data: any[], type: string }) => {
        const filtered = data.filter(t =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.code.includes(searchTerm)
        )
        const total = filtered.reduce((s, t) => s + t.balance, 0)

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Input
                        className="max-w-xs"
                        placeholder="Rechercher nom ou code..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <div className="text-right">
                        <span className="text-sm font-medium text-slate-500">Total Solde : </span>
                        <span className={`font-mono font-bold ${total < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>{total.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                </div>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Compte Aux.</TableHead>
                                <TableHead>Nom du Tiers</TableHead>
                                <TableHead className="text-right">Solde</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24 text-slate-400">Aucun tiers trouvé.</TableCell></TableRow>
                            ) : (
                                filtered.map(tier => (
                                    <TableRow key={tier.id}>
                                        <TableCell className="font-mono">{tier.code}</TableCell>
                                        <TableCell className="font-medium">{tier.name}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            <span className={tier.balance > 0 ? 'text-amber-600' : (tier.balance < 0 ? 'text-emerald-600' : 'text-slate-400')}>
                                                {tier.balance.toLocaleString('fr-FR')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={`/comptabilite/interrogation?id=${tier.id}`}>Voir</a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    const AddTierDialog = ({ type }: { type: 'CLIENT' | 'FOURNISSEUR' }) => {
        const [name, setName] = useState("")
        const [code, setCode] = useState("")

        const handleSubmit = async () => {
            const res = await createTier(name, type, code)
            if (res.success) {
                loadData()
                setName("")
                setCode("")
                // Close logic handled by separate state or generic re-render
                alert(`Tiers créé : ${res.code}`)
            } else {
                alert(res.message)
            }
        }

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Nouveau {type === 'CLIENT' ? 'Client' : 'Fournisseur'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter {type}</DialogTitle>
                        <DialogDescription>Création d'un compte auxiliaire {type === 'CLIENT' ? '411' : '401'}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Nom</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="Ex: SARL DUPONT" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Code (Opt)</Label>
                            <Input value={code} onChange={e => setCode(e.target.value)} className="col-span-3" placeholder="Laisser vide pour auto" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>Créer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Tiers</h1>
            <p className="text-slate-500">Clients (411) et Fournisseurs (401)</p>

            <Tabs defaultValue="clients" className="w-full">
                <TabsList>
                    <TabsTrigger value="clients" className="w-40"><Users className="mr-2 h-4 w-4" /> Clients</TabsTrigger>
                    <TabsTrigger value="fournisseurs" className="w-40"><Truck className="mr-2 h-4 w-4" /> Fournisseurs</TabsTrigger>
                </TabsList>

                <TabsContent value="clients" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Clients</CardTitle>
                                <CardDescription>Comptes Collectifs 411</CardDescription>
                            </div>
                            <AddTierDialog type="CLIENT" />
                        </CardHeader>
                        <CardContent>
                            <TierTable data={clients} type="CLIENT" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fournisseurs" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Fournisseurs</CardTitle>
                                <CardDescription>Comptes Collectifs 401</CardDescription>
                            </div>
                            <AddTierDialog type="FOURNISSEUR" />
                        </CardHeader>
                        <CardContent>
                            <TierTable data={suppliers} type="FOURNISSEUR" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
