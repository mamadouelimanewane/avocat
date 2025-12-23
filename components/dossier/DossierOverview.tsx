
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Gavel, Scale, UserMinus, ShieldAlert } from "lucide-react"
import { EditDossierDialog } from "./EditDossierDialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function DossierOverview({ dossier }: { dossier: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Info Principales */}
            <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Informations Procédurales</CardTitle>
                    <EditDossierDialog dossier={dossier} />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6 mt-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 flex items-center">
                            <Scale className="w-4 h-4 mr-2" /> Juridiction
                        </p>
                        <p className="text-base font-semibold">{dossier.jurisdiction || 'Non définie'}</p>
                        <p className="text-sm text-slate-500">{dossier.judge || 'Juge non assigné'}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 flex items-center">
                            <Gavel className="w-4 h-4 mr-2" /> Étape / Statut
                        </p>
                        <div className="flex gap-2">
                            <Badge variant="outline">{dossier.procedureType}</Badge>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                                {dossier.stage || 'SAISINE'}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 flex items-center">
                            <UserMinus className="w-4 h-4 mr-2" /> Partie Adverse
                        </p>
                        <p className="text-base font-semibold">{dossier.opposingParty || 'Non renseignée'}</p>
                        <p className="text-sm text-slate-500">
                            {dossier.opposingCounsel ? `Me ${dossier.opposingCounsel}` : 'Pas d\'avocat constitué'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2" /> Prochaine Audience
                        </p>
                        {dossier.nextHearingDate ? (
                            <p className="text-base font-bold text-red-600">
                                {format(new Date(dossier.nextHearingDate), 'dd MMMM yyyy (EEEE)', { locale: fr })}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Aucune date fixée</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Statistiques Rapides */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Synthèse</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm text-slate-500">Temps passé</span>
                        <span className="font-mono font-bold">12h 30m</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm text-slate-500">Facturé</span>
                        <span className="font-mono font-bold text-emerald-600">2 500 000 F</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm text-slate-500">Restant dû</span>
                        <span className="font-mono font-bold text-red-500">500 000 F</span>
                    </div>

                    <div className="pt-4">
                        <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                            <ShieldAlert className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-blue-700 uppercase mb-1">Rappel Procédure</p>
                                <p className="text-xs text-blue-600">
                                    Vérifier les délais de recours si le jugement a été rendu.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
