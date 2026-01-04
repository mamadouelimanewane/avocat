"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Crosshair, DollarSign, Building, Truck, AlertOctagon, CheckCircle2, Lock, Navigation } from "lucide-react"

// Mock Targets
const TARGETS = [
    { id: 1, type: "BANQUE", name: "CBAO - Siège", loc: "Place de l'Indépendance", amount: "45.000.000", status: "SECURED", agent: "Me Ndiaye (Huissier)" },
    { id: 2, type: "IMMOBILIER", name: "Villa R+2", loc: "Ngor Almadies", amount: "150.000.000", status: "PENDING", agent: "En attente Commandement" },
    { id: 3, type: "VEHICULE", name: "Parc Automobile", loc: "Zone Ind. Sodida", amount: "22.000.000", status: "IN_PROGRESS", agent: "Me Sow (Sur place)" },
    { id: 4, type: "TIERS", name: "Total Energies (Employeur)", loc: "Route de Ouakam", amount: "Quotité Saisissable", status: "PLANNED", agent: "Programmé J+2" },
]

export function ExecutionCommander() {
    const [selectedTarget, setSelectedTarget] = useState<any>(null)
    const [recovered, setRecovered] = useState(45000000)
    const totalDebt = 217000000

    const progress = (recovered / totalDebt) * 100

    return (
        <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative min-h-[600px] flex flex-col">
            {/* Header / HUD */}
            <div className="bg-slate-950/80 backdrop-blur-md p-4 border-b border-slate-800 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/30 animate-pulse">
                        <Crosshair className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-wider text-emerald-400">Execution Commander</h2>
                        <p className="text-[10px] text-slate-400 font-mono">Pilotage Temps Réel des Voies d'Exécution</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Taux de Recouvrement Global</p>
                    <div className="flex items-center gap-3">
                        <Progress value={progress} className="w-32 h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                        <span className="text-xl font-mono font-bold text-white">{progress.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            {/* Main Map Area (Simulated) */}
            <div className="flex-1 relative bg-slate-800 overflow-hidden group">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-17.44,14.69,12,0/800x600@2x?access_token=pk.mock')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700 md:bg-[url('/map-dakar-dark.jpg')]">
                    {/* Fallback pattern if no image */}
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black opacity-80" />

                    {/* Mock Map Grid Lines */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                </div>

                {/* Map Pins */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-10 max-w-4xl mx-auto grid grid-cols-2 gap-20 pointer-events-none">
                    {/* Pin 1: CBAO */}
                    <div className="absolute top-[30%] left-[40%] pointer-events-auto cursor-pointer" onClick={() => setSelectedTarget(TARGETS[0])}>
                        <div className="relative group/pin">
                            <div className="h-4 w-4 bg-emerald-500 rounded-full animate-ping absolute top-0 left-0" />
                            <div className="h-4 w-4 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(16,185,129,0.8)] relative z-10" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/30 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                                45M SÉCURISÉS
                            </div>
                        </div>
                    </div>

                    {/* Pin 2: Villa */}
                    <div className="absolute top-[20%] left-[25%] pointer-events-auto cursor-pointer" onClick={() => setSelectedTarget(TARGETS[1])}>
                        <div className="relative group/pin">
                            <div className="h-4 w-4 bg-amber-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(245,158,11,0.6)] relative z-10" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 text-[10px] font-bold px-2 py-1 rounded border border-amber-500/30 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                                VILLA EN VUE
                            </div>
                        </div>
                    </div>

                    {/* Pin 3: Véhicules */}
                    <div className="absolute bottom-[30%] right-[35%] pointer-events-auto cursor-pointer" onClick={() => setSelectedTarget(TARGETS[2])}>
                        <div className="relative group/pin">
                            <div className="h-4 w-4 bg-rose-500 rounded-full animate-pulse border-2 border-white shadow-[0_0_20px_rgba(244,63,94,0.6)] relative z-10" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-rose-400 text-[10px] font-bold px-2 py-1 rounded border border-rose-500/30 whitespace-nowrap opacity-100">
                                INTERVENTION EN COURS
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend Overlay */}
                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-lg z-20 pointer-events-none">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Légende Tactique</p>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] text-emerald-300">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" /> Saisie Fructueuse (Bloqué)
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-rose-300">
                            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Opération en cours (Huissier)
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-amber-300">
                            <div className="h-2 w-2 rounded-full bg-amber-500" /> Cible Identifiée
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Panel / Details */}
            <div className={`absolute top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 transform transition-transform duration-300 z-30 ${selectedTarget ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedTarget && (
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-white">Détails Operateur</h3>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedTarget(null)}>×</Button>
                        </div>
                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                            <div className="space-y-1 text-center py-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <p className="text-xs text-slate-400 uppercase">Montant Cible</p>
                                <p className="text-2xl font-black text-white font-mono">{selectedTarget.amount}</p>
                                <p className="text-[10px] text-slate-500">FCFA TTC</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-2">
                                        <Building className="h-3 w-3" /> Cible
                                    </div>
                                    <p className="text-slate-200 font-medium">{selectedTarget.name}</p>
                                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" /> {selectedTarget.loc}
                                    </p>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-2">
                                        <Truck className="h-3 w-3" /> Agent d'Exécution
                                    </div>
                                    <p className="text-indigo-400 font-medium">{selectedTarget.agent}</p>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-2">
                                        <AlertOctagon className="h-3 w-3" /> Statut
                                    </div>
                                    <Badge className={`
                                        ${selectedTarget.status === 'SECURED' ? 'bg-emerald-500' :
                                            selectedTarget.status === 'IN_PROGRESS' ? 'bg-rose-600 animate-pulse' :
                                                'bg-amber-600'} 
                                        uppercase rounded-sm px-2 py-1
                                    `}>
                                        {selectedTarget.status === 'SECURED' ? 'FONDS SÉCURISÉS' :
                                            selectedTarget.status === 'IN_PROGRESS' ? 'INTERVENTION' :
                                                'EN ATTENTE'}
                                    </Badge>
                                </div>
                            </div>

                            <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold mt-8">
                                <Navigation className="mr-2 h-4 w-4" /> Voir le Rapport
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
