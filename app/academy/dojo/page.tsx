"use client"

import { useState, useEffect, useRef } from "react"
import {
    Gavel,
    Mic,
    Play,
    Square,
    Trophy,
    AlertTriangle,
    Scale,
    RefreshCcw,
    HeartPulse,
    Swords,
    ScrollText,
    BrainCircuit
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Scenarios
const SCENARIOS = [
    {
        id: "foncier_bail",
        title: "Expulsion pour Impayés (Bail Commercial)",
        difficulty: "Intermédiaire",
        description: "Vous défendez le locataire (une PME) qui a 3 mois d'impayés mais invoque des travaux non faits par le bailleur.",
        opponent: "Procureur Sévère",
        initialAttack: "Maître, votre client ne paie plus depuis 90 jours. L'article 101 de l'Acte Uniforme est clair : la résiliation est de droit. Quelle est votre excuse ?"
    },
    {
        id: "penal_abus",
        title: "Abus de Confiance (Société)",
        difficulty: "Expert",
        description: "Le Gérant est accusé d'avoir utilisé le véhicule de société à des fins personnelles. Il risque la révocation et le pénal.",
        opponent: "Juge d'Instruction",
        initialAttack: "Le véhicule a été géolocalisé à Saly le weekend. C'est un détournement clair de l'actif social. Niez-vous les faits ?"
    }
]

type Message = {
    role: 'ai' | 'user'
    content: string
    scoreDelta?: number // How much this move affected the score
}

export default function DojoJuridiquePage() {
    const [activeScenario, setActiveScenario] = useState<typeof SCENARIOS[0] | null>(null)
    const [gameStatus, setGameStatus] = useState<'lobby' | 'playing' | 'feedback'>('lobby')

    // Game State
    const [convictionScore, setConvictionScore] = useState(50) // 0-100
    const [stressLevel, setStressLevel] = useState(20) // 0-100
    const [messages, setMessages] = useState<Message[]>([])
    const [userInput, setUserInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)
    const [turnCount, setTurnCount] = useState(0)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const startSession = (scenario: typeof SCENARIOS[0]) => {
        setActiveScenario(scenario)
        setGameStatus('playing')
        setConvictionScore(50)
        setStressLevel(20)
        setTurnCount(0)
        setMessages([{
            role: 'ai',
            content: scenario.initialAttack,
            scoreDelta: 0
        }])
    }

    const handleReply = async () => {
        if (!userInput.trim()) return

        // 1. User Move
        const userMsg: Message = { role: 'user', content: userInput }
        setMessages(prev => [...prev, userMsg])
        setUserInput("")
        setIsThinking(true)
        setTurnCount(prev => prev + 1)

        // Simulate Analysis & AI Response
        setTimeout(() => {
            // Mock logic for demo
            const isGoodArgument = userMsg.content.toLowerCase().includes("article") || userMsg.content.toLowerCase().includes("bonne foi") || userMsg.content.length > 50

            const scoreChange = isGoodArgument ? 15 : -10
            const newScore = Math.min(100, Math.max(0, convictionScore + scoreChange))
            setConvictionScore(newScore)

            let aiReply = ""
            if (isGoodArgument) {
                aiReply = "Mmh... l'argument de droit se tient. Mais quid du préjudice subi par la partie adverse ? Vous négligez l'équité !"
                setStressLevel(prev => Math.max(0, prev - 10))
            } else {
                aiReply = "C'est tout ce que vous avez ? Aucune base légale ! Vous plaidez l'émotion, Maître, pas le droit. Je suis déçu."
                setStressLevel(prev => Math.min(100, prev + 20))
            }

            const aiMsg: Message = { role: 'ai', content: aiReply, scoreDelta: scoreChange }
            setMessages(prev => [...prev, aiMsg])
            setIsThinking(false)

            if (turnCount >= 2) {
                setTimeout(() => setGameStatus('feedback'), 2000)
            }
        }, 1500)
    }

    if (gameStatus === 'lobby') {
        return (
            <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 px-4 py-1.5 text-sm uppercase tracking-widest mb-4">
                            <Swords className="w-4 h-4 mr-2" /> Simulateur v1.0
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
                            Le Dojo <span className="text-amber-500">Juridique</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Entraînez-vous face à une IA impitoyable. Choisissez votre arène et testez vos réflexes juridiques en conditions de stress.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {SCENARIOS.map(scenario => (
                            <Card key={scenario.id} className="bg-slate-900 border-white/10 overflow-hidden group hover:border-amber-500/50 transition-all cursor-pointer" onClick={() => startSession(scenario)}>
                                <div className="h-32 bg-slate-800 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <Badge variant="outline" className="bg-slate-950/50 border-white/20 text-white mb-2">
                                            {scenario.difficulty}
                                        </Badge>
                                        <h3 className="text-xl font-bold">{scenario.title}</h3>
                                    </div>
                                    <div className="absolute top-4 right-4 text-6xl opacity-10 font-black text-white">VS</div>
                                </div>
                                <CardContent className="p-6">
                                    <p className="text-slate-400 text-sm mb-6">{scenario.description}</p>
                                    <div className="flex items-center justify-between text-xs font-mono text-amber-500 uppercase tracking-widest">
                                        <span>Adversaire: {scenario.opponent}</span>
                                        <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                            Entrer dans l'arène <Play className="w-3 h-3 fill-current" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (gameStatus === 'feedback') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
                <Card className="max-w-2xl w-full bg-slate-900 border-white/10 p-8 text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="mx-auto w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center border-4 border-amber-500">
                        <Trophy className="w-10 h-10 text-amber-500" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">Session Terminée</h2>
                        <p className="text-slate-400">Analyse de performance pour le dossier : {activeScenario?.title}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-8 border-y border-white/5">
                        <div className="space-y-2">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Score Final</span>
                            <div className="text-4xl font-black text-emerald-500">{convictionScore}/100</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Stress</span>
                            <div className="text-4xl font-black text-rose-500">{stressLevel}%</div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Citations</span>
                            <div className="text-4xl font-black text-blue-500">2</div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl text-left">
                        <h4 className="font-bold text-amber-500 mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> Feedback de l'IA
                        </h4>
                        <p className="text-sm text-slate-300">
                            "Bonne réactivité sur l'attaque initiale. Cependant, vous manquez de références jurisprudentielles OHADA précises. N'oubliez pas l'article 101 la prochaine fois."
                        </p>
                    </div>

                    <Button onClick={() => setGameStatus('lobby')} className="w-full h-12 bg-white text-slate-900 font-bold hover:bg-slate-200">
                        <RefreshCcw className="w-4 h-4 mr-2" /> NOUVELLE SESSION
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: The Arena (Opponent) */}
            <div className="w-full md:w-2/3 p-6 flex flex-col relative">
                {/* HUD */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-2 pl-4 pr-6 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">En Direct • {activeScenario?.title}</span>
                    </div>
                </div>

                {/* Opponent Visualization */}
                <div className="flex-1 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/0 to-slate-900 pointer-events-none" />

                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-1000">
                        <div className={cn(
                            "w-48 h-48 mx-auto rounded-full border-4 flex items-center justify-center shadow-2xl relative",
                            isThinking ? "border-amber-500 shadow-amber-500/20" : "border-slate-700"
                        )}>
                            <Gavel className="w-20 h-20 text-slate-500" />
                            {isThinking && (
                                <span className="absolute -bottom-2 px-3 py-1 bg-amber-500 text-slate-900 text-[10px] font-black uppercase rounded-full animate-bounce">
                                    L'IA Réfléchit...
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{activeScenario?.opponent}</h2>
                            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Niveau de Menace: Élevé</p>
                        </div>
                    </div>
                </div>

                {/* Conversation Flow */}
                <div className="h-64 mt-4 relative">
                    <div className="absolute inset-0 overflow-y-auto px-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn(
                                "flex flex-col gap-1 max-w-[80%]",
                                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                            )}>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-slate-800 text-slate-200 border border-white/10 rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>
                                {msg.scoreDelta !== undefined && msg.scoreDelta !== 0 && (
                                    <span className={cn(
                                        "text-[10px] font-black",
                                        msg.scoreDelta > 0 ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {msg.scoreDelta > 0 ? "+" : ""}{msg.scoreDelta} Pts Impact
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel: Cockpit (User Controls) */}
            <div className="w-full md:w-1/3 bg-slate-900 border-l border-white/5 p-6 flex flex-col gap-6">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-950 border-white/5">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                                <span>Conviction</span>
                                <Scale className="w-4 h-4 text-emerald-500" />
                            </div>
                            <Progress value={convictionScore} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                            <div className="text-right text-lg font-black text-emerald-500">{convictionScore}%</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-950 border-white/5">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                                <span>Stress</span>
                                <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
                            </div>
                            <Progress value={stressLevel} className="h-2 bg-slate-800" indicatorClassName="bg-rose-500" />
                            <div className="text-right text-lg font-black text-rose-500">{stressLevel} BPM</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Input Controls */}
                <div className="flex-1 bg-slate-950/50 rounded-2xl border border-white/5 p-4 flex flex-col gap-4">
                    <div className="flex-1">
                        <Textarea
                            placeholder="Formulez votre objection ici..."
                            className="h-full bg-transparent border-none resize-none text-lg p-0 focus-visible:ring-0 placeholder:text-slate-600"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleReply()}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors">
                            <Mic className="w-5 h-5" />
                        </Button>
                        <Button
                            className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                            onClick={handleReply}
                            disabled={!userInput.trim() || isThinking}
                        >
                            PLAIDER MAINTENANT <Play className="w-4 h-4 ml-2 fill-current" />
                        </Button>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-200/80 leading-relaxed">
                        <span className="font-bold text-amber-500 block mb-1">CONSEIL TACTIQUE</span>
                        Le Juge semble insensible aux arguments émotionnels. Citez la jurisprudence OHADA pour remonter votre score.
                    </p>
                </div>

            </div>
        </div>
    )
}
