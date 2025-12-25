
import OpenAI from 'openai';

// Initialize OpenAI client compatible with DeepSeek
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.deepseek.com'
    });
}

/**
 * Generate a text response using DeepSeek Chat with RAG context.
 */
export async function generateCompletion(prompt: string, contextDocuments: any[], mode: string) {
    if (!openai) {
        return null; // Fallback to simulation mode if no key
    }

    try {
        const systemPrompt = `Tu es LexAI, un assistant juridique "Senior" expert en droit OHADA et Sénégalais.

PROTOCOLE DE RÉPONSE (HIÉRARCHIE DES SOURCES) :
1. PRIORITÉ ABSOLUE : DOCUMENTS INTERNES (RAG)
   - Si des documents sont fournis ci-dessous ("SOURCES INTERNES"), utilise-les OBLIGATOIREMENT.
   - Cite ces sources précisément (ex: "Selon l'Arrêt interne N°25...").

2. FALLBACK : CONNAISSANCE GÉNÉRALE / WEB
   - Si AUCUN document interne n'est pertinent ou trouvé, utilise ta vaste connaissance juridique (DeepSeek Knowledge).
   - DANS CE CAS, tu dois commencer ta réponse par : "⚠️ *Note : Cette réponse est basée sur mes connaissances générales et non sur la documentation interne du cabinet.*"
   - Cite des articles de loi ou des arrêts publics connus.

MODE ACTUEL : ${mode}`;

        const contextText = contextDocuments.length > 0
            ? contextDocuments.map((doc, i) =>
                `--- SOURCE INTERNE ${i + 1}: ${doc.title} (${doc.reference}) ---\n${doc.content}\n--- FIN SOURCE ${i + 1} ---\n`
            ).join('\n')
            : "AUCUN DOCUMENT INTERNE TROUVÉ. PASSE EN MODE 'CONNAISSANCE GÉNÉRALE'.";

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "system", content: `CONTEXTE DOCUMENTAIRE :\n${contextText}` },
                { role: "user", content: prompt }
            ],
            model: "deepseek-chat",
            temperature: 0.4,
            max_tokens: 1500
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("DeepSeek API Error:", error);
        return null;
    }
}

/**
 * Uses DeepSeek to scan a list of links and identify which ones are likely Legal Documents (Law, Jurisprudence).
 */
export async function filterRelevantLinks(links: { text: string, href: string }[], domain: string) {
    if (!openai) return [];

    try {
        const systemPrompt = `Tu es une IA de veille juridique ("Scout").
        Tu reçois une liste de liens (texte + url) extraits d'une page web (${domain}).
        
        Ta mission : Identifier les liens qui pointent PROBABLEMENT vers :
        - Un texte de loi complet (PDF ou HTML)
        - Une décision de justice / Jurisprudence
        - Un article de doctrine juridique
        
        Ignore strictement : les liens de navigation (Accueil, Contact), les publicités, les profils utilisateurs, les login.
        
        Renvoie un JSON contenant UNIQUEMENT les liens pertinents :
        {
            "relevantLinks": [
                { "text": "Titre document", "href": "url", "reason": "Semble être un arrêt CCJA", "score": 90 }
            ]
        }
        `;

        // Limit to 50 links to avoid context window overload
        const inputData = JSON.stringify(links.slice(0, 50));

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `LIENS À ANALYSER :\n${inputData}` }
            ],
            model: "deepseek-chat",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const result = completion.choices[0].message.content;
        const parsed = result ? JSON.parse(result) : { relevantLinks: [] };
        return parsed.relevantLinks;

    } catch (error) {
        console.error("DeepSeek Link Filter Error:", error);
        return [];
    }
}

/**
 * Uses DeepSeek Knowledge to suggest SEED URLs for a specific research topic.
 * Example: "Codes du Sénégal" -> ["https://www.sec.gouv.sn/lois-et-reglements", "http://www.jo.gouv.sn/"]
 */
