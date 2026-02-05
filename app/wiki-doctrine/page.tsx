"use client"

import { useState } from "react"
import {
    BookOpen,
    Search,
    Plus,
    Folder,
    ChevronRight,
    Clock,
    Star,
    FileText,
    Users,
    Globe,
    Layout,
    Share2,
    Trash2,
    Edit3,
    Bookmark,
    ShieldCheck,
    Zap,
    Tag
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data for Knowledge Base
const CATEGORIES = [
    { name: "Procédures Internes", icon: <Layout className="h-4 w-4" />, count: 12 },
    { name: "Recherche & Jurisprudence", icon: <BookOpen className="h-4 w-4" />, count: 25 },
    { name: "Modèles de Documents", icon: <FileText className="h-4 w-4" />, count: 18 },
    { name: "RH & Onboarding", icon: <Users className="h-4 w-4" />, count: 5 },
]

const POPULAR_ARTICLES = [
    { id: 1, title: "Guide de Facturation (Nouvelles normes BCEAO)", category: "Procédures Internes", author: "Admin", date: "Il y a 2j", views: 145 },
    { id: 2, title: "Analyse Article 12 - Loi sur la Propriété Foncier", category: "Recherche & Jurisprudence", author: "Me Diop", date: "Hier", views: 89 },
    { id: 3, title: "Checklist Ouverture de Dossier Cabinet 360", category: "Procédures Internes", author: "Me Ndiaye", date: "3 Fév", views: 210 },
]

export default function KnowledgeBasePage() {
    const [search, setSearch] = useState("")

    return (
        <div className="p-8 space-y-8 bg-[#fdfdfd] min-h-screen">

            {/* Helpjuice style Premium Knowledge Header */}
            <div className="max-w-5xl mx-auto space-y-12 py-12">
                <div className="text-center space-y-4">
                    <Badge className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                        Centre de Savoir du Cabinet
                    </Badge>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Votre Source Unique de Vérité</h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                        Accédez instantanément aux connaissances collectives, modèles et procédures du cabinet.
                    </p>
                </div>

                {/* Central Search Bar (Google/Helpjuice vibe) */}
                <div className="relative max-w-3xl mx-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-20 pl-16 pr-8 text-xl bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                        placeholder="Rechercher une procédure, un arrêt ou un modèle..."
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
                        <kbd className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs font-bold text-slate-400">⌘</kbd>
                        <kbd className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs font-bold text-slate-400">K</kbd>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">

                {/* Categories Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Catégories</h3>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-indigo-600"><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="space-y-2">
                            {CATEGORIES.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer group transition-all">
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 group-hover:text-indigo-600">
                                        <span className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {cat.icon}
                                        </span>
                                        {cat.name}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">{cat.count}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-8 border-t border-slate-50 space-y-4">
                            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Favoris</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Calculateur ITB
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Statuts SARL (OHADA)
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="rounded-[2rem] border-indigo-100 bg-indigo-600 text-white p-8">
                        <Zap className="h-8 w-8 text-amber-400 mb-6" />
                        <h4 className="text-lg font-bold mb-2">LexAI Knowledge</h4>
                        <p className="text-xs text-indigo-100 leading-relaxed mb-6">
                            L&apos;IA indexe automatiquement vos dossiers fermés pour enrichir la base de connaissance sans effort.
                        </p>
                        <Button className="w-full bg-white text-indigo-600 font-bold text-xs h-10 rounded-xl">Activer l&apos;Auto-Indexation</Button>
                    </Card>
                </div>

                {/* Main Content: Trending Articles */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Articles Populaires</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-10 px-4 rounded-xl text-xs font-bold border-slate-200">Plus consultés</Button>
                            <Button variant="outline" className="h-10 px-4 rounded-xl text-xs font-bold border-slate-200">Récents</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {POPULAR_ARTICLES.map((art) => (
                            <Card key={art.id} className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group bg-white">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-slate-50 text-slate-500 font-black text-[9px] border-none group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {art.category}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                            <Clock className="h-3 w-3" /> {art.date}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {art.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">
                                            Découvrez les points clés et les impacts juridiques pour notre cabinet dans le cadre des nouveaux textes...
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                                                {art.author[0]}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-700">{art.author}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{art.views} VUES</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center space-y-4 hover:border-indigo-300 hover:bg-slate-50/50 transition-all cursor-pointer">
                            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                                <Plus className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Publier une connaissance</h4>
                                <p className="text-xs text-slate-400 max-w-xs px-4">Partagez vos recherches ou vos modèles pour l&apos;équipe.</p>
                            </div>
                        </div>
                    </div>

                    {/* Knowledge Tags Explorer */}
                    <div className="pt-12 space-y-6">
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Tags Populaires</h3>
                        <div className="flex flex-wrap gap-2">
                            {["#OHADA", "#ConseilConstitutionnel", "#DroitDuTravail", "#Fisc", "#Immobilier", "#Cession", "#Arbitrage", "#Penal"].map((tag, i) => (
                                <Badge key={i} variant="outline" className="px-5 py-2 rounded-xl text-xs font-bold border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-pointer bg-white shadow-sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Governance & Trust Footer */}
                    <div className="pt-12 p-8 bg-slate-50 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100">
                        <div className="flex items-center gap-4 text-left">
                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Bibliothèque Certifiée</h4>
                                <p className="text-xs text-slate-500">Tous les contenus sont revus par le comité de doctrine du cabinet.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rapport hebdo</Button>
                            <Button className="bg-slate-900 text-white px-6 rounded-xl font-bold h-10 shadow-lg">Gérer ma Doctrine</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
