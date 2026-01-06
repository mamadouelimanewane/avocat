"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Gavel,
    BookOpen,
    ArrowUpRight,
    Filter,
    Sparkles,
    Loader2,
    Calendar,
    MapPin,
    Bookmark,
    ExternalLink,
    Quote
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface JurisResponse {
    id: string
    title: string
    reference: string
    summary: string
    relevancy: number
    court: string
    date: string
    tags: string[]
}

const MOCK_RESULTS: JurisResponse[] = [
    {
        id: '1',
        title: "Bail Commercial : Renouvellement et Indemnité d'Éviction",
        reference: "Cour d'Appel de Dakar, Chambre Civile, N° 124/2023",
        summary: "Dans cet arrêt majeur, la Cour confirme que le défaut de mise en demeure préalable à la résiliation pour impayés rend l'acte nul au sens de l'Acte Uniforme OHADA.",
        relevancy: 98,
        court: "COUR D'APPEL DAKAR",
        date: "15 Mars 2023",
        tags: ["OHADA", "BAIL", "PROCÉDURE"]
    },
    {
        id: '2',
        title: "Responsabilité Civile Professionnelle de l'Avocat",
        reference: "Cour Suprême du Sénégal, Arrêt N° 45/2022",
        summary: "La Cour rappelle l'obligation de diligence et les conditions d'engagement de la responsabilité de l'avocat en cas de perte de chance.",
        relevancy: 85,
        court: "COUR SUPRÊME",
        date: "10 Octobre 2022",
        tags: ["CIVIL", "PROFESSIONNEL"]
    },
    {
        id: '3',
        title: "Saisie Immobilière : Nullité du Commandement",
        reference: "CCJA, Arrêt de principe N° 002/2021",
        summary: "Interprétation stricte des mentions obligatoires prescrites par l'AUVE. Le commandement doit être dénoncé dans les délais de rigueur.",
        relevancy: 72,
        court: "CCJA (OHADA)",
        date: "05 Janvier 2021",
        tags: ["OHADA", "EXÉCUTION"]
    }
]

export function JurisprudenceResearch() {
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<JurisResponse[]>([])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/ai/jurisprudence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })
            const data = await response.json()
            if (data.success) {
                setResults(data.results)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-none shadow-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 text-white pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BookOpen className="h-48 w-48" />
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black italic">LexAI Research <span className="text-indigo-400">RAG ++</span></CardTitle>
                            <CardDescription className="text-slate-400">Accédez à la plus grande base de jurisprudence du Sénégal & OHADA par recherche sémantique.</CardDescription>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Posez votre question juridique (ex: Quel est le délai de grâce pour un bail commercial ?)"
                                className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-md"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-14 bg-indigo-600 hover:bg-indigo-700 px-8 rounded-2xl" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Rechercher"}
                        </Button>
                    </form>
                </div>
            </CardHeader>

            <CardContent className="p-8">
                {results.length > 0 ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center border-b pb-4">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{results.length} ARRÊTS PERTINENTS TROUVÉS</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-2"><Filter className="h-3 w-3" /> Filtrer</Button>
                                <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-2"><Bookmark className="h-3 w-3" /> Mes Favoris</Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {results.map((res, i) => (
                                <motion.div
                                    key={res.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <SearchResultCard result={res} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : !isLoading && (
                    <div className="py-20 text-center space-y-4">
                        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                            <Gavel className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900">Commencez votre recherche</p>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">Explorez des milliers d'arrêts indexés par notre moteur sémantique avancé.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function SearchResultCard({ result }: { result: JurisResponse }) {
    return (
        <div className="group bg-white p-6 rounded-3xl border-2 border-slate-50 hover:border-indigo-100 transition-all cursor-pointer relative shadow-sm hover:shadow-xl">
            <div className="absolute right-6 top-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-4 border-slate-50 flex items-center justify-center relative bg-white">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * result.relevancy) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[10px] font-black">{result.relevancy}%</span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Pertinence</span>
            </div>

            <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 uppercase text-[9px] font-black">{result.court}</Badge>
                    {result.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[9px] font-bold uppercase">{tag}</Badge>
                    ))}
                </div>

                <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{result.title}</h4>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {result.date}</span>
                        <span className="flex items-center gap-1 text-indigo-500 font-black"><Gavel className="h-3 w-3" /> {result.reference}</span>
                    </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl relative">
                    <Quote className="absolute top-2 left-2 h-4 w-4 text-slate-200" />
                    <p className="text-sm text-slate-600 leading-relaxed pl-4 italic">
                        {result.summary}
                    </p>
                </div>

                <div className="flex gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-full h-9 px-4">
                        <ArrowUpRight className="h-4 w-4 mr-2" /> Ouvrir l'acte complet
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-full h-9 px-4">
                        <Bookmark className="h-4 w-4 mr-2" /> Sauvegarder
                    </Button>
                </div>
            </div>
        </div>
    )
}
