
"use client"

import { useState, useRef, useEffect } from "react"
import {
    Clock,
    Play,
    Pause,
    RotateCcw,
    SkipForward,
    Settings,
    Music,
    Waves,
    Headphones,
    Brain,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface LexFlowProps {
    onClose?: () => void
}

export function LexFlow({ onClose }: LexFlowProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [activeMode, setActiveMode] = useState<'FOCUS' | 'DEEP_WORK' | 'STRESS_RELIEF'>('FOCUS')
    const [volume, setVolume] = useState(60)

    // Animated bars simulation
    const bars = Array.from({ length: 12 })

    const togglePlay = () => setIsPlaying(!isPlaying)

    const modes = [
        { id: 'FOCUS', name: 'Deep Focus', freq: '40Hz Gamma', color: 'bg-emerald-500' },
        { id: 'DEEP_WORK', name: 'Neural Flow', freq: '14Hz Beta', color: 'bg-indigo-500' },
        { id: 'STRESS_RELIEF', name: 'Court Detox', freq: '10Hz Alpha', color: 'bg-cyan-500' }
    ]

    return (
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 shadow-2xl flex items-center gap-8 z-[200] max-w-2xl w-full"
        >
            {/* Logo / Identity */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse-slow">
                    <Headphones className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h4 className="font-black text-white text-sm tracking-tight flex items-center gap-2">
                        LEX<span className="text-indigo-400">FLOW</span>
                        <span className="text-[9px] bg-white/10 px-1.5 rounded uppercase text-slate-400">Audio</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Binaural Productivity Engine</p>
                </div>
            </div>

            {/* Visualizer */}
            <div className="flex-1 flex items-center justify-center gap-1 h-8">
                {bars.map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            height: isPlaying ? [4, 24, 8, 16, 4] : 4,
                            backgroundColor: isPlaying ? (activeMode === 'FOCUS' ? '#10b981' : activeMode === 'DEEP_WORK' ? '#6366f1' : '#06b6d4') : '#334155'
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                        className="w-1.5 rounded-full bg-slate-700"
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">

                {/* Mode Selector */}
                <div className="flex gap-1">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveMode(mode.id as any)}
                            title={`${mode.name} - ${mode.freq}`}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all",
                                activeMode === mode.id ? cn(mode.color, "scale-150 ring-2 ring-white/20") : "bg-slate-700 hover:bg-slate-600"
                            )}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-full">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={togglePlay}
                        className={cn(
                            "h-12 w-12 rounded-full shadow-lg border-2 border-white/10 transition-all",
                            activeMode === 'FOCUS' ? "bg-emerald-600 hover:bg-emerald-500" :
                                activeMode === 'DEEP_WORK' ? "bg-indigo-600 hover:bg-indigo-500" : "bg-cyan-600 hover:bg-cyan-500"
                        )}
                    >
                        {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white rounded-full">
                        <SkipForward className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
