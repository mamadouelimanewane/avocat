
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Phone, Mail, FileText, ArrowRight, UserPlus } from "lucide-react"

const prisma = new PrismaClient()

export default async function CrmPage() {
    const clients = await prisma.client.findMany({
        where: { status: 'PROSPECT' },
        orderBy: { createdAt: 'desc' }
    })

    const StatsCard = ({ title, count, color }: { title: string, count: number, color: string }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${color}`}>{count}</div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">CRM & Développement</h1>
                    <p className="text-slate-500 mt-1">Gérez vos opportunités commerciales et convertissez vos prospects.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <UserPlus className="mr-2 h-4 w-4" /> Nouveau Prospect
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatsCard title="Prospects en cours" count={clients.length} color="text-indigo-600" />
                <StatsCard title="Devis envoyés" count={3} color="text-blue-600" />
                <StatsCard title="Convertis ce mois" count={2} color="text-emerald-600" />
                <StatsCard title="Taux de conversion" count={15} color="text-slate-600" />
            </div>

            <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                {/* Column 1: Nouveaux Contacts */}
                <Card className="bg-slate-50/50 flex flex-col h-full border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-white rounded-t-lg">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                            Nouveaux Contacts <Badge variant="secondary" className="bg-slate-100 text-slate-600">{clients.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
                        {clients.length === 0 ? (
                            <div className="text-center text-slate-400 py-10 text-sm">Aucun prospect.</div>
                        ) : clients.map(client => (
                            <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-slate-800">{client.name}</h3>
                                        <Badge variant="outline" className="text-[10px]">{client.type}</Badge>
                                    </div>
                                    <div className="text-xs text-slate-500 space-y-1 mb-3">
                                        <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {client.phone || '-'}</div>
                                        <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {client.email || '-'}</div>
                                    </div>
                                    <div className="flex justify-end pt-2 border-t border-slate-50">
                                        <Button variant="ghost" size="sm" className="h-6 text-xs text-indigo-600">Qualifier <ArrowRight className="h-3 w-3 ml-1" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {/* Mock Data */}
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-slate-800">Société Import-Export SA</h3>
                                <p className="text-xs text-slate-500 mt-1">Besoin : Conseil fiscal, Audit.</p>
                                <div className="mt-2 flex gap-2">
                                    <Badge className="bg-blue-100 text-blue-700">Audit</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                {/* Column 2: En Négociation */}
                <Card className="bg-indigo-50/30 flex flex-col h-full border-indigo-100">
                    <CardHeader className="pb-3 border-b border-indigo-100 bg-white rounded-t-lg">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-600 flex justify-between">
                            Discussion / Devis <Badge className="bg-indigo-100 text-indigo-600">2</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-slate-800">M. Mamadou Ndiaye</h3>
                                <p className="text-xs text-slate-500 mt-1">Litige Foncier Almadies.</p>
                                <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
                                    <span>Devis estimé: 2.5M</span>
                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Relance J+2</Badge>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-slate-800">Startup TechDakar</h3>
                                <p className="text-xs text-slate-500 mt-1">Rédaction Pacte d'Associés.</p>
                                <div className="mt-3 text-right">
                                    <Button size="sm" variant="outline" className="h-6 text-xs">Voir le devis</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                {/* Column 3: Gagné / A Onboarder */}
                <Card className="bg-emerald-50/30 flex flex-col h-full border-emerald-100">
                    <CardHeader className="pb-3 border-b border-emerald-100 bg-white rounded-t-lg">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex justify-between">
                            A Convertir <Badge className="bg-emerald-100 text-emerald-600">1</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-emerald-500 bg-white/80">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-slate-800">Mme. Aissatou Sow</h3>
                                <p className="text-xs text-slate-500 mt-1">Divorce par consentement mutuel.</p>
                                <div className="mt-4">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">Créer le Dossier (Convertir)</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
