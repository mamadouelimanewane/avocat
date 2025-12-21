
import { PrismaClient } from '@prisma/client'
import { Folder, FileText, Search, Plus, Filter, LayoutGrid, List as ListIcon, Calendar, Upload, Download, File, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getDocuments(query: string) {
    const where: any = {}
    if (query) {
        where.name = { contains: query }
    }

    const docs = await prisma.document.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: {
            dossier: { select: { title: true, reference: true, client: { select: { name: true } } } },
            versions: { orderBy: { version: 'desc' }, take: 1 }
        }
    })
    return docs
}

export default async function DocumentsPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q || ''
    const documents = await getDocuments(query)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Gestion Documentaire (GED)</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Centralisation de tous les documents du cabinet.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filtres
                    </Button>
                    <Button>
                        <Upload className="mr-2 h-4 w-4" /> Importer
                    </Button>
                </div>
            </div>

            {/* Stats / Folders Quick Access */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Actes', 'Preuves', 'Correspondances', 'Administratif'].map(cat => (
                    <Card key={cat} className="hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                <Folder className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{cat}</h3>
                                <p className="text-xs text-slate-500">Dossier virtuel</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search & List */}
            <Card>
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher un document..."
                                className="pl-9"
                                defaultValue={query}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon"><LayoutGrid className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="bg-slate-100 dark:bg-slate-800"><ListIcon className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Dossier / Client</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Version</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                                        Aucun document trouvé.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                documents.map(doc => (
                                    <TableRow key={doc.id} className="group">
                                        <TableCell>
                                            {doc.type === 'PDF' ? <FileText className="h-5 w-5 text-red-500" /> :
                                                doc.type === 'DOCX' ? <FileText className="h-5 w-5 text-blue-500" /> :
                                                    doc.type === 'IMAGE' ? <FileImage className="h-5 w-5 text-purple-500" /> :
                                                        <File className="h-5 w-5 text-slate-400" />}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{doc.name}</span>
                                                {doc.tags && <span className="text-xs text-slate-400">{doc.tags}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <Link href={`/dossiers/${doc.dossierId}`} className="hover:underline font-medium">
                                                    {doc.dossier.reference}
                                                </Link>
                                                <span className="text-xs text-slate-500">{doc.dossier.client.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px]">{doc.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={doc.status === 'SIGNED' ? 'default' : 'secondary'} className={doc.status === 'SIGNED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-transparent' : 'text-[10px]'}>
                                                {doc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                v{doc.versions[0]?.version || 1}.0
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">
                                            {new Date(doc.updatedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
