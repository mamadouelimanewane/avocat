"use client"

import { useState } from "react"
import {
    Globe,
    DollarSign,
    Receipt,
    TrendingUp,
    Plus,
    ArrowUpRight,
    CreditCard,
    Clock,
    AlertCircle,
    Settings2,
    FileDown,
    RefreshCcw,
    CheckCircle2,
    Calendar,
    BadgePercent
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Mock Data for Multi-country Billing
const COUNTRY_STATS = [
    { country: "Sénégal", currency: "FCFA", revenue: 154000000, taxRate: "18%", status: "OPTIMISÉ" },
    { country: "Côte d'Ivoire", currency: "FCFA", revenue: 92000000, taxRate: "18%", status: "OPTIMISÉ" },
    { country: "France", currency: "EUR", revenue: 45000, taxRate: "20%", status: "VÉRIFIÉ" },
    { country: "USA", currency: "USD", revenue: 12000, taxRate: "0%", status: "EXPORT" },
]

const RECENT_INVOICES = [
    { id: "INV-2026-001", client: "Sonatel Orange", country: "Sénégal", amount: "12.500.000 FCFA", status: "PAYÉ", date: "Aujourd'hui" },
    { id: "INV-2026-002", client: "Bouygues Projets", country: "Côte d'Ivoire", amount: "8.200.000 FCFA", status: "ATTENTE", date: "Hier" },
    { id: "INV-2026-003", client: "Cabinet Legal Paris", country: "France", amount: "2.500 EUR", status: "RETARD", date: "3 jours" },
]

export default function GlobalBillingPage() {
    const [selectedCurrency, setSelectedCurrency] = useState("FCFA")

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* Premium Header - Global Strategy Vibe */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white">
                        <Globe className="h-8 w-8 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Facturation Globale & Multi-Pays</h1>
                        <p className="text-slate-500 font-medium italic">Gestion automatisée des honoraires, taxes et devises internationales.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white shadow-sm font-bold">
                        <Settings2 className="h-4 w-4 mr-2" /> Régimes Fiscaux
                    </Button>
                    <Button className="h-12 px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-bold">
                        <Plus className="h-4 w-4 mr-2" /> Nouvelle Facture Inter
                    </Button>
                </div>
            </div>

            {/* Global Revenue Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white border-l-4 border-l-indigo-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg">C.A. Global Consolidé</p>
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">284.650.000 <span className="text-[10px] text-slate-400 font-bold">FCFA</span></h3>
                        <p className="text-[10px] text-emerald-600 font-black mt-2 tracking-tight">+14.2M ce trimestre</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white border-l-4 border-l-emerald-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg">Facturation Récurrente</p>
                            <RefreshCcw className="h-4 w-4 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">42.500.000 <span className="text-[10px] text-slate-400 font-bold">FCFA/Mois</span></h3>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[75%]" />
                            </div>
                            <span className="text-[9px] font-black text-slate-400">75% RETENTION</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white border-l-4 border-l-rose-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg">Impayés Transfrontaliers</p>
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-black text-rose-600 leading-none">15.420.000 <span className="text-[10px] text-slate-400 font-bold">FCFA</span></h3>
                        <Button variant="link" className="text-rose-600 text-[10px] font-black p-0 h-auto mt-2">LANCER RELANCES AUTO GPT</Button>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-amber-100 bg-amber-50/20 shadow-sm border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest px-2 py-0.5 bg-amber-100 rounded-lg">TVA & Taxes Colectées</p>
                            <Receipt className="h-4 w-4 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">51.240.000 <span className="text-[10px] text-slate-400 font-bold">FCFA</span></h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-2">Provisionnée pour déclaration Q1</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Country Compliance Table */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Performance par Territoire</CardTitle>
                                <CardDescription>Analyse de la rentabilité et conformité fiscale par pays.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                                    <SelectTrigger className="w-32 h-10 rounded-xl font-bold text-xs bg-slate-50 border-none">
                                        <SelectValue placeholder="Devise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FCFA">FCFA (BCEAO)</SelectItem>
                                        <SelectItem value="EUR">Euro (Zone)</SelectItem>
                                        <SelectItem value="USD">Dollar (Global)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-4">Pays / Territoire</th>
                                            <th className="px-8 py-4">Chiffre d&apos;Affaires</th>
                                            <th className="px-8 py-4">TVA Actuelle</th>
                                            <th className="px-8 py-4">Statut Fiscal</th>
                                            <th className="px-8 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {COUNTRY_STATS.map((s, i) => (
                                            <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                            {s.country[0]}
                                                        </div>
                                                        <span className="font-bold text-slate-900">{s.country}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-black text-slate-700">
                                                    {new Intl.NumberFormat('fr-FR').format(s.revenue)} <span className="text-[10px] text-slate-400">{s.currency}</span>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-bold text-indigo-600">
                                                    {s.taxRate}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px]">{s.status}</Badge>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                                                        <FileDown className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Automated Workflows section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[2.5rem] border-indigo-100 bg-indigo-900 text-white p-8 relative overflow-hidden group shadow-2xl shadow-indigo-100">
                            <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                            <TrendingUp className="h-10 w-10 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-black mb-2">Mise à jour Taux de Change</h3>
                            <p className="text-xs text-indigo-200 leading-relaxed mb-6 font-medium">
                                Consolidation temps réel via API BCEAO/BCE. Vos factures en EUR et USD sont automatiquement réévaluées selon le cours du jour.
                            </p>
                            <div className="flex items-center gap-4 text-xs font-black">
                                <span className="text-emerald-400 bg-white/10 px-3 py-1 rounded-full">1 EUR = 655.95 FCFA</span>
                                <span className="text-slate-400">STATIQUE</span>
                            </div>
                        </Card>

                        <Card className="rounded-[2.5rem] border-slate-100 bg-white shadow-sm p-8 flex flex-col justify-between border-dashed border-2">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-black text-xs uppercase tracking-widest">Facturation Récurrente IA</span>
                                </div>
                                <h4 className="font-bold text-slate-900">42 Abonnements Actifs</h4>
                                <p className="text-xs text-slate-500 mt-2">Génération prévue le 1er du mois prochain pour un total de 12.5M FCFA.</p>
                            </div>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-11 font-bold shadow-lg shadow-slate-200 mt-6">Configurer les Abonnements</Button>
                        </Card>
                    </div>
                </div>

                {/* Right Section: Invoicing Feed & Alerts */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <Clock className="h-4 w-4 text-indigo-400" />
                                Flux de Facturation (Live)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {RECENT_INVOICES.map((inv, i) => (
                                    <div key={i} className="p-6 hover:bg-slate-50/50 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{inv.client}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold">{inv.id} • {inv.country}</p>
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{inv.amount}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <Badge className={`${inv.status === 'PAYÉ' ? 'bg-emerald-50 text-emerald-600' :
                                                    inv.status === 'ATTENTE' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                                } border-none font-black text-[9px]`}>{inv.status}</Badge>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{inv.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-center border-t border-slate-50">
                                <Button variant="ghost" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest gap-2">
                                    Voir Journal de Ventes <ArrowUpRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] bg-indigo-50 border-indigo-100 p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                                <BadgePercent className="h-6 w-6" />
                            </div>
                            <h4 className="font-black text-indigo-900">Optimisation Fiscale IA</h4>
                        </div>
                        <p className="text-xs text-indigo-700 leading-relaxed font-medium mb-6">
                            "Conseil LexAI : Pour vos clients en Côte d&apos;Ivoire, l&apos;application du régime de faveur export (Article 15) pourrait réduire votre TVA provisionnelle de 4M FCFA ce trimestre."
                        </p>
                        <Button className="w-full bg-indigo-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-100">Appliquer Stratégie</Button>
                    </Card>

                    <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                            <CreditCard className="h-8 w-8" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900">Passerelles de Paiements</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">Stripe, Wave, Mobile Money, SWIFT Inter.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
