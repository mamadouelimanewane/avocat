"use client"

import { useState } from "react"
import {
    FileText,
    History,
    Users,
    Lock,
    Download,
    Upload,
    Eye,
    MoreVertical,
    Mail,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    ArrowLeftRight,
    ShieldCheck,
    FolderOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data for Versioning
const MOCK_VERSIONS = [
    { id: 'v3', version: '3.0', author: 'Me Ndiaye', date: '04 Fév 2026, 14:30', comment: 'Modifications article 12 - Clause pénale ajoutée.', status: 'CURRENT' },
    { id: 'v2', version: '2.0', author: 'Me Faye', date: '02 Fév 2026, 09:15', comment: 'Relecture associée, corrections mineures.', status: 'OLD' },
    { id: 'v1', version: '1.0', author: 'Me Ndiaye', date: '01 Fév 2026, 16:45', comment: 'Brouillon initial LexAI.', status: 'ARCHIVED' },
]

export default function DocumentDMSPage() {
    const [selectedVersion, setSelectedVersion] = useState(MOCK_VERSIONS[0])

    return (
        <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">

            {/* iManage style header: Solid, Document-centric */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <FolderOpen className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LexDMS Explorer</h1>
                        <p className="text-slate-500 font-medium">Gestion documentaire & Versioning (Standard iManage/Work10).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white">
                        <History className="h-4 w-4 mr-2" /> Historique Global
                    </Button>
                    <Button className="h-12 px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                        <Upload className="h-4 w-4 mr-2" /> Nouveau Document
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                {/* Left: Document Browser (DMS Sidebar) */}
                <Card className="xl:col-span-1 rounded-[2rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input className="w-full pl-10 pr-4 h-10 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Chercher un document..." />
                        </div>
                    </CardHeader>
                    <div className="p-4 space-y-1">
                        {[
                            { name: "Contrat de Cession v3", size: "2.4 MB", type: "DOCX", active: true },
                            { name: "Conclusions Réponse", size: "1.2 MB", type: "PDF", active: false },
                            { name: "Pièces Justificatives (Dossier 45)", size: "45 MB", type: "ZIP", active: false },
                        ].map((doc, i) => (
                            <div key={i} className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${doc.active ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${doc.active ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                                    <FileText className={`h-5 w-5 ${doc.active ? 'text-indigo-600' : 'text-slate-400'}`} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className={`text-sm font-bold truncate ${doc.active ? 'text-indigo-900' : 'text-slate-700'}`}>{doc.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.size} • {doc.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Center: Version Control & Preview (The iManage heart) */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Preview / Metadata */}
                        <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <h2 className="font-black text-slate-900">Contrat de Cession AfricaTech.docx</h2>
                                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-black border-none">VERSION FINALE</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-white shadow-sm border border-slate-100"><Eye className="h-4 w-4 text-slate-500" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-white shadow-sm border border-slate-100"><Download className="h-4 w-4 text-slate-500" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-white shadow-sm border border-slate-100"><MoreVertical className="h-4 w-4 text-slate-500" /></Button>
                                </div>
                            </div>
                            <ScrollArea className="flex-1 min-h-[500px] p-12 bg-slate-50/20">
                                <div className="max-w-2xl mx-auto space-y-8">
                                    <div className="text-center space-y-4 py-8">
                                        <h1 className="text-2xl font-serif font-black underline decoration-indigo-200 decoration-4 underline-offset-8">PROTOCOLE D'ACCORD DE CESSION</h1>
                                        <p className="text-xs text-slate-400 italic">Version 3.0 - Stabilisée le 04/02/2026</p>
                                    </div>
                                    <div className="space-y-6 font-serif text-slate-700 leading-relaxed text-lg">
                                        <p>ENTRE LES SOUSSIGNÉS :</p>
                                        <p>1. **La société AfricaTech SARL**, agissant par son représentant légal Me Ndiaye...</p>
                                        <p>2. **Le Groupe Investissements Unifiés**, sis à Dakar Plateau...</p>
                                        <p className="bg-amber-50 p-4 border-l-4 border-amber-400 rounded-r-xl italic shadow-sm">
                                            "Art 12. En cas de non-respect des engagements contractuels, une pénalité forfaitaire de 15% sera appliquée..."
                                        </p>
                                        <p>Fait à Dakar, en trois exemplaires originaux...</p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </Card>

                        {/* Version History Sidebar (Exactly like iManage Work10) */}
                        <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                            <CardHeader className="bg-slate-900 text-white">
                                <CardTitle className="text-sm font-black flex items-center gap-2">
                                    <History className="h-4 w-4 text-indigo-400" />
                                    Historique des Versions
                                </CardTitle>
                            </CardHeader>
                            <div className="divide-y divide-slate-50">
                                {MOCK_VERSIONS.map((v) => (
                                    <div
                                        key={v.id}
                                        onClick={() => setSelectedVersion(v)}
                                        className={`p-6 cursor-pointer transition-all ${selectedVersion.id === v.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${v.status === 'CURRENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                                V {v.version}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold">{v.date}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-900 mb-1">{v.author}</p>
                                        <p className="text-[11px] text-slate-500 leading-tight italic">"{v.comment}"</p>

                                        {selectedVersion.id === v.id && (
                                            <div className="mt-4 flex gap-2">
                                                <Button size="sm" className="h-7 text-[10px] bg-slate-900 text-white rounded-lg flex-1">Comparer</Button>
                                                <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg flex-1">Restaurer</Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100">
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Contrôle de Gouvernance</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">Audit Trail</span>
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">Encodage SSL-256</span>
                                        <Lock className="h-4 w-4 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>

                    {/* Legal Ops integration: File Email section (Standard in iManage/PolyOffice) */}
                    <Card className="rounded-[2.5rem] border-indigo-100 bg-indigo-50/20 shadow-sm border-dashed">
                        <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-indigo-600">
                                <Mail className="h-8 w-8" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-black text-slate-900">Email Management & Filing</h3>
                                <p className="text-sm text-slate-500 mt-2">Reliez automatiquement vos échanges Outlook à ce dossier. Ne perdez plus aucune instruction client.</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="h-12 px-6 bg-white border-indigo-200 text-indigo-700 font-bold rounded-xl shadow-sm">Récupérer via Outlook</Button>
                                <Button className="h-12 px-6 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100">Archiver l'échange</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </div>
    )
}
