/**
 * Analytics et Métriques IA
 * Suit l'utilisation et les coûts des API d'IA
 */

interface APIUsageMetric {
    timestamp: number
    model: 'deepseek' | 'openai' | 'fallback'
    mode: 'RESEARCH' | 'DRAFTING' | 'PLEADING'
    tokensInput?: number
    tokensOutput?: number
    cost?: number
    cached: boolean
    responseTime: number
}

class AIAnalytics {
    private metrics: APIUsageMetric[] = []
    private maxMetrics = 1000

    /**
     * Enregistre une utilisation d'API
     */
    track(metric: Omit<APIUsageMetric, 'timestamp'>) {
        this.metrics.push({
            ...metric,
            timestamp: Date.now()
        })

        // Nettoyer les anciennes métriques
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics)
        }
    }

    /**
     * Statistiques globales
     */
    getStats(periodDays: number = 7) {
        const cutoff = Date.now() - (periodDays * 24 * 60 * 60 * 1000)
        const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff)

        const totalCalls = recentMetrics.length
        const cachedCalls = recentMetrics.filter(m => m.cached).length
        const cacheHitRate = totalCalls > 0 ? (cachedCalls / totalCalls) * 100 : 0

        const totalCost = recentMetrics.reduce((sum, m) => sum + (m.cost || 0), 0)
        const avgResponseTime = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
            : 0

        const byModel = {
            deepseek: recentMetrics.filter(m => m.model === 'deepseek').length,
            openai: recentMetrics.filter(m => m.model === 'openai').length,
            fallback: recentMetrics.filter(m => m.model === 'fallback').length
        }

        const byMode = {
            RESEARCH: recentMetrics.filter(m => m.mode === 'RESEARCH').length,
            DRAFTING: recentMetrics.filter(m => m.mode === 'DRAFTING').length,
            PLEADING: recentMetrics.filter(m => m.mode === 'PLEADING').length
        }

        return {
            period: `${periodDays} jours`,
            totalCalls,
            cachedCalls,
            cacheHitRate: cacheHitRate.toFixed(1) + '%',
            totalCost: totalCost.toFixed(4) + ' $',
            avgResponseTime: avgResponseTime.toFixed(0) + ' ms',
            byModel,
            byMode,
            costSaved: (cachedCalls * 0.0001).toFixed(4) + ' $ (estimation)'
        }
    }

    /**
     * Rapport détaillé pour export
     */
    generateReport() {
        const stats = this.getStats(30)

        return {
            generatedAt: new Date().toISOString(),
            stats,
            recommendations: this.getRecommendations(stats)
        }
    }

    /**
     * Recommandations basées sur l'usage
     */
    private getRecommendations(stats: any) {
        const recommendations = []

        const cacheRate = parseFloat(stats.cacheHitRate)
        if (cacheRate < 30) {
            recommendations.push('⚠️ Taux de cache faible - Considérez augmenter la durée de cache')
        } else if (cacheRate > 70) {
            recommendations.push('✅ Excellent taux de cache ! Économies maximales.')
        }

        if (stats.byModel.fallback > stats.totalCalls * 0.5) {
            recommendations.push('⚠️ Plus de 50% en mode fallback - Vérifiez vos clés API')
        }

        const avgCost = parseFloat(stats.totalCost) / stats.totalCalls
        if (avgCost > 0.002) {
            recommendations.push('💡 Coût moyen élevé - Privilégiez DeepSeek vs OpenAI')
        }

        return recommendations
    }

    /**
     * Export vers CSV
     */
    exportCSV() {
        const headers = 'timestamp,model,mode,tokensInput,tokensOutput,cost,cached,responseTime\n'
        const rows = this.metrics.map(m =>
            `${m.timestamp},${m.model},${m.mode},${m.tokensInput || 0},${m.tokensOutput || 0},${m.cost || 0},${m.cached},${m.responseTime}`
        ).join('\n')

        return headers + rows
    }
}

// Instance singleton
const aiAnalytics = new AIAnalytics()

export { aiAnalytics, AIAnalytics }
