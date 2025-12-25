
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Scale, BookOpen, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getDocument(id: string) {
    const doc = await prisma.jurisprudence.findUnique({
        where: { id }
    })
    return doc
}

export default async function JurisprudenceDetailPage({ params }: { params: { id: string } }) {
    const doc = await getDocument(params.id)

    if (!doc) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Retour au tableau de bord
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                {doc.type}
                            </Badge>
                            <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                {doc.region}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">{doc.title}</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(doc.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            {doc.reference && (
                                <span className="font-mono text-sm">Réf: {doc.reference}</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary */}
            {doc.summary && (
                <Card className="mb-6 border-amber-200 bg-amber-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" /> Résumé
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-700">{doc.summary}</p>
                    </CardContent>
                </Card>
            )}

            {/* Content */}
            <Card className="mb-6">
                <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <Scale className="h-4 w-4" /> Contenu du Document
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="prose max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {doc.content || "Contenu non disponible."}
                    </div>
                </CardContent>
            </Card>

            {/* Source */}
            {doc.sourceUrl && (
                <div className="text-center">
                    <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="h-4 w-4" /> Voir la source originale
                        </Button>
                    </a>
                </div>
            )}
        </div>
    )
}
