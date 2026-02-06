import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Gavel,
    Bell
} from "lucide-react"

const appointments = [
    {
        time: "09:00",
        title: "Audience Correctionnelle",
        location: "Tribunal de Dakar, Salle 4",
        dossier: "Affaire Fall c. État",
        type: "AUDIENCE",
    },
    {
        time: "11:30",
        title: "Rendez-vous Client",
        location: "Cabinet",
        dossier: "Litige Almadies",
        type: "RDV",
    },
    {
        time: "15:00",
        title: "Vérification Conclusions",
        location: "Bureau",
        dossier: "Divorce Sarr",
        type: "TRAVAIL",
    }
]

export default function AgendaPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Mon Agenda</h2>
                    <p className="text-muted-foreground font-light">
                        Suivez vos audiences et ne manquez aucune échéance juridique.
                    </p>
                </div>
                <div className="flex items-center gap-x-2">
                    <button className="p-2 border rounded-lg hover:bg-slate-50 transition">
                        <Bell className="h-5 w-5 text-slate-600" />
                    </button>
                    <button className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Nouvel Événement
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendrier Side (Visual Mockup) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold">Janvier 2026</h3>
                            <div className="flex gap-x-1">
                                <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="h-4 w-4" /></button>
                                <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-4 text-center text-xs mb-4">
                            <div className="font-bold text-slate-400">LU</div>
                            <div className="font-bold text-slate-400">MA</div>
                            <div className="font-bold text-slate-400">ME</div>
                            <div className="font-bold text-slate-400">JE</div>
                            <div className="font-bold text-slate-400">VE</div>
                            <div className="font-bold text-slate-400">SA</div>
                            <div className="font-bold text-slate-400">DI</div>

                            {Array.from({ length: 31 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "py-2 rounded-lg cursor-pointer transition",
                                        i + 1 === 16 ? "bg-slate-900 text-white font-bold" : "hover:bg-slate-100",
                                        [10, 15, 17].includes(i + 1) ? "font-bold text-slate-900 relative" : ""
                                    )}
                                >
                                    {i + 1}
                                    {[10, 15, 17].includes(i + 1) && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                        <h4 className="text-orange-900 font-bold mb-2 flex items-center">
                            <Gavel className="h-4 w-4 mr-2" /> Délais de Procédure
                        </h4>
                        <p className="text-xs text-orange-700 font-light mb-4">
                            2 échéances critiques nécessitent votre attention immédiate.
                        </p>
                        <div className="space-y-3">
                            <div className="bg-white/50 p-3 rounded-xl border border-orange-200">
                                <p className="text-xs font-bold text-orange-900">Dépôt conclusions #2024</p>
                                <p className="text-[10px] text-orange-700">Expire dans 48h</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Main */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold flex items-center">
                        Aujourd'hui, 16 Janvier 2026
                    </h3>

                    <div className="space-y-4">
                        {appointments.map((apt, index) => (
                            <div key={index} className="flex gap-x-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="text-sm font-bold text-slate-900 w-12">{apt.time}</div>
                                    <div className="w-px flex-1 bg-slate-200 group-last:bg-transparent my-2" />
                                </div>
                                <div className={cn(
                                    "flex-1 p-5 rounded-2xl border transition hover:shadow-md",
                                    apt.type === 'AUDIENCE' ? "bg-white border-l-4 border-l-slate-900" : "bg-white border-l-4 border-l-slate-200"
                                )}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900">{apt.title}</h4>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{apt.type}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                                        <div className="flex items-center text-xs text-slate-500">
                                            <MapPin className="h-3 w-3 mr-2" /> {apt.location}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <Clock className="h-3 w-3 mr-2" /> {apt.dossier}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
