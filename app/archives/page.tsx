
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Archive, Box, MapPin, Search, Plus, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { NewArchiveBoxDialog } from '@/components/archives/NewArchiveBoxDialog'

export default async function ArchivesPage() {
    const boxes = await prisma.archiveBox.findMany({
        include: { _count: { select: { documents: true } } },
        orderBy: { code: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Archive className="h-8 w-8 text-slate-700" /> Gestion des Archives
                    </h1>
                    <p className="text-slate-500">Traçabilité physique et numérique des dossiers clôturés.</p>
                </div>
                <NewArchiveBoxDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold">Total Boîtes</CardDescription>
                        <CardTitle className="text-3xl">{boxes.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold">Localisation Principale</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <MapPin className="h-6 w-6 text-rose-500" /> Salle A
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-indigo-100 bg-indigo-50/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-indigo-600">Prochaine Destruction</CardDescription>
                        <CardTitle className="text-3xl text-indigo-700">31/12/2030</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold uppercase text-slate-500">Inventaire des boîtes</CardTitle>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Rechercher une boîte..." className="pl-9 h-9 text-xs" />
                    </div>
                </CardHeader>
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[150px]">Code Boîte</TableHead>
                            <TableHead>Emplacement</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Contenu</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {boxes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center">
                                    <Box className="h-12 w-12 text-slate-200 mx-auto mb-2" />
                                    <p className="text-slate-400">Aucune boîte d'archives enregistrée.</p>
                                </TableCell>
                            </TableRow>
                        ) : boxes.map((box: any) => (
                            <TableRow key={box.id} className="hover:bg-slate-50 transition-colors">
                                <TableCell className="font-mono font-bold text-indigo-600">{box.code}</TableCell>
                                <TableCell className="text-sm flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-slate-400" /> {box.location}
                                </TableCell>
                                <TableCell className="text-xs text-slate-500 italic max-w-xs truncate">{box.description}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-slate-100">{box._count.documents} actes / documents</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={box.status === 'OPEN' ? 'success' : 'default'}>{box.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                        Voir Contenu <ExternalLink className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <Box className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-amber-800">Note de procédure</p>
                    <p className="text-xs text-amber-700 italic">
                        Lorsqu'un dossier est clôturé, n'oubliez pas d'imprimer l'inventaire des pièces et de le placer dans une boîte physique.
                        Scannez ensuite le code de la boîte pour lier le dossier numériquement.
                    </p>
                </div>
            </div>
        </div>
    )
}