export async function findTargetUrls(topic: string) {
    if (!openai) return [];

    try {
        const systemPrompt = `Tu es un expert en recherche juridique sur le Web Africain (OHADA, Sénégal, UEMOA).
        Un utilisateur veut trouver des documents sur : "${topic}".
        
        Ta mission : Fournir une liste de 3 à 5 URLs PRÉCISES et RÉELLES où ces documents sont listés (Hubs).
        Privilégie les sites officiels (.gouv.sn, ohada.com, cour-supreme.sn) ou très fiables (droit-afrique.com).
        
        FORMAT JSON ATTENDU :
        {
            "urls": ["url1", "url2"]
        }
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: topic }
            ],
            model: "deepseek-chat",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const result = completion.choices[0].message.content;
        const parsed = result ? JSON.parse(result) : { urls: [] };
        return parsed.urls;

    } catch (error) {
        console.error("DeepSeek Seed Finder Error:", error);
        return [];
    }
}

/**
 * Uses DeepSeek to parse a natural language search query into structured filters and keywords.
 * Example: "Arrêts CCJA sur le licenciement en 2023"
 * Returns: { keywords: "licenciement", type: "JURISPRUDENCE", court: "CCJA", year: 2023 }
 */
export async function extractSearchFilters(query: string) {
    if (!openai) return { keywords: query };

    try {
        const systemPrompt = `Tu es un assistant de recherche juridique.
        Convertis la requête naturelle de l'utilisateur en filtres de recherche structurés pour une base de données.
        
        Champs possibles :
        - keywords (string): Mots-clés principaux **sous forme d'une seule chaine** (ex: "rupture bail"). Pas de tableau.
        - type (string): LOI, JURISPRUDENCE, DOCTRINE.
        - region (string): SENEGAL, OHADA, UEMOA.
        - year (number): Année explicite mentionnée.
        
        Renvoie un JSON. Si un champ n'est pas mentionné, omets-le.
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            model: "deepseek-chat",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const result = completion.choices[0].message.content;
        return result ? JSON.parse(result) : { keywords: query };
    } catch (error) {
        return { keywords: query };
    }
}

/**
 * Uses DeepSeek to analyze raw crawled content and extract structured metadata.
 */
export async function analyzeCrawledContent(rawText: string, url: string) {
    if (!openai) return null;

    try {
        const systemPrompt = `Tu es une IA experte en structuration de données juridiques (Crawler Intelligent).
        Ta mission : Analyser le texte brut d'une page web juridique et en extraire un objet JSON structuré.
        
        FORMAT JSON ATTENDU :
        {
            "title": "Titre officiel du texte ou de l'arrêt",
            "type": "LOI" | "JURISPRUDENCE" | "DOCTRINE" | "AUTRE",
            "date": "YYYY-MM-DD" (Date du texte, ou null),
            "summary": "Résumé concis en 2 phrases",
            "reference": "Numéro de loi ou d'arrêt (ex: J-2024-12)",
            "keywords": ["mot1", "mot2", "mot3"],
            "cleanedContent": "Le texte juridique épuré (sans menus, pubs, ni navigation)..."
        }
        
        Si tu ne trouves pas une info, mets null.
        Garde le 'cleanedContent' fidèle au texte original de loi/arrêt.
        `;

        // We limit input to ~15k chars to avoid token overflow, focusing on the core
        const clippedInput = rawText.substring(0, 15000);

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `URL Source: ${url}\n\nCONTENU BRUT :\n${clippedInput}` }
            ],
            model: "deepseek-chat",
            temperature: 0.1, // Very precise for extraction
            response_format: { type: "json_object" } // DeepSeek V3 supports JSON mode
        });

        const result = completion.choices[0].message.content;
        return result ? JSON.parse(result) : null;
    } catch (error) {
        console.error("DeepSeek Extraction Error:", error);
        return null;
    }
}

export async function interpretVoiceCommand(transcript: string) {
    if (!openai) return null;

    const systemPrompt = `
    Tu es l'assistant personnel d'un avocat. Analyse la commande vocale et extrais l'intention structurée.
    
    Commandes possibles :
    1. 'CREATE_NOTE': Créer une note ou une tâche. Champs: intent='CREATE_NOTE', content (détail), dossier (nom approximatif).
    2. 'CREATE_EVENT': Agenda/RDV. Champs: intent='CREATE_EVENT', title, date (ISO string approximative YYYY-MM-DDTHH:mm:00, assume année courante si non précisé), type (AUDIENCE, RDV).
    3. 'SEARCH': Recherche juridique. Champs: intent='SEARCH', query.
    4. 'NAVIGATE': Aller à une page. Champs: intent='NAVIGATE', page (string: 'clients', 'dossiers', 'compta', 'dashboard').

    Réponds UNIQUEMENT le JSON.
    Exemple: "Rdv demain 15h avec Client Diop" -> {"intent": "CREATE_EVENT", "title": "RDV Client Diop", "date": "2025-XX-XXT15:00:00", "type": "RDV"}
    Exemple: "Note sur dossier Succession Diop il faut relancer l'huissier" -> {"intent": "CREATE_NOTE", "dossier": "Succession Diop", "content": "Relancer l'huissier"}
    `

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Date actuelle: ${new Date().toISOString()}. Commande: "${transcript}"` }
            ],
            model: "deepseek-chat",
            temperature: 0,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0].message.content || "{}"
        return JSON.parse(content)
    } catch (e) {
        console.error("Voice interpret error", e)
        return null
    }
}
