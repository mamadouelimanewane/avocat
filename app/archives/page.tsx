"use client"

import { AdvancedArchiveManager } from '@/components/dossier/AdvancedArchiveManager'
import { Badge } from '@/components/ui/badge'
import {
    ShieldCheck,
    HardDrive,
    ExternalLink,
    FileSignature,
    Info,
    Archive
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ArchivesPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8 space-y-10">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-slate-900 text-white font-black px-3 py-1 text-[10px] uppercase tracking-[0.2em]">Compliance AI</Badge>
                        <Badge variant="outline" className="text-slate-500 border-slate-200">OHADA / RGPD</Badge>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Archives & <span className="text-indigo-600">Sceau Numérique</span></h1>
                    <p className="text-slate-500 font-medium">Gestion intelligente de votre fonds documentaire et des preuves électroniques.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">État Système</p>
                            <p className="text-sm font-black text-slate-900">100% Intègre</p>
                        </div>
                    </div>
                    <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 text-white flex items-center gap-4">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <HardDrive className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-100 uppercase opacity-70">Stockage Cloud</p>
                            <p className="text-sm font-black">2.4 TB / 5 TB</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance Alert */}
            <div className="max-w-7xl mx-auto">
                <Alert className="bg-blue-50 border-blue-100 text-blue-900 rounded-2xl overflow-hidden p-6 relative">
                    <div className="absolute right-0 top-0 p-8 opacity-5">
                        <FileSignature className="h-24 w-24" />
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <Info className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <AlertTitle className="text-lg font-black tracking-tight">Informations sur le Sceau Numérique LexPremium</AlertTitle>
                            <AlertDescription className="max-w-3xl leading-relaxed font-medium">
                                Tous les documents archivés avec le statut <span className="underline font-bold">"SIGNÉ"</span> bénéficient d'une empreinte cryptographique SHA-256 enregistrée. Toute modification ultérieure du fichier rendra le sceau caduc, garantissant ainsi une preuve irréfutable devant les tribunaux OHADA.
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <AdvancedArchiveManager />
            </div>

            {/* Sub-footer Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-200">
                <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <FileSignature className="h-5 w-5 text-indigo-500" /> Signature AES
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Conforme au Règlement (UE) N°910/2014 (eIDAS) et aux dispositions locales sur la preuve électronique.
                    </p>
                    <a href="#" className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline">
                        VOIR CERTIFICATION <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
                <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" /> Intégrité des Données
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Surveillance continue de l'intégrité des fichiers stockés sur Vercel Blob / MongoDB.
                    </p>
                    <a href="#" className="text-xs font-black text-emerald-600 flex items-center gap-1 hover:underline">
                        RAPPORT D'AUDIT <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
                <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Archive className="h-5 w-5 text-amber-500" /> Politique de Retention
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Les dossiers clos sont conservés 10 ans par défaut, 30 ans pour les dossiers fonciers/immobiliers.
                    </p>
                    <a href="#" className="text-xs font-black text-amber-600 flex items-center gap-1 hover:underline">
                        PARAMÈTRES LÉGAUX <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </div>
    )
}
