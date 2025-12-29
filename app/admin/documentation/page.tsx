
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, Download, BookOpen, ShieldCheck, Cpu, GraduationCap, Layout, Database, AlertCircle, Presentation, Megaphone, FileBox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"

export default function DocumentationPage() {
    const cookieStore = cookies()
    const userRole = cookieStore.get('user_role')?.value || 'AVOCAT'
    const isAdmin = userRole === 'ADMIN'

    const manuals = [
        {
            id: 'ultra',
            title: "La Bible LexPremium (Ultra-Détaillé)",
            description: "Le manuel de référence complet couvrant tous les modules (40+ pages).",
            icon: <FileBox className="h-8 w-8 text-rose-600" />,
            file: '/manuals/manuel_utilisation_ultra.pdf',
            restricted: false
        },
        {
            id: 'flyer',
            title: "Flyer Commercial A4",
            description: "Support visuel pour la prospection et présentation rapide.",
            icon: <Megaphone className="h-8 w-8 text-amber-500" />,
            file: '/manuals/marketing_flyer.pdf',
            restricted: false
        },
        {
            id: 'presentation',
            title: "Pitch Deck Commercial",
            description: "Présentation de 10 slides pour vos rendez-vous stratégiques.",
            icon: <Presentation className="h-8 w-8 text-indigo-600" />,
            file: '/manuals/marketing_presentation.pdf',
            restricted: false
        },
        {
            id: 'utilisation',
            title: "Manuel d'Utilisation",
            description: "Guide complet pour les avocats et collaborateurs.",
            icon: <BookOpen className="h-8 w-8 text-blue-500" />,
            file: '/manuals/manuel_utilisation.pdf',
            restricted: false
        },
        {
            id: 'formation',
            title: "Manuel de Formation Magistral",
            description: "Le guide pédagogique d'élite pour une maîtrise totale du cabinet.",
            icon: <GraduationCap className="h-8 w-8 text-purple-500" />,
            file: '/manuals/manuel_formation.pdf',
            restricted: false
        },
        {
            id: 'administration',
            title: "Manuel d'Administration",
            description: "Gestion des utilisateurs, des rôles et du cabinet.",
            icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
            file: '/manuals/manuel_administration.pdf',
            restricted: true
        },
        {
            id: 'technique',
            title: "Manuel Technique Performance",
            description: "Stack technologique, structure et maintenance.",
            icon: <Cpu className="h-8 w-8 text-amber-500" />,
            file: '/manuals/manuel_technique.pdf',
            restricted: true
        },
        {
            id: 'architecture',
            title: "Manuel d'Architecture Système",
            description: "Schémas système, sécurité et flux de données IA.",
            icon: <Layout className="h-8 w-8 text-indigo-500" />,
            file: '/manuals/manuel_architecture.pdf',
            restricted: true
        },
        {
            id: 'donnees',
            title: "Structure des Données & Fonctions",
            description: "Modèles Prisma, algorithmes et intégrité.",
            icon: <Database className="h-8 w-8 text-orange-500" />,
            file: '/manuals/manuel_donnees_fonctions.pdf',
            restricted: true
        },
        {
            id: 'maintenance',
            title: "Guide Maintenance & Erreurs",
            description: "Monitoring, troubleshooting et procédures de secours.",
            icon: <AlertCircle className="h-8 w-8 text-red-500" />,
            file: '/manuals/manuel_maintenance_erreurs.pdf',
            restricted: true
        }
    ]

    const visibleManuals = manuals.filter(m => !m.restricted || isAdmin)

    return (
        <div className="space-y-6 container mx-auto py-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centre de Documentation</h1>
                    <p className="text-slate-500 mt-1">Consultez les guides officiels. {isAdmin ? <span className="text-emerald-600 font-medium">(Accès Administration Actif)</span> : "Certains guides techniques sont réservés aux administrateurs."}</p>
                </div>
                {!isAdmin && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-700 font-medium flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> Mode Collaborateur
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleManuals.map((manual) => (
                    <Card key={manual.id} className="hover:shadow-lg transition-all border-slate-200">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="mb-4">{manual.icon}</div>
                                {manual.restricted && (
                                    <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-2 py-1 rounded">Admin</span>
                                )}
                            </div>
                            <CardTitle className="text-xl">{manual.title}</CardTitle>
                            <CardDescription>{manual.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button variant="outline" className="w-full border-slate-300" asChild>
                                    <a href={manual.file} target="_blank" rel="noopener noreferrer">
                                        <BookOpen className="mr-2 h-4 w-4" /> Lire
                                    </a>
                                </Button>
                                <Button className="w-full bg-slate-900 text-white" asChild>
                                    <a href={manual.file} download>
                                        <Download className="mr-2 h-4 w-4" /> PDF
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-slate-50 border-dashed border-2">
                <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">Besoin d'aide supplémentaire ?</h3>
                    <p className="text-slate-500 mb-6">Notre support technique est disponible 24/7 pour vous accompagner dans votre transformation digitale.</p>
                    <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">Contacter le Support</Button>
                </CardContent>
            </Card>
        </div>
    )
}
