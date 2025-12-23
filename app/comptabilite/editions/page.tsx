"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, FileText, BarChartHorizontal } from "lucide-react"
import Link from "next/link"

export default function EditionsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Éditions Comptables</h1>
            <p className="text-slate-500">Génération des états financiers pour impression ou export PDF.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:border-slate-400 transition-colors cursor-pointer">
                    <CardHeader>
                        <BarChartHorizontal className="h-8 w-8 text-slate-700 mb-2" />
                        <CardTitle>Balance Générale</CardTitle>
                        <CardDescription>Solde de tous les comptes (6 colonnes).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/comptabilite/editions/balance" target="_blank">
                            <Button className="w-full" variant="outline"><Printer className="mr-2 h-4 w-4" /> Imprimer</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-slate-400 transition-colors cursor-pointer">
                    <CardHeader>
                        <FileText className="h-8 w-8 text-slate-700 mb-2" />
                        <CardTitle>Grand Livre</CardTitle>
                        <CardDescription>Détail chronologique des écritures par compte.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/comptabilite/editions/grand-livre" target="_blank">
                            <Button className="w-full" variant="outline"><Printer className="mr-2 h-4 w-4" /> Imprimer</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-slate-400 transition-colors cursor-pointer">
                    <CardHeader>
                        <FileText className="h-8 w-8 text-slate-700 mb-2" />
                        <CardTitle>Bilan & CR</CardTitle>
                        <CardDescription>États financiers format SYSCOHADA (Simplifié).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/comptabilite/editions/compte-resultat" target="_blank">
                            <Button className="w-full" variant="outline"><Printer className="mr-2 h-4 w-4" /> Compte Résultat</Button>
                        </Link>
                        <Link href="/comptabilite/editions/bilan" target="_blank">
                            <Button className="w-full" variant="outline"><Printer className="mr-2 h-4 w-4" /> Bilan (Actif/Passif)</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
