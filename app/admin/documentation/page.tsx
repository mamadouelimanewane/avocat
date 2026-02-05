"use client";

import { useState } from "react";
import {
    GraduationCap,
    BookOpen,
    Play,
    CheckCircle2,
    Clock,
    Award,
    Bell,
    AlertTriangle,
    FileText,
    Calendar,
    TrendingUp,
    Filter,
    Search,
    ExternalLink,
    Zap,
    Users,
    Map as MapIcon,
    Trophy,
    Star,
    MessageSquare,
    Pause,
    Volume2,
    Maximize,
    SkipForward,
    SkipBack,
    ChevronRight,
    Download,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const COURSES = [
    {
        id: "LEX001",
        title: "Maîtriser LexPredict PRO",
        type: "Feature Mastery",
        duration: "1h 30m",
        status: "new",
        category: "IA Justice",
        instructor: "Me. Diop"
    },
    {
        id: "LEX002",
        title: "Recouvrement Massif Automatisé",
        type: "Productivité",
        duration: "2h",
        status: "in_progress",
        progress: 65,
        category: "Finance",
        instructor: "Cabinet Expert"
    },
    {
        id: "LEX003",
        title: "Défense Pénale & Tech",
        type: "Stratégie",
        duration: "4h",
        status: "completed",
        category: "Pénal",
        instructor: "Bâtonnier Faye"
    },
    {
        id: "LEX004",
        title: "Audit Juridique par l'IA",
        type: "Atelier",
        duration: "3h",
        status: "upcoming",
        date: "22 Fév 2026",
        category: "Audit",
        instructor: "LexExpert Team"
    }
];

const LEGAL_ALERTS = [
    { id: 1, title: "Nouvelle Jurisprudence OHADA (Recouvrement)", date: "Aujourd'hui", severity: "high", read: false },
    { id: 2, title: "Réforme Code Minier Sénégal 2026", date: "Hier", severity: "high", read: false },
    { id: 3, title: "Webinaire : Impact Loi Finances", date: "02/02/2026", severity: "medium", read: true },
    { id: 4, title: "Mise à jour LexPremium v2.1", date: "01/02/2026", severity: "info", read: true }
];

export default function CabinetAcademyPage() {
    const [activeTab, setActiveTab] = useState<"formations" | "veille">("formations");

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">

            {/* Header Modernisé */}
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 py-10 text-white shadow-2xl">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-amber-500/20">
                            <GraduationCap className="w-3 h-3" /> Académie & Excellence
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">
                            Cabinet <span className="text-amber-500">Academy</span>
                        </h1>
                        <p className="text-slate-400 mt-2 max-w-xl text-lg font-medium">
                            Formez-vous aux nouvelles technologies juridiques et restez à la pointe de la doctrine.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Progression Annuelle</p>
                            <p className="text-3xl font-black text-white">12<span className="text-amber-500 text-lg">/20h</span></p>
                        </div>
                        <button className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-all shadow-lg shadow-amber-500/25 group">
                            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
                    <button
                        onClick={() => setActiveTab("formations")}
                        className={cn("px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
                            activeTab === "formations" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        <BookOpen className="w-4 h-4" /> Catalogue
                    </button>
                    <button
                        onClick={() => setActiveTab("veille")}
                        className={cn("px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 relative",
                            activeTab === "veille" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        <Bell className="w-4 h-4" /> Veille Juridique
                        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    </button>
                </div>

                <div className="ml-auto flex gap-2">
                    <a
                        href="/manuals/LexPremium_Master_Handbook_2026.pdf"
                        download
                        className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                        <Download className="w-4 h-4" /> MASTER HANDBOOK PDF
                    </a>
                    <Link href="/cabinet-academy/certificats" className="px-4 py-2 bg-white border border-slate-200 hover:border-amber-500/50 text-slate-700 hover:text-amber-600 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm">
                        <Award className="w-4 h-4" /> Mes Certificats
                    </Link>
                </div>
            </div>

            {activeTab === "formations" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Liste des formations */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" /> Formations Recommandées
                            </h2>
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-64" />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {COURSES.map((course) => (
                                <div key={course.id} className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <GraduationCap className="w-24 h-24 text-amber-500 -rotate-12" />
                                    </div>

                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex gap-5">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                                course.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                                                    course.status === "in_progress" ? "bg-amber-100 text-amber-600" :
                                                        "bg-indigo-100 text-indigo-600"
                                            )}>
                                                {course.status === "completed" ? <CheckCircle2 className="w-7 h-7" /> :
                                                    course.status === "in_progress" ? <Play className="w-7 h-7 ml-1" /> :
                                                        <BookOpen className="w-7 h-7" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                                                        {course.category}
                                                    </span>
                                                    {course.status === "new" && (
                                                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide">
                                                            Nouveau
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                                    <Users className="w-3 h-3" /> {course.instructor}
                                                    <span className="text-slate-300">•</span>
                                                    <Clock className="w-3 h-3" /> {course.duration}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="self-center">
                                            <button className="h-10 w-10 rounded-full bg-slate-50 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {course.status === "in_progress" && (
                                        <div className="mt-5 relative z-10">
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="font-bold text-slate-700">Progression en cours</span>
                                                <span className="font-bold text-amber-600">{course.progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${course.progress}%` }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Droit */}
                    <div className="space-y-6">
                        {/* Handbook Banner */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FileText className="w-20 h-20 text-slate-900" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Ressource Maître</h3>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">Le Manuel de Maîtrise 2026</h2>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Accédez à l'intégralité des secrets de LexPremium Elite en un seul document.</p>
                            <a
                                href="/manuals/LexPremium_Master_Handbook_2026.pdf"
                                download
                                className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                                <Download className="w-4 h-4" /> TÉLÉCHARGER LE PDF (14MB)
                            </a>
                        </div>

                        {/* Carte Progression */}
                        <div className="bg-white rounded-[2rem] p-6 text-center border border-slate-200 shadow-sm">
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray="351" strokeDashoffset="140" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-900">60%</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Objectif</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Expertise Niveau 3</h3>
                            <p className="text-sm text-slate-500 mt-2">Plus que 2 modules pour atteindre le niveau Master.</p>
                        </div>

                        {/* Top Performers */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy className="w-5 h-5 text-amber-400" />
                                <h3 className="font-bold">Palmarès du Cabinet</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: "Me. Dia", points: 2450, rank: 1 },
                                    { name: "Me. Fall", points: 1980, rank: 2 },
                                    { name: "Me. Sow", points: 1850, rank: 3 },
                                ].map((user, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                            i === 0 ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-slate-700 text-slate-300"
                                        )}>
                                            {user.rank}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-400">{user.points} XP</p>
                                        </div>
                                        {i === 0 && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                    {LEGAL_ALERTS.map((alert) => (
                        <div key={alert.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-5 group cursor-pointer border-l-4 border-l-transparent hover:border-l-amber-500">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                alert.severity === "high" ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600"
                            )}>
                                {alert.severity === "high" ? <AlertTriangle className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">{alert.title}</h3>
                                    {!alert.read && <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase">Important</span>}
                                </div>
                                <p className="text-slate-500 text-sm">{alert.date} • Source Juridique Vérifiée</p>
                            </div>
                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    ))}

                    <div className="rounded-2xl bg-slate-100 p-8 text-center border-2 border-dashed border-slate-300">
                        <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-900">Suggérer un sujet de veille</h3>
                        <p className="text-slate-500 text-sm mb-4">Vous ne trouvez pas l'info que vous cherchez ? Demandez à l'équipe de recherche.</p>
                        <button className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:border-slate-300 transition-colors">
                            Faire une suggestion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
