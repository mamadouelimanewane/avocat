"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Share2, ZoomIn, Info, Network } from "lucide-react"
import { motion } from "framer-motion"

// Mock Data for the Graph
const NODES = [
    { id: 1, type: "CLIENT", name: "Sénégal Tech SA", x: 400, y: 300, risk: "LOW" },
    { id: 2, type: "ADVERSE", name: "BTP Construction", x: 600, y: 200, risk: "HIGH" },
    { id: 3, type: "JUDGE", name: "Juge Faye", x: 500, y: 100, risk: "NEUTRAL" },
    { id: 4, type: "DOSSIER", name: "Litige Construction #22", x: 500, y: 250, risk: "CRITICAL" },
    { id: 5, type: "PERSON", name: "M. Diop (DG)", x: 300, y: 400, risk: "LOW" },
    { id: 6, type: "PERSON", name: "M. Sow (Expert)", x: 700, y: 350, risk: "NEUTRAL" },
    { id: 7, type: "DOSSIER", name: "Audit Fiscal 2025", x: 250, y: 250, risk: "LOW" },
]

const LINKS = [
    { source: 1, target: 4, label: "Partie" },
    { source: 2, target: 4, label: "Adversaire" },
    { source: 4, target: 3, label: "Préside" },
    { source: 5, target: 1, label: "Dirige" },
    { source: 6, target: 4, label: "Expertise" },
    { source: 6, target: 2, label: "Ancien Salarié (!!)" }, // Conflict Alert
    { source: 1, target: 7, label: "Client" },
]

export function NexusGraph() {
    const [selectedNode, setSelectedNode] = useState<any>(null)

    return (
        <Card className="border-none shadow-2xl bg-slate-950 text-white overflow-hidden h-[600px] relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-indigo-900/50 bg-slate-950/50 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-400">
                            <Network className="h-6 w-6" />
                            Nexus Graph™ (Intelligence Relationnelle)
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Visualisation des liens cachés et détection des conflits d'intérêts.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300">
                            <Search className="h-4 w-4 mr-2" /> Scanner une entité
                        </Button>
                        <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <div className="relative w-full h-full overflow-hidden bg-slate-950">
                {/* SVG Graph Visualization */}
                <svg className="w-full h-full" viewBox="0 0 1000 600">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                    </defs>

                    {/* Links */}
                    {LINKS.map((link, i) => {
                        const source = NODES.find(n => n.id === link.source)
                        const target = NODES.find(n => n.id === link.target)
                        if (!source || !target) return null

                        const isRisk = link.label.includes("!!")

                        return (
                            <g key={i} className="group cursor-pointer">
                                <line
                                    x1={source.x} y1={source.y}
                                    x2={target.x} y2={target.y}
                                    stroke={isRisk ? "#f43f5e" : "#475569"}
                                    strokeWidth={isRisk ? 2 : 1}
                                    strokeDasharray={isRisk ? "5,5" : "0"}
                                    className="transition-all duration-500 group-hover:stroke-indigo-500 group-hover:stroke-[2px]"
                                />
                                {/* Label background */}
                                <rect
                                    x={(source.x + target.x) / 2 - 30}
                                    y={(source.y + target.y) / 2 - 10}
                                    width="60" height="20"
                                    rx="4"
                                    fill="#0f172a"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                                <text
                                    x={(source.x + target.x) / 2}
                                    y={(source.y + target.y) / 2}
                                    dy="4"
                                    textAnchor="middle"
                                    className={`text-[10px] font-medium fill-slate-400 group-hover:fill-white transition-all ${isRisk ? 'fill-rose-500 font-bold' : ''}`}
                                >
                                    {link.label}
                                </text>
                            </g>
                        )
                    })}

                    {/* Nodes */}
                    {NODES.map((node) => (
                        <g
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className="group cursor-pointer hover:scale-110 transition-transform duration-300 origin-center"
                            style={{ transformBox: 'fill-box' }}
                        >
                            {/* Glow Effect */}
                            <circle
                                cx={node.x} cy={node.y} r="30"
                                className={`opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${node.type === 'DOSSIER' ? 'fill-indigo-500' :
                                        node.type === 'ADVERSE' ? 'fill-rose-500' :
                                            'fill-indigo-500'
                                    }`}
                            />

                            {/* Main Circle */}
                            <circle
                                cx={node.x} cy={node.y} r="20"
                                className={`stroke-2 ${node.type === 'DOSSIER' ? 'fill-slate-900 stroke-indigo-500' :
                                        node.type === 'ADVERSE' ? 'fill-slate-900 stroke-rose-500' :
                                            node.type === 'JUDGE' ? 'fill-slate-900 stroke-amber-500' :
                                                'fill-slate-800 stroke-slate-600'
                                    }`}
                            />

                            {/* Icon or Initial mockup */}
                            <text
                                x={node.x} y={node.y} dy="5"
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-white pointer-events-none"
                            >
                                {node.type === 'DOSSIER' ? 'D' : node.name.charAt(0)}
                            </text>

                            {/* Label */}
                            <text
                                x={node.x} y={node.y + 35}
                                textAnchor="middle"
                                className="text-[10px] fill-slate-400 group-hover:fill-indigo-300 transition-colors font-medium tracking-wide"
                            >
                                {node.name}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Info Panel Overlay */}
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-20 right-4 w-64 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-xl"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="border-indigo-500 text-indigo-400">{selectedNode.type}</Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedNode(null)}>×</Button>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1">{selectedNode.name}</h3>
                        <p className="text-xs text-slate-400 mb-4">ID: #{selectedNode.id} • Risk Level: {selectedNode.risk}</p>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-300 uppercase">Connexions détectées :</p>
                            <ul className="text-xs text-slate-400 space-y-1">
                                {LINKS.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).map((l, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                        {l.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 h-8 text-xs">
                            <ZoomIn className="mr-2 h-3 w-3" /> Analyser en détail
                        </Button>
                    </motion.div>
                )}

                <div className="absolute bottom-4 left-4">
                    <div className="bg-slate-900/80 px-3 py-1.5 rounded-full flex gap-4 text-[10px] font-medium text-slate-400 border border-slate-800">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Dossier</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Magistrat</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> Partie Adverse</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600" /> Personne/Client</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
