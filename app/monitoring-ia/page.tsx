"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Activity,
    Zap,
    TrendingUp,
    Database,
    DollarSign,
    RefreshCw,
    BarChart3,
    CheckCircle2,
    AlertTriangle
} from "lucide-react"

export default function AIMonitoringPage() {
    const [stats, setStats] = useState<any>(null)
    const [cacheStats, setCacheStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadStats = async () => {
        setIsLoading(true)
        try {
            // Importer dynamiquement les analytics
            const { aiAnalytics } = await import('@/lib/ai-analytics')
            const { aiCache } = await import('@/lib/ai-cache')

            const analyticsData = aiAnalytics.getStats(7)
            const cacheData = aiCache.getStats()

            setStats(analyticsData)
            setCacheStats(cacheData)
        } catch (error) {
            console.error('Erreur chargement stats:', error)
        }
        setIsLoading(false)
    }

    const clearCache = async () => {
        const { aiCache } = await import('@/lib/ai-cache')
        aiCache.clear()
        loadStats()
    }

    useEffect(() => {
        loadStats()

        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(loadStats, 30000)
        return () => clearInterval(interval)
    }, [])

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    const hasAPIKey = typeof window !== 'undefined' && (
        process.env.NEXT_PUBLIC_HAS_DEEPSEEK_KEY === 'true' ||
        process.env.NEXT_PUBLIC_HAS_OPENAI_KEY === 'true'
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Monitoring IA
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Statistiques d'utilisation et performance des assistants juridiques
                    </p>
                </div>
                <Button onClick={loadStats} variant="outline" disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualiser
                </Button>
            </div>

            {/* Status Badge */}
            <Card className={hasAPIKey ? "border-emerald-200 bg-emerald-50/30" : "border-amber-200 bg-amber-50/30"}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {hasAPIKey ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span className="font-semibold text-emerald-900">IA Complète Activée</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                <span className="font-semibold text-amber-900">Mode Dégradé (RAG Local)</span>
                            </>
                        )}
                    </div>
                    {!hasAPIKey && (
                        <Badge variant="outline" className="bg-white text-amber-700 border-amber-200">
                            Clé API manquante
                        </Badge>
                    )}
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Requêtes (7j)</CardTitle>
                        <Activity className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalCalls || 0}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats?.cachedCalls || 0} depuis le cache
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de Cache</CardTitle>
                        <Database className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">
                            {stats?.cacheHitRate || '0%'}
                        </div>
                        <Progress
                            value={parseFloat(stats?.cacheHitRate || '0')}
                            className="h-2 mt-2"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Coût Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalCost || '0 $'}</div>
                        <p className="text-xs text-emerald-600 mt-1">
                            Économisé: {stats?.costSaved || '0 $'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Temps Réponse</CardTitle>
                        <Zap className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.avgResponseTime || '0 ms'}</div>
                        <p className="text-xs text-slate-500 mt-1">Moyenne</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Par Modèle */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                            Répartition par Modèle
                        </CardTitle>
                        <CardDescription>Usage des APIs sur 7 jours</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats?.byModel && Object.entries(stats.byModel).map(([model, count]: [string, any]) => {
                            const total = stats.totalCalls || 1
                            const percentage = ((count / total) * 100).toFixed(1)

                            return (
                                <div key={model} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium capitalize">{model}</span>
                                        <span className="text-slate-500">{count} ({percentage}%)</span>
                                    </div>
                                    <Progress value={parseFloat(percentage)} className="h-2" />
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Par Mode */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Répartition par Usage
                        </CardTitle>
                        <CardDescription>Types de requêtes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats?.byMode && Object.entries(stats.byMode).map(([mode, count]: [string, any]) => {
                            const total = stats.totalCalls || 1
                            const percentage = ((count / total) * 100).toFixed(1)

                            const modeLabels: Record<string, string> = {
                                'RESEARCH': 'Recherche',
                                'DRAFTING': 'Rédaction',
                                'PLEADING': 'Plaidoirie'
                            }

                            return (
                                <div key={mode} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{modeLabels[mode] || mode}</span>
                                        <span className="text-slate-500">{count} ({percentage}%)</span>
                                    </div>
                                    <Progress value={parseFloat(percentage)} className="h-2" />
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Cache Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-slate-600" />
                        Détails du Cache
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Entrées</p>
                            <p className="text-2xl font-bold">{cacheStats?.size || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Capacité Max</p>
                            <p className="text-2xl font-bold">{cacheStats?.maxSize || 100}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Hits Totaux</p>
                            <p className="text-2xl font-bold">{cacheStats?.totalHits || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Utilisation</p>
                            <Progress
                                value={(cacheStats?.size / cacheStats?.maxSize) * 100 || 0}
                                className="h-2 mt-3"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button onClick={clearCache} variant="outline" size="sm">
                            Vider le Cache
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations */}
            {stats?.recommendations && stats.recommendations.length > 0 && (
                <Card className="border-blue-100 bg-blue-50/30">
                    <CardHeader>
                        <CardTitle className="text-blue-900">💡 Recommandations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {stats.recommendations.map((rec: string, i: number) => (
                            <div key={i} className="text-sm text-blue-800 flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>{rec}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
