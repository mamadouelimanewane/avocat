
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, Download, BookOpen, ShieldCheck, Cpu, GraduationCap, Layout, Database, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocumentationPage() {
    const manuals = [
        {
            id: 'utilisation',
            title: "Manuel d'Utilisation",
            description: "Guide complet pour les avocats et collaborateurs.",
            icon: <BookOpen className="h-8 w-8 text-blue-500" />,
            file: '/manuals/manuel_utilisation.pdf'
        },
        {
            id: 'administration',
            title: "Manuel d'Administration",
            description: "Gestion des utilisateurs, des rôles et du cabinet.",
            icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
            file: '/manuals/manuel_administration.pdf'
        },
        {
            id: 'technique',
            title: "Manuel Technique",
            description: "Stack technologique, structure et maintenance.",
            icon: <Cpu className="h-8 w-8 text-amber-500" />,
            file: '/manuals/manuel_technique.pdf'
        },
        {
            id: 'architecture',
            title: "Manuel d'Architecture",
            description: "Schémas système, base de données et flux IA.",
            icon: <Layout className="h-8 w-8 text-indigo-500" />,
            file: '/manuals/manuel_architecture.pdf'
        },
        {
            id: 'formation',
            title: "Manuel de Formation",
            description: "Guide de démarrage rapide et bonnes pratiques.",
            icon: <GraduationCap className="h-8 w-8 text-purple-500" />,
            file: '/manuals/manuel_formation.pdf'
        },
        {
            id: 'donnees',
            title: "Structure des Données",
            description: "Modèles Prisma, fonctions métiers et flux de données.",
            icon: <Database className="h-8 w-8 text-orange-500" />,
            file: '/manuals/manuel_donnees_fonctions.pdf'
        },
        {
            id: 'maintenance',
            title: "Guide de Maintenance",
            description: "Bibliothèque des erreurs et procédures de secours.",
            icon: <AlertCircle className="h-8 w-8 text-red-500" />,
            file: '/manuals/manuel_maintenance_erreurs.pdf'
        }
    ]

    return (
        <div className="space-y-6 container mx-auto py-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centre de Documentation</h1>
                <p className="text-slate-500 mt-1">Consultez et téléchargez les guides officiels de LexPremium ERP.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {manuals.map((manual) => (
                    <Card key={manual.id} className="hover:shadow-lg transition-all border-slate-200">
                        <CardHeader className="pb-3">
                            <div className="mb-4">{manual.icon}</div>
                            <CardTitle className="text-xl">{manual.title}</CardTitle>
                            <CardDescription>{manual.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={manual.file} target="_blank" rel="noopener noreferrer">
                                        <BookOpen className="mr-2 h-4 w-4" /> Consulter
                                    </a>
                                </Button>
                                <Button className="w-full bg-slate-900 text-white" asChild>
                                    <a href={manual.file} download>
                                        <Download className="mr-2 h-4 w-4" /> Télécharger
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
