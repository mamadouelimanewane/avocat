/**
 * LexAI - Intelligence Artificielle Juridique
 * Fonctions d'IA réelles pour l'analyse et la génération de contenu juridique
 */

// Configuration API
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

interface JurisprudenceDoc {
    id: string
    title: string
    content: string | null
    reference: string | null
    type: string
}

/**
 * Génère une réponse IA basée sur le contexte RAG
 */
export async function generateCompletion(
    prompt: string,
    contextDocs: JurisprudenceDoc[],
    mode: string = 'RESEARCH'
): Promise<string | null> {
    try {
        // ✅ CHECK CACHE FIRST
        const { aiCache } = await import('./ai-cache')
        const cached = aiCache.get(prompt, mode)
        if (cached) {
            return cached
        }

        // Construction du contexte RAG
        const context = contextDocs.length > 0
            ? contextDocs.map(doc => `[${doc.reference || 'N/A'}] ${doc.title}\n${(doc.content || '').substring(0, 500)}...`).join('\n\n')
            : "Aucun document pertinent trouvé dans la base de connaissances.";

        // Prompt système selon le mode
        const systemPrompt = mode === 'DRAFTING'
            ? `Tu es un assistant juridique expert en droit Sénégalais et OHADA. Tu rédiges des actes juridiques professionnels en français formel.`
            : mode === 'PLEADING'
                ? `Tu es un avocat plaidant expert. Rédige des arguments juridiques convaincants en respectant la forme et le style des plaidoiries.`
                : `Tu es un expert juridique en droit Sénégalais et OHADA. Réponds de manière précise en citant les textes applicables.`;

        const userPrompt = `${systemPrompt}

CONTEXTE JURIDIQUE (Base RAG):
${context}

QUESTION/DEMANDE:
${prompt}

Réponds de manière structurée et professionnelle en français.`;

        // Tentative avec DeepSeek (prioritaire car moins cher)
        if (DEEPSEEK_API_KEY) {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (response.ok) {
                const data = await response.json();
                const result = data.choices[0]?.message?.content || null;

                // ✅ STORE IN CACHE
                if (result) {
                    aiCache.set(prompt, mode, result)
                }

                return result;
            }
        }

        // Fallback OpenAI
        if (OPENAI_API_KEY) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (response.ok) {
                const data = await response.json();
                const result = data.choices[0]?.message?.content || null;

                // ✅ STORE IN CACHE
                if (result) {
                    aiCache.set(prompt, mode, result)
                }

                return result;
            }
        }

        // Fallback simulé intelligent basé sur le contexte
        const fallback = generateFallbackResponse(prompt, contextDocs, mode);

        // Cache fallback aussi (moins prioritaire mais utile)
        if (fallback) {
            aiCache.set(prompt, mode, fallback)
        }

        return fallback;

    } catch (error) {
        console.error('AI Completion Error:', error);
        return generateFallbackResponse(prompt, contextDocs, mode);
    }
}

/**
 * Interprète une commande vocale et extrait l'intention
 */
export async function interpretVoiceCommand(transcript: string): Promise<{
    intent: string
    title?: string
    content?: string
    date?: string
    type?: string
    query?: string
    page?: string
} | null> {
    const lower = transcript.toLowerCase();

    // Patterns de détection d'intention
    const patterns = {
        CREATE_NOTE: /(?:créer|ajouter|prendre) (?:une )?note|note(?:r)? (?:que|:)/i,
        CREATE_EVENT: /(?:créer|ajouter|planifier|programmer) (?:un )?(?:rendez-vous|rdv|événement|audience)/i,
        SEARCH: /(?:rechercher|chercher|trouver|trouve-moi|cherche)/i,
        NAVIGATE: /(?:aller à|aller sur|ouvrir|afficher|va à) (?:la page |le module |l'onglet )?(?:de |des |du )?(.*)/i
    };

    // Détection CREATE_NOTE
    if (patterns.CREATE_NOTE.test(lower)) {
        const content = transcript.replace(patterns.CREATE_NOTE, '').trim();
        return {
            intent: 'CREATE_NOTE',
            content: content || transcript
        };
    }

    // Détection CREATE_EVENT
    if (patterns.CREATE_EVENT.test(lower)) {
        const titleMatch = transcript.match(/(?:rendez-vous|rdv|événement|audience) (?:avec |pour |de )?(.*?)(?:\sle\s|\sà\s|$)/i);
        const dateMatch = transcript.match(/le (\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2} (?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) \d{4})/i);

        return {
            intent: 'CREATE_EVENT',
            title: titleMatch?.[1] || 'RDV (Vocal)',
            date: dateMatch?.[1],
            type: lower.includes('audience') ? 'AUDIENCE' : 'RDV'
        };
    }

    // Détection SEARCH
    if (patterns.SEARCH.test(lower)) {
        const query = transcript.replace(patterns.SEARCH, '').trim();
        return {
            intent: 'SEARCH',
            query: query
        };
    }

    // Détection NAVIGATE
    const navMatch = lower.match(patterns.NAVIGATE);
    if (navMatch) {
        const target = navMatch[1] || '';
        const pageMap: Record<string, string> = {
            'dossiers': 'dossiers',
            'clients': 'clients',
            'factures': 'factures',
            'agenda': 'agenda',
            'comptabilité': 'comptabilite',
            'rapports': 'rapports',
            'tableaux de bord': '',
            'accueil': '',
            'dashboard': ''
        };

        for (const [key, value] of Object.entries(pageMap)) {
            if (target.includes(key)) {
                return {
                    intent: 'NAVIGATE',
                    page: value
                };
            }
        }
    }

    return null;
}

