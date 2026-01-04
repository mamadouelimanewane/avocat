"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calculator, Dna, Share2, Download, RefreshCw, TrendingUp } from "lucide-react"

export function QuantumSimulator() {
    const [salary, setSalary] = useState([500000])
    const [years, setYears] = useState([5])
    const [age, setAge] = useState([35])
    const [isAbusive, setIsAbusive] = useState(false)
    const [total, setTotal] = useState(0)

    // Animation state
    const [displayTotal, setDisplayTotal] = useState(0)

    useEffect(() => {
        // Complex OHADA/Senegal Calculation Logic Simulation
        const baseSalary = salary[0]
        const seniority = years[0]

        // Indemnité Légale de Licenciement (approx 35% par année pour les 5 premières, 40% après)
        let legalIndemnity = 0
        if (seniority <= 5) {
            legalIndemnity = baseSalary * 0.25 * seniority
        } else {
            legalIndemnity = (baseSalary * 0.25 * 5) + (baseSalary * 0.35 * (seniority - 5))
        }

        // Préavis (Simulation: 3 mois cadres)
        const notice = baseSalary * 3

        // Dommages et Intérêts (Barème indicatif : 1 mois par année d'ancienneté si abusif)
        const damages = isAbusive ? (baseSalary * seniority) : 0

        const grandTotal = legalIndemnity + notice + damages
        setTotal(grandTotal)
    }, [salary, years, isAbusive])

    // Number animation effect
    useEffect(() => {
        const duration = 500 // ms
        const steps = 20
        const increment = (total - displayTotal) / steps
        let current = displayTotal
        let step = 0

        if (Math.abs(total - displayTotal) > 100) {
            const timer = setInterval(() => {
                current += increment
                step++
                setDisplayTotal(current)
                if (step >= steps) {
                    clearInterval(timer)
                    setDisplayTotal(total)
                }
            }, duration / steps)
            return () => clearInterval(timer)
        } else {
            setDisplayTotal(total)
        }
    }, [total])

    return (
        <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <CardHeader className="border-b border-white/5 relative z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-400">
                            <Dna className="h-6 w-6 animate-pulse" />
                            Quantum Simulator™ (Social)
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Algorithme prédictif des indemnités de licenciement (Code du Travail Sénégalais / CCNI).
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Controls Area */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label className="text-slate-300">Salaire Mensuel Brut (Moyen 12 derniers mois)</Label>
                            <span className="font-mono text-indigo-400 font-bold">{salary[0].toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <Slider
                            value={salary}
                            onValueChange={setSalary}
                            max={5000000}
                            step={10000}
                            className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>SMIG</span>
                            <span>Directeur Général</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label className="text-slate-300">Ancienneté (Années)</Label>
                            <span className="font-mono text-indigo-400 font-bold">{years[0]} ans</span>
                        </div>
                        <Slider
                            value={years}
                            onValueChange={setYears}
                            max={40}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label className="text-slate-300">Âge du Salarié</Label>
                            <span className="font-mono text-indigo-400 font-bold">{age[0]} ans</span>
                        </div>
                        <Slider
                            value={age}
                            onValueChange={setAge}
                            min={18}
                            max={65}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setIsAbusive(!isAbusive)}>
                        <div className="space-y-1">
                            <Label className="text-slate-200 cursor-pointer">Licenciement Abusif ?</Label>
                            <p className="text-xs text-slate-500">Active le calcul des dommages et intérêts (Barème art. L.56).</p>
                        </div>
                        <Switch checked={isAbusive} onCheckedChange={setIsAbusive} className="data-[state=checked]:bg-rose-500" />
                    </div>
                </div>

                {/* Results Visualization Area */}
                <div className="flex flex-col justify-center space-y-8 relative">
                    {/* Glowing Total */}
                    <div className="text-center space-y-2 relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-75 animate-pulse" />
                        <h3 className="text-slate-400 text-sm uppercase tracking-widest font-bold relative z-10">Estimation Totale</h3>
                        <div className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 font-mono relative z-10 transition-all">
                            {displayTotal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-indigo-400 text-sm font-bold relative z-10">FCFA NET</p>
                    </div>

                    {/* Breakdown Chips */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] text-slate-400 uppercase">Indemnité Légale</span>
                            <span className="font-bold text-white text-lg">
                                {((years[0] <= 5 ? salary[0] * 0.25 * years[0] : (salary[0] * 0.25 * 5) + (salary[0] * 0.35 * (years[0] - 5)))).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] text-slate-400 uppercase">Préavis (3 mois)</span>
                            <span className="font-bold text-white text-lg">
                                {(salary[0] * 3).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        {isAbusive && (
                            <div className="col-span-2 p-3 rounded-lg bg-rose-900/20 border border-rose-500/30 flex flex-col items-center justify-center text-center animate-in zoom-in">
                                <span className="text-[10px] text-rose-300 uppercase font-bold flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> Dommages & Intérêts (Abusif)
                                </span>
                                <span className="font-bold text-rose-400 text-xl">
                                    {(salary[0] * years[0]).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                        <Button className="flex-1 bg-white text-slate-900 hover:bg-slate-200 font-bold">
                            <Download className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                        <Button variant="outline" className="border-slate-700 text-indigo-400 hover:text-white hover:bg-indigo-600">
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                    </div>
                </div>
            </CardContent>

            {/* Disclaimer Footer */}
            <div className="bg-black/20 p-2 text-center text-[10px] text-slate-600 italic">
                *Ceci est une estimation algorithmique basée sur les paramètres saisis. Elle ne remplace pas une consultation juridique détaillée.
            </div>
        </Card>
    )
}
