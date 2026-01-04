"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Search, Gavel, Scale, BrainCircuit, Mic2, AlertTriangle, TrendingUp, Lock } from "lucide-react"

// Mock Data
const JUDGES = [
    {
        id: 1,
        name: "Juge Seynabou FAYE",
        court: "Tribunal de Commerce - Ch. 3",
        image: "/avatars/judge1.png",
        years: 12,
        winRate: "78% (Défense)",
        avgDamages: "1.2M",
        profile: "Formaliste",
        stats: [
            { subject: 'Rigueur Procédurale', A: 100, fullMark: 100 },
            { subject: 'Sévérité (Montants)', A: 40, fullMark: 100 },
            { subject: 'Rapidité Délibéré', A: 90, fullMark: 100 },
            { subject: 'Empathie / Équité', A: 30, fullMark: 100 },
            { subject: 'Innovation', A: 50, fullMark: 100 },
            { subject: 'Patience (Audience)', A: 20, fullMark: 100 },
        ],
        insights: [
            "Rejette systématiquement les conclusions déposées après 11h la veille.",
            "Très sensible à la clarté des bordereaux de pièces.",
            "N'accorde quasi-jamais de renvoi pour 'réplique'.",
            "Déteste les effets de manche : préfère une plaidoirie technique de 5min."
        ]
    },
    {
        id: 2,
        name: "Président Amadou SOW",
        court: "TGI Dakar - Ch. Civile 1",
        image: "/avatars/judge2.png",
        years: 24,
        winRate: "45% (Défense)",
        avgDamages: "15M",
        profile: "Humaniste",
        stats: [
            { subject: 'Rigueur Procédurale', A: 60, fullMark: 100 },
            { subject: 'Sévérité (Montants)', A: 85, fullMark: 100 },
            { subject: 'Rapidité Délibéré', A: 40, fullMark: 100 },
            { subject: 'Empathie / Équité', A: 95, fullMark: 100 },
            { subject: 'Innovation', A: 80, fullMark: 100 },
            { subject: 'Patience (Audience)', A: 90, fullMark: 100 },
        ],
        insights: [
            "Juge de l'équité plus que du droit strict.",
            "Accorde facilement des dommages-intérêts élevés si la mauvaise foi est prouvée.",
            "Laisse parler longtemps, apprécie les références littéraires ou sociales.",
            "Attention : Vérifie personnellement la jurisprudence citée."
        ]
    }
]

export function JudgeProfiler() {
    const [selectedJudge, setSelectedJudge] = useState(JUDGES[0])

    return (
        <Card className="border-none shadow-2xl bg-slate-950 text-white overflow-hidden relative min-h-[600px]">
            {/* Background Tech Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-50">
                <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs">
                    <Lock className="h-3 w-3" />
                    CONFIDENTIAL / ATTORNEY EYES ONLY
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                {/* Left Panel: List */}
                <div className="lg:col-span-3 bg-slate-900/50 border-r border-slate-800 p-4">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                            <BrainCircuit className="h-5 w-5" />
                            Magistrat Intel
                        </h3>
                        <p className="text-xs text-slate-500">Base de données de profilage.</p>
                    </div>

                    <div className="space-y-3">
                        {JUDGES.map(judge => (
                            <div
                                key={judge.id}
                                onClick={() => setSelectedJudge(judge)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedJudge.id === judge.id
                                        ? 'bg-indigo-600/20 border-indigo-500'
                                        : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-slate-600">
                                        <AvatarImage src={judge.image} />
                                        <AvatarFallback className="bg-slate-700 text-xs font-bold">{judge.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold text-slate-100">{judge.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate w-32">{judge.court}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full text-xs border-dashed border-slate-700 text-slate-500 hover:text-white hover:bg-slate-800">
                            + Ajouter un profil
                        </Button>
                    </div>
                </div>

                {/* Center Panel: Profile & Radar */}
                <div className="lg:col-span-6 p-6 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">{selectedJudge.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="border-indigo-500 text-indigo-400 bg-indigo-500/10">
                                    {selectedJudge.profile}
                                </Badge>
                                <span className="text-sm text-slate-400">{selectedJudge.court} • {selectedJudge.years} ans d'xp</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">LexAI Win Rate</p>
                            <p className="text-2xl font-bold text-emerald-400">{selectedJudge.winRate}</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedJudge.stats}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name={selectedJudge.name}
                                    dataKey="A"
                                    stroke="#818cf8"
                                    strokeWidth={2}
                                    fill="#6366f1"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <BrainCircuit className="h-12 w-12 text-indigo-500/10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <p className="text-[10px] text-slate-400 uppercase">Ticket Moyen (D.I.)</p>
                            <p className="text-xl font-bold text-white">{selectedJudge.avgDamages}</p>
                            <p className="text-[10px] text-slate-500">FCFA (Faible vs Moyenne)</p>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <p className="text-[10px] text-slate-400 uppercase">Durée Moyenne</p>
                            <p className="text-xl font-bold text-white">4.2 Mois</p>
                            <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Rapide
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Intelligence & Strategy */}
                <div className="lg:col-span-3 bg-slate-900/30 border-l border-slate-800 p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            Insights Critiques
                        </h4>
                        <ul className="space-y-3">
                            {selectedJudge.insights.map((insight, idx) => (
                                <li key={idx} className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-slate-700">
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <h4 className="text-sm font-bold text-indigo-400 uppercase flex items-center gap-2 mb-3">
                            <Mic2 className="h-4 w-4" />
                            Stratégie Conseillée
                        </h4>
                        <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/30 text-xs text-indigo-200">
                            {selectedJudge.id === 1 ? (
                                "Adoptez une posture technique. Citez précisément les articles du Code. Évitez le pathos. Soyez bref et fournissez un dossier de pièces impeccablement numéroté."
                            ) : (
                                "Jouez sur l'équité et la bonne foi. Prenez le temps d'expliquer le contexte humain. N'hésitez pas à invoquer les principes généraux du droit."
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
