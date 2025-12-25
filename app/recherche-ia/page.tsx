import { GlobalSmartSearch } from "@/components/ai/GlobalSmartSearch"

export default function RechercheIAPage() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recherche Intelligence Artificielle</h1>
                <p className="text-slate-500">Moteur de recherche global alimenté par IA pour vos dossiers, documents et base de connaissances.</p>
            </div>

            <GlobalSmartSearch />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dossiers</p>
                    <p className="text-2xl font-bold text-slate-700">1,240</p>
                    <p className="text-[10px] text-slate-400">Indexés en temps réel</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Documents</p>
                    <p className="text-2xl font-bold text-slate-700">12,500+</p>
                    <p className="text-[10px] text-slate-400">Full-text searchable</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Uptime IA</p>
                    <p className="text-2xl font-bold text-emerald-600">99.9%</p>
                    <p className="text-[10px] text-slate-400">ElasticSearch Node Active</p>
                </div>
            </div>
        </div>
    )
}
