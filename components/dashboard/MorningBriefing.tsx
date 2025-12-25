
import { Sparkles, Sun } from 'lucide-react'

export function MorningBriefing({ stats, agenda }: { stats: any, agenda: any[] }) {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    const meetingCount = agenda.length

    // Simple logic to generate a "Smart" sentence
    let insight = "Tout est calme pour le moment."
    if (meetingCount > 2) insight = "Journée chargée en perspective."
    if (stats.impayes > 1000000) insight = "N'oubliez pas les relances factures."
    if (stats.tasksHigh > 0) insight = `${stats.tasksHigh} tâches prioritaires requièrent votre attention.`

    return (
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-indigo-300 uppercase tracking-wider text-xs font-semibold">
                    <Sun className="h-4 w-4" />
                    <span>Briefing du {today}</span>
                </div>

                <h1 className="text-3xl font-bold mb-4">Bonjour, Maître.</h1>

                <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <Sparkles className="h-6 w-6 text-amber-300" />
                    </div>
                    <div>
                        <p className="text-lg font-light leading-relaxed">
                            {insight} Vous avez <strong className="text-white font-bold">{meetingCount} rendez-vous</strong> prévus d'ici demain et <strong className="text-white font-bold">{stats.dossiersActifs} dossiers</strong> actifs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
