
import { PrismaClient } from '@prisma/client'
import { analyzeCrawledContent, filterRelevantLinks } from '@/lib/openai'

// Use a dedicated prisma instance or let the caller provide it? 
// For simplicity, new instance here (singleton pattern ideally)
const prisma = new PrismaClient()

export async function processUrl(url: string, region: string = 'SENEGAL') {
    try {
        const simulatedFetch = await fetch(url).then(res => res.text()).catch(() => "")
        if (!simulatedFetch) return { success: false, message: "Impossible d'accéder à l'URL" }

        // Remove heavy scripts/styles
        const lightContent = simulatedFetch.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, "")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/g, "")
            .replace(/<[^>]+>/g, " ");

        // AI ANALYSIS (DeepSeek)
        const aiAnalysis = await analyzeCrawledContent(lightContent, url);

        let finalData = {
            title: "Document sans titre (Crawl)",
            type: "VEILLE_JURIDIQUE",
            content: lightContent.substring(0, 5000),
            summary: "Extraction brute.",
            reference: 'CRAWL-' + new Date().getTime(),
            keywords: '["veille"]',
            date: new Date()
        }

        if (aiAnalysis) {
            finalData = {
                title: aiAnalysis.title || finalData.title,
                type: aiAnalysis.type || "VEILLE_JURIDIQUE",
                content: aiAnalysis.cleanedContent || finalData.content,
                summary: aiAnalysis.summary || "Analysé par DeepSeek",
                reference: aiAnalysis.reference || finalData.reference,
                keywords: JSON.stringify(aiAnalysis.keywords || []),
                date: aiAnalysis.date ? new Date(aiAnalysis.date) : new Date()
            }
        } else {
            const titleMatch = simulatedFetch.match(/<title>(.*?)<\/title>/)
            if (titleMatch) finalData.title = titleMatch[1]
        }

        await prisma.jurisprudence.create({
            data: {
                ...finalData,
                court: region,
                region: region,
                sourceUrl: url,
                status: 'PENDING',
            }
        })

        return { success: true, message: aiAnalysis ? "Document analysé par IA" : "Document brut", data: finalData }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur technique crawl" }
    }
}

export async function discoverLinks(url: string) {
    try {
        const html = await fetch(url).then(res => res.text()).catch(() => "")
        if (!html) return { success: false, links: [] }

        const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi
        const links = []
        let match

        while ((match = linkRegex.exec(html)) !== null) {
            const href = match[1]
            const text = match[2].replace(/<[^>]+>/g, "").trim()

            if (href && text && text.length > 5 && !href.startsWith('#') && !href.startsWith('javascript:')) {
                try {
                    const absoluteUrl = new URL(href, url).href;
                    links.push({ text, href: absoluteUrl })
                } catch (e) { }
            }
        }

        const uniqueLinks = Array.from(new Map(links.map(item => [item.href, item])).values());
        const relevantLinks = await filterRelevantLinks(uniqueLinks, url)

        return { success: true, links: relevantLinks }
    } catch (e) {
        console.error(e)
        return { success: false, links: [] }
    }
}
