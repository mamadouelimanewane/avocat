"use client"

import { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function Stopwatch() {
    const [isRunning, setIsRunning] = useState(false)
    const [time, setTime] = useState(0) // seconds
    const [description, setDescription] = useState('')
    const [dossierId, setDossierId] = useState('')

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isRunning])

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStop = () => {
        setIsRunning(false)
        // In a real app, save this to the DB via server action
        console.log("Time saved:", time, description, dossierId)
        alert(`Temps enregistré: ${formatTime(time)} sur le dossier.`)
        setTime(0)
        setDescription('')
    }

    if (!isRunning && time === 0) {
        return (
            <Button
                variant="outline"
                className="w-full justify-start text-xs border-dashed text-slate-500 hover:text-slate-900 border-slate-300"
                onClick={() => setIsRunning(true)}
            >
                <Clock className="mr-2 h-4 w-4" /> Démarrer Chrono
            </Button>
        )
    }

    return (
        <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardContent className="p-3 space-y-3">
                <div className="text-center font-mono text-2xl font-bold tracking-widest text-amber-500">
                    {formatTime(time)}
                </div>

                <Input
                    placeholder="Description (ex: Appel Client)"
                    className="h-7 text-xs bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-amber-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex gap-2">
                    {!isRunning ? (
                        <Button size="sm" variant="secondary" className="w-full h-7 bg-green-600 hover:bg-green-500 text-white border-none" onClick={() => setIsRunning(true)}>
                            <Play className="h-3 w-3" />
                        </Button>
                    ) : (
                        <Button size="sm" variant="secondary" className="w-full h-7 bg-amber-600 hover:bg-amber-500 text-white border-none" onClick={() => setIsRunning(false)}>
                            <Pause className="h-3 w-3" />
                        </Button>
                    )}
                    <Button size="sm" variant="destructive" className="w-full h-7" onClick={handleStop}>
                        <Square className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
