
"use client"

import { useState } from "react"
import {
    GitBranch,
    GitCommit,
    Share2,
    Play,
    Plus,
    Save,
    ZoomIn,
    ZoomOut,
    Move,
    Split,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Copy,
    Trash2,
    Workflow,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface LexLogicArchitectProps {
    dossierId: string
    onClose?: () => void
}

type Node = {
    id: string
    type: 'question' | 'outcome' | 'condition'
    text: string
    x: number
    y: number
    connections: string[]
}

const INITIAL_NODES: Node[] = [
    { id: '1', type: 'question', text: 'Le contrat est-il signé par les deux parties ?', x: 50, y: 50, connections: ['2', '3'] },
    { id: '2', type: 'condition', text: 'OUI : Clause de compétence ?', x: 250, y: 0, connections: ['4'] },
    { id: '3', type: 'outcome', text: 'NON : Contrat invalide (Nullité)', x: 250, y: 150, connections: [] },
    { id: '4', type: 'outcome', text: 'Tribunal de Commerce Compétent', x: 450, y: 0, connections: [] }
]

export function LexLogicArchitect({ dossierId, onClose }: LexLogicArchitectProps) {
    const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
    const [activeNode, setActiveNode] = useState<string | null>(null)
    const [scale, setScale] = useState(1)

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - TalkingTree Style */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-cyan-500 p-2 rounded-lg shadow-md shadow-cyan-200">
                        <GitBranch className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-cyan-500">Tree</span> Architect
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Decision Logic Builder</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <XCircle className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Toolbar */}
            <div className="bg-white border-b border-slate-100 p-2 flex items-center justify-between shadow-sm relative z-10">
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg"><Plus className="h-4 w-4" /></Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="font-bold text-xs">Add Node</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg"><Split className="h-4 w-4" /></Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="font-bold text-xs">Add Branch</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                    <Button size="sm" variant="ghost" onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="h-8 w-8 p-0 rounded-lg"><ZoomIn className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="h-8 w-8 p-0 rounded-lg"><ZoomOut className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1 text-cyan-600 border-cyan-200 bg-cyan-50 hover:bg-cyan-100">
                        <Share2 className="h-3 w-3" /> SHARE TREE
                    </Button>
                    <Button size="sm" className="h-8 text-xs font-bold gap-1 bg-slate-900 text-white shadow-lg">
                        <Play className="h-3 w-3" /> SIMULATE
                    </Button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-hidden relative bg-[url('/grid-pattern.svg')] bg-[length:20px_20px] bg-slate-50">
                {/* Canvas Controls Overlay */}
                <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <Badge variant="outline" className="bg-white font-bold text-[10px] gap-1">
                        <Workflow className="h-3 w-3 text-cyan-500" />
                        AUTO-LAYOUT
                    </Badge>
                </div>

                <div
                    className="w-full h-full relative transition-transform duration-200 ease-out origin-top-left p-8"
                    style={{ transform: `scale(${scale})` }}
                >
                    {/* Render Nodes */}
                    {nodes.map(node => (
                        <div
                            key={node.id}
                            className={cn(
                                "absolute w-64 p-4 rounded-xl border-2 shadow-lg cursor-pointer transition-all bg-white group hover:z-10",
                                node.type === 'question' ? "border-slate-200 hover:border-blue-400" :
                                    node.type === 'condition' ? "border-amber-200 bg-amber-50/50 hover:border-amber-400" :
                                        "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400",
                                activeNode === node.id && "ring-2 ring-offset-2 ring-cyan-400 shadow-xl z-20"
                            )}
                            style={{ left: node.x, top: node.y }}
                            onClick={() => setActiveNode(node.id)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className={cn(
                                    "text-[9px] font-black uppercase tracking-wider",
                                    node.type === 'question' ? "bg-slate-100 text-slate-500" :
                                        node.type === 'condition' ? "bg-amber-100 text-amber-600" :
                                            "bg-emerald-100 text-emerald-600"
                                )}>
                                    {node.type}
                                </Badge>
                                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                    <button className="text-slate-400 hover:text-cyan-500"><Copy className="h-3 w-3" /></button>
                                    <button className="text-slate-400 hover:text-rose-500"><Trash2 className="h-3 w-3" /></button>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-snug">{node.text}</p>

                            {/* Connector Points */}
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-crosshair hover:border-cyan-500 hover:text-cyan-500 transition-all shadow-sm">
                                <ArrowRight className="h-3 w-3" />
                            </div>
                        </div>
                    ))}

                    {/* Mock Connections (SVG Lines) */}
                    <svg className="absolute inset-0 pointer-events-none w-[800px] h-[600px] overflow-visible">
                        <path d="M 320 80 C 370 80, 200 40, 260 40" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                        <path d="M 320 80 C 370 80, 200 180, 260 180" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                        <path d="M 520 40 C 570 40, 400 40, 460 40" fill="none" stroke="#cbd5e1" strokeWidth="2" />
                    </svg>
                </div>
            </div>

            {/* Footer Properties Panel */}
            <div className="bg-white border-t border-slate-200 p-4 h-48 overflow-y-auto">
                {activeNode ? (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide">Propriétés du Noeud</h4>
                            <Badge variant="outline">{activeNode}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Type de Logique</label>
                                <select className="w-full text-sm border-slate-200 rounded-lg bg-slate-50 font-medium h-9 px-2">
                                    <option>Question (Input)</option>
                                    <option>Condition (If/Else)</option>
                                    <option>Document (Generate)</option>
                                    <option>Action (Email/API)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Variable Associée</label>
                                <input className="w-full text-sm border-slate-200 rounded-lg bg-slate-50 font-medium h-9 px-2" placeholder="ex: client.married" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Texte / Question</label>
                            <textarea className="w-full text-sm border-slate-200 rounded-lg bg-slate-50 font-medium p-2 h-16 resize-none" defaultValue={nodes.find(n => n.id === activeNode)?.text} />
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <GitCommit className="h-8 w-8 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest text-center">Sélectionnez un noeud pour l'éditer</p>
                    </div>
                )}
            </div>
        </div>
    )
}
