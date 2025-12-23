import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJournalStats } from "@/app/actions"
import Link from "next/link"
import { ArrowRight, FileText, AlertCircle, CheckCircle } from "lucide-react"

export default async function JournauxDashboard() {
    const stats = await getJournalStats()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Journaux de Saisie</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((journal) => (
                    <Card key={journal.id} className="hover:shadow-lg transition-shadow border-slate-200">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono bg-slate-100">{journal.code}</Badge>
                                        <CardTitle className="text-lg">{journal.name}</CardTitle>
                                    </div>
                                    <CardDescription className="mt-1 font-mono text-xs uppercase tracking-wider">{journal.type}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center py-2 text-sm">
                                <span className="flex items-center text-amber-600">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Brouillard: {journal.draftCount}
                                </span>
                                <span className="flex items-center text-emerald-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Validé: {journal.entryCount - journal.draftCount}
                                </span>
                            </div>
                            <Link href={`/comptabilite/journaux/${journal.code}?id=${journal.id}`}>
                                <Button className="w-full mt-4 group">
                                    Ouvrir journal
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
