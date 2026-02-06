
"use client"

import { useState, useMemo } from "react"
import {
    Zap,
    ShieldAlert,
    Target,
    Share2,
    Swords,
    Clock,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Search,
    BrainCircuit,
    Activity,
    ShieldCheck,
    Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface LexStrategyProps {
    dossierId: string
    onClose?: () => void
}

export function LexStrategy({ dossierId, onClose }: LexStrategyProps) {
    const [activeTab, setActiveTab] = useState("neural")
    const [simStep, setSimStep] = useState(0)

    const argumentNodes = [
        { id: 1, type: 'FACT', label: "Versement 50M CFA", color: "bg-blue-500", x: 100, y: 50 },
        { id: 2, type: 'EVIDENCE', label: "Relevé bancaire (DOC. 04)", color: "bg-emerald-500", x: 50, y: 150 },
        { id: 3, type: 'CLAIM', label: "Rupture Abusive", color: "bg-amber-500", x: 200, y: 120 },
        { id: 4, type: 'RISK', label: "Prescription 2 ans", color: "bg-rose-500", x: 300, y: 80 },
        { id: 5, type: 'STRATEGY', label: "Exception de nullité", color: "bg-violet-600", x: 150, y: 220 },
    ]

    const connections = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 3, to: 4 },
        { from: 3, to: 5 },
    ]

    return (
        <div className="bg-[#0c0c14] text-slate-100 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden border-l border-indigo-500/20">
            {/* Header - Ultra Premium Noir/Or */}
            <div className="p-6 border-b border-indigo-500/20 bg-gradient-to-r from-[#0c0c14] to-[#1a1a2e] sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
                        <BrainCircuit className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-white tracking-tighter flex items-center gap-2">
                            LEX STRATEGY <span className="text-indigo-400">WAR ROOM</span>
                        </h3>
                        <p className="text-[10px] text-indigo-300/60 font-black uppercase tracking-[0.2em]">Adversarial Intelligence & Tactical Mapping</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/5 rounded-full h-10 w-10 text-slate-500 hover:text-white">
                        <XIcon className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-6 py-2 bg-[#0c0c14] border-b border-indigo-500/10">
                    <TabsList className="bg-white/5 p-1 border border-white/5 rounded-xl w-full">
                        <TabsTrigger value="neural" className="flex-1 gap-2 font-black text-[10px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all uppercase tracking-widest">
                            <Share2 className="h-3 w-3" /> Neural Map
                        </TabsTrigger>
                        <TabsTrigger value="redteam" className="flex-1 gap-2 font-black text-[10px] data-[state=active]:bg-rose-600 data-[state=active]:text-white rounded-lg transition-all uppercase tracking-widest">
                            <Swords className="h-3 w-3" /> Red Team
                        </TabsTrigger>
                        <TabsTrigger value="moves" className="flex-1 gap-2 font-black text-[10px] data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg transition-all uppercase tracking-widest">
                            <Target className="h-3 w-3" /> Tactical Moves
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <TabsContent value="neural" className="h-full m-0 p-0 outline-none">
                        <div className="h-full relative bg-[#0c0c14]">
                            {/* Grid Background */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }} />

                            {/* SVG Connections */}
                            <svg className="absolute inset-0 w-full h-full">
                                {connections.map((conn, idx) => {
                                    const from = argumentNodes.find(n => n.id === conn.from)!
                                    const to = argumentNodes.find(n => n.id === conn.to)!
                                    return (
                                        <motion.line
                                            key={idx}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1, delay: idx * 0.2 }}
                                            x1={from.x + 50} y1={from.y + 25}
                                            x2={to.x + 50} y2={to.y + 25}
                                            stroke="#4f46e5"
                                            strokeWidth="2"
                                            strokeDasharray="5,5"
                                            className="opacity-40"
                                        />
                                    )
                                })}
                            </svg>

                            {/* Nodes */}
                            {argumentNodes.map((node) => (
                                <motion.div
                                    key={node.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: node.id * 0.1 }}
                                    style={{ left: node.x, top: node.y }}
                                    className="absolute"
                                >
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-2xl border shadow-xl backdrop-blur-md flex flex-col gap-1 min-w-[140px] group cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all",
                                        "bg-neutral-900/80 border-white/10"
                                    )}>
                                        <Badge className={cn("text-[8px] font-black tracking-widest uppercase w-fit", node.color)}>
                                            {node.type}
                                        </Badge>
                                        <p className="text-[11px] font-bold text-white leading-tight">{node.label}</p>
                                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-500 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </motion.div>
                            ))}

                            {/* Legend / Overlay */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Neural Intelligence</p>
                                            <p className="text-xs text-slate-300 leading-tight pr-8">
                                                L'IA a détecté une connexion critique entre le **Document 04** et la prétention de **Rupture Abusive**.
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold text-[10px] gap-2">
                                                GÉNÉRER ARGUMENTAIRE <Zap className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="redteam" className="h-full m-0 p-0 outline-none overflow-hidden">
                        <ScrollArea className="h-full bg-gradient-to-b from-[#0c0c14] to-[#1a0f0f]/30">
                            <div className="p-8 space-y-8">
                                <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
                                    <div className="h-20 w-20 rounded-full bg-rose-500/10 border-2 border-rose-500/50 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                                        <Swords className="h-10 w-10 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white tracking-tight uppercase">Simulation Adversaire</h4>
                                        <p className="text-xs text-slate-400 font-medium">L'IA simule l'angle d'attaque le plus agressif de votre adversaire.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <SimulationStep
                                        isActive={simStep >= 0}
                                        icon={<AlertTriangle className="text-rose-500" />}
                                        title="L'ANGLE D'ATTAQUE"
                                        text="L'adversaire va exploiter le délai de 48h entre la notification et le versement pour plaider la mauvaise foi."
                                        severity="CRITIQUE"
                                    />
                                    <SimulationStep
                                        isActive={simStep >= 1}
                                        icon={<ShieldCheck className="text-emerald-500" />}
                                        title="VOTRE PARADE (COUNTER-MOVE)"
                                        text="Opposer l'article 31 du code des obligations : l'erreur matérielle invoquée dès la découverte."
                                        severity="OPTIMAL"
                                    />
                                    <SimulationStep
                                        isActive={simStep >= 2}
                                        icon={<Star className="text-amber-500" />}
                                        title="PIÈGE POTENTIEL"
                                        text="Attention à la production du témoin 'X' qui pourrait contredire la présence physique du client au cabinet."
                                        severity="VIGILANCE"
                                    />
                                </div>

                                {simStep < 2 && (
                                    <Button
                                        onClick={() => setSimStep(s => s + 1)}
                                        className="w-full h-14 bg-rose-600 hover:bg-rose-700 font-black tracking-widest text-xs uppercase shadow-xl shadow-rose-900/20"
                                    >
                                        DÉVOILER LA PROCHAINE ATTAQUE <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="moves" className="h-full m-0 p-0 outline-none">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <TacticalMove
                                        title="DÉPLOIEMENT : OFFENSIVE FONCIÈRE"
                                        status="RECOMMANDÉ"
                                        score={92}
                                        desc="Lancer l'assignation en référé immédiatement pour bloquer les travaux."
                                    />
                                    <TacticalMove
                                        title="OPTION : NÉGOCIATION SOUS RÉSERVE"
                                        status="SECOND CHOIX"
                                        score={65}
                                        desc="Proposer un règlement amiable, mais seulement après avoir déposé les conclusions."
                                    />
                                    <TacticalMove
                                        title="POSTURE : SILENCE STRATÉGIQUE"
                                        status="DANGEREUX"
                                        score={21}
                                        desc="Attendre la fin du délai d'appel. Risque de forclusion trop élevé."
                                    />
                                </div>

                                <div className="p-6 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 mt-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Activity className="h-5 w-5 text-indigo-400" />
                                        <h5 className="font-black text-xs uppercase tracking-widest text-white">Impact Procédural</h5>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                            <span>Pression Judiciaire</span>
                                            <span className="text-indigo-400">Fort</span>
                                        </div>
                                        <Progress value={85} className="h-1.5 bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </div>
            </Tabs>

            {/* Bottom Glow */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-indigo-500/20 blur-[100px] pointer-events-none rounded-full" />
        </div>
    )
}

function SimulationStep({ isActive, icon, title, text, severity }: { isActive: boolean, icon: React.ReactNode, title: string, text: string, severity: string }) {
    if (!isActive) return null
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all shadow-lg"
        >
            <div className="h-12 w-12 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                {icon}
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{title}</h5>
                    <Badge variant="outline" className={cn(
                        "text-[8px] font-black border-none",
                        severity === 'CRITIQUE' ? "bg-rose-500/10 text-rose-500" :
                            severity === 'OPTIMAL' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>{severity}</Badge>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{text}</p>
            </div>
        </motion.div>
    )
}

function TacticalMove({ title, status, score, desc }: { title: string, status: string, score: number, desc: string }) {
    return (
        <div className="p-6 rounded-[2.5rem] bg-neutral-900/50 border border-white/5 hover:border-indigo-500/30 transition-all space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <Badge className="bg-white/10 text-slate-400 font-black text-[8px] tracking-widest mb-2 border-none">
                        {status}
                    </Badge>
                    <h4 className="text-sm font-black text-white tracking-tight">{title}</h4>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-white/5 flex items-center justify-center text-xs font-black text-indigo-400 shadow-xl">
                    {score}%
                </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl gap-2">
                SIMULER L'IMPACT <Zap className="h-3 w-3" />
            </Button>
        </div>
    )
}

function XIcon(props: any) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
