"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, PlayCircle, StopCircle, RefreshCw, Database, Globe, BookOpen } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function VeilleJuridiquePage() {
    const { toast } = useToast()
    const [isRunning, setIsRunning] = useState(false)
    const [loading, setLoading] = useState(false)
    const [config, setConfig] = useState({
        interval: 24,
        maxPerSource: 5
    })
    const [stats, setStats] = useState({
        jurisprudenceCount: 0,
        lastRun: null as Date | null
    })

    useEffect(() => {
        fetchStatus()
    }, [])

    async function fetchStatus() {
        try {
            const res = await fetch('/api/veille/status')
            const data = await res.json()
            setIsRunning(data.isRunning)
            setStats({
                jurisprudenceCount: data.jurisprudenceCount || 0,
                lastRun: data.lastRun ? new Date(data.lastRun) : null
            })
        } catch (e) {
            console.error('Erreur fetch status:', e)
        }
    }

    async function handleStart() {
        setLoading(true)
        try {
            const res = await fetch('/api/veille/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })
            const data = await res.json()

            if (data.success) {
                toast({ title: "✅ Veille démarrée", description: data.message })
                setIsRunning(true)
            } else {
                toast({ title: "⚠️ Erreur", description: data.message, variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "❌ Erreur", description: "Impossible de démarrer la veille", variant: "destructive" })
        }
        setLoading(false)
    }

    async function handleStop() {
        setLoading(true)
        try {
            const res = await fetch('/api/veille/stop', { method: 'POST' })
            const data = await res.json()

            toast({ title: "⏸️ Veille arrêtée", description: data.message })
            setIsRunning(false)
        } catch (e) {
            toast({ title: "❌ Erreur", description: "Impossible d'arrêter la veille", variant: "destructive" })
        }
        setLoading(false)
    }

    async function handleManualRun() {
        setLoading(true)
        toast({ title: "🔄 Scan manuel en cours...", description: "Cela peut prendre quelques minutes" })

        try {
            const res = await fetch('/api/veille/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ maxPerSource: config.maxPerSource })
            })
            const data = await res.json()

            toast({
                title: "✅ Scan terminé",
                description: `${data.totalImported} nouveaux documents importés`
            })
            fetchStatus()
        } catch (e) {
            toast({ title: "❌ Erreur", description: "Échec du scan manuel", variant: "destructive" })
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">🔍 Veille Juridique Automatisée</h1>
                <p className="text-muted-foreground">
                    Scan automatique et permanent des sources juridiques Sénégal, OHADA et UEMOA
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Statut</CardTitle>
                        {isRunning ? <PlayCircle className="h-4 w-4 text-green-600" /> : <StopCircle className="h-4 w-4 text-gray-400" />}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isRunning ? (
                                <Badge variant="default" className="bg-green-600">En cours</Badge>
                            ) : (
                                <Badge variant="secondary">Arrêté</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Textes Juridiques</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.jurisprudenceCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">dans la bibliothèque</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Dernier Scan</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {stats.lastRun ? stats.lastRun.toLocaleString('fr-FR') : 'Jamais'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Configuration de la Veille</CardTitle>
                    <CardDescription>
                        Paramètres de scan automatique des sources juridiques
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="interval">Intervalle (heures)</Label>
                            <Input
                                id="interval"
                                type="number"
                                min="1"
                                max="168"
                                value={config.interval}
                                onChange={(e) => setConfig({ ...config, interval: parseInt(e.target.value) || 24 })}
                                disabled={isRunning}
                            />
                            <p className="text-xs text-muted-foreground">
                                Fréquence de scan automatique (1-168h)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxPerSource">Limite par source</Label>
                            <Input
                                id="maxPerSource"
                                type="number"
                                min="1"
                                max="20"
                                value={config.maxPerSource}
                                onChange={(e) => setConfig({ ...config, maxPerSource: parseInt(e.target.value) || 5 })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Nombre max de documents à examiner par source
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        {!isRunning ? (
                            <Button onClick={handleStart} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                                Démarrer la Veille
                            </Button>
                        ) : (
                            <Button onClick={handleStop} variant="destructive" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <StopCircle className="mr-2 h-4 w-4" />}
                                Arrêter
                            </Button>
                        )}

                        <Button onClick={handleManualRun} variant="outline" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            Scan Manuel
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Sources Surveillées
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { name: "Lois et Règlements Sénégal", url: "sec.gouv.sn", region: "SENEGAL" },
                            { name: "Actes Uniformes OHADA", url: "ohada.com", region: "OHADA" },
                            { name: "Codes Sénégalais", url: "droit-afrique.com/senegal", region: "SENEGAL" },
                            { name: "Cour Suprême Sénégal", url: "coursupreme.gouv.sn", region: "SENEGAL" },
                            { name: "CCJA (Jurisprudence)", url: "ccja.org", region: "OHADA" },
                        ].map((source, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="font-medium">{source.name}</div>
                                    <div className="text-sm text-muted-foreground">{source.url}</div>
                                </div>
                                <Badge variant={source.region === "OHADA" ? "default" : "secondary"}>
                                    {source.region}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