/**
 * Analyse un contrat et détecte les risques juridiques
 */
export async function analyzeContractText(text: string): Promise<{
    summary: string
    risks: Array<{ severity: 'HIGH' | 'MEDIUM' | 'LOW', text: string }>
    parties: string[]
    dates: Array<{ label: string, value: string }>
    clauses: Array<{ type: string, text: string, risk?: string }>
}> {
    // Si une clé API est configurée, on utilise l'IA pour une analyse plus profonde
    if (DEEPSEEK_API_KEY || OPENAI_API_KEY) {
        const prompt = `Analyse ce contrat juridique (Droit Sénégalais/OHADA) et extrais les informations suivantes sous forme de JSON uniquement :
        {
            "summary": "Résumé concis du contrat",
            "risks": [{"severity": "HIGH|MEDIUM|LOW", "text": "description du risque"}],
            "parties": ["Nom Partie 1", "Nom Partie 2"],
            "dates": [{"label": "Date de signature/Echéance", "value": "2025-..."}],
            "clauses": [{"type": "Non-concurrence", "text": "contenu", "risk": "avis"}]
        }
        
        TEXTE DU CONTRAT:
        ${text.substring(0, 10000)}`

        try {
            const response = await generateCompletion(prompt, [], 'RESEARCH')
            if (response) {
                // Nettoyage JSON
                const jsonStr = response.includes('```')
                    ? response.split('```')[1].replace('json', '').trim()
                    : response.trim()
                return JSON.parse(jsonStr)
            }
        } catch (error) {
            console.error("Erreur analyse IA profonde, basculement sur heuristique:", error)
        }
    }

    // --- FALLBACK HEURISTIQUE (Analyse locale si pas d'API) ---
    const parties: string[] = [];
    const partyPatterns = [
        /(?:Société|SARL|SAS|SA)\s+([A-Z][A-Za-zÀ-ÿ\s]+)(?:,|au capital)/gi,
        /M\.\s+([A-Z][a-z]+)/g,
        /Mme\s+([A-Z][a-z]+)/g
    ];

    partyPatterns.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            if (match[1] && !parties.includes(match[1])) {
                parties.push(match[1].trim());
            }
        }
    });

    const dates: Array<{ label: string, value: string }> = [];
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g;
    const dateMatches = text.matchAll(datePattern);
    let dateIndex = 1;
    for (const match of dateMatches) {
        dates.push({ label: `Date ${dateIndex}`, value: match[1] });
        dateIndex++;
    }

    const risks: Array<{ severity: 'HIGH' | 'MEDIUM' | 'LOW', text: string }> = [];
    if (/non-concurrence|interdiction de concurrence/i.test(text)) {
        const durationMatch = text.match(/(?:pendant|durée de)\s+(\d+)\s+ans/i);
        if (durationMatch && parseInt(durationMatch[1]) > 2) {
            risks.push({ severity: 'HIGH', text: `Clause de non-concurrence excessive (${durationMatch[1]} ans) - Limite OHADA: 2 ans.` });
        }
    }

    if (/usages du commerce/i.test(text) && !/loi applicable/i.test(text)) {
        risks.push({ severity: 'HIGH', text: 'Clause de loi applicable vague - Risque d\'insécurité juridique.' });
    }

    const summary = `Contrat impliquant ${parties.length} partie(s). ${risks.length} point(s) de vigilance. Type : ${detectContractType(text)}. (Analyse Heuristique)`;

    return {
        summary,
        risks,
        parties,
        dates,
        clauses: []
    };
}

/**
 * Détecte le type de contrat
 */
