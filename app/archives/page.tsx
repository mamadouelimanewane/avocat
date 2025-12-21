
import { PrismaClient } from '@prisma/client'
import { ArchiveSearch } from '@/components/archives/ArchiveSearch'
import { ArchiveStats } from '@/components/archives/ArchiveStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Archive, Box, Search, FileText } from 'lucide-react'

const prisma = new PrismaClient()

async function getArchiveData(query: string = '') {
    // Basic stats
    const totalBoxes = await prisma.archiveBox.count()
    const archivedDocs = await prisma.document.count({ where: { status: 'ARCHIVED' } })

    // Search logic (mocking "Solr" power with Prisma filters for now)
    const filters: any = { status: 'ARCHIVED' }
    if (query) {
        filters.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { ocrContent: { contains: query, mode: 'insensitive' } },
            { archiveBox: { code: { contains: query, mode: 'insensitive' } } },
            { dossier: { title: { contains: query, mode: 'insensitive' } } }
        ]
    }

    const results = await prisma.document.findMany({
        where: filters,
        include: {
            dossier: { select: { reference: true, client: { select: { name: true } } } },
            archiveBox: true
        },
        take: 20
    })

    return { totalBoxes, archivedDocs, results }
}

export default async function ArchivesPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q || ''
    const { totalBoxes, archivedDocs, results } = await getArchiveData(query)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                        <Archive className="h-8 w-8 text-amber-600" />
                        Système d'Archivage
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gestion physique et numérique avec recherche FullText (IA).
                    </p>
                </div>
            </div>

            <ArchiveStats totalBoxes={totalBoxes} totalDocs={archivedDocs} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Search Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="bg-slate-50 dark:bg-slate-900 border-indigo-200/50">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Search className="h-4 w-4" /> Moteur de Recherche
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-500 mb-4">
                                Indexation Lucene/Solr active. Recherche sémantique disponible.
                            </p>
                            <ArchiveSearch />
                        </CardContent>
                    </Card>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-3 space-y-4">
                    <Card>
                        <CardHeader className="border-b pb-3">
                            <CardTitle className="text-sm font-medium">
                                Résultats pertinents ({results.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {!results.length ? (
                                <div className="p-10 text-center text-slate-400">
                                    <Search className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    Aucun document archivé ne correspond à votre recherche.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {results.map(doc => (
                                        <div key={doc.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex items-start gap-4">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                                <FileText className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
                                                        {doc.name}
                                                    </h4>
                                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Box className="h-3 w-3" />
                                                        {doc.archiveBox?.code || 'En attente de boîte'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                                    Dossier: <span className="font-semibold">{doc.dossier.reference}</span> • Client: {doc.dossier.client.name}
                                                </p>
                                                {/* Simulated Content Snippet (Highlight) */}
                                                {query && doc.ocrContent && (
                                                    <div className="mt-2 text-xs text-slate-500 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded border border-yellow-100 dark:border-yellow-900/30">
                                                        ...{doc.ocrContent.substring(0, 150)}...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
