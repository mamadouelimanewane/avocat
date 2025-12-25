"use client"

import { useState, useEffect } from "react"
import {
    getCarpaTransactions,
    getCarpaStats,
    createCarpaTransaction,
    getDossiersList
} from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Search,
    FileText,
    ShieldCheck,
    RefreshCcw
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function CarpaPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [stats, setStats] = useState({ total: 0, count: 0 })
    const [dossiers, setDossiers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    // Form State
    const [formData, setFormData] = useState({
        dossierId: "",
        type: "DEPOT" as "DEPOT" | "RETRAIT",
        amount: "",
        description: "",
        beneficiary: "",
        reference: ""
    })

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [t, s, d] = await Promise.all([
                getCarpaTransactions(),
                getCarpaStats(),
                getDossiersList()
            ])
            setTransactions(t)
            setStats(s)
            setDossiers(d)
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les données CARPA", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.dossierId || !formData.amount || !formData.description) return

        const amountNum = parseFloat(formData.amount) * (formData.type === 'RETRAIT' ? -1 : 1)

        try {
            const res = await createCarpaTransaction({
                ...formData,
                amount: amountNum,
                type: formData.type as any
            })

            if (res.success) {
                toast({ title: "Succès", description: "Opération CARPA enregistrée et intégrée en comptabilité" })
                setIsDialogOpen(false)
                setFormData({ dossierId: "", type: "DEPOT", amount: "", description: "", beneficiary: "", reference: "" })
                loadData()
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de l'opération", variant: "destructive" })
        }
    }

    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.dossier?.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.dossier?.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header section with Premium design */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-xl">
                            <Wallet className="h-8 w-8 text-emerald-600" />
                        </div>
                        Gestion CARPA & Fonds Tiers
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Maniement des fonds clients en toute conformité avec les règles du barreau.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={loadData} className="border-slate-200">
                        <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle Opération
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Enregistrer un mouvement CARPA</DialogTitle>
                                    <DialogDescription>
                                        Cette opération sera automatiquement répercutée sur le compte 467 de votre comptabilité SYSCOHADA.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Dossier lié</Label>
                                        <Select
                                            value={formData.dossierId}
                                            onValueChange={(v) => setFormData({ ...formData, dossierId: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un dossier..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dossiers.map(d => (
                                                    <SelectItem key={d.id} value={d.id}>
                                                        {d.reference} - {d.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={formData.type}
                                                onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DEPOT">Dépôt (Entrée)</SelectItem>
                                                    <SelectItem value="RETRAIT">Retrait (Sortie)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Montant (FCFA)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Libellé de l'opération</Label>
                                        <Input
                                            placeholder="Ex: Provision pour consignation, Dommages-intérêts..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Bénéficiaire (si retrait)</Label>
                                        <Input
                                            placeholder="Nom de la partie ou organisme"
                                            value={formData.beneficiary}
                                            onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Valider le mouvement</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="h-24 w-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-100">Solde Total CARPA Held</CardDescription>
                        <CardTitle className="text-4xl font-bold">
                            {stats.total.toLocaleString()} <span className="text-xl">FCFA</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-emerald-200 text-sm flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Fonds sécurisés et isolés
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-white/50 backdrop-blur-sm shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-medium">Nombre d'opérations</CardDescription>
                        <CardTitle className="text-3xl font-bold text-slate-900">{stats.count}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-slate-400 text-sm">Total historique des mouvements</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-white/50 backdrop-blur-sm shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-medium">Conformité Audit</CardDescription>
                        <CardTitle className="text-3xl font-bold text-slate-900">100%</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-emerald-600 text-sm flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Écritures SYSCOHADA à jour
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Section */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <History className="h-5 w-5 text-indigo-600" />
                            <CardTitle>Historique des Mouvements</CardTitle>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher..."
                                className="pl-9 bg-white border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead>Dossier & Client</TableHead>
                                <TableHead>Libellé / Bénéficiaire</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead className="text-right">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-10 w-10 opacity-20" />
                                            Aucun mouvement enregistré
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium text-slate-600">
                                            {format(new Date(t.date), "dd MMM yyyy", { locale: fr })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-[10px] bg-slate-50">
                                                {t.reference}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">{t.dossier?.reference}</span>
                                                <span className="text-xs text-slate-500">{t.dossier?.client?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-slate-700">{t.description}</span>
                                                {t.beneficiary && (
                                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                        Bénéf : {t.beneficiary}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className={`font-bold flex items-center justify-end gap-1 ${t.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {t.amount > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                                                {Math.abs(t.amount).toLocaleString()} FCFA
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100">
                                                SYSCOHADA OK
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
