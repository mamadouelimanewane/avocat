
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gavel, MapPin, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"

const prisma = new PrismaClient()

export default async function AudiencesPage() {
    // Fetch upcoming audiences
    const audiences = await prisma.event.findMany({
        where: { type: 'AUDIENCE' },
        include: { dossier: { include: { client: true } } },
        orderBy: { startDate: 'asc' }
    })

    // Group by Date for "Rôle" view
    const today = new Date()
    const upcoming = audiences.filter(a => new Date(a.startDate) >= today)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Palais & Audiences</h1>
                    <p className="text-slate-500 mt-1">Gestion centralisée du contentieux et suivi des audiences.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Imprimer le Rôle</Button>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                        <Gavel className="mr-2 h-4 w-4" /> Nouvelle Audience
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-amber-50 border-amber-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-amber-800 flex items-center gap-2">
                            <Clock className="h-5 w-5" /> Prochaine Audience
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcoming[0] ? (
                            <div>
                                <div className="text-2xl font-bold text-slate-900">
                                    {new Date(upcoming[0].startDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}
                                </div>
                                <div className="text-sm text-amber-700 font-medium mt-1">
                                    {upcoming[0].location || 'Tribunal de Dakar'}
                                </div>
                                <div className="mt-2 text-xs text-slate-600">
                                    Dossier: {upcoming[0].dossier?.title}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500">Aucune audience programmée</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-700">Dossiers en Délibéré</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">3</div>
                        <p className="text-xs text-slate-500 mt-1">En attente de jugement</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-700">Renvois cette semaine</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">5</div>
                        <p className="text-xs text-slate-500 mt-1">Audiences de procédure</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="upcoming">Rôle des Audiences (A venir)</TabsTrigger>
                    <TabsTrigger value="history">Historique & Résultats</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Heure</TableHead>
                                    <TableHead>Juridiction</TableHead>
                                    <TableHead>Dossier / Affaire</TableHead>
                                    <TableHead>Objet / Instruction</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcoming.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                            Aucune audience programmée.
                                        </TableCell>
                                    </TableRow>
                                ) : upcoming.map((audience) => (
                                    <TableRow key={audience.id} className="hover:bg-slate-50 group">
                                        <TableCell className="font-medium whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900">{new Date(audience.startDate).toLocaleDateString('fr-FR')}</span>
                                                <span className="text-xs text-slate-500">{new Date(audience.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                {audience.location || 'Tribunal'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-indigo-700">{audience.dossier?.reference}</div>
                                            <div className="text-xs text-slate-600">{audience.dossier?.title}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Clt: {audience.dossier?.client.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                                                {audience.title}
                                            </Badge>
                                            {audience.description && (
                                                <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">{audience.description}</p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                Noter Résultat
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <div className="text-center py-10 text-slate-500">
                        Historique des audiences passées.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
