"use client"

import { PredictiveDashboard } from '@/components/ai/PredictiveDashboard'
import { JurisprudenceResearch } from '@/components/ai/JurisprudenceResearch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
    BrainCircuit,
    Search,
    TrendingUp,
    Scale,
    ShieldCheck,
    Gavel,
    Sparkles
} from 'lucide-react'

export default function PredictivePage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8 space-y-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-600 text-white font-black px-3 py-1 text-[10px] uppercase tracking-widest">
                            Intelligence Artificielle de Pointe
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600 animate-pulse">
                            <Sparkles className="h-3 w-3" /> LEXAI PREDICTIVE ENGINE V6.0
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                        Stratégie <span className="text-indigo-600">& IA</span> Prédictive
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        Anticipez les décisions judiciaires et optimisez votre stratégie de plaidoirie.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <SmallStat label="Cerveau IA" value="Mode Stratège" icon={BrainCircuit} color="indigo" />
                    <SmallStat label="Base RAG" value="5M+ Actes" icon={Search} color="slate" />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="predict" className="space-y-8">
                    <TabsList className="bg-white p-1 h-14 rounded-2xl border-2 border-slate-100 shadow-sm inline-flex">
                        <TabsTrigger value="predict" className="px-8 h-12 rounded-xl text-sm font-black data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all gap-2">
                            <TrendingUp className="h-4 w-4" /> Prédiction de Succès
                        </TabsTrigger>
                        <TabsTrigger value="research" className="px-8 h-12 rounded-xl text-sm font-black data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all gap-2">
                            <Search className="h-4 w-4" /> Jurisprudence RAG ++
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="predict">
                        <PredictiveDashboard dossierId="NEW_CASE" />
                    </TabsContent>

                    <TabsContent value="research">
                        <JurisprudenceResearch />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Scientific Footer */}
            <div className="max-w-7xl mx-auto pt-12 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <TechInfo title="Probabilisme Juridique" content="Nos algorithmes utilisent la théorie des jeux pour simuler les issues probables basées sur 20 ans d'arrêts." />
                    <TechInfo title="Conformité CCJA" titleColor="text-indigo-600" content="Indexation exhaustive de la jurisprudence de la Cour Commune de Justice et d'Arbitrage (OHADA)." />
                    <TechInfo title="Analyse Adverse" content="Émulation cognitive des stratégies probables de la défense pour anticiper chaque faille." />
                    <TechInfo title="Droit Sénégalais" titleColor="text-rose-600" content="Mise à jour hebdomadaire des positions de la Cour Suprême et des Cours d'Appel du Sénégal." />
                </div>
            </div>
        </div>
    )
}

function SmallStat({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
    const colors: Record<string, string> = {
        indigo: "bg_indigo_600 text_white shadow_indigo_200", // Fix underscore vs dash in Tailwind simulation
        slate: "bg_white text_slate_900 border_slate_100 shadow_sm"
    }
    // Correcting BG/Text class names
    const bgClass = color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 border-2 border-slate-100'

    return (
        <div className={`p-4 rounded-2xl flex items-center gap-4 ${bgClass}`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color === 'indigo' ? 'bg-white/20' : 'bg-slate-50 text-indigo-600'}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${color === 'indigo' ? 'text-indigo-100' : 'text-slate-400'}`}>{label}</p>
                <p className="text-sm font-black whitespace-nowrap">{value}</p>
            </div>
        </div>
    )
}

function TechInfo({ title, content, titleColor = "text-slate-900" }: { title: string, content: string, titleColor?: string }) {
    return (
        <div className="space-y-2">
            <h4 className={`text-sm font-black uppercase tracking-widest ${titleColor}`}>{title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{content}</p>
        </div>
    )
}
