
"use client"

import { useState } from "react"
import {
    Palette,
    Share2,
    Download,
    Type,
    Layout,
    Image as ImageIcon,
    PenTool,
    Wand2,
    Undo2,
    Redo2,
    Layers,
    AlignLeft,
    Square,
    Circle,
    Triangle,
    Minus,
    MoreHorizontal,
    Move3d,
    Network
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface LexDesignStudioProps {
    dossierId: string
    onClose?: () => void
}

export function LexDesignStudio({ dossierId, onClose }: LexDesignStudioProps) {
    const [selectedTool, setSelectedTool] = useState("timeline")
    const [zoom, setZoom] = useState(100)

    const timelineEvents = [
        { year: "2023", month: "Juin", title: "Signature du Contrat", type: "contract" },
        { year: "2023", month: "Nov", title: "Premier Incident", type: "alert" },
        { year: "2024", month: "Jan", title: "Rupture Brutale", type: "legal" },
    ]

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - Haiku Design Style */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-pink-500 p-2 rounded-lg shadow-md shadow-pink-200">
                        <PenTool className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-pink-500">Design</span> Studio
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Visual Legal Design</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <Redo2 className="h-4 w-4" />
                    </Button>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Toolbox Bar */}
            <div className="bg-white border-b border-slate-100 p-2 flex items-center gap-4 shadow-sm z-10 px-4">
                <ToolGroup>
                    <ToolButton icon={<Layout className="h-4 w-4" />} active={selectedTool === 'timeline'} onClick={() => setSelectedTool('timeline')} label="Timeline" />
                    <ToolButton icon={<Network className="h-4 w-4" />} active={selectedTool === 'network'} onClick={() => setSelectedTool('network')} label="Org Chart" />
                    <ToolButton icon={<Move3d className="h-4 w-4" />} active={selectedTool === 'flow'} onClick={() => setSelectedTool('flow')} label="Flowchart" />
                </ToolGroup>
                <div className="h-6 w-[1px] bg-slate-200" />
                <ToolGroup>
                    <ToolButton icon={<Square className="h-4 w-4" />} active={false} onClick={() => { }} />
                    <ToolButton icon={<Circle className="h-4 w-4" />} active={false} onClick={() => { }} />
                    <ToolButton icon={<Triangle className="h-4 w-4" />} active={false} onClick={() => { }} />
                    <ToolButton icon={<Minus className="h-4 w-4" />} active={false} onClick={() => { }} />
                </ToolGroup>
                <div className="h-6 w-[1px] bg-slate-200" />
                <ToolGroup>
                    <ToolButton icon={<Type className="h-4 w-4" />} active={false} onClick={() => { }} />
                    <ToolButton icon={<ImageIcon className="h-4 w-4" />} active={false} onClick={() => { }} />
                </ToolGroup>
                <div className="flex-1" />
                <div className="flex items-center gap-2 w-32">
                    <span className="text-[10px] font-bold text-slate-400">{zoom}%</span>
                    <Slider defaultValue={[100]} max={200} step={10} className="h-4" />
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-[url('/grid-dot.svg')] bg-[length:20px_20px] bg-slate-50 relative overflow-hidden flex items-center justify-center p-8">

                {/* Floating Properties Panel */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg w-64 p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-black uppercase text-slate-500">Propriétés</span>
                        <Palette className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                            <span>Thème</span>
                            <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-100">Haiku Clean</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            <ColorSwatch color="bg-slate-900" />
                            <ColorSwatch color="bg-pink-500" />
                            <ColorSwatch color="bg-emerald-500" />
                            <ColorSwatch color="bg-blue-500" />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] font-bold">SOLID</Button>
                            <Button size="sm" variant="secondary" className="flex-1 h-8 text-[10px] font-bold bg-slate-100">OUTLINE</Button>
                        </div>
                    </div>
                </div>

                {/* THE ARTBOARD (Visual Representation) */}
                <div className="bg-white shadow-2xl w-full max-w-3xl aspect-video rounded-xl p-8 relative flex items-center justify-center">
                    {selectedTool === 'timeline' && (
                        <div className="w-full relative">
                            {/* Timeline Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />

                            {/* Events */}
                            <div className="flex justify-between relative z-10 px-8">
                                {timelineEvents.map((event, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
                                        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 -mt-16 opacity-0 group-hover:opacity-100 transition-all absolute -top-4 w-32 text-center">
                                            <p className="text-[10px] font-black uppercase text-slate-400">{event.year}</p>
                                            <p className="text-xs font-bold text-slate-800">{event.title}</p>
                                        </div>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-125 z-10",
                                            event.type === 'contract' ? "bg-emerald-500" :
                                                event.type === 'alert' ? "bg-amber-500" : "bg-pink-500"
                                        )} />
                                        <div className="text-center">
                                            <p className="text-xs font-black text-slate-900">{event.month}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{event.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTool === 'network' && (
                        <div className="relative w-full h-full">
                            <Node text="Holding SAS" x="50%" y="20%" type="entity" />
                            <Node text="Filiale A" x="30%" y="60%" type="sub" />
                            <Node text="Filiale B" x="70%" y="60%" type="sub" />
                            {/* Mock SVG Connections */}
                            <svg className="absolute inset-0 pointer-events-none w-full h-full">
                                <line x1="50%" y1="28%" x2="33%" y2="55%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                                <line x1="50%" y1="28%" x2="67%" y2="55%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center">
                <Button variant="ghost" className="text-slate-500 font-bold text-xs gap-2">
                    <Wand2 className="h-4 w-4" /> AI Suggest
                </Button>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-slate-200 shadow-sm text-slate-700">
                        <Share2 className="h-4 w-4 mr-2" /> PARTAGER
                    </Button>
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-lg shadow-pink-200">
                        <Download className="h-4 w-4 mr-2" /> EXPORT PNG
                    </Button>
                </div>
            </div>
        </div>
    )
}

function ToolGroup({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center gap-1">{children}</div>
}

function ToolButton({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label?: string }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                "h-8 px-2 rounded-lg gap-2 text-slate-500",
                active ? "bg-pink-50 text-pink-600 font-bold shadow-sm" : "hover:bg-slate-50"
            )}
        >
            {icon}
            {label && <span className="text-xs">{label}</span>}
        </Button>
    )
}

function ColorSwatch({ color }: { color: string }) {
    return <div className={cn("w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform border border-white shadow-sm ring-1 ring-slate-100", color)} />
}

function Node({ text, x, y, type }: { text: string, x: string, y: string, type: string }) {
    return (
        <div
            className={cn(
                "absolute px-4 py-2 rounded-lg border-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 font-bold text-sm bg-white",
                type === 'entity' ? "border-slate-800 text-slate-900" : "border-slate-200 text-slate-600"
            )}
            style={{ left: x, top: y }}
        >
            {text}
        </div>
    )
}
