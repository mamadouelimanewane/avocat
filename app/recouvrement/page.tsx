
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BadgePercent, Megaphone, CheckCircle2, AlertTriangle, TrendingUp, PhoneCall, Mail } from "lucide-react"

const prisma = new PrismaClient()

export default async function RecouvrementPage() {
    // Simulated Data (since we didn't add a Debt Model yet)
    // In a real app, this would be `prisma.debt.findMany`
    const debts = [
        { id: 1, debtor: "BTP Construction SA", creditor: "Banque Atlantique", amount: 15000000, recovered: 5000000, status: "AMIABLE", nextAction: "Relance Téléphonique", date: "2024-05-01" },
        { id: 2, debtor: "M. Modou Lo", creditor: "Cbao", amount: 2500000, recovered: 0, status: "JUDICIAIRE", nextAction: "Assignation", date: "2024-04-10" },
        { id: 3, debtor: "Société Diamant", creditor: "Fournisseur Express", amount: 800000, recovered: 800000, status: "CLOTURE", nextAction: "-", date: "2024-03-15" },
        { id: 4, debtor: "Agence Immobilière Kirene", creditor: "Propriétaire Bailleur", amount: 4500000, recovered: 1500000, status: "AMIABLE", nextAction: "Mise en demeure", date: "2024-05-12" },
    ]

    const totalAmount = debts.reduce((sum, d) => sum + d.amount, 0)
    const totalRecovered = debts.reduce((sum, d) => sum + d.recovered, 0)
    const recoveryRate = Math.round((totalRecovered / totalAmount) * 100)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recouvrement de Créances</h1>
                    <p className="text-slate-500 mt-1">Pilotage des dossiers de recouvrement amiable et judiciaire.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Megaphone className="mr-2 h-4 w-4" /> Campagne SMS</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <BadgePercent className="mr-2 h-4 w-4" /> Nouveau Dossier
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-slate-900 text-white border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Portefeuille Global</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAmount.toLocaleString()} FCFA</div>
                        <p className="text-xs text-slate-400 mt-1">Total créances confiées</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700">Recouvré</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">{totalRecovered.toLocaleString()} FCFA</div>
                        <Progress value={recoveryRate} className="h-2 mt-2 bg-emerald-200" indicatorClassName="bg-emerald-600" />
                        <p className="text-xs text-emerald-600 mt-1">{recoveryRate}% Taux de succès</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Phase Judiciaire</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">5 Dossiers</div>
                        <p className="text-xs text-slate-500 mt-1">En cours d'instance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Actions du Jour</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">12</div>
                        <p className="text-xs text-slate-500 mt-1">Relances à effectuer</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dossiers en cours</CardTitle>
                    <CardDescription>Liste des débiteurs et état d'avancement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Débiteur</TableHead>
                                <TableHead>Créancier</TableHead>
                                <TableHead>Montant Dû</TableHead>
                                <TableHead>Recouvré</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Prochaine Action</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {debts.map((debt) => (
                                <TableRow key={debt.id} className="hover:bg-slate-50">
                                    <TableCell className="font-medium">{debt.debtor}</TableCell>
                                    <TableCell className="text-slate-500">{debt.creditor}</TableCell>
                                    <TableCell>{debt.amount.toLocaleString()} XOF</TableCell>
                                    <TableCell className="text-emerald-600 font-medium">
                                        {debt.recovered > 0 ? debt.recovered.toLocaleString() + ' XOF' : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            debt.status === 'CLOTURE' ? 'bg-slate-100 text-slate-600' :
                                                debt.status === 'JUDICIAIRE' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    'bg-blue-100 text-blue-700 border-blue-200'
                                        }>
                                            {debt.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2 text-sm">
                                        {debt.nextAction === 'Relance Téléphonique' && <PhoneCall className="h-3 w-3 text-orange-500" />}
                                        {debt.nextAction === 'Mise en demeure' && <Mail className="h-3 w-3 text-red-500" />}
                                        {debt.nextAction === 'Assignation' && <AlertTriangle className="h-3 w-3 text-red-600" />}
                                        {debt.nextAction}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 text-xs">Gérer</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-indigo-50 border-indigo-100">
                    <CardHeader>
                        <CardTitle className="text-indigo-900">Calculateur d'Intérêts de Retard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-indigo-700 mb-4">Utilisez le taux légal OHADA ou contractuel pour actualiser la créance.</p>
                        <Button variant="outline" className="bg-white text-indigo-700 border-indigo-200">Ouvrir le simulateur</Button>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <CardHeader>
                        <CardTitle className="text-orange-900">Générateur de Mise en Demeure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-orange-700 mb-4">Créez une mise en demeure formelle avec LRAR en un clic.</p>
                        <Button variant="outline" className="bg-white text-orange-700 border-orange-200">Générer Courrier</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
