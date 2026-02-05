"use client"

import { useState } from "react"
import {
    Mic,
    Bot,
    FileText,
    Send,
    Mail,
    Clock,
    History,
    Settings,
    Volume2,
    Sparkles,
    CheckCircle2,
    Loader2,
    ListTodo,
    Truck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data for Secretariat
const MOCK_TRANSCRIPTIONS = [
    { id: 1, title: "Réunion AfricaTech", duration: "12:45", status: "TRANSCRIT", date: "il y a 2h" },
    { id: 2, title: "Note Plaidoirie TGI", duration: "05:20", status: "EN COURS", date: "il y a 30 min" },
    { id: 3, title: "Instructions Client Fall", duration: "02:15", status: "ARCHIVÉ", date: "02 Fév" },
]

export default function SecretariatIAPage() {
    const [isRecording, setIsRecording] = useState(false)

    return (
        <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">

            {/* SECIB style Administrative Hub Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-100">
                        <Mic className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hub Secrétariat IA</h1>
                        <p className="text-slate-500 font-medium">Dictée numérique, Transcription & Pilotage Administrative (Inspiré SECIB).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white">
                        <Settings className="h-4 w-4 mr-2" /> Paramètres Dictée
                    </Button>
                    <Button className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
                        <FileText className="h-4 w-4 mr-2" /> Centraliser Dossier
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left: Dictation & AI Transcription Hub (Septeo Brain vibe) */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[3rem] border-slate-100 shadow-xl bg-white overflow-hidden active:scale-[0.99] transition-transform">
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-[3rem] shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
                            </div>

                            <div className="space-y-2">
                                <Badge className="bg-amber-500 text-white font-black border-none px-4 py-1 text-xs">LEXDICTÉE PRO</Badge>
                                <h2 className="text-3xl font-black tracking-tight">Prêt pour la dictée</h2>
                                <p className="text-slate-400 font-medium max-w-sm">Capturez vos pensées juridiques. Septeo Brain s'occupe de la transcription.</p>
                            </div>

                            <div className="relative group">
                                <div className={`absolute -inset-4 bg-amber-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${isRecording ? 'animate-pulse opacity-60' : ''}`} />
                                <button
                                    onClick={() => setIsRecording(!isRecording)}
                                    className={`relative h-28 w-28 rounded-full flex items-center justify-center shadow-2xl transition-all ${isRecording ? 'bg-rose-600 scale-95' : 'bg-white text-slate-900 hover:scale-110 active:scale-90'
                                        }`}
                                >
                                    {isRecording ? <div className="h-8 w-8 bg-white rounded-sm animate-pulse" /> : <Mic className="h-10 w-10" />}
                                </button>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Qualité</p>
                                    <p className="text-sm font-bold flex items-center gap-1"><Volume2 className="h-4 w-4 text-emerald-400" /> Lossless</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Langue</p>
                                    <p className="text-sm font-bold">Français (Legal)</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Postal & Document Dispatch (SECIB Secretariat style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-sm font-black flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-blue-600" />
                                    Suivi du Courrier Physique
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {[
                                    { dest: "Greffe TGI Dakar", status: "ENVOYÉ", date: "Aujourd'hui, 09:00" },
                                    { dest: "Me Soumare (Adverse)", status: "REÇU", date: "Hier, 14:20" },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{c.dest}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{c.date}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black">{c.status}</Badge>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 rounded-xl">Nouveau Bordereau</Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-amber-100 bg-amber-50/10 shadow-sm overflow-hidden border-2 border-dashed">
                            <CardHeader>
                                <CardTitle className="text-sm font-black flex items-center gap-2 text-amber-900">
                                    <ListTodo className="h-4 w-4" />
                                    Tâches Secrétariat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    "Signifier Assignation (Dossier 45)",
                                    "Préparer Chemises pour Audience",
                                    "Éditer relevé de frais AfricaTech",
                                ].map((t, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                        <div className="h-2 w-2 rounded-full bg-amber-400" />
                                        {t}
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-amber-100 flex justify-center">
                                    <Button variant="link" className="text-amber-700 text-[10px] font-black uppercase tracking-widest">Voir tous les rappels</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right: Transcription History & AI Status */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <History className="h-4 w-4 text-amber-400" />
                                Historique Dictées
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {MOCK_TRANSCRIPTIONS.map((t) => (
                                    <div key={t.id} className="p-6 hover:bg-slate-50/50 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors">{t.title}</h4>
                                            <span className="text-[10px] text-slate-400 font-bold">{t.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${t.status === 'TRANSCRIT' ? 'bg-emerald-50 text-emerald-600' :
                                                        t.status === 'EN COURS' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                                                    } border-none font-black text-[9px]`}>{t.status}</Badge>
                                                {t.status === 'EN COURS' && <Loader2 className="h-3 w-3 animate-spin text-amber-500" />}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{t.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] bg-indigo-600 text-white p-8 relative overflow-hidden group shadow-xl">
                        <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
                        <Bot className="h-10 w-10 text-indigo-200 mb-6" />
                        <h3 className="text-lg font-bold mb-2">Intelligence Secrétariat</h3>
                        <p className="text-xs text-indigo-100 leading-relaxed mb-6">
                            Septeo Brain a détecté 4 rendez-vous potentiels dans vos dictées d'aujourd'hui. Voulez-vous les ajouter à l'agenda ?
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <Button className="bg-white text-indigo-600 font-bold text-[10px] h-9 rounded-xl">OUI, ANALYSER</Button>
                            <Button variant="ghost" className="text-indigo-100 font-bold text-[10px] h-9 rounded-xl hover:bg-white/10">IGNORER</Button>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
