
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GraduationCap, Coffee, Clock, Award, Users, TrendingUp, Calendar, FileText, CheckCircle2 } from "lucide-react"

const prisma = new PrismaClient()

export default async function RHPage() {
    // Simulated Data for Staff
    const staff = [
        { id: 1, name: "Me Astou Diop", role: "Associée Gérante", department: "Contentieux", seniority: "15 ans", status: "ACTIF", leaves: 25 },
        { id: 2, name: "Paul Ndiaye", role: "Collaborateur Senior", department: "Conseil", seniority: "6 ans", status: "ACTIF", leaves: 12 },
        { id: 3, name: "Fatou Sow", role: "Secrétaire Juridique", department: "Administratif", seniority: "3 ans", status: "ACTIF", leaves: 18 },
        { id: 4, name: "Jean Gomis", role: "Stagiaire", department: "Recherche", seniority: "6 mois", status: "ACTIF", leaves: 2 },
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ressources Humaines & Talents</h1>
                    <p className="text-slate-500 mt-1">Plateforme SIRH complète : Recrutement, Paie, Carrière et Planning.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Coffee className="mr-2 h-4 w-4" /> Demander Congés</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Users className="mr-2 h-4 w-4" /> Ajouter Collaborateur
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700">Effectif Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{staff.length}</div>
                        <p className="text-xs text-purple-600 mt-1">Collaborateurs actifs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Absents Aujourd'hui</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">1</div>
                        <p className="text-xs text-slate-500 mt-1">M. Diallo (Maladie)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Formation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">15h</div>
                        <p className="text-xs text-slate-500 mt-1">Moyenne / collaborateur</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Turnover</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">5%</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> Stable</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="equipe" className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-[900px]">
                    <TabsTrigger value="equipe">L'Équipe</TabsTrigger>
                    <TabsTrigger value="planning">Planning & Absences</TabsTrigger>
                    <TabsTrigger value="recrutement">Recrutement</TabsTrigger>
                    <TabsTrigger value="paie">Paie & Admin</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="equipe" className="mt-6">
                    <div className="flex justify-between mb-4">
                        <Input placeholder="Rechercher un collaborateur..." className="max-w-xs" />
                        <div className="flex gap-2">
                            <Button variant="outline">Organigramme</Button>
                            <Button variant="outline">Exporter Annuaire</Button>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {staff.map(person => (
                            <Card key={person.id} className="hover:shadow-md transition-shadow group">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${person.name}&background=random`} />
                                        <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-700 transition-colors">{person.name}</h3>
                                                <p className="text-sm text-purple-600 font-medium">{person.role}</p>
                                            </div>
                                            <Badge variant={person.status === 'ACTIF' ? 'default' : 'secondary'} className={person.status === 'ACTIF' ? 'bg-emerald-600' : ''}>
                                                {person.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-500">
                                            <div>
                                                <span className="block text-xs uppercase tracking-wide text-slate-400">Département</span>
                                                {person.department}
                                            </div>
                                            <div>
                                                <span className="block text-xs uppercase tracking-wide text-slate-400">Ancienneté</span>
                                                {person.seniority}
                                            </div>
                                            <div>
                                                <span className="block text-xs uppercase tracking-wide text-slate-400">Contrat</span>
                                                CDI - Cadre
                                            </div>
                                            <div>
                                                <span className="block text-xs uppercase tracking-wide text-slate-400">Entretien Annuel</span>
                                                <span className="text-orange-600">En retard</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" className="text-xs">Dossier Numérique</Button>
                                            <Button variant="outline" size="sm" className="text-xs">Entretiens</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="planning" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Calendrier des Absences</CardTitle>
                                <CardDescription>Vue d'ensemble des congés, maladies et télétravail.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Congés Payés</Badge>
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Maladie</Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Télétravail</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="border rounded-lg p-4 bg-slate-50 text-center text-slate-400 italic flex flex-col items-center justify-center h-48">
                                    <Calendar className="h-10 w-10 text-slate-300 mb-2" />
                                    [Module Calendrier Interactif]
                                    <span className="text-xs">Synchronisé avec Agenda Outlook/Google</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm text-slate-900">Demandes en attente</h3>
                                    {staff.slice(0, 2).map(person => (
                                        <div key={person.id} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{person.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-sm">{person.name}</div>
                                                    <div className="text-xs text-slate-500">12 Mai - 15 Mai • Congés Payés (3j)</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-red-600 h-8">Refuser</Button>
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 text-white">Valider</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="recrutement" className="mt-6">
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {/* Column: Candidature */}
                        <div className="min-w-[300px] bg-slate-100/50 rounded-lg p-4 border border-slate-200">
                            <div className="flex justify-between mb-4 font-semibold text-slate-700">
                                Candidatures <Badge className="bg-slate-200 text-slate-700">3</Badge>
                            </div>
                            <div className="space-y-3">
                                <Card className="cursor-pointer hover:shadow p-3">
                                    <div className="font-medium">Sophie Mendy</div>
                                    <div className="text-xs text-slate-500">CV reçu via LinkedIn</div>
                                    <Badge variant="outline" className="mt-2 text-[10px]">Stagiaire</Badge>
                                </Card>
                                <Card className="cursor-pointer hover:shadow p-3">
                                    <div className="font-medium">Moustapha Fall</div>
                                    <div className="text-xs text-slate-500">Master 2 Droit Affaires</div>
                                    <Badge variant="outline" className="mt-2 text-[10px]">Collab Junior</Badge>
                                </Card>
                            </div>
                        </div>
                        {/* Column: Entretien */}
                        <div className="min-w-[300px] bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                            <div className="flex justify-between mb-4 font-semibold text-blue-800">
                                Entretiens <Badge className="bg-blue-200 text-blue-800">1</Badge>
                            </div>
                            <div className="space-y-3">
                                <Card className="cursor-pointer hover:shadow p-3 border-l-4 border-l-blue-500">
                                    <div className="font-medium">El Hadj Diouf</div>
                                    <div className="text-xs text-slate-500">Entretien RH validé.</div>
                                    <div className="text-xs text-blue-600 font-medium mt-1">A voir par Associé</div>
                                </Card>
                            </div>
                        </div>
                        {/* Column: Offre */}
                        <div className="min-w-[300px] bg-purple-50/50 rounded-lg p-4 border border-purple-100">
                            <div className="flex justify-between mb-4 font-semibold text-purple-800">
                                Offre Envoyée <Badge className="bg-purple-200 text-purple-800">1</Badge>
                            </div>
                            <div className="space-y-3">
                                <Card className="cursor-pointer hover:shadow p-3 border-l-4 border-l-purple-500">
                                    <div className="font-medium">Fatou Ndiaye</div>
                                    <div className="text-xs text-slate-500">Senior Associate</div>
                                    <div className="text-xs text-purple-600 font-medium mt-1">Négo Salariale en cours</div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="paie" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gestion de la Paie</CardTitle>
                            <CardDescription>Historique des bulletins et ordres de virement.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Période</TableHead>
                                        <TableHead>Masse Salariale</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Documents</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Avril 2024</TableCell>
                                        <TableCell>4 250 000 FCFA</TableCell>
                                        <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-200">Payé</Badge></TableCell>
                                        <TableCell><span className="text-xs underline text-blue-600 cursor-pointer flex items-center gap-1"><FileText className="h-3 w-3" /> 4 Bulletins</span></TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="sm">Archiver</Button></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Mars 2024</TableCell>
                                        <TableCell>4 250 000 FCFA</TableCell>
                                        <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-200">Payé</Badge></TableCell>
                                        <TableCell><span className="text-xs underline text-blue-600 cursor-pointer flex items-center gap-1"><FileText className="h-3 w-3" /> 4 Bulletins</span></TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="sm">Archiver</Button></TableCell>
                                    </TableRow>
                                    <TableRow className="bg-slate-50">
                                        <TableCell className="font-medium">Mai 2024 (En cours)</TableCell>
                                        <TableCell>4 250 000 FCFA</TableCell>
                                        <TableCell><Badge variant="outline" className="text-slate-600">Brouillon</Badge></TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell className="text-right"><Button size="sm" className="bg-indigo-600 text-white">Générer Bulletins</Button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-amber-500" />
                                    Top Facturation (Mois)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <div className="font-bold text-amber-900">1. Me Astou Diop</div>
                                        <div className="font-bold text-amber-700">4.5M FCFA</div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                        <div className="font-bold text-slate-700">2. Paul Ndiaye</div>
                                        <div className="font-bold text-slate-600">2.8M FCFA</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Objectifs Cabinet
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Chiffre d'Affaires Trimestre</span>
                                            <span className="font-bold">85%</span>
                                        </div>
                                        <Progress value={85} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Nouveaux Dossiers</span>
                                            <span className="font-bold">60%</span>
                                        </div>
                                        <Progress value={60} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
