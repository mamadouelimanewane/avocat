/**
 * Script de Test Automatique - Assistants IA
 * Vérifie que toutes les fonctionnalités IA sont opérationnelles
 */

import { generateCompletion, interpretVoiceCommand, analyzeContractText, extractSearchFilters } from './lib/ai'

const RESET = '\x1b[0m'
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'

function log(status: 'success' | 'error' | 'info' | 'warning', message: string) {
    const colors = {
        success: GREEN,
        error: RED,
        info: BLUE,
        warning: YELLOW
    }
    console.log(`${colors[status]}${message}${RESET}`)
}

async function testVoiceCommands() {
    console.log('\n🎤 Test 1: Interprétation Commandes Vocales')
    console.log('='.repeat(50))

    const testCases = [
        { input: "Créer une note que le client a appelé", expected: "CREATE_NOTE" },
        { input: "Planifier un rdv avec Me Ndiaye le 15 janvier", expected: "CREATE_EVENT" },
        { input: "Rechercher jurisprudence sur la saisie", expected: "SEARCH" },
        { input: "Aller à la page des dossiers", expected: "NAVIGATE" }
    ]

    let passed = 0
    for (const test of testCases) {
        const result = await interpretVoiceCommand(test.input)
        if (result?.intent === test.expected) {
            log('success', `✓ "${test.input}" → ${result.intent}`)
            passed++
        } else {
            log('error', `✗ "${test.input}" → ${result?.intent || 'null'} (attendu: ${test.expected})`)
        }
    }

    log(passed === testCases.length ? 'success' : 'warning',
        `\nRésultat: ${passed}/${testCases.length} tests passés`)
    return passed === testCases.length
}

async function testContractAnalysis() {
    console.log('\n📄 Test 2: Analyse Contractuelle')
    console.log('='.repeat(50))

    const sampleContract = `
    CONTRAT DE PRESTATION DE SERVICES
    
    ENTRE LES SOUSSIGNÉS :
    Société Alpha SARL, au capital de 1.000.000 FCFA
    
    ET:
    M. Dupont, demeurant à Dakar
    
    Article 12 - Non-concurrence
    Le Client s'interdit d'exercer toute activité concurrente pendant une durée de 5 ans.
    
    Article 15 - Loi Applicable
    Le présent contrat est régi par les usages du commerce.
    `

    try {
        const analysis = await analyzeContractText(sampleContract)

        log('info', `Parties détectées: ${analysis.parties.length}`)
        analysis.parties.forEach(p => console.log(`  - ${p}`))

        log('info', `Risques détectés: ${analysis.risks.length}`)
        analysis.risks.forEach(r => {
            const severityColor = r.severity === 'HIGH' ? RED : r.severity === 'MEDIUM' ? YELLOW : GREEN
            console.log(`  ${severityColor}[${r.severity}]${RESET} ${r.text}`)
        })

        const hasHighRisk = analysis.risks.some(r => r.severity === 'HIGH')
        log(hasHighRisk ? 'success' : 'warning',
            hasHighRisk ? '✓ Risques HAUTE sévérité bien détectés' : '⚠ Aucun risque haute sévérité détecté')

        return analysis.risks.length > 0
    } catch (error) {
        log('error', `✗ Erreur: ${error}`)
        return false
    }
}

async function testSearchFilters() {
    console.log('\n🔍 Test 3: Extraction Filtres de Recherche')
    console.log('='.repeat(50))

    const queries = [
        "Jurisprudence CCJA 2020 sur la saisie",
        "Code du travail sénégalais licenciement",
        "Acte uniforme OHADA recouvrement"
    ]

    let passed = 0
    for (const query of queries) {
        const filters = await extractSearchFilters(query)

        const hasFilters = filters.type || filters.region || filters.year || filters.keywords
        if (hasFilters) {
            log('success', `✓ "${query}"`)
            console.log(`  Type: ${filters.type || 'N/A'}, Région: ${filters.region || 'N/A'}, Année: ${filters.year || 'N/A'}`)
            console.log(`  Mots-clés: ${filters.keywords}`)
            passed++
        } else {
            log('error', `✗ Aucun filtre extrait de: "${query}"`)
        }
    }

    log(passed === queries.length ? 'success' : 'warning',
        `\nRésultat: ${passed}/${queries.length} tests passés`)
    return passed === queries.length
}

