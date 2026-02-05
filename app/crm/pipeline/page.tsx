"use client"

import { useState } from "react"
import {
    Users,
    Target,
    TrendingUp,
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    Filter,
    ArrowRight,
    UserPlus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Types
type Prospect = {
    id: string
    name: string
    source: string
    value: number
    probability: number
    lastContact: string
    type: 'PARTICULIER' | 'ENTREPRISE'
}

type Column = {
    id: string
    title: string
    color: string
}

// Mock Data
const COLUMNS: Column[] = [
    { id: 'new', title: 'Nouveaux Leads', color: 'bg-blue-500' },
    { id: 'meeting', title: 'Rendez-vous', color: 'bg-amber-500' },
    { id: 'proposal', title: 'Offre envoyée', color: 'bg-purple-500' },
    { id: 'negotiation', title: 'Négociation', color: 'bg-indigo-500' },
]

const MOCK_PROSPECTS: Record<string, Prospect[]> = {
    new: [
        { id: '1', name: 'Aliko Dangote (Cession)', source: 'Site Web', value: 25000000, probability: 20, lastContact: '2h', type: 'ENTREPRISE' },
        { id: '2', name: 'Mariama Ba', source: 'Recommandation', value: 750000, probability: 40, lastContact: '1j', type: 'PARTICULIER' },
    ],
    meeting: [
        { id: '3', name: 'Orange SA (Litige)', source: 'Appel entrant', value: 12000000, probability: 60, lastContact: '3j', type: 'ENTREPRISE' },
    ],
    proposal: [
        { id: '4', name: 'Pathé Balé', source: 'LinkedIn', value: 1500000, probability: 75, lastContact: '5j', type: 'PARTICULIER' },
    ],
    negotiation: [
        { id: '5', name: 'Wave Mobile (Contracting)', source: 'Appel d\'offre', value: 8500000, probability: 90, lastContact: '12h', type: 'ENTREPRISE' },
    ]
}

export default function CRMPipelinePage() {
    const [activeTab, setActiveTab] = useState<'pipeline' | 'stats'>('pipeline')

    return (
        <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">

            {/* Header aligned with LegalProd "premium all-in-one" vibe */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">CRM Business Development</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">95% de satisfaction</Badge>
                            <span className="text-slate-400 text-sm font-medium">• 12 nouveaux prospects ce mois</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 px-5 border-slate-200">
                        <Filter className="h-4 w-4 mr-2" /> Filtrer
                    </Button>
                    <Button className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800">
                        <UserPlus className="h-4 w-4 mr-2" /> Nouveau Prospect
                    </Button>
                </div>
            </div>

            {/* Top Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="rounded-3xl border-slate-100 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Valeur Pipeline</p>
                        <h3 className="text-2xl font-black text-slate-900">48.250.000 <span className="text-[10px] font-normal text-slate-400 uppercase">fcfa</span></h3>
                        <div className="flex items-center gap-1 text-emerald-500 mt-1 font-bold text-xs">
                            <TrendingUp className="h-3 w-3" /> +15% vs mois dernier
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Taux de Conversion</p>
                        <h3 className="text-2xl font-black text-slate-900">68%</h3>
                        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[68%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Délai Signature Moyen</p>
                        <h3 className="text-2xl font-black text-slate-900">12 Jours</h3>
                        <p className="text-xs text-slate-400 mt-1">-2 jours grâce à LexAI Assist</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-indigo-100 bg-indigo-50/20 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 text-center">Score Cabinet 360</p>
                        <h3 className="text-2xl font-black text-indigo-900 text-center">Elite</h3>
                        <p className="text-[10px] text-indigo-400 text-center font-bold">TOP 5% DES CABINETS</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pipeline View */}
            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-6">
                {COLUMNS.map((column) => (
                    <div key={column.id} className="min-w-[320px] flex-1">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">{column.title}</h3>
                                <Badge variant="secondary" className="rounded-full h-5 min-w-[20px] flex items-center justify-center font-bold text-[10px] bg-slate-200 text-slate-600 border-none">
                                    {MOCK_PROSPECTS[column.id]?.length || 0}
                                </Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {MOCK_PROSPECTS[column.id]?.map((prospect) => (
                                <Card key={prospect.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                {prospect.type === 'ENTREPRISE' ? <Users className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{prospect.name}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium mb-4">{prospect.source}</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm font-black text-indigo-600">
                                                {new Intl.NumberFormat('fr-FR').format(prospect.value)} <span className="text-[10px] font-medium text-slate-400">FCFA</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                                <Calendar className="h-3 w-3" /> {prospect.lastContact}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-4 border-t border-slate-50">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-slate-400">Probabilité</span>
                                                <span className="text-indigo-600">{prospect.probability}%</span>
                                            </div>
                                            <Progress value={prospect.probability} className="h-1 bg-slate-100" />
                                        </div>

                                        <div className="flex gap-2 mt-4 pt-4 invisible group-hover:visible transition-all">
                                            <Button variant="secondary" className="h-8 px-0 flex-1 rounded-lg text-xs bg-indigo-50 text-indigo-600 border-none shadow-none">
                                                <Mail className="h-3 w-3 mr-1.5" /> Mail
                                            </Button>
                                            <Button variant="secondary" className="h-8 px-0 flex-1 rounded-lg text-xs bg-emerald-50 text-emerald-600 border-none shadow-none">
                                                <ArrowRight className="h-3 w-3 mr-1.5" /> Next
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