function detectContractType(text: string): string {
    if (/bail|location|loyer/i.test(text)) return 'Contrat de Bail';
    if (/prestation de services|mission/i.test(text)) return 'Contrat de Prestation de Services';
    if (/travail|emploi|salarié/i.test(text)) return 'Contrat de Travail';
    if (/société|statuts|associés/i.test(text)) return 'Statuts de Société';
    return 'Contrat Commercial';
}

/**
 * Génère une réponse fallback intelligente sans API
 */
function generateFallbackResponse(prompt: string, docs: JurisprudenceDoc[], mode: string): string {
    const lower = prompt.toLowerCase();

    if (mode === 'DRAFTING') {
        return `# PROJET D'ACTE JURIDIQUE

L'AN DEUX MILLE VINGT-CINQ,
ET LE [DATE À COMPLÉTER],

À LA REQUÊTE DE :
[NOM DU REQUÉRANT]
Demeurant à [ADRESSE]

J'AI, HUISSIER DE JUSTICE SOUSSIGNÉ,

DONNÉ ASSIGNATION À :
[NOM DU DÉFENDEUR]

À COMPARAÎTRE devant le Tribunal [COMPÉTENT] de [VILLE]

AUX FINS DE :
- [OBJET DE LA DEMANDE]

SUR LE FONDEMENT DE :
${docs.length > 0 ? `Article(s) pertinent(s) : ${docs[0].reference}` : 'Articles applicables du Code OHADA'}

PAR CES MOTIFS :
[DÉVELOPPER LES DEMANDES]

🤖 Note: Cette réponse est générée en mode dégradé. Configurez DEEPSEEK_API_KEY pour une génération IA complète.`;
    }

    if (mode === 'PLEADING') {
        return `# PLAIDOIRIE - PROJET

Mesdames, Messieurs les membres du Tribunal,

## I. RAPPEL DES FAITS

L'affaire qui vous est soumise aujourd'hui concerne...

## II. EN DROIT

Sur le fondement des dispositions ${docs.length > 0 ? `de ${docs[0].reference}` : 'applicables'}...

Le principe est clairement établi que...

## III. PAR CES MOTIFS

Nous demandons respectueusement au Tribunal de bien vouloir :
- [DEMANDE PRINCIPALE]
- Condamner la partie adverse aux dépens

🤖 Plaidoirie générée en mode dégradé. Activez l'API IA pour un argumentaire complet.`;
    }

    // Mode RESEARCH
    if (docs.length > 0) {
        return `D'après la base de connaissances juridique :

📚 ${docs[0].title} (${docs[0].reference || 'N/A'})

${(docs[0].content || '').substring(0, 300)}...

💡 Conseil : ${docs.length} document(s) pertinent(s) trouvé(s) dans la base. Consultez les sources suggérées pour plus de détails.

🤖 Réponse basée sur la recherche RAG. Configurez une clé API pour des analyses IA approfondies.`;
    }

    return `Je n'ai pas trouvé de documentation pertinente dans ma base de connaissances pour répondre à cette question.

💡 Suggestions :
- Vérifiez l'orthographe de votre recherche
- Utilisez des termes juridiques plus généraux
- Consultez l'annuaire pour contacter un confrère spécialisé

🤖 Mode dégradé actif. Contactez l'administrateur pour activer l'IA complète.`;
}

/**
 * Extrait les filtres de recherche depuis une requête en langage naturel
 */
export async function extractSearchFilters(query: string): Promise<{
    type?: string
    region?: string
    year?: number
    keywords: string
}> {
    const lower = query.toLowerCase();

    // Détection du type
    let type: string | undefined;
    if (lower.includes('jurisprudence') || lower.includes('arrêt') || lower.includes('décision')) {
        type = 'JURISPRUDENCE';
    } else if (lower.includes('loi') || lower.includes('code')) {
        type = 'LOI';
    } else if (lower.includes('acte uniforme') || lower.includes('ohada')) {
        type = 'ACTE_UNIFORME';
    }

    // Détection de la région
    let region: string | undefined;
    if (lower.includes('sénégal') || lower.includes('senegal')) {
        region = 'SENEGAL';
    } else if (lower.includes('ohada')) {
        region = 'OHADA';
    } else if (lower.includes('ccja')) {
        region = 'OHADA';
    }

    // Extraction de l'année
    const yearMatch = query.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0]) : undefined;

    // Extraction des mots-clés (enlever les stopwords)
    const stopwords = ['de', 'la', 'le', 'les', 'un', 'une', 'des', 'du', 'en', 'et', 'ou', 'sur', 'pour', 'dans', 'à'];
    const words = query.toLowerCase().split(/\s+/)
        .filter(w => w.length > 3 && !stopwords.includes(w));

    const keywords = words.join(' ');

    return { type, region, year, keywords };
}
