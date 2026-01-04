import { getPortalDossierById } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    FileText,
    Calendar,
    Clock,
    ArrowLeft,
    Download,
    MessageSquare,
    Paperclip,
    Gavel,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProcedureTracker } from '@/components/portal/ProcedureTracker'


export default async function PortalDossierDetailPage({ params }: { params: { id: string } }) {
    const { success, dossier } = await getPortalDossierById(params.id)

    if (!success || !dossier) {
        redirect('/portal/dossiers')
    }

    return (
        <div className="space-y-8">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/portal/dossiers" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Retour à la liste
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900">{dossier.title}</h1>
                        <Badge className={dossier.status === 'OUVERT' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                            {dossier.status}
                        </Badge>
                    </div>
                    <p className="text-slate-500 mt-1 font-mono text-sm">Référence : {dossier.reference}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Poser une question
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Download className="mr-2 h-4 w-4" />
                        Exporter (ZIP)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Workflow & Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="status" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-slate-100 p-1">
                            <TabsTrigger value="status" className="rounded-lg">État d'avancement</TabsTrigger>
                            <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
                            <TabsTrigger value="agenda" className="rounded-lg">Agenda</TabsTrigger>
                        </TabsList>

                        <TabsContent value="status" className="mt-6 space-y-6">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Gavel className="h-5 w-5 text-indigo-600" />
                                        Résumé de la procédure
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-slate-600 leading-relaxed">
                                        Ce dossier est actuellement en phase de {dossier.stage || 'préparation'}.
                                        L'instruction suit son cours conformément au calendrier établi.
                                    </p>

                                    {/* Procedure Tracker (LexPremium Style) */}
                                    <div className="mt-8 px-4 pb-4">
                                        <ProcedureTracker
                                            currentStage={dossier.stage || 'OUVERTURE'}
                                            estimatedCompletion="Prochaine étape prévue dans 12 jours"
                                        />
                                    </div>

                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-6">
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-0">
                                    <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-700">{dossier.documents?.length || 0} Documents partagés</span>
                                        <Button size="sm" variant="outline" className="h-8">
                                            <Paperclip className="h-4 w-4 mr-2" /> Déposer un fichier
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[500px]">
                                        <div className="divide-y divide-slate-100">
                                            {(dossier.documents || []).map((doc: any) => (
                                                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{doc.name}</p>
                                                            <p className="text-xs text-slate-500">Versé le {formatDate(doc.createdAt)} | {(doc.size / 1024).toFixed(0)} KB</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                                                        <Download className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {(dossier.documents || []).length === 0 && (
                                                <div className="p-12 text-center text-slate-500">
                                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                                    <p>Aucun document dans ce dossier.</p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="agenda" className="mt-6">
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {(dossier.events || []).length > 0 ? (
                                            (dossier.events || []).map((event: any) => (
                                                <div key={event.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                                    <div className="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 shrink-0">
                                                        <span className="text-xs font-bold uppercase">{new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                                        <span className="text-lg font-black leading-none">{new Date(event.startDate).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{event.title}</h4>
                                                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                            {event.location && ` | ${event.location}`}
                                                        </p>
                                                        {event.description && <p className="text-sm text-slate-600 mt-2">{event.description}</p>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                                                <p className="text-slate-500 font-medium">Aucun événement planifié pour ce dossier.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar: Lawyer & Quick Stats */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Votre Avocat Référent</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">👨‍💼</div>
                                <div>
                                    <p className="font-bold text-white">Me Mamadou WANE</p>
                                    <p className="text-xs text-indigo-300">Avocat à la Cour</p>
                                </div>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-none h-10">
                                Envoyer un message direct
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Détails de l'affaire</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-slate-500">Nature</span>
                                <span className="font-medium text-slate-900">Contentieux</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-slate-500">Juridiction</span>
                                <span className="font-medium text-slate-900">{dossier.jurisdiction || 'TPI Dakar'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-500">Partie Adverse</span>
                                <span className="font-medium text-rose-600">{dossier.opposingParty || 'Non spécifiée'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
