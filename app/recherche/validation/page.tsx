"use client"

import { useState, useEffect } from "react"
import { getPendingDocuments, crawlLegalUrl, approveDocument, rejectDocument, scanHubPage, launchResearchMission } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Globe, Check, X, Search, AlertCircle, Loader2, Link as LinkIcon, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Research Mission Component
function ResearchMission() {
    const [query, setQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<{ seeds: string[], links: any[] } | null>(null)
    const { toast } = useToast()

    async function handleMission() {
        if (!query) return
        setIsSearching(true)
        setResults(null)

        toast({ title: "Mission lancée", description: "L'IA analyse le sujet et cherche des sources..." })

        const res = await launchResearchMission(query)
        setIsSearching(false)

        if (res.success && res.links) {
            setResults({ seeds: res.seeds || [], links: res.links })
            toast({ title: "Mission terminée", description: `${res.links.length} documents potentiels trouvés.` })
        } else {
            toast({ title: "Échec Mission", description: res.message || "Rien trouvé.", variant: "destructive" })
        }
    }

    async function importLink(linkUrl: string) {
        toast({ title: "Importation...", description: "Analyse en cours..." })
        await crawlLegalUrl(linkUrl, "SENEGAL")
        toast({ title: "Succès", description: "Ajouté à la file d'attente." })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4 rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                <div className="space-y-2">
                    <Label className="text-indigo-900 font-semibold">Objectif de la Mission</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="ex: Tous les codes du Sénégal, Traités OHADA..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="bg-white"
                        />
                        <Button onClick={handleMission} disabled={isSearching} className="bg-indigo-600 hover:bg-indigo-700">
                            {isSearching ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2 h-4 w-4" />}
                            Lancer l'Agent
                        </Button>
                    </div>
                    <p className="text-xs text-indigo-600/80">
                        L'IA va identifier les sites officiels pertinents, les scanner, et vous proposer les documents.
                    </p>
                </div>
            </div>

            {results && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sources identifiées par l'IA</h3>
                        <div className="flex flex-wrap gap-2">
                            {results.seeds.map((seed, i) => (
                                <Badge key={i} variant="secondary" className="px-3 py-1 font-mono text-xs">
                                    <Globe className="mr-1 h-3 w-3" /> {new URL(seed).hostname}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                        <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-sm text-indigo-700">Documents Trouvés ({results.links.length})</h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto divide-y">
                            {results.links.map((link, i) => (
                                <div key={i} className="p-3 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                    <div className="space-y-1 overflow-hidden">
                                        <div className="font-medium text-sm truncate max-w-[500px]" title={link.text}>
                                            {link.text}
                                        </div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1">
                                            <LinkIcon className="h-3 w-3" /> {link.href}
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => importLink(link.href)} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                        <Download className="h-4 w-4 mr-1" /> Importer
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function HubScanner() {
    const [url, setUrl] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const [links, setLinks] = useState<any[]>([])
    const { toast } = useToast()

    async function handleScan() {
        if (!url) return
        setIsScanning(true)
        setLinks([])
        const res = await scanHubPage(url)
        setIsScanning(false)
        if (res.success) {
            setLinks(res.links)
            toast({ title: "Scan terminé", description: `${res.links.length} liens juridiques pertinents trouvés.` })
        } else {
            toast({ title: "Erreur Scan", description: "Impossible de scanner cette page.", variant: "destructive" })
        }
    }

    async function importLink(linkUrl: string) {
        toast({ title: "Importation...", description: "Le crawler analyse la page..." })
        await crawlLegalUrl(linkUrl, "SENEGAL")
        toast({ title: "Succès", description: "Document ajouté à la file d'attente." })
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <Label>URL de la page "Actualités" ou "Liste"</Label>
                    <Input
                        placeholder="ex: https://www.sec.gouv.sn/lois-et-reglements"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                </div>
                <Button onClick={handleScan} disabled={isScanning} variant="secondary">
                    {isScanning ? <Loader2 className="animate-spin mr-2" /> : <Globe className="mr-2 h-4 w-4" />}
                    Scanner la page
                </Button>
            </div>

            {links.length > 0 && (
                <div className="border rounded-md p-4 bg-slate-50 space-y-2 max-h-[300px] overflow-y-auto">
                    <h3 className="font-semibold text-sm mb-2 text-indigo-700">Documents Découverts ({links.length})</h3>
                    {links.map((link, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <LinkIcon className="h-3 w-3 text-slate-400 flex-shrink-0" />
                                <div className="text-sm truncate max-w-[500px]" title={link.text}>
                                    {link.text || "Lien sans texte"}
                                </div>
                                {link.reason && <Badge variant="outline" className="text-[10px] text-slate-500">{link.reason}</Badge>}
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => importLink(link.href)} className="text-indigo-600 hover:bg-indigo-50 h-8">
                                <Download className="h-4 w-4 mr-1" /> Importer
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ValidationPage() {
    const [pendingDocs, setPendingDocs] = useState<any[]>([])
    const [crawlUrl, setCrawlUrl] = useState("")
    const [crawlRegion, setCrawlRegion] = useState("SENEGAL")
    const [isCrawling, setIsCrawling] = useState(false)
    const [reviewDoc, setReviewDoc] = useState<any>(null) // Doc being reviewed
    const { toast } = useToast()

    useEffect(() => {
        loadPending()
    }, [])

    async function loadPending() {
        const docs = await getPendingDocuments()
        setPendingDocs(docs)
    }

    async function handleCrawl() {
        if (!crawlUrl) return
        setIsCrawling(true)
        const res = await crawlLegalUrl(crawlUrl, crawlRegion)
        setIsCrawling(false)
        if (res.success) {
            toast({ title: "Crawl réussi", description: "Le document est en attente de validation." })
            loadPending()
            setCrawlUrl("")
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
    }

    async function handleApprove() {
        if (!reviewDoc) return
        await approveDocument(reviewDoc.id, {
            title: reviewDoc.title,
            summary: reviewDoc.summary,
            content: reviewDoc.content,
            reference: reviewDoc.reference // Allow editing reference
        })
        toast({ title: "Document Validé", description: "Intégré à la Base de Connaissance (et vectorisé)." })
        setReviewDoc(null)
        loadPending()
    }

    async function handleReject(id: string) {
        if (confirm("Supprimer ce document de la file d'attente ?")) {
            await rejectDocument(id)
            loadPending()
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Globe className="h-8 w-8 text-indigo-600" />
                Veille Juridique & Validation (RAG)
            </h1>

            {/* CRAWLER SECTION */}
            <Card className="mb-12 border-indigo-100 shadow-sm">
                <CardHeader className="bg-indigo-50/50">
                    <CardTitle className="text-indigo-900">Scanner le Web Juridique</CardTitle>
                    <CardDescription>
                        Importez des documents uniques ou scannez des pages d'actualité pour découvrir de nouveaux textes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs defaultValue="direct">
                        <TabsList className="mb-4">
                            <TabsTrigger value="direct">Import Direct</TabsTrigger>
                            <TabsTrigger value="hub">Scanner "Hub"</TabsTrigger>
                            <TabsTrigger value="mission">Mission IA (Recherche)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="direct">
                            {/* ... Content ... */}
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label>URL du Document (Loi/Arrêt)</Label>
                                    <Input
                                        placeholder="https://www.ohada.com/actes-uniformes/..."
                                        value={crawlUrl}
                                        onChange={(e) => setCrawlUrl(e.target.value)}
                                    />
                                </div>
                                <div className="w-[200px] space-y-2">
                                    <Label>Région</Label>
                                    <Select value={crawlRegion} onValueChange={setCrawlRegion}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SENEGAL">Sénégal</SelectItem>
                                            <SelectItem value="OHADA">OHADA</SelectItem>
                                            <SelectItem value="UEMOA">UEMOA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleCrawl} disabled={isCrawling} className="bg-indigo-600">
                                    {isCrawling ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2 h-4 w-4" />}
                                    Importer
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="hub">
                            <HubScanner />
                        </TabsContent>

                        <TabsContent value="mission">
                            <ResearchMission />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* VALIDATION QUEUE */}
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                File d'Attente ({pendingDocs.length})
            </h2>

            <div className="grid gap-4">
                {pendingDocs.length === 0 && (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed">
                        Aucun document en attente de validation.
                    </div>
                )}

                {pendingDocs.map(doc => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="mb-2">{doc.region}</Badge>
                                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                                    <CardDescription>Source: {doc.sourceUrl}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" onClick={() => setReviewDoc(doc)}>
                                                Examiner & Valider
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Validation du Document</DialogTitle>
                                                <DialogDescription>
                                                    Vérifiez le contenu extrait, corrigez les erreurs d'OCR, et validez pour l'intégration RAG.
                                                </DialogDescription>
                                            </DialogHeader>

                                            {reviewDoc && (
                                                <div className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Titre</Label>
                                                            <Input
                                                                value={reviewDoc.title}
                                                                onChange={(e) => setReviewDoc({ ...reviewDoc, title: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Référence</Label>
                                                            <Input
                                                                value={reviewDoc.reference}
                                                                onChange={(e) => setReviewDoc({ ...reviewDoc, reference: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Résumé (pour l'Assistant)</Label>
                                                        <Textarea
                                                            className="h-20"
                                                            value={reviewDoc.summary || ''}
                                                            onChange={(e) => setReviewDoc({ ...reviewDoc, summary: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Contenu Intégral (Nettoyé)</Label>
                                                        <Textarea
                                                            className="h-[300px] font-mono text-sm"
                                                            value={reviewDoc.content || ''}
                                                            onChange={(e) => setReviewDoc({ ...reviewDoc, content: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <DialogFooter className="gap-2">
                                                <Button variant="ghost" onClick={() => handleReject(doc.id)} className="text-red-500 hover:bg-red-50">
                                                    Rejeter
                                                </Button>
                                                <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
                                                    <Check className="mr-2 h-4 w-4" /> Approuver & Intégrer
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter className="text-xs text-slate-400 pt-0">
                            Extrait le {new Date(doc.createdAt).toLocaleDateString()}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
