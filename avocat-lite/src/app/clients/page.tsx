import {
    Users,
    Search,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    ExternalLink
} from "lucide-react"

const clients = [
    {
        id: "1",
        name: "M. Ibrahima Fall",
        type: "Particulier",
        email: "i.fall@example.com",
        phone: "+221 77 123 45 67",
        dossiers: 3,
    },
    {
        id: "2",
        name: "SCI Les Perles",
        type: "Entreprise",
        email: "contact@lesperles.sn",
        phone: "+221 33 821 00 11",
        dossiers: 12,
    },
    {
        id: "3",
        name: "Mme Mariama Sarr",
        type: "Particulier",
        email: "mariama.sarr@orange.sn",
        phone: "+221 70 987 65 43",
        dossiers: 1,
    }
]

export default function ClientsPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Annuaire Clients</h2>
                    <p className="text-muted-foreground font-light">
                        Gérez vos contacts et accédez rapidement à leurs dossiers.
                    </p>
                </div>
                <button className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouveau Client
                </button>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Rechercher un client par nom, email ou téléphone..."
                    className="w-full pl-10 p-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clients.map((client) => (
                    <div key={client.id} className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-muted rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition">
                                <Users className="h-6 w-6" />
                            </div>
                            <button className="p-1 hover:bg-muted rounded">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>

                        <h3 className="font-bold text-lg mb-1">{client.name}</h3>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                            {client.type}
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2" />
                                {client.email}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-2" />
                                {client.phone}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <div className="text-xs">
                                <span className="font-bold">{client.dossiers}</span>
                                <span className="text-muted-foreground ml-1">dossiers actifs</span>
                            </div>
                            <button className="text-xs font-bold flex items-center hover:underline">
                                Voir détails <ExternalLink className="h-3 w-3 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
