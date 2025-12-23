
import { initJurisprudenceLibrary, searchJurisprudence } from '@/app/actions'
import { SearchBar } from '@/components/recherche/SearchBar'
import { JurisprudenceList } from '@/components/recherche/JurisprudenceList'
import { AddJurisprudenceDialog } from '@/components/recherche/AddJurisprudenceDialog'
import { WebWatchDialog } from '@/components/recherche/WebWatchDialog'
import { BookOpen } from 'lucide-react'

export default async function RecherchePage({ searchParams }: { searchParams: { q?: string } }) {
    // Lazy Init DB
    await initJurisprudenceLibrary()

    // Search
    const query = searchParams.q || ""
    const results = await searchJurisprudence(query)

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 min-h-screen">
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-emerald-700" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-serif">
                    Lexbase Sénégal & OHADA
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Moteur de recherche intelligent combinant la jurisprudence locale et l'analyse par intelligence artificielle.
                </p>

                <div className="flex justify-center gap-4 mt-6">
                    <AddJurisprudenceDialog />
                    <WebWatchDialog />
                </div>
            </div>

            <SearchBar />

            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {query ? `Résultats pour "${query}"` : 'Jurisprudence Récente'}
                    </h2>
                    <span className="text-sm text-slate-500">{results.length} décisions trouvées</span>
                </div>

                <JurisprudenceList results={results} />
            </div>
        </div>
    )
}
