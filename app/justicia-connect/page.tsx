"use client"

import { useState } from "react"
import {
    Landmark,
    Send,
    Inbox,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Link as LinkIcon,
    Gavel,
    Calendar,
    Download,
    ShieldCheck,
    Zap,
    MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock Data for RPVA / Judicial Dashboard
const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'DÉPÔT', subject: 'Assignation AfricaTech SARL', status: 'VALIDÉ', date: 'il y a 45 min', source: 'Tribunal de Commerce' },
    { id: 2, type: 'MESSAGE', subject: 'Chambre Sociale - Avis de renvoi', status: 'À LIRE', date: 'Hier, 16:30', source: 'Cour Suprême' },
    { id: 3, type: 'ACTE', subject: 'Exploit Huissier signifié', status: 'ARCHIVÉ', date: '02 Fév 2026', source: 'Me Fall (Huissier)' },
]

export default function JusticiaConnectPage() {
    return (
        <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">

            {/* PolyOffice/SECIB style Judicial Portal Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                        <Landmark className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Justicia Connect</h1>
                        <p className="text-slate-500 font-medium italic">Portail Interconnecté du Palais (Simulateur BVA/RPVA Elite).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Badge className="h-10 px-4 bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Serveur Palais Connecté
                    </Badge>
                    <Button className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
                        <Send className="h-4 w-4 mr-2" /> Dépôt d&apos;Acte Numérique
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left: Communication Hub (BVA Style) */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl">Flux des Échanges Judiciaires</CardTitle>
                                    <CardDescription>Messages et actes reçus du Réseau Privé des Avocats.</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Marquer tout comme lu</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {MOCK_NOTIFICATIONS.map((notif) => (
                                    <div key={notif.id} className="p-6 hover:bg-slate-50/50 transition-all cursor-pointer group flex items-start gap-6">
                                        <div className={`mt-1 h-10 w-10 rounded-xl flex items-center justify-center ${notif.status === 'À LIRE' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {notif.type === 'MESSAGE' ? <Inbox className="h-5 w-5" /> : <Gavel className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notif.source}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">{notif.date}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase">{notif.subject}</h4>
                                            <div className="flex items-center gap-3 mt-3">
                                                <Badge className={`${notif.status === 'VALIDÉ' ? 'bg-emerald-50 text-emerald-600' :
                                                        notif.status === 'À LIRE' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                                                    } border-none font-black text-[9px]`}>{notif.status}</Badge>
                                                {notif.type === 'DÉPÔT' && (
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> Preuve de dépôt n° 23-890-AF
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 text-center border-t border-slate-50">
                                <Button variant="link" className="text-slate-400 font-bold text-xs uppercase tracking-widest">Voir l&apos;intégralité des échanges</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RPVA Status / Digital Court integration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-8 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-indigo-400" />
                                </div>
                                <Badge className="bg-white/10 text-white border-none text-[10px] font-bold">TEMPS RÉEL</Badge>
                            </div>
                            <h3 className="text-lg font-black mb-2">Suivi Audiences Palais</h3>
                            <p className="text-xs text-indigo-200 leading-relaxed mb-6">
                                Synchronisation automatique avec le greffe. 4 dossiers en attente de mise en l'état aujourd'hui.
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                                    <span>Délais de procédure</span>
                                    <span>85% critiques</span>
                                </div>
                                <Progress value={85} className="h-1.5 bg-white/10" />
                            </div>
                        </Card>

                        <Card className="rounded-[2.5rem] border-indigo-100 bg-white shadow-sm p-8 border-2 border-dashed flex flex-col items-center justify-center text-center">
                            <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-slate-900">Agenda Palais Sync</h4>
                            <p className="text-xs text-slate-500 mt-2 mb-4">Liez votre agenda Justicia avec votre calendrier Google ou Outlook.</p>
                            <Button variant="outline" className="rounded-xl font-bold h-10 px-6 border-indigo-200 text-indigo-600">Lancer la synchro</Button>
                        </Card>
                    </div>
                </div>

                {/* Right: Tools & Archive (PolyOffice vibe) */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white border-b border-indigo-500/20">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-400" />
                                Délais Procéduraux Critiques
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {[
                                { title: "Réponse Conclusions", dossier: "Orange SA", days: 2, priority: 'HIGH' },
                                { title: "Péremption d'instance", dossier: "Litige Fall", days: 12, priority: 'MEDIUM' },
                            ].map((d, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className={`mt-1 h-2 w-2 rounded-full ${d.priority === 'HIGH' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{d.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold mb-2">{d.dossier}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-rose-600 font-black">
                                            <AlertTriangle className="h-3.5 w-3.5" /> J - {d.days} JOURS
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full bg-slate-50 text-slate-600 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                Configurer mes alertes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] bg-indigo-600 text-white p-8 relative overflow-hidden group shadow-xl">
                        <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                        <ShieldCheck className="h-10 w-10 text-indigo-200 mb-6" />
                        <h3 className="text-lg font-bold mb-2">Signature & Dépôt Certifié</h3>
                        <p className="text-xs text-indigo-100 leading-relaxed mb-6">
                            Utilisez votre certificat électronique LexPremium pour valider vos actes devant toutes les juridictions OHADA.
                        </p>
                        <Button className="w-full bg-white text-indigo-600 font-bold text-xs rounded-xl h-10 shadow-lg">
                            Télécharger Preuve de Dépôt
                        </Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
