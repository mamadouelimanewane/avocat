
"use client"

import { useState } from "react"
import {
    Search,
    BookOpen,
    Scale,
    FileText,
    Filter,
    ChevronRight,
    TrendingUp,
    Brain,
    Sparkles,
    MessageSquare,
    Bookmark,
    Link as LinkIcon,
    ExternalLink,
    Quote,
    Library
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface LexMateriaProps {
    dossierId: string
    onClose?: () => void
}

export function LexMateria({ dossierId, onClose }: LexMateriaProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"search" | "chat">("search")
    const [activeCitation, setActiveCitation] = useState<number | null>(null)

    const searchResults = [
        {
            id: 1,
            title: "Arrêt n° 12-345 du 15 Oct 2024",
            court: "Cour de Cassation, Chambre Commerciale",
            snippet: "...qu'en vertu de l'article 1104 du Code Civil, la bonne foi doit présider à la négociation, la formation et l'exécution des contrats...",
            tags: ["Contrats", "Bonne Foi", "Rupture Brutale"]
        },
        {
            id: 2,
            title: "CA Paris, Pôle 5, Ch. 4, 12 Sept 2023",
            court: "Cour d'Appel de Paris",
            snippet: "...confirme la jurisprudence constante selon laquelle le préavis doit tenir compte de l'ancienneté des relations commerciales...",
            tags: ["Préavis", "Commerce"]
        }
    ]

    const chatHistory = [
        {
            role: "user",
            text: "Quels sont les critères récents pour caractériser une rupture brutale des relations commerciales ?"
        },
        {
            role: "ai",
            text: "Pour caractériser une rupture brutale, la jurisprudence récente, notamment l'arrêt de la Cour de Cassation du 15 Octobre 2024 [1], met l'accent sur deux critères principaux : la soudaineté de la rupture sans préavis écrit suffisant et l'ancienneté des relations commerciales établies [2].",
            citations: [
                { id: 1, source: "Cass. Com., 15 Oct 2024, n° 12-345" },
                { id: 2, source: "Code de Commerce, Art. L442-1" }
            ]
        }
    ]

    return (
        <div className="bg-[#f8fafc] border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - Doctrine Style Clean */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-violet-600 p-2 rounded-lg shadow-md shadow-violet-200">
                        <Library className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-violet-600">Materia</span> Research
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Doctrine & Jurisprudence IA</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Search / Chat Toggle Bar (Left) */}
                <div className="w-14 border-r border-slate-200 bg-white flex flex-col items-center py-4 gap-4 z-10 shadow-sm">
                    <ModeButton active={viewMode === 'search'} icon={<Search className="h-5 w-5" />} onClick={() => setViewMode('search')} label="Recherche" />
                    <ModeButton active={viewMode === 'chat'} icon={<MessageSquare className="h-5 w-5" />} onClick={() => setViewMode('chat')} label="Assistant IA" />
                    <div className="w-8 h-[1px] bg-slate-100 my-2" />
                    <ModeButton active={false} icon={<Bookmark className="h-5 w-5" />} onClick={() => { }} label="Favoris" />
                </div>

                {/* Content Panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">

                    {/* Search Field (Always Visible but Contextual) */}
                    <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {viewMode === 'search' ? (
                                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                ) : (
                                    <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
                                )}
                            </div>
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl font-medium text-sm transition-all shadow-inner"
                                placeholder={viewMode === 'search' ? "Rechercher une décision, un article, un point de droit..." : "Posez une question juridique complexe à LexMateria..."}
                            />
                            {viewMode === 'search' && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-50">
                                        <span className="text-xs">⌘</span>K
                                    </kbd>
                                </div>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-6 max-w-2xl mx-auto w-full">
                            <AnimatePresence mode="wait">
                                {viewMode === 'search' ? (
                                    <motion.div
                                        key="search-view"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        {/* Quick Filters */}
                                        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                                            <Badge variant="outline" className="bg-white hover:bg-violet-50 cursor-pointer border-slate-200 text-slate-600 font-bold px-3 py-1.5 h-8 gap-1.5">
                                                <Scale className="h-3 w-3" /> Jurisprudence
                                            </Badge>
                                            <Badge variant="outline" className="bg-white hover:bg-violet-50 cursor-pointer border-slate-200 text-slate-600 font-bold px-3 py-1.5 h-8 gap-1.5">
                                                <BookOpen className="h-3 w-3" /> Codes
                                            </Badge>
                                            <Badge variant="outline" className="bg-white hover:bg-violet-50 cursor-pointer border-slate-200 text-slate-600 font-bold px-3 py-1.5 h-8 gap-1.5">
                                                <FileText className="h-3 w-3" /> Doctrine
                                            </Badge>
                                        </div>

                                        {/* Trends Card */}
                                        <Card className="border-none shadow-lg shadow-violet-100 bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                                <TrendingUp className="h-32 w-32" />
                                            </div>
                                            <CardContent className="p-6 relative z-10">
                                                <h4 className="font-black text-lg mb-1">Tendances : Rupture Brutale</h4>
                                                <p className="text-violet-100 text-sm font-medium mb-4 opacity-90">Analyse sur 1,240 arrêts (2024)</p>
                                                <div className="flex gap-4">
                                                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                                        <span className="block text-2xl font-black">72%</span>
                                                        <span className="text-[10px] uppercase font-bold opacity-70">Confirmations Appel</span>
                                                    </div>
                                                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                                        <span className="block text-2xl font-black">14 mois</span>
                                                        <span className="text-[10px] uppercase font-bold opacity-70">Préavis Moyen</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Results List */}
                                        <div className="space-y-4">
                                            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Résultats Pertinents</h5>
                                            {searchResults.map(result => (
                                                <Card key={result.id} className="group border shadow-sm hover:shadow-md hover:border-violet-200 transition-all cursor-pointer">
                                                    <CardContent className="p-5 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 text-base text-violet-700 group-hover:underline decoration-2 decoration-violet-200 underline-offset-4">{result.title}</h4>
                                                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                                                                    <Scale className="h-3 w-3" /> {result.court}
                                                                </p>
                                                            </div>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 group-hover:text-violet-500">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm text-slate-600 font-serif leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100 relative pl-8">
                                                            <Quote className="h-4 w-4 text-slate-300 absolute top-3 left-2" />
                                                            {result.snippet}
                                                        </p>
                                                        <div className="flex gap-2">
                                                            {result.tags.map(tag => (
                                                                <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-violet-100 hover:text-violet-700 transition-colors">
                                                                    #{tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="chat-view"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {chatHistory.map((msg, idx) => (
                                            <div key={idx} className={cn("flex gap-4", msg.role === 'ai' ? "flex-row" : "flex-row-reverse")}>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                                    msg.role === 'ai' ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"
                                                )}>
                                                    {msg.role === 'ai' ? <Brain className="h-4 w-4" /> : <span className="font-black text-xs">M</span>}
                                                </div>
                                                <div className={cn(
                                                    "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm max-w-[85%]",
                                                    msg.role === 'ai' ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none" : "bg-violet-600 text-white rounded-tr-none"
                                                )}>
                                                    {msg.text}
                                                    {msg.citations && (
                                                        <div className="mt-4 pt-3 border-t border-slate-100 grid gap-2">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sources Citées</p>
                                                            {msg.citations.map(cit => (
                                                                <div
                                                                    key={cit.id}
                                                                    onClick={() => setActiveCitation(cit.id)}
                                                                    className={cn(
                                                                        "flex items-center gap-2 p-2 rounded-lg text-xs font-bold cursor-pointer transition-all border",
                                                                        activeCitation === cit.id
                                                                            ? "bg-violet-50 text-violet-700 border-violet-200 shadow-sm"
                                                                            : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                                                                    )}
                                                                >
                                                                    <span className="bg-white border px-1.5 rounded text-[10px] py-0.5 shadow-sm font-mono text-slate-400">[{cit.id}]</span>
                                                                    <span className="truncate flex-1">{cit.source}</span>
                                                                    <ChevronRight className="h-3 w-3 opacity-50" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

function ModeButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <button
                        onClick={onClick}
                        className={cn(
                            "p-2.5 rounded-xl transition-all duration-200 group relative",
                            active
                                ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                                : "text-slate-400 hover:bg-violet-50 hover:text-violet-600"
                        )}
                    >
                        {icon}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-white font-bold text-xs" sideOffset={10}>
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
