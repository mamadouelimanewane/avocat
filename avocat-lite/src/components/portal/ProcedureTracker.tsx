"use client"

import { Check, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProcedureTrackerProps {
    currentStage: string
    estimatedCompletion?: string
}

const STEPS = [
    { id: 'OUVERTURE', label: 'Ouverture', description: 'Constitution du dossier' },
    { id: 'INSTRUCTION', label: 'Instruction', description: 'Échange de pièces & conclusions' },
    { id: 'AUDIENCE', label: 'Audience', description: 'Plaidoiries au tribunal' },
    { id: 'DELIBERE', label: 'Délibéré', description: 'Attente du jugement' },
    { id: 'CLOTURE', label: 'Jugement', description: 'Décision rendue & archivage' }
]

export function ProcedureTracker({ currentStage, estimatedCompletion }: ProcedureTrackerProps) {
    // Normalize stage for matching
    const normalizedStage = (currentStage || 'OUVERTURE').toUpperCase()

    // Find current step index
    const currentStepIndex = STEPS.findIndex(s => s.id === normalizedStage)
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex

    // Progress percentage
    const progress = Math.min(100, Math.max(0, (activeIndex / (STEPS.length - 1)) * 100))

    return (
        <div className="w-full py-8">
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />

                {/* Active Progress Bar */}
                <div
                    className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-amber-500 to-amber-300 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < activeIndex
                        const isCurrent = index === activeIndex
                        const isFuture = index > activeIndex

                        return (
                            <div key={step.id} className="flex flex-col items-center group relative">
                                {/* Dot Indicator */}
                                <div
                                    className={cn(
                                        "h-8 w-8 rounded-full border-4 flex items-center justify-center bg-white z-10 transition-all duration-300",
                                        isCompleted ? "border-amber-500 text-amber-500" :
                                            isCurrent ? "border-amber-500 bg-amber-500 text-white scale-125 shadow-lg shadow-amber-500/30" :
                                                "border-slate-200 text-slate-300"
                                    )}
                                >
                                    {isCompleted && <Check className="h-4 w-4 stroke-[3]" />}
                                    {isCurrent && <Clock className="h-4 w-4 animate-pulse" />}
                                    {isFuture && <div className="h-2 w-2 rounded-full bg-slate-200" />}
                                </div>

                                {/* Label & Description */}
                                <div className="text-center mt-4 absolute top-8 w-32 -left-12 sm:w-40 sm:-left-16 transition-all duration-300">
                                    <p className={cn(
                                        "text-xs font-bold uppercase tracking-wider mb-1",
                                        isCurrent ? "text-amber-600" : "text-slate-500",
                                        isFuture && "opacity-50"
                                    )}>
                                        {step.label}
                                    </p>
                                    <p className={cn(
                                        "text-[10px] text-slate-400 hidden sm:block",
                                        isCurrent && "text-slate-600 font-medium"
                                    )}>
                                        {step.description}
                                    </p>
                                </div>

                                {/* Current Step Popover Animation (Pulse Effect) */}
                                {isCurrent && (
                                    <div className="absolute top-0 left-0 h-8 w-8 rounded-full bg-amber-500/30 animate-ping -z-10" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Estimated Completion or AI Insight */}
            <div className="mt-16 flex items-center justify-center">
                <div className="bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-xl border border-slate-800">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    <span>Estimation IA LexPremium : </span>
                    <span className="text-amber-400">{estimatedCompletion || "Calcul en cours..."}</span>
                </div>
            </div>
        </div>
    )
}
