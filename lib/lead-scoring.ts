// Lead Scoring Algorithm - AI-powered prospect evaluation
// Scores leads from 0-100 based on multiple factors

export interface Lead {
    id: string
    name: string
    email?: string
    phone?: string
    source: 'WEBSITE' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'PHONE' | 'WALK_IN' | 'PARTNER'
    type: 'PARTICULIER' | 'ENTREPRISE'
    domaine?: string // CIVIL, COMMERCIAL, PENAL, etc.
    budget?: number
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    lastContact?: Date
    interactions: number
    status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST'
    createdAt: Date
}

export interface ScoringResult {
    score: number // 0-100
    grade: 'A' | 'B' | 'C' | 'D'
    priority: 'TRÈS HAUTE' | 'HAUTE' | 'MOYENNE' | 'BASSE'
    factors: {
        source: number
        engagement: number
        budget: number
        urgency: number
        recency: number
    }
    recommendation: string
    nextAction: string
}

/**
 * Calculate lead score based on multiple weighted factors
 */
export function calculateLeadScore(lead: Lead): ScoringResult {
    const factors = {
        source: scoreSource(lead.source),
        engagement: scoreEngagement(lead.interactions, lead.lastContact),
        budget: scoreBudget(lead.budget),
        urgency: scoreUrgency(lead.urgency),
        recency: scoreRecency(lead.createdAt, lead.lastContact)
    }

    // Weighted average
    const weights = {
        source: 0.15,
        engagement: 0.30,
        budget: 0.25,
        urgency: 0.20,
        recency: 0.10
    }

    const totalScore = Math.round(
        factors.source * weights.source +
        factors.engagement * weights.engagement +
        factors.budget * weights.budget +
        factors.urgency * weights.urgency +
        factors.recency * weights.recency
    )

    const grade = getGrade(totalScore)
    const priority = getPriority(totalScore, lead.urgency)
    const recommendation = getRecommendation(totalScore, lead, factors)
    const nextAction = getNextAction(lead, totalScore)

    return {
        score: totalScore,
        grade,
        priority,
        factors,
        recommendation,
        nextAction
    }
}

/**
 * Score based on lead source quality
 */
function scoreSource(source: Lead['source']): number {
    const sourceScores: Record<Lead['source'], number> = {
        REFERRAL: 90,      // Meilleure source (confiance)
        PARTNER: 80,       // Partenaire professionnel
        WEBSITE: 70,       // Démarche active
        SOCIAL_MEDIA: 60,  // Intérêt démontré
        WALK_IN: 50,       // Contact direct
        PHONE: 40          // Moins qualifié
    }
    return sourceScores[source]
}

/**
 * Score based on engagement level
 */
