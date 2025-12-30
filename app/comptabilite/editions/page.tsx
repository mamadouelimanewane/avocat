"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, FileText, BarChartHorizontal, Book, LayoutGrid, FileSearch } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getJournalStats } from "@/app/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditionsPage() {
    const [journals, setJournals] = useState<any[]>([])
    const [selectedJournal, setSelectedJournal] = useState<string>("")

    useEffect(() => {
        getJournalStats().then(setJournals)
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    Éditions <span className="text-indigo-600">Comptables</span>
                </h1>
                <p className="text-slate-500 text-lg">Générez vos documents officiels au format PDF haute fidélité.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* BALANCE */}
                <Card className="hover:shadow-xl transition-all border-slate-200 overflow-hidden group">
                    <div className="h-2 bg-indigo-500 w-full" />
                    <CardHeader>
                        <BarChartHorizontal className="h-10 w-10 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Balance Générale</CardTitle>
                        <CardDescription>Solde cumulé de tous les comptes du plan comptable (Balance 6 colonnes).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/comptabilite/editions/balance" target="_blank">
                            <Button className="w-full bg-slate-900 hover:bg-indigo-700 transition-colors">
                                <FileSearch className="mr-2 h-4 w-4" /> Générer PDF
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* GRAND LIVRE */}
                <Card className="hover:shadow-xl transition-all border-slate-200 overflow-hidden group">
                    <div className="h-2 bg-emerald-500 w-full" />
                    <CardHeader>
                        <FileText className="h-10 w-10 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Grand Livre</CardTitle>
                        <CardDescription>Visualisation chronologique exhaustive des mouvements par compte individuel.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/comptabilite/editions/grand-livre" target="_blank">
                            <Button className="w-full bg-slate-900 hover:bg-emerald-700 transition-colors">
                                <FileSearch className="mr-2 h-4 w-4" /> Générer PDF
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* JOURNAUX */}
                <Card className="hover:shadow-xl transition-all border-slate-200 overflow-hidden group">
                    <div className="h-2 bg-amber-500 w-full" />
                    <CardHeader>
                        <Book className="h-10 w-10 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>Journaux d'Écritures</CardTitle>
                        <CardDescription>Export complet d'un journal spécifique (Achat, Vente, Banque, Caisse, OD).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={setSelectedJournal}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir un journal..." />
                            </SelectTrigger>
                            <SelectContent>
                                {journals.map(j => (
                                    <SelectItem key={j.id} value={j.id}>{j.code} - {j.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            className="w-full bg-slate-900 hover:bg-amber-700 transition-colors"
                            disabled={!selectedJournal}
                            onClick={() => window.open(`/comptabilite/editions/journaux?id=${selectedJournal}`, '_blank')}
                        >
                            <FileSearch className="mr-2 h-4 w-4" /> Générer PDF
                        </Button>
                    </CardContent>
                </Card>

                {/* BILAN & CR */}
                <Card className="hover:shadow-xl transition-all border-slate-200 overflow-hidden group lg:col-span-3">
                    <div className="h-2 bg-rose-500 w-full" />
                    <CardHeader>
                        <LayoutGrid className="h-10 w-10 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle>États de Synthèse (Bilan & Compte de Résultat)</CardTitle>
                        <CardDescription>Présentation normalisée SYSCOHADA de la situation patrimoniale et des résultats.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/comptabilite/editions/compte-resultat" target="_blank">
                                <Button className="w-full" variant="outline">
                                    <FileSearch className="mr-2 h-4 w-4 text-rose-600" /> Aperçu Compte de Résultat
                                </Button>
                            </Link>
                            <Link href="/comptabilite/editions/bilan" target="_blank">
                                <Button className="w-full" variant="outline">
                                    <FileSearch className="mr-2 h-4 w-4 text-rose-600" /> Aperçu Bilan Actif/Passif
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

