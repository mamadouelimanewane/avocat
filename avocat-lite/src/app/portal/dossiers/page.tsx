import { getPortalAllDossiers } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Folder, Calendar, FileText, ArrowLeft, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function PortalDossiersPage() {
    const { success, dossiers } = await getPortalAllDossiers()

    if (!success) {
        redirect('/portal')
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/portal" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Retour au tableau de bord
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Mes Dossiers</h1>
                    <p className="text-slate-500 mt-1">Consultez l'état d'avancement de toutes vos procédures.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Rechercher un dossier..." className="pl-10 w-[300px]" />
                    </div>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {(dossiers || []).map((dossier: any) => (
                    <Card key={dossier.id} className="hover:shadow-md transition-all border-l-4 border-l-slate-200 hover:border-l-indigo-500">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">{dossier.reference}</Badge>
                                        <Badge className={
                                            dossier.status === 'OUVERT' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                dossier.status === 'ARCHIVE' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' :
                                                    'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                        }>
                                            {dossier.status}
                                        </Badge>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{dossier.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Créé le {formatDate(dossier.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Folder className="h-4 w-4" />
                                            {dossier.type || 'Général'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 md:border-l md:pl-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-slate-900">{(dossier as any)._count?.documents || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Documents</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-slate-900">{(dossier as any)._count?.events || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Audiences</div>
                                    </div>
                                    <Button>
                                        Consulter
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {(dossiers || []).length === 0 && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-12 text-center text-slate-500">
                        <Folder className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">Aucun dossier trouvé</p>
                        <p className="text-sm">Vous n'avez pas de procédure en cours actuellement.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