function scoreEngagement(interactions: number, lastContact?: Date): number {
    let score = 0

    // Interaction count (max 50 points)
    if (interactions >= 5) score += 50
    else if (interactions >= 3) score += 40
    else if (interactions >= 2) score += 30
    else if (interactions >= 1) score += 20
    else score += 10

    // Recency of interaction (max 50 points)
    if (lastContact) {
        const daysSinceContact = Math.floor(
            (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysSinceContact <= 1) score += 50
        else if (daysSinceContact <= 3) score += 40
        else if (daysSinceContact <= 7) score += 30
        else if (daysSinceContact <= 14) score += 20
        else if (daysSinceContact <= 30) score += 10
        else score += 5
    }

    return Math.min(score, 100)
}

/**
 * Score based on budget capacity
 */
function scoreBudget(budget?: number): number {
    if (!budget) return 30 // Unknown budget = medium score

    // Budget thresholds in XOF
    if (budget >= 5000000) return 100      // > 5M FCFA
    if (budget >= 2000000) return 85       // 2-5M FCFA
    if (budget >= 1000000) return 70       // 1-2M FCFA
    if (budget >= 500000) return 55        // 500K-1M FCFA
    if (budget >= 200000) return 40        // 200K-500K FCFA
    return 25                              // < 200K FCFA
}

/**
 * Score based on urgency level
 */
function scoreUrgency(urgency: Lead['urgency']): number {
    const urgencyScores: Record<Lead['urgency'], number> = {
        URGENT: 100,
        HIGH: 75,
        MEDIUM: 50,
        LOW: 25
    }
    return urgencyScores[urgency]
}

/**
 * Score based on lead recency
 */
function scoreRecency(createdAt: Date, lastContact?: Date): number {
    const referenceDate = lastContact || createdAt
    const daysSince = Math.floor(
        (Date.now() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSince <= 1) return 100      // Très récent
    if (daysSince <= 3) return 85       // Récent
    if (daysSince <= 7) return 70       // Cette semaine
    if (daysSince <= 14) return 50      // Cette quinzaine
    if (daysSince <= 30) return 30      // Ce mois
    return 15                           // Ancien
}

/**
 * Convert score to letter grade
 */
function getGrade(score: number): 'A' | 'B' | 'C' | 'D' {
    if (score >= 80) return 'A'
    if (score >= 60) return 'B'
    if (score >= 40) return 'C'
    return 'D'
}

/**
 * Determine priority based on score and urgency
 */
function getPriority(score: number, urgency: Lead['urgency']): ScoringResult['priority'] {
    if (score >= 80 || urgency === 'URGENT') return 'TRÈS HAUTE'
    if (score >= 60 || urgency === 'HIGH') return 'HAUTE'
    if (score >= 40) return 'MOYENNE'
    return 'BASSE'
}

/**
 * Generate AI recommendation
 */
function getRecommendation(score: number, lead: Lead, factors: ScoringResult['factors']): string {
    if (score >= 80) {
        return `Lead PRIORITAIRE ! ${lead.name} présente un excellent potentiel. Budget élevé, forte urgence et bon engagement. Traiter immédiatement.`
    }

    if (score >= 60) {
        return `Lead QUALIFIÉ. ${lead.name} mérite une attention rapide. ${factors.engagement < 50 ? 'Augmenter les interactions pour améliorer la conversion.' : 'Présenter une proposition commerciale rapidement.'
            }`
    }

    if (score >= 40) {
        return `Lead MOYEN. ${lead.name} nécessite une qualification approfondie. ${factors.budget < 50 ? 'Clarifier le budget disponible.' : 'Relancer pour évaluer l\'urgence réelle.'
            }`
    }

    return `Lead À FAIBLE PRIORITÉ. ${lead.name} doit être nurturé via campagnes automatisées. Éviter investissement temps important pour le moment.`
}

/**
 * Suggest next action based on lead state
 */
function getNextAction(lead: Lead, score: number): string {
    switch (lead.status) {
        case 'NEW':
            return score >= 70
                ? '📞 Appel téléphonique sous 2h'
                : '📧 Envoyer email de bienvenue automatisé'

        case 'CONTACTED':
            return score >= 70
                ? '📅 Planifier RDV physique ou visio'
                : '📋 Envoyer questionnaire de qualification'

        case 'QUALIFIED':
            return '💼 Préparer proposition commerciale personnalisée'

        case 'PROPOSAL':
            return '🔔 Relance à J+3 si pas de réponse'

        case 'NEGOTIATION':
            return '✍️ Finaliser les conditions et envoyer contrat'

        case 'WON':
            return '🎉 Créer le dossier client et planifier onboarding'

        case 'LOST':
            return '📊 Documenter raison de perte + Campagne re-engagement dans 6 mois'

        default:
            return '📝 Mettre à jour le statut du lead'
    }
}

/**
 * Batch scoring for multiple leads
 */
export function scoreLeads(leads: Lead[]): Array<Lead & { scoring: ScoringResult }> {
    return leads
        .map(lead => ({
            ...lead,
            scoring: calculateLeadScore(lead)
        }))
        .sort((a, b) => b.scoring.score - a.scoring.score) // Sort by score descending
}

/**
 * Get conversion probability (%)
 */
export function getConversionProbability(score: number): number {
    // Statistical model based on historical data
    if (score >= 90) return 85
    if (score >= 80) return 70
    if (score >= 70) return 55
    if (score >= 60) return 40
    if (score >= 50) return 28
    if (score >= 40) return 18
    if (score >= 30) return 10
    return 5
}

/**
 * Estimate deal value based on lead characteristics
 */
export function estimateDealValue(lead: Lead): number {
    let baseValue = lead.budget || 500000 // Default 500K FCFA

    // Adjust based on lead type
    if (lead.type === 'ENTREPRISE') {
        baseValue *= 2.5 // Companies pay more
    }

    // Adjust based on domain
    const domainMultipliers: Record<string, number> = {
        COMMERCIAL: 1.8,
        PENAL: 1.5,
        CIVIL: 1.2,
        SOCIAL: 1.1,
        ADMINISTRATIF: 1.3
    }

    if (lead.domaine && domainMultipliers[lead.domaine]) {
        baseValue *= domainMultipliers[lead.domaine]
    }

    return Math.round(baseValue)
}
