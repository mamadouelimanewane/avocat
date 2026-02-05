"use client"

import { useState } from "react"
import {
    Network,
    Search,
    Users,
    Building2,
    AlertTriangle,
    ShieldCheck,
    Maximize2,
    Filter,
    MoreVertical,
    Zap,
    ArrowUpRight,
    User,
    ExternalLink,
    Target,
    XCircle,
    CheckCircle2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data for Graph (Nodes and Links)
const NODES = [
    { id: 1, label: "Orange Sénégal", type: "CLIENT", x: 400, y: 300, color: "bg-indigo-600", icon: <Building2 className="h-6 w-6" /> },
    { id: 2, label: "Me Fall", type: "ASSOCIÉ", x: 250, y: 150, color: "bg-slate-900", icon: <User className="h-4 w-4" /> },
    { id: 3, label: "Groupe Wave", type: "ADVERSE", x: 550, y: 150, color: "bg-rose-500", icon: <Building2 className="h-4 w-4" />, conflict: true },
    { id: 4, label: "Holding Africa", type: "ENTITÉ", x: 400, y: 100, color: "bg-slate-400", icon: <Building2 className="h-4 w-4" /> },
    { id: 5, label: "Me Diop", type: "ASSOCIÉ", x: 300, y: 450, color: "bg-slate-900", icon: <User className="h-4 w-4" /> },
]

const LINKS = [
    { from: 2, to: 1, label: "RESPONSABLE" },
    { from: 1, to: 4, label: "FILIALE 45%" },
    { from: 3, to: 4, label: "ACTIONNAIRE 12%" },
    { from: 5, to: 1, label: "CO-CONSEIL" },
]

export default function LexGraphPage() {
    const [selectedNode, setSelectedNode] = useState<any>(NODES[0])

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* LexGraph Header: Intelligence & Network vibe */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white">
                        <Network className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LexGraph : Cartographie d&apos;Influence</h1>
                        <p className="text-slate-500 font-medium italic">Analyse de réseau, détection de conflits & mapping de holding (Inspiré Palantir Gotham).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white font-bold rounded-xl shadow-sm">
                        <Filter className="h-4 w-4 mr-2" /> Paramètres Graphe
                    </Button>
                    <Button className="h-12 px-8 bg-indigo-900 text-white hover:bg-slate-800 shadow-xl font-bold rounded-xl">
                        <Zap className="h-4 w-4 mr-2" /> Analyser Conflit IA
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[800px]">

                {/* Graph Canvas Area (8 columns) */}
                <div className="xl:col-span-8 bg-white rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden group">
                    {/* Legend & Tools */}
                    <div className="absolute top-8 left-8 z-10 space-y-4">
                        <Card className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border-slate-100 shadow-lg space-y-4 w-48">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-indigo-600" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clients Actifs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-rose-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parties Adverses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-slate-900" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Associés</span>
                            </div>
                        </Card>
                    </div>

                    <div className="absolute top-8 right-8 z-10 flex flex-col gap-2">
                        <Button size="icon" variant="outline" className="h-10 w-10 bg-white rounded-xl shadow-lg hover:bg-slate-50"><Maximize2 className="h-4 w-4" /></Button>
                        <Button size="icon" variant="outline" className="h-10 w-10 bg-white rounded-xl shadow-lg hover:bg-slate-50"><Search className="h-4 w-4" /></Button>
                    </div>

                    {/* Simulated Graph (SVG) */}
                    <svg className="w-full h-full cursor-grab active:cursor-grabbing bg-[#fafbfc]">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                            </marker>
                        </defs>

                        {/* Lines (Links) */}
                        {LINKS.map((link, i) => {
                            const fromNode = NODES.find(n => n.id === link.from)!
                            const toNode = NODES.find(n => n.id === link.to)!
                            return (
                                <g key={i}>
                                    <line
                                        x1={fromNode.x} y1={fromNode.y}
                                        x2={toNode.x} y2={toNode.y}
                                        stroke="#cbd5e1" strokeWidth="2"
                                        markerEnd="url(#arrowhead)"
                                        strokeDasharray={fromNode.id === 3 || toNode.id === 3 ? "5,5" : ""}
                                        className={(fromNode.id === 3 || toNode.id === 3) ? "stroke-rose-300 animate-[dash_20s_linear_infinite]" : ""}
                                    />
                                    <text
                                        x={(fromNode.x + toNode.x) / 2}
                                        y={(fromNode.y + toNode.y) / 2 - 10}
                                        textAnchor="middle"
                                        className="text-[8px] font-black fill-slate-300 uppercase tracking-widest"
                                    >
                                        {link.label}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Nodes (Circles) */}
                        {NODES.map((node) => (
                            <g
                                key={node.id}
                                transform={`translate(${node.x},${node.y})`}
                                onClick={() => setSelectedNode(node)}
                                className="cursor-pointer group/node"
                            >
                                {node.conflict && (
                                    <circle r="45" className="fill-rose-500/10 animate-pulse" />
                                )}
                                <circle
                                    r="35"
                                    className={`${node.color} shadow-2xl transition-all duration-300 group-hover/node:r-[40] ${selectedNode?.id === node.id ? 'ring-[6px] ring-indigo-200' : 'ring-4 ring-white'}`}
                                />
                                <foreignObject x="-15" y="-15" width="30" height="30">
                                    <div className="flex items-center justify-center text-white">
                                        {node.icon}
                                    </div>
                                </foreignObject>
                                <text
                                    y="50"
                                    textAnchor="middle"
                                    className="text-[10px] font-black fill-slate-900 group-hover/node:fill-indigo-600 transition-colors uppercase tracking-widest"
                                >
                                    {node.label}
                                </text>
                                <text
                                    y="62"
                                    textAnchor="middle"
                                    className="text-[8px] font-bold fill-slate-400 uppercase tracking-widest"
                                >
                                    {node.type}
                                </text>
                            </g>
                        ))}
                    </svg>

                    {/* Bottom Scan Toast */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center gap-6 z-10 ring-4 ring-white/10">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest">Statut: Analyse de conflits active</span>
                        </div>
                        <div className="w-px h-4 bg-white/20" />
                        <span className="text-[10px] font-bold text-slate-400">Dernière indexation des holdings: Aujourd&apos;hui, 11:05</span>
                    </div>
                </div>

                {/* Node Sidebar (4 columns) */}
                <div className="xl:col-span-4 space-y-6">
                    <Card className="rounded-[3rem] border-slate-100 shadow-xl bg-white overflow-hidden flex flex-col h-full">
                        <ScrollArea className="flex-1">
                            {selectedNode ? (
                                <div className="p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex flex-col items-center text-center space-y-6">
                                        <div className={`h-24 w-24 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl ${selectedNode.color} ring-8 ring-slate-50`}>
                                            {selectedNode.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedNode.label}</h2>
                                            <Badge variant="outline" className="mt-2 text-[10px] font-black px-4 py-1 border-slate-200">{selectedNode.type}</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Relations Directes</span>
                                            <span className="bg-slate-50 px-2 py-1 rounded">
                                                {LINKS.filter(l => l.from === selectedNode.id || l.to === selectedNode.id).length}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {LINKS.filter(l => l.from === selectedNode.id || l.to === selectedNode.id).map((link, i) => {
                                                const target = NODES.find(n => n.id === (link.from === selectedNode.id ? link.to : link.from))!
                                                return (
                                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-lg transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-sm ${target.color}`}>
                                                                {target.id === 3 ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{link.label}</p>
                                                                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{target.label}</p>
                                                            </div>
                                                        </div>
                                                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {selectedNode.conflict && (
                                        <Card className="rounded-[2.5rem] bg-rose-50 border-rose-100 p-8 space-y-4 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <AlertTriangle className="h-10 w-10 text-rose-600" />
                                            </div>
                                            <h4 className="text-sm font-black text-rose-700 uppercase tracking-widest flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4" /> Alerte Conflit IA
                                            </h4>
                                            <p className="text-xs text-rose-600 leading-relaxed font-bold">
                                                Conflit de Holding détecté. L'entité **"Groupe Wave"** possède une participation croisée via **"Holding Africa"** qui est un client du cabinet dans un dossier de propriété intellectuelle.
                                            </p>
                                            <Button className="w-full bg-rose-600 text-white font-black h-11 rounded-xl shadow-lg shadow-rose-100 uppercase text-[10px] tracking-widest">
                                                Ouvrir Procédure Éthique
                                            </Button>
                                        </Card>
                                    )}

                                    <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="h-12 rounded-xl text-xs font-black uppercase tracking-widest border-slate-200">Dossier Complet</Button>
                                        <Button variant="outline" className="h-12 rounded-xl text-xs font-black uppercase tracking-widest border-slate-200"><ExternalLink className="h-4 w-4 mr-2" /> RCCM</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-40">
                                    <Network className="h-16 w-16 mb-6" />
                                    <h3 className="text-sm font-black uppercase tracking-widest">Sélectionnez un noeud</h3>
                                </div>
                            )}
                        </ScrollArea>
                    </Card>
                </div>

            </div>

        </div>
    )
}
