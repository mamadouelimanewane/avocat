"use client"

import { useState, useEffect } from "react"
import {
    Search,
    FileText,
    User,
    Briefcase,
    Calendar,
    Gavel,
    Filter,
    X,
    ArrowRight,
    Loader2,
    Clock,
    Sparkles,
    FileSearch
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchResult {
    id: string
    title: string
    description: string
    type: 'DOSSIER' | 'CLIENT' | 'DOCUMENT' | 'AUDIENCE' | 'JURISPRUDENCE'
    date: string
    relevance: number
    highlights?: string[]
}

export function GlobalSmartSearch() {
    const [query, setQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [history, setHistory] = useState<string[]>(["Bail commercial Dakar", "Assignation TechCorp", "Art. 258 AUDCG"])
    const [activeTab, setActiveTab] = useState("all")

    useEffect(() => {
        if (!query) {
            setResults([])
            return
        }

        const timer = setTimeout(() => {
            performSearch()
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    const performSearch = () => {
        setIsSearching(true)
        // Simulated ElasticSearch response
        setTimeout(() => {
            const mockResults: SearchResult[] = ([
                {
                    id: '1',
                    title: "Bail Commercial - Ndiaye & Fils",
                    description: "Recherche sur les clauses de résiliation et le préavis contractuel...",
                    type: 'DOSSIER',
                    date: '20/12/2024',
                    relevance: 0.98,
                    highlights: ["...clause de **résiliation** particulièrement stricte...", "...**préavis** de 6 mois exigé..."]
                },
                {
                    id: '2',
                    title: "Assignation en paiement - TechCorp SA",
                    description: "Conclusions en défense préparées pour l'audience du 15/01/2025.",
                    type: 'DOCUMENT',
                    date: '24/12/2024',
                    relevance: 0.85,
                    highlights: ["...moyen soulevé sur la **prescription** triennale..."]
                },
                {
                    id: '3',
                    title: "Art. 258 AUDCG OHADA",
                    description: "Responsabilité du vendeur et réparation du préjudice commercial.",
                    type: 'JURISPRUDENCE',
                    date: 'Audit 2023',
                    relevance: 0.75
                }
            ] as SearchResult[]).filter(r =>
                r.title.toLowerCase().includes(query.toLowerCase()) ||
                r.description.toLowerCase().includes(query.toLowerCase())
            )

            setResults(mockResults)
            setIsSearching(false)
        }, 800)
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'DOSSIER': return <Briefcase className="h-4 w-4 text-blue-500" />
            case 'CLIENT': return <User className="h-4 w-4 text-emerald-500" />
            case 'DOCUMENT': return <FileText className="h-4 w-4 text-indigo-500" />
            case 'AUDIENCE': return <Gavel className="h-4 w-4 text-purple-500" />
            case 'JURISPRUDENCE': return <FileSearch className="h-4 w-4 text-amber-500" />
            default: return <Search className="h-4 w-4" />
        }
    }

    return (
        <Card className="border-indigo-100 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardContent className="p-0">
                {/* Search Bar Container */}
                <div className="p-4 border-b bg-white">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Recherche intelligente (Dossiers, Clients, Jurisprudence, Textes...)"
                            className="pl-11 pr-20 py-6 text-lg border-none focus-visible:ring-0 shadow-none bg-transparent"
                            autoFocus
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {query && (
                                <Button variant="ghost" size="icon" onClick={() => setQuery("")} className="h-8 w-8 hover:bg-slate-100 rounded-full">
                                    <X className="h-4 w-4 text-slate-400" />
                                </Button>
                            )}
                            <div className="h-8 px-2 flex items-center bg-slate-100 rounded text-[10px] font-mono text-slate-400 border border-slate-200">
                                Ctrl + K
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-4 py-2 border-b bg-slate-50/50 flex items-center justify-between">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-transparent h-8 p-0 gap-4">
                            <TabsTrigger value="all" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-full border-none px-4 text-xs">Tout</TabsTrigger>
                            <TabsTrigger value="dossiers" className="rounded-full border-none px-4 text-xs">Dossiers</TabsTrigger>
                            <TabsTrigger value="documents" className="rounded-full border-none px-4 text-xs">Documents</TabsTrigger>
                            <TabsTrigger value="clients" className="rounded-full border-none px-4 text-xs">Clients</TabsTrigger>
                            <TabsTrigger value="juris" className="rounded-full border-none px-4 text-xs">Jurisprudence</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">
                        <Filter className="h-3 w-3 mr-2" /> Filtrer
                    </Button>
                </div>

                <div className="flex h-[500px]">
                    {/* Left: History/Suggestions */}
                    {!query && (
                        <div className="w-64 border-r bg-slate-50/30 p-4 space-y-6">
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Recherches Récentes
                                </h4>
                                <div className="space-y-1">
                                    {history.map((h, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setQuery(h)}
                                            className="w-full text-left p-2 text-sm text-slate-600 hover:bg-white hover:text-indigo-600 rounded-md transition-all flex items-center justify-between group"
                                        >
                                            {h}
                                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-indigo-500" /> Suggestions IA
                                </h4>
                                <div className="space-y-1">
                                    {["Conformité OHADA 2024", "Droit du travail Sénégal", "Réforme fiscale"].map((s, i) => (
                                        <button key={i} className="w-full text-left p-2 text-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-md flex items-center gap-2">
                                            <Badge variant="outline" className="h-4 p-1 rounded-sm bg-white text-[8px]">PRO</Badge>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right: Results */}
                    <ScrollArea className="flex-1 p-4 bg-white/40">
                        {isSearching ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-pulse">
                                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                <p className="text-sm font-medium">Interrogation d'ElasticSearch...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-4">
                                {results.map((result) => (
                                    <Card key={result.id} className="border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group bg-white">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-4">
                                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                                        {getTypeIcon(result.type)}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{result.title}</h4>
                                                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-100">
                                                                {result.type}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-500 line-clamp-2">{result.description}</p>

                                                        {result.highlights && (
                                                            <div className="mt-2 space-y-1">
                                                                {result.highlights.map((h, i) => (
                                                                    <p key={i} className="text-xs text-slate-400 italic bg-slate-50/50 p-1 px-2 rounded border-l-2 border-indigo-200" dangerouslySetInnerHTML={{ __html: h }} />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <span className="text-[10px] font-medium text-slate-400">{result.date}</span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500" style={{ width: `${result.relevance * 100}%` }} />
                                                        </div>
                                                        <span className="text-[8px] font-bold text-indigo-400">Score: {Math.round(result.relevance * 100)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                                <Search className="h-12 w-12 mb-4 opacity-10" />
                                <h3 className="font-semibold text-slate-600">Aucun résultat trouvé</h3>
                                <p className="text-sm mt-1 max-w-xs">Nous n'avons trouvé aucun élément correspondant à "{query}". Essayez avec d'autres mots-clés.</p>
                                <Button variant="outline" size="sm" className="mt-4" onClick={() => setQuery("")}>Effacer la recherche</Button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-12">
                                <Sparkles className="h-16 w-16 mb-4 opacity-5" />
                                <p className="text-lg font-medium">Recherche Globale Intelligente</p>
                                <p className="text-sm">Commencez à taper pour explorer votre base de connaissances.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
