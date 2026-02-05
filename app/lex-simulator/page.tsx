"use client"

import { useState, useRef, useEffect } from "react"
import {
    MessageSquare,
    User,
    Bot,
    Send,
    Zap,
    Gavel,
    AlertTriangle,
    CheckCircle2,
    Plus,
    X,
    History,
    MoreVertical,
    Volume2,
    Trash2,
    ListCheck,
    ChevronRight,
    Sparkles
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data for Simulator
const INITIAL_MESSAGES = [
    { id: 1, role: 'system', content: 'Simulation initialisée. Je suis Me Bamba, avocat de la partie adverse. Soumettez votre argument principal pour que je puisse le contester.' },
]

export default function LexSimulatorPage() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES)
    const [input, setInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return

        const userMsg = { id: Date.now(), role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsThinking(true)

        // Simulate Adversarial AI response
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: 'ai',
                content: "Monsieur le Juge, l&apos;argument de mon confrère ne tient pas. L&apos;Article 1134 du Code Civil (version OHADA) stipule clairement que les conventions légalement formées tiennent lieu de loi. Or, le document cité n&apos;a jamais été paraphé sur cette page cruciale. C&apos;est une nullité relative évidente."
            }
            setMessages(prev => [...prev, aiMsg])
            setIsThinking(false)
        }, 2000)
    }

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans">

            {/* LexSimulator Header: Duel & Drama vibe */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-100 ring-4 ring-white">
                        <Gavel className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LexSimulator : Duel de Plaidoirie</h1>
                        <p className="text-slate-500 font-medium italic">Simulateur de partie adverse & Stress-test d&apos;arguments (Inspiré CaseText Parallel Search).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white font-bold rounded-xl shadow-sm">
                        <History className="h-4 w-4 mr-2" /> Historique Duels
                    </Button>
                    <Button className="h-12 px-8 bg-rose-600 text-white hover:bg-rose-700 shadow-xl font-bold rounded-xl">
                        <Zap className="h-4 w-4 mr-2" /> Nouvelle Confrontation
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[800px]">

                {/* Left: Chat/Arena (8 columns) */}
                <div className="xl:col-span-8 flex flex-col h-full bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative">
                    {/* Duel Header */}
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <div className="h-12 w-12 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center text-white font-black">MOI</div>
                                <div className="h-12 w-12 rounded-full bg-rose-600 border-4 border-white flex items-center justify-center text-white font-black ring-4 ring-transparent animate-pulse">ADV</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Scénario: Litige Commercial</h3>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Moteur: Adversarial-GPT-4 Pro</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[10px] uppercase px-4 py-1">Mode Combat Actif</Badge>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><Settings2 className="h-5 w-5" /></Button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <ScrollArea className="flex-1 p-10 bg-slate-50/30">
                        <div className="space-y-8 pb-10">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                    <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${msg.role === 'user' ? 'bg-slate-900 text-white' :
                                                msg.role === 'ai' ? 'bg-rose-600 text-white' : 'bg-indigo-100 text-indigo-600'
                                            }`}>
                                            {msg.role === 'user' ? <User className="h-5 w-5" /> :
                                                msg.role === 'ai' ? <Gavel className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                        </div>
                                        <div className={`p-6 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' :
                                                msg.role === 'ai' ? 'bg-white text-slate-800 border-l-4 border-l-rose-500 rounded-tl-none' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {msg.content}
                                            {msg.role === 'ai' && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
                                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-black text-rose-400 uppercase tracking-widest gap-1"><Volume2 className="h-3 w-3" /> Audio</Button>
                                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest gap-1"><Sparkles className="h-3 w-3" /> Analyser Faille</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start animate-pulse">
                                    <div className="flex gap-4 items-center">
                                        <div className="h-10 w-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-300"><Bot className="h-5 w-5" /></div>
                                        <div className="bg-white p-4 rounded-full flex gap-1">
                                            <span className="h-1.5 w-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="h-1.5 w-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="h-1.5 w-1.5 bg-rose-400 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Footer */}
                    <div className="p-8 bg-white border-t border-slate-50 relative">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-slate-50 rounded-[2rem] px-6 py-2 border border-slate-100 flex items-center gap-4 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    placeholder="Déclamez votre argument de plaidoirie ici..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold min-h-[50px] py-3 resize-none"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="h-12 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform shrink-0"
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between px-4">
                            <div className="flex gap-4">
                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Charger Conclusions Adverses</button>
                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Style: Me Bamba (Agressif)</button>
                            </div>
                            <span className="text-[10px] font-black text-slate-300">Pression Intellectuelle: 8.5/10</span>
                        </div>
                    </div>
                </div>

                {/* Right: Tactics & Analysis (4 columns) */}
                <div className="xl:col-span-4 space-y-6 flex flex-col h-full">
                    <Card className="rounded-[3rem] bg-slate-900 text-white p-8 flex-1 flex flex-col shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 rounded-bl-[100px]" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <ListCheck className="h-6 w-6 text-emerald-400" />
                                <h3 className="text-sm font-black uppercase tracking-widest">Analyse de Faille IA</h3>
                            </div>

                            <div className="flex-1 space-y-8">
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-3">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">La Faille Détectée</h4>
                                    <p className="text-sm font-medium leading-relaxed italic">
                                        "Confrère, votre argument sur la nullité est brillant mais fragile car vous ignorez l&apos;exception de l&apos;Article 45 sur les contrats par tacite reconduction."
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">Stratégies de Riposte Suggérées</h4>
                                    {[
                                        { title: "Contre-attaque: Tacite Reconduction", power: 92 },
                                        { title: "Manœuvre: Demande de Renvoi", power: 45 },
                                        { title: "Pivot: Preuve par Témoins", power: 78 },
                                    ].map((s, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3 text-xs font-bold">
                                                <span className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                                                {s.title}
                                            </div>
                                            <Progress value={s.power} className="w-12 h-1 bg-white/5" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Confiance de l&apos;Argument</span>
                                    <span className="text-emerald-400">ÉLEVÉ (85%)</span>
                                </div>
                                <Progress value={85} className="h-2 bg-white/5" />
                                <Button className="w-full bg-indigo-600 h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-indigo-500/20">
                                    Générer Riposte IA
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-slate-100 bg-white p-8 space-y-4 shadow-sm border-dashed border-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Volume2 className="h-6 w-6" />
                            </div>
                            <h4 className="font-black text-slate-900 text-xs tracking-widest uppercase">Plaidoirie Vocale</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
                            Activer l&apos;IA Vocale pour écouter la riposte adverse lue par une voix synthétique mimant l&apos;autorité judiciaire.
                        </p>
                        <Button variant="outline" className="w-full h-8 px-4 rounded-xl text-[9px] font-black border-slate-200">ACTIVER AUDIO-BIXBY</Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
