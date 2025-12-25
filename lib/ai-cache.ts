/**
 * Système de Cache pour Réponses IA
 * Optimise les coûts et la vitesse en mémorisant les réponses fréquentes
 */

interface CacheEntry {
    prompt: string
    response: string
    timestamp: number
    mode: string
    hits: number
}

class AIResponseCache {
    private cache: Map<string, CacheEntry> = new Map()
    private maxEntries = 100
    private ttl = 24 * 60 * 60 * 1000 // 24 heures

    /**
     * Génère une clé de cache unique
     */
    private generateKey(prompt: string, mode: string): string {
        return `${mode}:${prompt.toLowerCase().trim()}`
    }

    /**
     * Récupère une réponse du cache si disponible
     */
    get(prompt: string, mode: string): string | null {
        const key = this.generateKey(prompt, mode)
        const entry = this.cache.get(key)

        if (!entry) return null

        // Vérifier expiration
        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key)
            return null
        }

        // Incrémenter compteur de hits
        entry.hits++

        console.log(`💾 Cache HIT: "${prompt.substring(0, 50)}..." (${entry.hits} utilisations)`)
        return entry.response
    }

    /**
     * Stocke une réponse dans le cache
     */
    set(prompt: string, mode: string, response: string): void {
        const key = this.generateKey(prompt, mode)

        // Nettoyer si cache plein
        if (this.cache.size >= this.maxEntries) {
            this.evictOldest()
        }

        this.cache.set(key, {
            prompt,
            response,
            mode,
            timestamp: Date.now(),
            hits: 0
        })

        console.log(`💾 Cache SET: "${prompt.substring(0, 50)}..."`)
    }

    /**
     * Supprime les entrées les plus anciennes
     */
    private evictOldest(): void {
        let oldestKey: string | null = null
        let oldestTime = Infinity

        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp
                oldestKey = key
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey)
        }
    }

    /**
     * Nettoie les entrées expirées
     */
    cleanup(): void {
        const now = Date.now()
        let cleaned = 0

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.ttl) {
                this.cache.delete(key)
                cleaned++
            }
        }

        if (cleaned > 0) {
            console.log(`🧹 Cache cleanup: ${cleaned} entrées supprimées`)
        }
    }

    /**
     * Statistiques du cache
     */
    getStats() {
        const entries = Array.from(this.cache.values())
        const totalHits = entries.reduce((sum, e) => sum + e.hits, 0)

        return {
            size: this.cache.size,
            maxSize: this.maxEntries,
            totalHits,
            avgHitsPerEntry: entries.length > 0 ? totalHits / entries.length : 0,
            oldestEntry: entries.reduce((oldest, e) =>
                e.timestamp < oldest ? e.timestamp : oldest, Date.now()
            )
        }
    }

    /**
     * Réinitialise le cache
     */
    clear(): void {
        this.cache.clear()
        console.log('🧹 Cache vidé')
    }
}

// Instance singleton
const aiCache = new AIResponseCache()

// Cleanup automatique toutes les heures
if (typeof setInterval !== 'undefined') {
    setInterval(() => aiCache.cleanup(), 60 * 60 * 1000)
}

export { aiCache, AIResponseCache }
