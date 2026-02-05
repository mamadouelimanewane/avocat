
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Gavel, Scale, FileText, Download, ExternalLink, RefreshCcw, Eye, Upload as UploadIcon, Book, ScrollText, CheckCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { initJurisprudenceLibrary, searchJurisprudenceAdvanced as searchJurisprudence } from "@/app/actions"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

export default function JurisprudencePage() {
    const [results, setResults] = useState<any[]>([])
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("tous")
    const [pendingUploads, setPendingUploads] = useState<any[]>([])

    const filteredResults = results.filter(item => {
        if (activeTab === "tous") return true;
        if (activeTab === "ohada") return item.type === "ACTE_UNIFORME" || item.court === "OHADA" || item.court === "CCJA";
        if (activeTab === "lois") return item.type === "LOI" || item.court === "SENEGAL";
        if (activeTab === "arretes") return item.type === "ARRETE";
        if (activeTab === "jurisprudence") return item.type === "JURISPRUDENCE" || (!item.type && (item.court === "CCJA" || item.court === "COUR_SUPREME"));
        if (activeTab === "foncier") return item.category === "FONCIER";
        return true;
    });

    const handleDownloadPDF = (item: any) => {
        // Mappage des titres vers les fichiers PDF réels générés
        const pdfMapping: Record<string, string> = {
            "Code Général des Impôts (CGI) - Actualisation 2025": "/codes_pdf/code_general_des_impots_cgi_2025.pdf",
            "Nouveau Code des Investissements 2025": "/codes_pdf/code_des_investissements_2025.pdf",
            "Code des Marchés Publics - Réforme 2024": "/codes_pdf/code_des_marchés_publics_2024.pdf",
            "Code du Travail Sénégalais - Mise à jour 2024": "/codes_pdf/code_du_travail_sénégalais_2024.pdf",
            "Nouveau Code Minier (Projet 2025)": "/codes_pdf/code_minier_du_sénégal_2025.pdf",
            "Code Pénal Sénégalais - Mise à jour 2024": "/codes_pdf/code_penal_senegalais_2024.pdf",
            "Code de l'Urbanisme - Partie Réglementaire 2025": "/codes_pdf/code_de_lurbanisme_-_reglementation_2025.pdf",
            "Code de l'Environnement 2024": "/codes_pdf/code_de_lenvironnement_2024.pdf",
            "Code de l'Électricité 2024": "/codes_pdf/code_de_lelectricite_-_cadre_2024.pdf",
            "Loi n° 64-46 relative au Domaine National": "/codes_pdf/loi_sur_le_domaine_national_64-46.pdf",
            "Loi n° 76-67 relative à l'expropriation pour cause d'utilité publique": "/codes_pdf/loi_sur_lexpropriation_76-67.pdf",
            "Décret n° 2023-382 sur la Baisse des Loyers": "/codes_pdf/decret_sur_la_baisse_des_loyers_2023.pdf"
        };

        const realPdfPath = pdfMapping[item.title];

        if (realPdfPath) {
            // Téléchargement du fichier réel
            const link = document.createElement('a');
            link.href = realPdfPath;
            link.download = realPdfPath.split('/').pop() || 'document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Téléchargement PDF",
                description: `Téléchargement du texte officiel : ${item.title}`,
            });
            return;
        }

        // Fallback sur la génération textuelle si le fichier n'est pas mappé
        const pdfContent = `
═══════════════════════════════════════════════════════════════
${item.title}
═══════════════════════════════════════════════════════════════

Référence: ${item.reference || 'N/A'}
Date: ${format(new Date(item.date), 'dd MMMM yyyy', { locale: fr })}
Court: ${item.court || 'N/A'}
Type: ${item.type || 'N/A'}

───────────────────────────────────────────────────────────────
RÉSUMÉ
───────────────────────────────────────────────────────────────

${item.summary || 'Aucun résumé disponible.'}

───────────────────────────────────────────────────────────────
CONTENU INTÉGRAL
───────────────────────────────────────────────────────────────

${item.content || 'Contenu complet non disponible dans la base locale.'}

${item.sourceUrl ? `\n\n───────────────────────────────────────────────────────────────\nSOURCE OFFICIELLE\n───────────────────────────────────────────────────────────────\n\n${item.sourceUrl}` : ''}

═══════════════════════════════════════════════════════════════
Document généré par LexPremium - ${new Date().toLocaleDateString('fr-FR')}
═══════════════════════════════════════════════════════════════
        `.trim()

        // Créer un blob et télécharger
        const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${item.reference?.replace(/[\/\\]/g, '-') || 'document'}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
            title: "Téléchargement réussi",
            description: "Le document a été téléchargé.",
        })
    }

    const handleValidation = (item: any) => {
        // En production, appel API pour update le statut. Ici simulation.

        // Update results list
        setResults(prev => prev.map(doc => {
            if (doc.id === item.id) {
                return {
                    ...doc,
                    status: 'VALIDATED',
                    reference: `JURIS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                    summary: "Ce document a été validé par le comité de lecture et intégré à la base de connaissances.",
                    content: `DOCUMENT CERTIFIÉ ET VALIDÉ
                    
TITRE: ${doc.title}
DATE DE VALIDATION: ${new Date().toLocaleDateString('fr-FR')}
STATUT: APPROUVÉ PAR LE COMITÉ DE LECTURE

[Le contenu complet du fichier original a été traité, indexé et archivé sécurisé.]

Ce texte est désormais opposable et consultable par l'ensemble des collaborateurs du cabinet.
Il a été vérifié pour sa conformité juridique.

---
Signature numérique: VALIDÉ-#${Math.floor(Math.random() * 100000)}`
                }
            }
            return doc
        }))

        // Update pending list (remove from pending)
        setPendingUploads(prev => prev.map(p => {
            if (p.name === item.title + '.pdf') return { ...p, status: 'Validé' }
            return p
        }))

        toast({
            title: "Document Validé",
            description: "Le document est maintenant accessible à tout le cabinet.",
            className: "bg-emerald-50 border-emerald-200"
        })
    }

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault() // Prevent link navigation if inside a link (though button handles clicks)
        e.stopPropagation()

        if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
            setResults(prev => prev.filter(item => item.id !== id))
            toast({
                title: "Document supprimé",
                description: "Le document a été retiré de la liste.",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            await initJurisprudenceLibrary()
            const response = await searchJurisprudence("")
            if (response && response.success) {
                setResults(response.results || [])
            } else if (Array.isArray(response)) {
                // Fallback if the alias points to the old function returning array directly (safety)
                setResults(response)
            }
            setIsLoading(false)
        }
        load()
    }, [])

    const handleSearch = async () => {
        setIsLoading(true)
        const response = await searchJurisprudence(query)
        if (response && response.success) {
            setResults(response.results || [])
        } else if (Array.isArray(response)) {
            setResults(response)
        }
        setIsLoading(false)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Textes Législatifs, Réglementaires et Jurisprudence</h1>
                    <p className="text-slate-500 mt-1">Base de données juridique : Lois, Codes, Arrêtés (Sénégal) & OHADA.</p>
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
                            <label
                                htmlFor="file-upload"
                                className="border-2 border-dashed border-slate-200 rounded-lg h-32 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <UploadIcon className="h-8 w-8 mb-2 text-slate-400" />
                                <span className="font-medium text-sm">Cliquez pour sélectionner vos PDF</span>
                                <span className="text-xs text-slate-400 mt-1">Maximum 10 Mo - Sélection Multiple</span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || [])
                                        if (files.length > 0) {
                                            toast({
                                                title: `${files.length} Fichier(s) reçu(s)`,
                                                description: `Traitement en cours...`,
                                                className: "bg-blue-50 border-blue-200"
                                            })

                                            files.forEach((file, index) => {
                                                setTimeout(() => {
                                                    const newDoc = {
                                                        id: `pending-${Date.now()}-${index}`,
                                                        title: file.name.replace('.pdf', ''),
                                                        reference: "EN ATTENTE",
                                                        court: "Contribution",
                                                        date: new Date(),
                                                        summary: "Document téléversé en attente de revue par le comité de lecture.",
                                                        type: "CONTRIBUTION",
                                                        status: 'PENDING',
                                                        keywords: JSON.stringify(["nouveau", "contribution"])
                                                    }

                                                    setPendingUploads(prev => [...prev, {
                                                        name: file.name,
                                                        date: new Date(),
                                                        status: 'En cours de validation'
                                                    }])

                                                    setResults(prev => [newDoc, ...prev])
                                                }, 500 * (index + 1))
                                            })

                                            setTimeout(() => {
                                                toast({
                                                    title: "Succès",
                                                    description: "Les documents ont été ajoutés à la file d'attente.",
                                                    className: "bg-green-50 border-green-200"
                                                })
                                            }, 500 * files.length + 500)
                                        }
                                    }}
                                />
                                <span className="text-xs text-indigo-600 mt-2 font-medium block text-center">Sélection multiple autorisée</span>
                            </label>

                            {/* Liste des fichiers en attente */}
                            {pendingUploads.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-semibold text-slate-700">Contributions en attente</h4>
                                    <div className="bg-slate-50 rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                                        {pendingUploads.map((file, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-slate-400" />
                                                    <span className="font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
                                                </div>
                                                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                                    {file.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Terminer
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="tous" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="flex overflow-x-auto no-scrollbar mb-4 bg-slate-100/50 p-1">
                    <TabsTrigger value="tous" className="flex-1 min-w-[60px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:text-indigo-600 transition-all">Tous</TabsTrigger>
                    <TabsTrigger value="jurisprudence" className="flex-1 min-w-[100px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:text-indigo-600 transition-all">Jurisprudence</TabsTrigger>
                    <TabsTrigger value="lois" className="flex-1 min-w-[100px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:text-indigo-600 transition-all">Lois & Codes</TabsTrigger>
                    <TabsTrigger value="arretes" className="flex-1 min-w-[80px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:text-indigo-600 transition-all">Arrêtés</TabsTrigger>
                    <TabsTrigger value="ohada" className="flex-1 min-w-[80px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white hover:text-indigo-600 transition-all">
                        <span className="font-bold">OHADA</span>
                    </TabsTrigger>
                    <TabsTrigger value="foncier" className="flex-1 min-w-[80px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white hover:text-emerald-600 transition-all font-bold">FONCIER</TabsTrigger>
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
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {item.status === 'PENDING' ? (
                                                <span className="text-lg text-slate-500 font-serif font-medium cursor-not-allowed">{item.title}</span>
                                            ) : (
                                                <Link href={`/jurisprudence/${item.id}`}>
                                                    <CardTitle className="text-lg text-indigo-900 font-serif hover:text-indigo-700 cursor-pointer transition-colors">
                                                        {item.title}
                                                    </CardTitle>
                                                </Link>
                                            )}
                                            {item.status === 'PENDING' && (
                                                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 animate-pulse text-[10px]">
                                                    En attente validation
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Badge className={item.status === 'PENDING' ? 'bg-slate-400' : (item.court === 'CCJA' ? 'bg-indigo-600' : 'bg-emerald-600')}>
                                                {item.court || 'Contribution'}
                                            </Badge>
                                            <span className="flex items-center gap-1"><Gavel className="h-3 w-3" /> {item.reference}</span>
                                            <span className="flex items-center gap-1"><Scale className="h-3 w-3" /> {format(new Date(item.date), 'dd MMMM yyyy', { locale: fr })}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {item.status === 'PENDING' ? (
                                            <Button
                                                size="sm"
                                                className="text-xs gap-2 bg-indigo-600 hover:bg-indigo-700 text-white animate-in zoom-in"
                                                onClick={() => handleValidation(item)}
                                            >
                                                <CheckCircle className="h-3 w-3" /> Valider (Admin)
                                            </Button>
                                        ) : (
                                            <>
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
                                                                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir la source officielle (PDF)</a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleDownloadPDF(item)}>
                                                    <Download className="mr-2 h-3 w-3" /> PDF
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={(e) => handleDelete(item.id, e)}
                                            title="Supprimer le document"
                                        >
                                            <Trash2 className="h-4 w-4" />
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
