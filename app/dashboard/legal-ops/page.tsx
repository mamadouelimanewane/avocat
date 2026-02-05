"use client"

import { useState } from "react"
import {
    BarChart3,
    Calendar,
    ChevronRight,
    Clock,
    Filter,
    Layout,
    ListTodo,
    MoreHorizontal,
    Plus,
    Search,
    Users,
    Workflow,
    CheckCircle2,
    AlertCircle,
    Clock3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Data
const DOSSIERS_PROGRESS = [
    { id: 1, title: "Acquisition Africa Tech", stage: "Due Diligence", progress: 65, priority: "HAUTE", lawyer: "Me Ndiaye", deadline: "15 Fév" },
    { id: 2, title: "Litige Foncier Saly", stage: "Plaidoirie", progress: 85, priority: "MOYENNE", lawyer: "Me Diop", deadline: "10 Fév" },
    { id: 3, title: "Contrat Franchise Wave", stage: "Rédaction", progress: 20, priority: "URGENT", lawyer: "Me Faye", deadline: "Aujourd'hui" },
]

const TEAM_WORKLOAD = [
    { name: "Me Ndiaye", avatar: "N", load: 85, tasks: 12 },
    { name: "Me Diop", avatar: "D", load: 45, tasks: 6 },
    { name: "Me Faye", avatar: "F", load: 95, tasks: 15 },
    { name: "Me Sy", avatar: "S", load: 20, tasks: 2 },
]

const RECENT_STEPS = [
    { id: 1, text: "Conclusions déposées", dossier: "Acquisition Africa Tech", time: "Il y a 2h", user: "Me Ndiaye" },
    { id: 2, text: "Nouveau document KYC", dossier: "Litige Foncier Saly", time: "Il y a 4h", user: "Client" },
    { id: 3, text: "Facture pro-forma générée", dossier: "Contrat Franchise Wave", time: "Il y a 6h", user: "IA Assist" },
]

export default function LegalProjectManagementPage() {
    const [view, setView] = useState<'list' | 'kanban' | 'workload'>('list')

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 bg-slate-50/50 min-h-screen">

            {/* Premium Header inspired by ClickUp/Monday */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                            <Workflow className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Legal Ops & Pilotage</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Gestion de projet juridique avancée et optimisation des ressources.</p>
                </div>

                <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Vue Liste
                    </button>
                    <button
                        onClick={() => setView('kanban')}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${view === 'kanban' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Tableau Kanban
                    </button>
                    <button
                        onClick={() => setView('workload')}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${view === 'workload' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Charge Équipe
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                {/* Left Section: Active Dossiers Tracking (ClickUp style) */}
                <div className="xl:col-span-3 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Suivi des Dossiers Actifs</CardTitle>
                                <CardDescription>Visualisation en temps réel de la progression.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input className="pl-10 pr-4 h-9 w-48 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" placeholder="Rechercher..." />
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold">
                                    <Filter className="h-4 w-4" /> Filtres
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {DOSSIERS_PROGRESS.map((d) => (
                                    <div key={d.id} className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                            {/* Matter Info */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{d.title}</h3>
                                                    <Badge className={`${d.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' :
                                                            d.priority === 'HAUTE' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                                        } border-none font-black text-[10px]`}>{d.priority}</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                                    <span className="flex items-center gap-1.5"><Layout className="h-3.5 w-3.5" /> Stage: <span className="text-slate-900">{d.stage}</span></span>
                                                    <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> Échéance: <span className="text-slate-900">{d.deadline}</span></span>
                                                </div>
                                            </div>

                                            {/* Progress Tracker (Monday style) */}
                                            <div className="w-full lg:w-64 space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-slate-400">Progression</span>
                                                    <span className="text-indigo-600">{d.progress}%</span>
                                                </div>
                                                <Progress value={d.progress} className="h-2.5 bg-slate-100" />
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <div key={s} className={`h-1 flex-1 rounded-full ${s <= (d.progress / 20) ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Lawyer & Actions */}
                                            <div className="flex items-center gap-6 min-w-[150px] justify-end">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                                        <AvatarFallback className="bg-slate-900 text-white text-[10px] font-bold">{d.lawyer[3]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-bold text-slate-700">{d.lawyer}</span>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Voir le dossier</DropdownMenuItem>
                                                        <DropdownMenuItem>Changer de stage</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600">Archiver</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50/50 flex justify-center border-t border-slate-50">
                                <Button variant="ghost" className="text-slate-500 font-bold hover:bg-white gap-2">
                                    <Plus className="h-4 w-4" /> Ajouter un dossier au pilotage
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Legal Playbooks / Automations Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[2.5rem] border-emerald-100 bg-emerald-50/10">
                            <CardHeader>
                                <CardTitle className="text-sm font-black flex items-center gap-2 text-emerald-900">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Playbook: Litige Civil Automatisé
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {[
                                        { task: "Assignation signifiée", done: true },
                                        { task: "Constitution avocat adverse", done: true },
                                        { task: "Rédaction conclusions n°1", done: false },
                                        { task: "Demande de renvoi (si besoin)", done: false },
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                                            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${t.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-200'}`}>
                                                {t.done && <CheckCircle2 className="h-3 w-3" />}
                                            </div>
                                            <span className={`text-xs font-bold ${t.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.task}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-10">
                                    Lancer le prochain automatisme
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-indigo-100 bg-indigo-50/10">
                            <CardHeader>
                                <CardTitle className="text-sm font-black flex items-center gap-2 text-indigo-900">
                                    <AlertCircle className="h-4 w-4" />
                                    Intelligence des Délais
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center h-[200px] text-center space-y-4">
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-indigo-50">
                                    <Calendar className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">4 Échéances Critiques</h4>
                                    <p className="text-xs text-slate-500 mt-1">Vous avez 2 dépôts de conclusions prévus ce vendredi.</p>
                                </div>
                                <Button variant="link" className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Voir le calendrier global</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Section: Workflow & Team (Monday/ClickUp style) */}
                <div className="space-y-8">
                    {/* Team Workload Chart */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Users className="h-4 w-4 text-indigo-400" />
                                Capacité de l&apos;Équipe
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {TEAM_WORKLOAD.map((m) => (
                                <div key={m.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-7 w-7">
                                                <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">{m.avatar}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-bold text-slate-700">{m.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-black ${m.load > 80 ? 'text-rose-500' : 'text-slate-400'}`}>{m.load}%</span>
                                    </div>
                                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute h-full left-0 rounded-full transition-all duration-1000 ${m.load > 80 ? 'bg-rose-500' : m.load > 50 ? 'bg-orange-500' : 'bg-emerald-500'
                                                }`}
                                            style={{ width: `${m.load}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">{m.tasks} tâches en cours</p>
                                </div>
                            ))}
                            <Button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-xl h-10 border border-slate-200">
                                Rééquilibrer les tâches
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Activity Stream (Jarvis Digital style) */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-indigo-600" />
                                Flux d&apos;Activités
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-50">
                                {RECENT_STEPS.map((s) => (
                                    <div key={s.id} className="relative pl-8">
                                        <div className="absolute left-1 top-1 h-3.5 w-3.5 rounded-full bg-white border-2 border-indigo-500 z-10" />
                                        <p className="text-xs font-bold text-slate-800">{s.text}</p>
                                        <p className="text-[10px] text-indigo-600 font-medium mt-0.5">{s.dossier}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{s.time}</span>
                                            <span className="text-[10px] text-slate-400 font-bold opacity-30">•</span>
                                            <span className="text-[10px] text-slate-500 italic">Par {s.user}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-black mb-2 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" /> Analyse KPI
                        </h4>
                        <p className="text-[10px] text-indigo-100 leading-relaxed mb-6">
                            Votre délai moyen de traitement des dossiers "Droit Social" a réduit de 12% grâce au nouveau playbook.
                        </p>
                        <Button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl border border-white/30 backdrop-blur-sm">
                            Rapport de Performance
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}
