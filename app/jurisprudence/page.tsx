
"use client"

import { useState, useEffect } from "react"
import { Search, Gavel, Scale, FileText, Download, ExternalLink, RefreshCcw, Eye, Upload as UploadIcon, Book, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { initJurisprudenceLibrary, searchJurisprudence } from "@/app/actions"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

export default function JurisprudencePage() {
    const [results, setResults] = useState<any[]>([])
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("tous")

    const filteredResults = results.filter(item => {
        if (activeTab === "tous") return true;
        if (activeTab === "ohada") return item.type === "ACTE_UNIFORME" || item.court === "OHADA" || item.court === "CCJA";
        if (activeTab === "lois") return item.type === "LOI" || item.court === "SENEGAL";
        if (activeTab === "arretes") return item.type === "ARRETE";
        if (activeTab === "jurisprudence") return item.type === "JURISPRUDENCE" || (!item.type && (item.court === "CCJA" || item.court === "COUR_SUPREME"));
        return true;
    });

    const handleUpload = () => {
        toast({
            title: "Téléversement simulé",
            description: "Votre document a été ajouté à la file d'attente de validation.",
            duration: 3000,
        })
    }

    useEffect(() => {
        // Initial load & seed
        const load = async () => {
            setIsLoading(true)
            await initJurisprudenceLibrary()
            const data = await searchJurisprudence("")
            setResults(data)
            setIsLoading(false)
        }
        load()
    }, [])

    const handleSearch = async () => {
        setIsLoading(true)
        const data = await searchJurisprudence(query)
        setResults(data)
        setIsLoading(false)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Jurisprudence</h1>
                    <p className="text-slate-500 mt-1">Base de données unifiée Cour Suprême (Sénégal) & CCJA (OHADA).</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher un arrêt, un thème, une date..."
                        className="pl-10 h-10 border-slate-300 focus-visible:ring-indigo-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} className="bg-indigo-900 text-white hover:bg-indigo-800">
                    <Search className="mr-2 h-4 w-4" /> Rechercher
                </Button>
            </div>

            {/* Header Actions */}
            <div className="flex justify-end mb-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                            <UploadIcon className="h-4 w-4" /> Téléverser un document
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Contribuer à la base juridique</DialogTitle>
                            <DialogDescription>Partagez une décision ou un texte de loi avec le cabinet.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="border-2 border-dashed border-slate-200 rounded-lg h-32 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer" onClick={handleUpload}>
                                <UploadIcon className="h-8 w-8 mb-2" />
                                <span>Glisser-déposer un PDF ici</span>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="tous" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5 mb-4">
                    <TabsTrigger value="tous">Tous</TabsTrigger>
                    <TabsTrigger value="jurisprudence">Jurisprudence</TabsTrigger>
                    <TabsTrigger value="lois">Lois & Codes</TabsTrigger>
                    <TabsTrigger value="arretes">Arrêtés</TabsTrigger>
                    <TabsTrigger value="ohada"><span className="text-indigo-600 font-bold">OHADA</span></TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Filter Tags (Visual Only now, Tabs do real filtering) */}
            <div className="flex gap-2 flex-wrap mb-4">
                {/* Keep existing badges if needed, or remove. User request implied Tabs replaced them or augmented them. Keeping simplified. */}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-400">Chargement de la base de données...</div>
                ) : filteredResults.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">Aucun résultat trouvé pour "{query}" dans cet onglet.</div>
                ) : (
                    filteredResults.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg text-indigo-900 font-serif">{item.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Badge className={item.court === 'CCJA' ? 'bg-indigo-600' : 'bg-emerald-600'}>
                                                {item.court}
                                            </Badge>
                                            <span className="flex items-center gap-1"><Gavel className="h-3 w-3" /> {item.reference}</span>
                                            <span className="flex items-center gap-1"><Scale className="h-3 w-3" /> {format(new Date(item.date), 'dd MMMM yyyy', { locale: fr })}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-xs gap-2">
                                                    <Eye className="h-3 w-3" /> Voir
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                                                <DialogHeader>
                                                    <DialogTitle>{item.title}</DialogTitle>
                                                    <DialogDescription>
                                                        {item.reference} - {format(new Date(item.date), 'dd MMMM yyyy', { locale: fr })}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex-1 bg-slate-50 p-6 rounded-md overflow-y-auto border">
                                                    <div className="prose max-w-none">
                                                        <h3 className="text-lg font-bold mb-4">Texte Intégral / Extrait</h3>
                                                        <div className="whitespace-pre-wrap text-slate-800 font-mono text-sm leading-relaxed p-4 bg-white border rounded shadow-sm">
                                                            {item.content || item.summary || "Contenu non disponible."}
                                                        </div>
                                                        {item.sourceUrl && (
                                                            <div className="mt-8">
                                                                <a href={item.sourceUrl} target="_blank" className="text-blue-600 underline">Voir la source officielle (PDF)</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: "Téléchargement", description: "Le téléchargement a démarré..." })}>
                                            <Download className="mr-2 h-3 w-3" /> PDF
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {item.summary}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.keywords && JSON.parse(item.keywords).map((k: string) => (
                                        <span key={k} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                            #{k}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
