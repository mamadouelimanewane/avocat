"use client"

import { useState, useEffect } from "react"
import {
    Play,
    Zap,
    ShieldCheck,
    Settings,
    ChevronRight,
    CheckCircle2,
    ArrowRight,
    Monitor,
    Smartphone,
    Layout,
    Star,
    Sparkles,
    Award,
    Crown,
    Lock,
    Globe,
    Gavel,
    Briefcase,
    History,
    Rocket
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Simulation Scenarios
const SCENARIOS = [
    {
        id: "ma",
        title: "Fusion-Acquisition Stratégique",
        description: "Vérifiez les conflits d'intérêts, auditez les contrats et gérez les versions complexes.",
        pillars: ["LexGraph", "LexCheck Pro", "LexDMS", "CLM"],
        color: "bg-indigo-600",
        icon: <Briefcase className="h-6 w-6" />,
        gradient: "from-indigo-600 to-indigo-900"
    },
    {
        id: "trial",
        title: "Défense en Procès Pénal des Affaires",
        description: "Prédisez l'issue du procès et testez vos plaidoiries contre l'IA adverse.",
        pillars: ["LexPredict", "LexSimulator", "Justicia Connect"],
        color: "bg-rose-600",
        icon: <Gavel className="h-6 w-6" />,
        gradient: "from-rose-600 to-rose-900"
    },
    {
        id: "global",
        title: "Expansion Pan-Africaine (Multi-pays)",
        description: "Configurez la facturation multi-pays et vérifiez la conformité KYC internationale.",
        pillars: ["Global Billing", "KYC/Sanctions", "Wiki Doctrine"],
        color: "bg-emerald-600",
        icon: <Globe className="h-6 w-6" />,
        gradient: "from-emerald-600 to-emerald-900"
    }
]

export default function DemoElitePage() {
    const [activeScenario, setActiveScenario] = useState<string | null>(null)
    const [step, setStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const launchSimulation = (id: string) => {
        setActiveScenario(id)
        setIsLoading(true)
        setStep(0)
        setTimeout(() => {
            setIsLoading(false)
            setStep(1)
        }, 2000)
    }

    const nextStep = () => {
        setStep(prev => prev + 1)
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">

            {/* Premium Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent" />
                <div className="absolute -top-40 -left-40 h-[600px] w-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-20 right-0 h-[400px] w-[400px] bg-rose-600/5 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-12">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                        <Crown className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Edition Elite 2026</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] lg:max-w-4xl mx-auto">
                            L&apos;Expérience <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">LexPremium Elite.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed">
                            Plongez dans le futur du droit avec nos simulations interactives. Découvrez comment nos 19 piliers technologiques révolutionnent la pratique juridique de votre cabinet.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md text-left space-y-2">
                            <Star className="h-5 w-5 text-amber-400" />
                            <p className="text-sm font-black uppercase tracking-widest text-indigo-300">19 Piliers</p>
                            <p className="text-xs text-slate-500 font-medium">L&apos;infrastructure la plus complète du marché.</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md text-left space-y-2">
                            <Zap className="h-5 w-5 text-emerald-400" />
                            <p className="text-sm font-black uppercase tracking-widest text-emerald-300">IA Proactive</p>
                            <p className="text-xs text-slate-500 font-medium">Anticipation des risques et opportunités.</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md text-left space-y-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-400" />
                            <p className="text-sm font-black uppercase tracking-widest text-indigo-300">Hautement Sécurisé</p>
                            <p className="text-xs text-slate-500 font-medium">Chiffrement militaire & conformité OHADA.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 pb-32">
                {!activeScenario ? (
                    <div className="space-y-12">
                        <div className="flex items-end justify-between border-b border-white/10 pb-8">
                            <h2 className="text-3xl font-black tracking-tight uppercase">Choisissez votre Simulation</h2>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">3 Scénarios disponibles</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {SCENARIOS.map((scenario) => (
                                <Card key={scenario.id} className="group relative bg-[#0f172a] border-white/5 rounded-[3rem] overflow-hidden hover:border-white/20 transition-all cursor-pointer shadow-2xl">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                    <CardContent className="p-12 space-y-10 relative z-10">
                                        <div className={`h-16 w-16 ${scenario.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-900/20 group-hover:scale-110 transition-transform duration-500`}>
                                            {scenario.icon}
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
                                                {scenario.title}
                                            </h3>
                                            <p className="text-slate-400 font-medium leading-relaxed">
                                                {scenario.description}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modules Exploités</p>
                                            <div className="flex flex-wrap gap-2">
                                                {scenario.pillars.map((p, i) => (
                                                    <Badge key={i} className="bg-white/5 text-slate-300 border-none px-3 py-1 text-[9px] font-black uppercase tracking-tight">
                                                        {p}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => launchSimulation(scenario.id)}
                                            className="w-full h-16 bg-white text-slate-900 rounded-2xl font-black text-lg gap-3 hover:bg-slate-100 shadow-xl group/btn"
                                        >
                                            Lancer la Simulation
                                            <Play className="h-5 w-5 fill-slate-900 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
                        <div className="flex justify-between items-center">
                            <Button variant="ghost" onClick={() => setActiveScenario(null)} className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                                <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Retour au Hub
                            </Button>
                            <Badge className="bg-indigo-600 text-white border-none px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">Simulation en cours</Badge>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full border-b-4 border-indigo-500 animate-spin" />
                                    <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500 animate-bounce" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-widest">Initialisation de l&apos;environnement Elite</h3>
                                    <p className="text-slate-500 font-medium mt-2">Génération des données transactionnelles, juridiques et graphiques...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Progress Tracker Sidebar */}
                                <div className="lg:col-span-3 space-y-6">
                                    <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 space-y-8">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-300">Progression</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercaseTracking-widest">Scénario: {SCENARIOS.find(s => s.id === activeScenario)?.title}</p>
                                        </div>
                                        <div className="space-y-6">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${step >= i ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/10 text-white/50'
                                                        }`}>
                                                        {step > i ? <CheckCircle2 className="h-4 w-4" /> : i}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${step >= i ? 'opacity-100' : 'opacity-30'}`}>
                                                        {i === 1 && "Configuration"}
                                                        {i === 2 && "Analyse Stratégique"}
                                                        {i === 3 && "Exécution Elite"}
                                                        {i === 4 && "Bilan & ROI"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 space-y-4">
                                        <Star className="h-6 w-6 text-amber-500" />
                                        <h5 className="font-black text-amber-100 uppercase text-[10px] tracking-widest">Conseil LexAI</h5>
                                        <p className="text-[11px] text-amber-200/60 leading-relaxed font-medium">
                                            "Pour maximiser l&apos;impact de cette démo, soulignez la rapidité d&apos;exécution par rapport aux méthodes traditionnelles."
                                        </p>
                                    </div>
                                </div>

                                {/* Main Content Arena */}
                                <div className="lg:col-span-9 space-y-8">
                                    <Card className="bg-white border-none rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden min-h-[600px] flex flex-col">
                                        <div className="p-8 border-b border-slate-50 flex justify-between items-center text-slate-900 bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-indigo-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                    <Monitor className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">LEXPREMIUM ELITE VIEWPORT</p>
                                                    <h4 className="text-sm font-black uppercase">Étape {step}: {
                                                        step === 1 ? "Configuration du Dossier" :
                                                            step === 2 ? "Audit de Risques Global" :
                                                                step === 3 ? "Action Co-Counsel" : "Génération de Valeur"
                                                    }</h4>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                            </div>
                                        </div>

                                        <div className="flex-1 p-12 text-slate-900">
                                            {step === 1 && (
                                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div className="space-y-6">
                                                            <h3 className="text-4xl font-black tracking-tight leading-none text-indigo-900">Préparation de l&apos;environnement.</h3>
                                                            <p className="text-slate-500 font-medium leading-relaxed">
                                                                LexPremium Elite scanne automatiquement les bases de données pour extraire les entités liées.
                                                            </p>
                                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                                                    <span className="text-xs font-black uppercase tracking-widest">Compliance KYC: OK</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-slate-400">
                                                                    <History className="h-5 w-5" />
                                                                    <span className="text-xs font-bold uppercase tracking-widest">Holdings Cartographiées: WIP</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-center gap-6 shadow-2xl">
                                                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                                                <Search className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Scan Temps Réel</p>
                                                                <h4 className="text-lg font-black tracking-tight mt-2 italic">"Détection de 3 entités liées en Côte d&apos;Ivoire."</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {step === 2 && (
                                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                                    <div className="flex items-center gap-4 p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem]">
                                                        <Zap className="h-10 w-10 text-indigo-600 animate-pulse" />
                                                        <div>
                                                            <h3 className="text-2xl font-black text-indigo-900 uppercase tracking-tight">Intelligence Étendue Activée.</h3>
                                                            <p className="text-sm font-bold text-indigo-600/60 uppercase">Analyse des 19 piliers en cours sur le scénario.</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-6">
                                                        {[
                                                            { label: "Risque Juridique", value: 12, color: "bg-emerald-500" },
                                                            { label: "Conformité KYC", value: 98, color: "bg-indigo-600" },
                                                            { label: "Predict Impact", value: 75, color: "bg-amber-500" },
                                                        ].map((stat, i) => (
                                                            <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                                                <div className="flex items-end gap-2">
                                                                    <span className="text-2xl font-black">{stat.value}%</span>
                                                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full mb-2">
                                                                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.value}%` }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 3 && (
                                                <div className="space-y-8 animate-in fade-in zoom-in-95">
                                                    <div className="text-center space-y-4 max-w-xl mx-auto">
                                                        <div className="h-20 w-20 bg-rose-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-rose-200">
                                                            <Crown className="h-10 w-10" />
                                                        </div>
                                                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">L&apos;Avocat Augmenté.</h3>
                                                        <p className="text-slate-500 font-medium">LexAI Co-Counsel a rédigé la stratégie de riposte optimisée en fonction de la jurisprudence locale.</p>
                                                    </div>
                                                    <div className="p-10 bg-slate-900 text-white rounded-[3rem] font-serif italic text-lg leading-relaxed shadow-2xl shadow-indigo-100 relative">
                                                        <div className="absolute top-6 left-6 opacity-20"><Plus className="h-10 w-10" /></div>
                                                        "Considérant la jurisprudence de la CCJA du 14 Octobre 2024, nous activons la clause d&apos;exception territoriale pour neutraliser l&apos;argument adverse..."
                                                    </div>
                                                </div>
                                            )}

                                            {step === 4 && (
                                                <div className="space-y-12 animate-in fade-in slide-in-from-top-4">
                                                    <div className="grid grid-cols-2 gap-12">
                                                        <div className="space-y-8">
                                                            <div className="space-y-2">
                                                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px] uppercase tracking-widest">Simulation Terminée</Badge>
                                                                <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Bilan Stratégique.</h3>
                                                            </div>
                                                            <div className="space-y-6">
                                                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                                                    <span className="text-xs font-black uppercase text-slate-400">Gain de temps</span>
                                                                    <span className="text-lg font-black text-emerald-600">+85%</span>
                                                                </div>
                                                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                                                    <span className="text-xs font-black uppercase text-slate-400">Sécurité Juridique</span>
                                                                    <span className="text-lg font-black text-indigo-600">MAXIMALE</span>
                                                                </div>
                                                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                                                    <span className="text-xs font-black uppercase text-slate-400">Valeur de Démo</span>
                                                                    <span className="text-lg font-black text-amber-500">EXCEPTIONNELLE</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-10 bg-indigo-600 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-indigo-200">
                                                            <Award className="h-16 w-16 opacity-30" />
                                                            <div className="space-y-4">
                                                                <h4 className="text-2xl font-black leading-none uppercase tracking-tighter">Prêt pour le déploiement ?</h4>
                                                                <p className="text-sm font-medium text-indigo-100 italic opacity-80 leading-relaxed italic">
                                                                    "Cette démonstration confirme la supériorité d&apos;Avocat Pro Elite sur toutes les solutions du marché africain."
                                                                </p>
                                                            </div>
                                                            <Button
                                                                onClick={() => setActiveScenario(null)}
                                                                className="w-full h-14 bg-white text-indigo-600 rounded-2xl font-black text-lg gap-2 mt-8"
                                                            >
                                                                Terminer & Retour au Hub
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                            <div className="flex items-center gap-6">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partager cette Simulation :</span>
                                                <div className="flex gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400"><Smartphone className="h-4 w-4" /></div>
                                                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400"><Layout className="h-4 w-4" /></div>
                                                </div>
                                            </div>
                                            {step < 4 && (
                                                <Button
                                                    onClick={nextStep}
                                                    className="h-14 px-12 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all gap-3"
                                                >
                                                    Continuer l&apos;Aventure LexElite
                                                    <ArrowRight className="h-5 w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    )
}
