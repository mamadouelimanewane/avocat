"use client"

import { useState } from "react"
import { smartSearchJurisprudence } from "@/app/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Search, Scale, BookOpen, Clock, FileText, Globe,
    ArrowRight, Printer, Download, Sparkles
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Helper function to print content
const printDocument = (doc: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>${doc.title}</title>
                    <style>
                        body { font-family: serif; padding: 40px; max-width: 800px; margin: auto; }
                        h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
                        .meta { color: #666; font-style: italic; margin-bottom: 20px; }
                        .content { line-height: 1.6; text-align: justify; }
                        .footer { margin-top: 50px; font-size: 0.8em; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <h1>${doc.title}</h1>
                    <div class="meta">
                        Source: ${doc.court || doc.region} | Date: ${new Date(doc.date).toLocaleDateString()} | Réf: ${doc.reference || 'N/A'}
                    </div>
                    <div class="content">
                        ${doc.content ? doc.content.replace(/\n/g, '<br/>') : 'Contenu non disponible.'}
                    </div>
                    <div class="footer">
                        Document généré par AvocatOS - Le ${new Date().toLocaleDateString()}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

export default function RecherchePage() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [searchMeta, setSearchMeta] = useState<any>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState<any>(null)

    async function handleSearch() {
        if (!query.trim()) return
        setIsSearching(true)
        setResults([])

        const res = await smartSearchJurisprudence(query)
        setIsSearching(false)

        if (res.success) {
            setResults(res.results)
            setSearchMeta(res.analysis)
        }
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* EN-TÊTE RECHERCHE */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    Bibliothèque Juridique Intelligente
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Recherchez parmi des milliers de textes de loi, arrêts et doctrines.
                    L'IA comprend votre intention (dates, lieux, sujets).
                </p>

                <div className="max-w-3xl mx-auto relative flex gap-2">
                    <Input
                        placeholder="Ex: Arrêts sur le licenciement abusif au Sénégal en 2023..."
                        className="h-14 pl-12 text-lg shadow-sm"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                    <Button
                        size="lg"
                        className="h-14 px-8 text-lg font-medium bg-indigo-600 shadow-md hover:bg-indigo-700"
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? <Sparkles className="animate-spin mr-2" /> : "Rechercher"}
                    </Button>
                </div>

                <div className="flex justify-center gap-4 text-sm text-slate-600">
                    <Link href="/recherche/validation">
                        <Button variant="link" className="text-slate-500 hover:text-indigo-600">
                            <Globe className="h-4 w-4 mr-1" />
                            Veille & Validation Crawler
                        </Button>
                    </Link>
                </div>
            </div>

            {/* RÉSULTATS */}
            {searchMeta && (
                <div className="flex items-center gap-2 mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-indigo-700 text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>
                        Filtres compris par l'IA :
                        {searchMeta.keywords && <strong className="ml-1">"{searchMeta.keywords}"</strong>}
                        {searchMeta.type && <Badge variant="outline" className="ml-2 bg-white text-indigo-700 border-indigo-200">{searchMeta.type}</Badge>}
                        {searchMeta.year && <Badge variant="outline" className="ml-2 bg-white text-indigo-700 border-indigo-200">{searchMeta.year}</Badge>}
                        {searchMeta.region && <Badge variant="outline" className="ml-2 bg-white text-indigo-700 border-indigo-200">{searchMeta.region}</Badge>}
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* LISTE */}
                <div className="md:col-span-3 space-y-4">
                    {results.length > 0 ? (
                        results.map((doc) => (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedDoc(doc)}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                            {doc.type}
                                        </Badge>
                                        <span className="text-sm text-slate-400 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(doc.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-indigo-900 group-hover:text-indigo-600 transition-colors">
                                        {doc.title}
                                    </h3>
                                    <div className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                        {doc.summary || doc.content}
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-400">
                                        <span className="flex items-center"><Scale className="h-3 w-3 mr-1" /> {doc.court || doc.region}</span>
                                        {doc.reference && <span className="flex items-center"><FileText className="h-3 w-3 mr-1" /> Réf: {doc.reference}</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        !isSearching && searchMeta && (
                            <div className="text-center py-12 text-slate-400">
                                Aucun résultat trouvé pour cette recherche.
                            </div>
                        )
                    )}
                </div>

                {/* STATS / INFO */}
                <div className="hidden md:block space-y-6">
                    <Card className="bg-indigo-900 text-white border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg"><BookOpen className="h-5 w-5 mr-2" /> Base de Données</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between border-b border-indigo-800 pb-2">
                                <span>Documents</span>
                                <span className="font-bold">2,450+</span>
                            </div>
                            <div className="flex justify-between border-b border-indigo-800 pb-2">
                                <span>Regions</span>
                                <span className="font-bold">OHADA, SN...</span>
                            </div>
                            <p className="text-xs text-indigo-300 pt-2">
                                Mise à jour quotidienne via l'agent de patrouille autonome.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* LECTEUR DE DOCUMENT (DIALOG) */}
            <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
                    {selectedDoc && (
                        <>
                            <DialogHeader className="p-6 pb-2 border-b bg-slate-50">
                                <div className="flex gap-2 mb-2">
                                    <Badge>{selectedDoc.type}</Badge>
                                    <Badge variant="outline">{selectedDoc.region}</Badge>
                                </div>
                                <DialogTitle className="text-2xl font-serif text-indigo-900 leading-tight">
                                    {selectedDoc.title}
                                </DialogTitle>
                                <DialogDescription>
                                    Date: {new Date(selectedDoc.date).toLocaleDateString()} — Réf: {selectedDoc.reference || 'N/A'}
                                </DialogDescription>

                                <div className="flex gap-2 mt-4">
                                    <Button size="sm" variant="outline" onClick={() => printDocument(selectedDoc)}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Imprimer / PDF
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-indigo-600">
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Citer dans un dossier
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto p-8 bg-white">
                                <div className="max-w-3xl mx-auto prose prose-indigo">
                                    {/* Text Content */}
                                    <div className="whitespace-pre-line text-slate-800 leading-relaxed font-serif text-lg">
                                        {selectedDoc.content || "Contenu non disponible."}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