async function testAICompletion() {
    console.log('\n🤖 Test 4: Génération IA (DeepSeek/OpenAI)')
    console.log('='.repeat(50))

    const hasAPIKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY

    if (!hasAPIKey) {
        log('warning', '⚠ Aucune clé API configurée - Test en mode dégradé')
    }

    const prompt = "Quel est le délai d'appel en droit OHADA ?"
    const mockContextDocs = [{
        id: '1',
        title: 'Acte Uniforme OHADA - Procédure',
        content: 'Le délai d\'appel est de 30 jours...',
        reference: 'AUPSRVE',
        type: 'ACTE_UNIFORME'
    }]

    try {
        log('info', `Prompt: "${prompt}"`)
        const response = await generateCompletion(prompt, mockContextDocs, 'RESEARCH')

        if (response) {
            log('success', `✓ Réponse générée (${response.length} caractères)`)
            console.log(`\nExtrait: "${response.substring(0, 150)}..."`)

            // Vérifier si ce n'est pas juste le fallback
            const isFallback = response.includes('🤖') || response.includes('mode dégradé')
            if (isFallback && hasAPIKey) {
                log('warning', '⚠ Mode dégradé actif malgré clé API configurée')
            } else if (!isFallback && hasAPIKey) {
                log('success', '✓ API IA fonctionnelle')
            } else {
                log('info', 'ℹ Mode dégradé (attendu sans clé API)')
            }

            return true
        } else {
            log('error', '✗ Aucune réponse générée')
            return false
        }
    } catch (error) {
        log('error', `✗ Erreur: ${error}`)
        return false
    }
}

async function checkEnvironment() {
    console.log('\n⚙️  Vérification Environnement')
    console.log('='.repeat(50))

    const checks = [
        { name: 'DATABASE_URL', value: process.env.DATABASE_URL },
        { name: 'DEEPSEEK_API_KEY', value: process.env.DEEPSEEK_API_KEY },
        { name: 'OPENAI_API_KEY', value: process.env.OPENAI_API_KEY }
    ]

    checks.forEach(check => {
        if (check.value) {
            log('success', `✓ ${check.name} configuré`)
        } else {
            log('warning', `⚠ ${check.name} non configuré`)
        }
    })

    const hasAnyAI = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
    console.log()
    if (!hasAnyAI) {
        log('warning', '⚠ IMPORTANT: Aucune clé API IA configurée')
        log('info', 'L\'application fonctionnera en mode dégradé (RAG local uniquement)')
        log('info', 'Pour activer l\'IA complète:')
        console.log('  1. Créez un compte sur https://platform.deepseek.com')
        console.log('  2. Ajoutez DEEPSEEK_API_KEY dans .env.local')
        console.log('  3. Redémarrez le serveur\n')
    }
}

async function runAllTests() {
    console.clear()
    console.log('╔════════════════════════════════════════════════╗')
    console.log('║   🧪 Tests Automatiques - Assistants IA       ║')
    console.log('║   Avocat Premium - v1.0.0                     ║')
    console.log('╚════════════════════════════════════════════════╝')

    await checkEnvironment()

    const results = {
        voiceCommands: await testVoiceCommands(),
        contractAnalysis: await testContractAnalysis(),
        searchFilters: await testSearchFilters(),
        aiCompletion: await testAICompletion()
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 RÉSUMÉ FINAL')
    console.log('='.repeat(50))

    const total = Object.keys(results).length
    const passed = Object.values(results).filter(Boolean).length

    Object.entries(results).forEach(([name, passed]) => {
        const statusIcon = passed ? '✓' : '✗'
        const statusColor = passed ? GREEN : RED
        console.log(`${statusColor}${statusIcon}${RESET} ${name}`)
    })

    console.log()
    if (passed === total) {
        log('success', `🎉 TOUS LES TESTS RÉUSSIS (${passed}/${total})`)
        log('success', 'L\'application est prête pour la production !')
    } else {
        log('warning', `⚠ ${passed}/${total} tests réussis`)
        log('info', 'Consultez docs/AI_CONFIGURATION.md pour le troubleshooting')
    }

    console.log('\n')
    process.exit(passed === total ? 0 : 1)
}

// Exécution
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('Erreur fatale:', error)
        process.exit(1)
    })
}

export { runAllTests }
