
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        // Define multiple sources for a broader search targeting specific legal domains
        const feedUrls = [
            `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' "Journal Officiel" OR "Décret" OR "Loi" Sénégal')}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('OHADA "Acte Uniforme" OR "CCJA" ' + query)}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('UEMOA "Règlement" OR "Directive" ' + query)}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('"Droit Communautaire" Afrique ' + query)}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('"Jurisprudence" OR "Arrêt" OR "Jugement" "Cour Suprême" Sénégal OR "Cour d\'Appel" Dakar')}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('"Code Pénal" OR "Code Civil" OR "Code du Travail" OR "COCC" OR "Code Général des Impôts" OR "Code Minier" OR "Code de la Famille" Sénégal')}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('"Code des Douanes" OR "Code des Marchés Publics" OR "Code de l\'Urbanisme" OR "Code de l\'Environnement" OR "Code des Collectivités Territoriales" Sénégal')}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('"Code Electoral" OR "Code de la Presse" OR "Code de la Pêche" OR "Code Forestier" OR "Code des Télécommunications" OR "Code de l\'Aviation Civile" Sénégal')}&hl=fr&gl=SN&ceid=SN:fr`,
            `https://news.google.com/rss/search?q=${encodeURIComponent('"Code de la Construction" OR "Code de la Route" OR "Code de la Santé" OR "Code des Obligations de l\'Administration" Sénégal')}&hl=fr&gl=SN&ceid=SN:fr`
        ];

        let allItems: any[] = [];

        // Fetch all feeds in parallel
        await Promise.all(feedUrls.map(async (url) => {
            try {
                const feed = await parser.parseURL(url);
                const items = feed.items.map(item => ({
                    id: item.guid || item.link,
                    title: item.title,
                    source: item.creator || item.source?.trim() || "Web Juridique",
                    url: item.link,
                    date: item.pubDate ? new Date(item.pubDate).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }) : "Aucune date",
                    status: 'new'
                }));
                allItems = [...allItems, ...items];
            } catch (err) {
                console.error(`Error fetching feed ${url}:`, err);
            }
        }));

        // Deduplicate by title
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.title, item])).values());

        // Limit results
        const limitedResults = uniqueItems.slice(0, 8);

        return NextResponse.json({ success: true, results: limitedResults });
    } catch (error) {
        console.error("Crawler Error:", error);
        return NextResponse.json({ success: false, error: "Failed to crawl sources" }, { status: 500 });
    }
}
