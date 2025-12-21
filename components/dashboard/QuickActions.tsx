"use client"

import {
    Plus,
    UserPlus,
    FileText,
    Gavel,
    Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export function QuickActions() {
    return (
        <Card className="border-none shadow-md bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />

            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="bg-white/20 p-1.5 rounded-lg"><Plus className="h-4 w-4" /></span>
                    Actions Rapides
                </CardTitle>
                <CardDescription className="text-slate-300">
                    Raccourcis pour les tâches fréquentes.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white transition-all hover:scale-105" asChild>
                    <Link href="/dossiers?new=true">
                        <Plus className="h-6 w-6 text-blue-300" />
                        <span>Nouveau Dossier</span>
                    </Link>
                </Button>

                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white transition-all hover:scale-105" asChild>
                    <Link href="/clients?new=true">
                        <UserPlus className="h-6 w-6 text-emerald-300" />
                        <span>Nouveau Client</span>
                    </Link>
                </Button>

                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white transition-all hover:scale-105" asChild>
                    <Link href="/factures?new=true">
                        <FileText className="h-6 w-6 text-amber-300" />
                        <span>Émettre Facture</span>
                    </Link>
                </Button>

                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white transition-all hover:scale-105" asChild>
                    <Link href="/jurisprudence">
                        <Search className="h-6 w-6 text-purple-300" />
                        <span>Recherche</span>
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
