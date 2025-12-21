
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldCheck, ShieldAlert, Search, FileCheck, History } from "lucide-react"

const prisma = new PrismaClient()

export default async function ConflitsPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q || ''

    let results = {
        clients: [] as any[],
        partiesAdverses: [] as any[],
        contacts: [] as any[]
    }

    let hasSearched = false

    if (query.length > 2) {
        hasSearched = true
        // Search in Clients
        results.clients = await prisma.client.findMany({
            where: { name: { contains: query, mode: 'insensitive' } }
        })

        // Search in Dossiers (Opposing Parties)
        const opposing = await prisma.dossier.findMany({
            where: { opposingParty: { contains: query, mode: 'insensitive' } },
            select: { id: true, reference: true, title: true, opposingParty: true, status: true }
        })
        results.partiesAdverses = opposing

        // Search in Directory
        results.contacts = await prisma.directoryContact.findMany({
            where: { name: { contains: query, mode: 'insensitive' } }
        })
    }

    const totalMatches = results.clients.length + results.partiesAdverses.length + results.contacts.length
    const isClean = hasSearched && totalMatches === 0

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-indigo-600" />
                    Contrôle des Conflits d'Intérêts
                </h1>
                <p className="text-slate-500">
                    Vérifiez systématiquement l'existence d'un conflit avant d'accepter un nouveau dossier.
                </p>
            </div>

            <Card className="border-2 border-indigo-50 shadow-lg">
                <CardContent className="p-8">
                    <form className="flex gap-4">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Entrez le nom de la personne ou de la société..."
                            className="text-lg py-6"
                            autoFocus
                        />
                        <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 px-8">
                            <Search className="mr-2 h-5 w-5" /> Vérifier
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {hasSearched && (
                <div className="space-y-6">
                    {isClean ? (
                        <Alert className="bg-emerald-50 border-emerald-200">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            <AlertTitle className="text-emerald-800 font-bold text-lg">Aucun conflit détecté</AlertTitle>
                            <AlertDescription className="text-emerald-700 mt-2">
                                Le terme "<strong>{query}</strong>" n'apparaît dans aucune base de données (Clients, Parties Adverses, Contacts).
                                <div className="mt-4">
                                    <Button variant="outline" className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                        <FileCheck className="mr-2 h-4 w-4" /> Générer Certificat de Non-Conflit
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive" className="bg-red-50 border-red-200">
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                            <AlertTitle className="text-red-800 font-bold text-lg">Conflit Potentiel Détecté ({totalMatches} correspondances)</AlertTitle>
                            <AlertDescription className="text-red-700">
                                Veuillez analyser les résultats ci-dessous avec précaution.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Clients */}
                        <Card className={results.clients.length > 0 ? "border-red-200 bg-red-50/30" : "opacity-60"}>
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between">
                                    Base Clients
                                    <Badge variant={results.clients.length > 0 ? "destructive" : "outline"}>{results.clients.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {results.clients.map(c => (
                                    <div key={c.id} className="p-3 bg-white rounded border border-red-100 shadow-sm">
                                        <div className="font-bold text-slate-800">{c.name}</div>
                                        <div className="text-xs text-slate-500 uppercase">{c.type} • {c.status}</div>
                                        <div className="mt-2 text-xs text-red-600 font-medium">⚠️ Déjà Client du cabinet</div>
                                    </div>
                                ))}
                                {results.clients.length === 0 && <span className="text-sm text-slate-400">R.A.S</span>}
                            </CardContent>
                        </Card>

                        {/* Parties Adverses */}
                        <Card className={results.partiesAdverses.length > 0 ? "border-orange-200 bg-orange-50/30" : "opacity-60"}>
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between">
                                    Parties Adverses (Dossiers)
                                    <Badge variant={results.partiesAdverses.length > 0 ? "destructive" : "outline"} className={results.partiesAdverses.length > 0 ? "bg-orange-600" : ""}>{results.partiesAdverses.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {results.partiesAdverses.map(d => (
                                    <div key={d.id} className="p-3 bg-white rounded border border-orange-100 shadow-sm">
                                        <div className="font-bold text-slate-800">{d.opposingParty}</div>
                                        <div className="text-xs text-slate-500">Contre: {d.title}</div>
                                        <div className="text-[10px] text-slate-400">Ref: {d.reference}</div>
                                        <div className="mt-2 text-xs text-orange-600 font-medium">⚠️ Partie adverse dans un dossier {d.status.toLowerCase()}</div>
                                    </div>
                                ))}
                                {results.partiesAdverses.length === 0 && <span className="text-sm text-slate-400">R.A.S</span>}
                            </CardContent>
                        </Card>

                        {/* Directory */}
                        <Card className={results.contacts.length > 0 ? "border-slate-200 bg-slate-50" : "opacity-60"}>
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between">
                                    Annuaire / Partenaires
                                    <Badge variant="outline">{results.contacts.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {results.contacts.map(c => (
                                    <div key={c.id} className="p-3 bg-white rounded border border-slate-200 shadow-sm">
                                        <div className="font-bold text-slate-800">{c.name}</div>
                                        <div className="text-xs text-slate-500">{c.category}</div>
                                        <div className="mt-2 text-xs text-blue-600 font-medium">ℹ️ Contact connu</div>
                                    </div>
                                ))}
                                {results.contacts.length === 0 && <span className="text-sm text-slate-400">R.A.S</span>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <div className="mt-12">
                <div className="flex items-center gap-2 mb-4">
                    <History className="h-5 w-5 text-slate-500" />
                    <h3 className="font-semibold text-slate-800">Dernières vérifications effectuées</h3>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500 italic">
                    Aucun historique récent.
                </div>
            </div>
        </div>
    )
}
