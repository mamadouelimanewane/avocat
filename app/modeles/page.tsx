
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Plus, FileText, Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Briefcase, Users, FileText as FileIcon } from 'lucide-react'

const prisma = new PrismaClient()

export default async function ModelesPage() { // Keep as server component but maybe hard to filter dynamically without client component or search params. 
    // Actually, Tabs usually require client state if filtering client side. 
    // Or we fetch all and filter in render if dataset is small.
    // Let's make it a Client Component or use search params?
    // User requested "Bibliotheque", tabs feel instant.
    // I'll make the internal part client side or just render all tables in TabsContent (simpler).

    const templates = await prisma.template.findMany({
        orderBy: { updatedAt: 'desc' }
    })

    const affaires = templates.filter(t => t.category === 'AFFAIRES')
    const foncier = templates.filter(t => t.category === 'FONCIER')
    const travail = templates.filter(t => t.category === 'TRAVAIL')
    const others = templates.filter(t => !['AFFAIRES', 'FONCIER', 'TRAVAIL'].includes(t.category || ''))

    const TemplateTable = ({ data }: { data: typeof templates }) => (
        <div className="rounded-md border border-slate-200 bg-white shadow-sm mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom du Modèle</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Variables</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                Aucun modèle dans cette catégorie.
                            </TableCell>
                        </TableRow>
                    ) : data.map((template) => (
                        <TableRow key={template.id} className="hover:bg-slate-50 group">
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <FileIcon className="mr-2 h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                                    {template.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{template.category || 'Général'}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                                {template.variables ? JSON.parse(template.variables).length + ' variables' : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8" asChild>
                                    <Link href={`/modeles/${template.id}`}>
                                        <Edit className="h-4 w-4 text-slate-500 hover:text-indigo-600" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bible des Actes</h1>
                    <p className="text-slate-500 mt-1">Gérez vos modèles d'actes et documents récurrents intelligemment.</p>
                </div>
                <Button className="bg-slate-900 text-white hover:bg-slate-800" asChild>
                    <Link href="/modeles/nouveau">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau Modèle
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="tous" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="tous">Tous</TabsTrigger>
                    <TabsTrigger value="afaires" className="gap-2"><Briefcase className="h-4 w-4" /> Affaires</TabsTrigger>
                    <TabsTrigger value="foncier" className="gap-2"><Building2 className="h-4 w-4" /> Foncier</TabsTrigger>
                    <TabsTrigger value="travail" className="gap-2"><Users className="h-4 w-4" /> Travail</TabsTrigger>
                </TabsList>

                <TabsContent value="tous">
                    <TemplateTable data={templates} />
                </TabsContent>
                <TabsContent value="afaires">
                    <TemplateTable data={affaires} />
                </TabsContent>
                <TabsContent value="foncier">
                    <TemplateTable data={foncier} />
                </TabsContent>
                <TabsContent value="travail">
                    <TemplateTable data={travail} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
