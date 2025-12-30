
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Gavel, Scale, UserMinus, ShieldAlert, Archive } from "lucide-react"
import { archiveDossier, getRoles } from "@/app/actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { prisma } from "@/lib/prisma"
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
                        <span className="font-mono font-bold">
                            {Math.floor((dossier.timeEntries?.reduce((acc: number, t: any) => acc + t.duration, 0) || 0) / 60)}h {(dossier.timeEntries?.reduce((acc: number, t: any) => acc + t.duration, 0) || 0) % 60}m
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm text-slate-500">Facturé</span>
                        <span className="font-mono font-bold text-emerald-600">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(dossier.factures?.reduce((acc: number, f: any) => acc + f.amountTTC, 0) || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-sm text-slate-500">Restant dû</span>
                        <span className="font-mono font-bold text-red-500">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(
                                (dossier.factures?.reduce((acc: number, f: any) => acc + f.amountTTC, 0) || 0) -
                                (dossier.factures?.reduce((acc: number, f: any) => acc + (f.payments?.reduce((pa: number, p: any) => pa + p.amount, 0) || 0), 0) || 0)
                            )}
                        </span>
                    </div>

                    <div className="pt-4 space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                            <ShieldAlert className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-blue-700 uppercase mb-1">Rappel Procédure</p>
                                <p className="text-xs text-blue-600">
                                    Vérifier les délais de recours si le jugement a été rendu.
                                </p>
                            </div>
                        </div>

                        {dossier.status !== 'ARCHIVE' && (
                            <ArchiveDossierDialog dossierId={dossier.id} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ArchiveDossierDialog({ dossierId }: { dossierId: string }) {
    const [boxes, setBoxes] = useState<any[]>([])
    const [selectedBoxId, setSelectedBoxId] = useState("")
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    // In a real app, we'd fetch this from a server action
    // Simulating fetching boxes
    useEffect(() => {
        if (isOpen) {
            // This is a bit hacky to fetch inside a client component without a dedicated hook, 
            // but for the demo it works.
            fetch('/api/archives/boxes').then(res => res.json()).then(data => setBoxes(data))
        }
    }, [isOpen])

    async function handleArchive() {
        if (!selectedBoxId) return
        setLoading(true)
        const res = await archiveDossier(dossierId, selectedBoxId)
        setLoading(false)
        if (res.success) {
            toast({ title: "Dossier Archivé", description: "Le dossier et ses documents ont été déplacés vers les archives." })
            window.location.reload()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50">
                    <Archive className="w-4 h-4 mr-2" /> Archiver le Dossier
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archivage du Dossier</DialogTitle>
                    <DialogDescription>
                        Pour archiver ce dossier, vous devez l'attribuer à une boîte d'archives physique.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sélectionner une Boîte d'Archives</label>
                        <Select onValueChange={setSelectedBoxId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une boîte..." />
                            </SelectTrigger>
                            <SelectContent>
                                {boxes.map(box => (
                                    <SelectItem key={box.id} value={box.id}>{box.code} ({box.location})</SelectItem>
                                ))}
                                {boxes.length === 0 && <p className="p-2 text-xs text-slate-400">Aucune boîte disponible. Créez-en une dans le module Archives.</p>}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button onClick={handleArchive} disabled={loading || !selectedBoxId} className="bg-slate-900 text-white">
                        {loading ? 'Archivage...' : 'Confirmer l\'archivage'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
