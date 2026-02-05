"use client"

import { useState } from "react"
import {
    Receipt,
    Plus,
    Camera,
    TrendingUp,
    History,
    CheckCircle2,
    Clock,
    AlertCircle,
    CreditCard,
    Car,
    Plane,
    Utensils,
    Hotel,
    Search,
    Download,
    Filter,
    ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock Data for Expenses
const MOCK_EXPENSES = [
    { id: 1, type: "TRANSPORT", client: "AfricaTech", amount: 15400, date: "Aujourd'hui", status: "VALIDÉ", proof: true },
    { id: 2, type: "REPAS", client: "Me Ndiaye (Interne)", amount: 8500, date: "Hier", status: "À VÉRIFIER", proof: false },
    { id: 3, type: "LOGEMENT", client: "Groupe Wave", amount: 125000, date: "03 Fév", status: "REMBOURSÉ", proof: true },
]

export default function ExpenseManagementPage() {
    const [activeTab, setActiveTab] = useState("ALL")

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* N2F style Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                        <Receipt className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LexNotes de Frais</h1>
                        <p className="text-slate-500 font-medium italic">Gestion des débours, frais de déplacement & justificatifs (Inspiré N2F).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white shadow-sm font-bold">
                        <Download className="h-4 w-4 mr-2" /> Exporter (Excel/PDF)
                    </Button>
                    <Button className="h-12 px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-bold">
                        <Camera className="h-4 w-4 mr-2" /> Scanner un Reçu
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">À Rembourser (Ce mois)</p>
                        <h3 className="text-2xl font-black text-slate-900">425.400 <span className="text-[10px] text-slate-400 font-bold">FCFA</span></h3>
                        <div className="flex items-center gap-1 text-emerald-500 mt-1 font-bold text-[10px]">
                            <TrendingUp className="h-3 w-3" /> +12% vs M-1
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Débours Refacturables</p>
                        <h3 className="text-2xl font-black text-slate-900">1.250.000 <span className="text-[10px] text-slate-400 font-bold">FCFA</span></h3>
                        <p className="text-[10px] text-indigo-600 font-bold mt-1">ATTACHÉS À 12 DOSSIERS</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Justificatifs manquants</p>
                        <h3 className="text-2xl font-black text-rose-600">4</h3>
                        <div className="flex items-center gap-1 text-rose-500 mt-1 font-bold text-[10px]">
                            <AlertCircle className="h-3 w-3" /> ACTION REQUISE
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-indigo-100 bg-indigo-50/50 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Budget Cabinet (Q1)</p>
                        <h3 className="text-2xl font-black text-indigo-900">Consommé 45%</h3>
                        <Progress value={45} className="h-1 bg-white mt-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Expense List Hub */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("ALL")}
                                    className={`text-xs font-black uppercase tracking-widest px-6 h-10 rounded-xl transition-all ${activeTab === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                                >
                                    Tous
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("PENDING")}
                                    className={`text-xs font-black uppercase tracking-widest px-6 h-10 rounded-xl transition-all ${activeTab === 'PENDING' ? 'bg-amber-100 text-amber-900' : 'text-slate-400'}`}
                                >
                                    En attente
                                </Button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input className="pl-10 pr-4 h-10 bg-slate-50 border-none rounded-xl text-xs font-bold" placeholder="Chercher un débours..." />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {MOCK_EXPENSES.map((exp) => (
                                    <div key={exp.id} className="p-8 hover:bg-slate-50/30 transition-all cursor-pointer group flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${exp.type === 'TRANSPORT' ? 'bg-blue-50 text-blue-600' :
                                                    exp.type === 'REPAS' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {exp.type === 'TRANSPORT' ? <Car className="h-7 w-7" /> :
                                                    exp.type === 'REPAS' ? <Utensils className="h-7 w-7" /> :
                                                        <Hotel className="h-7 w-7" />}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{exp.client}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.type}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span className="text-[10px] font-bold text-slate-400">{exp.date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-900">{new Intl.NumberFormat('fr-FR').format(exp.amount)} <span className="text-[10px] font-bold text-slate-400">FCFA</span></p>
                                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                                    {exp.proof ? (
                                                        <Badge className="bg-emerald-50 text-emerald-600 text-[8px] font-black border-none uppercase">REÇU JOINT</Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-50 text-rose-600 text-[8px] font-black border-none uppercase">REÇU MANQUANT</Badge>
                                                    )}
                                                    <Badge className={`${exp.status === 'VALIDÉ' ? 'bg-blue-50 text-blue-600' :
                                                            exp.status === 'REMBOURSÉ' ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-900'
                                                        } border-none font-black text-[8px] uppercase tracking-tighter`}>{exp.status}</Badge>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-200">
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50/50 flex justify-center border-t border-slate-50">
                                <Button variant="link" className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Voir toutes les transactions Q1</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Receipt processing AI section */}
                    <Card className="rounded-[3rem] border-indigo-100 bg-indigo-900 text-white p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute -right-10 -top-10 h-60 w-60 bg-white/10 rounded-full blur-[100px]" />
                        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                            <div className="h-24 w-24 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Camera className="h-10 w-10" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-black mb-2">Capture IA LexScan</h3>
                                <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                                    Finie la saisie manuelle. Prenez une photo de votre reçu, l&apos;IA extrait automatiquement le marchand, la TVA, le montant et suggère le dossier associé.
                                </p>
                            </div>
                            <Button className="h-16 px-10 bg-white text-indigo-900 rounded-2xl font-black shadow-xl hover:bg-slate-50 flex gap-2 text-lg">
                                Lancer l&apos;IA Scan
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right: Policy & Stats */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <Filter className="h-4 w-4 text-indigo-400" />
                                Politique Interne Frais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                {[
                                    { label: "Plafond Déjeuner", value: "25.000 FCFA", used: 45 },
                                    { label: "Indemnités Km", value: "350 FCFA/km", used: 80 },
                                    { label: "Logement (Mission)", value: "150.000 FCFA", used: 12 },
                                ].map((p, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-700">
                                            <span>{p.label}</span>
                                            <span>{p.value}</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${p.used}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
                                <p className="text-[10px] italic text-slate-500 font-medium">
                                    "Les notes de frais doivent être soumises dans les 48h suivant la mission pour un remboursement garanti sous 5 jours."
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <CreditCard className="h-8 w-8" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900">Carte LexPremium Business</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">Reliez vos dépenses directement au cabinet sans déavance de fonds.</p>
                        </div>
                        <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 rounded-xl border-slate-200">Demander une carte</Button>
                    </div>
                </div>

            </div>

        </div>
    )
}
