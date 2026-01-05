
export const dynamic = 'force-dynamic'

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
import { Building2, Briefcase, Users, FileText as FileIcon, Gavel, Scale, ShieldAlert, Landmark, Globe, Cpu } from 'lucide-react'

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
    const procedure = templates.filter(t => ['LITIGE', 'PROCEDURE', 'PENAL', 'ADMINISTRATIF'].includes(t.category || '')) // Grouping procedural ones to keep tab bar sane
    const social = templates.filter(t => t.category === 'SOCIAL')
    const civil = templates.filter(t => t.category === 'CIVIL')
    const penal = templates.filter(t => t.category === 'PENAL')
    const admin = templates.filter(t => t.category === 'ADMINISTRATIF')
    const international = templates.filter(t => t.category === 'INTERNATIONAL')
    const tech = templates.filter(t => t.category === 'TECH')
    const energie = templates.filter(t => t.category === 'PETROLE_GAZ')
    const fiscalite = templates.filter(t => t.category === 'FISCALITE')
    const others = templates.filter(t => !['AFFAIRES', 'FONCIER', 'TRAVAIL', 'LITIGE', 'PROCEDURE', 'SOCIAL', 'CIVIL', 'PENAL', 'ADMINISTRATIF', 'INTERNATIONAL', 'TECH', 'PETROLE_GAZ', 'FISCALITE'].includes(t.category || ''))

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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bibliothèque des Actes</h1>
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
                <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
                    <TabsTrigger value="tous" className="data-[state=active]:bg-slate-100">Tous</TabsTrigger>
                    <TabsTrigger value="affaires" className="gap-2 data-[state=active]:bg-slate-100"><Briefcase className="h-4 w-4" /> Affaires & OHADA</TabsTrigger>
                    <TabsTrigger value="procedure" className="gap-2 data-[state=active]:bg-slate-100"><Gavel className="h-4 w-4" /> Procédure</TabsTrigger>
                    <TabsTrigger value="international" className="gap-2 data-[state=active]:bg-slate-100"><Globe className="h-4 w-4" /> International</TabsTrigger>
                    <TabsTrigger value="admin" className="gap-2 data-[state=active]:bg-slate-100"><Landmark className="h-4 w-4" /> Administratif</TabsTrigger>
                    <TabsTrigger value="travail" className="gap-2 data-[state=active]:bg-slate-100"><Users className="h-4 w-4" /> Travail</TabsTrigger>
                    <TabsTrigger value="social" className="gap-2 data-[state=active]:bg-slate-100"><Users className="h-4 w-4" /> Famille & Social</TabsTrigger>
                    <TabsTrigger value="foncier" className="gap-2 data-[state=active]:bg-slate-100"><Building2 className="h-4 w-4" /> Foncier</TabsTrigger>
                    <TabsTrigger value="tech" className="gap-2 data-[state=active]:bg-slate-100"><Cpu className="h-4 w-4" /> Tech & Données</TabsTrigger>
                    <TabsTrigger value="energie" className="gap-2 data-[state=active]:bg-slate-100"><FileText className="h-4 w-4 text-orange-600" /> Pétrole & Gaz</TabsTrigger>
                    <TabsTrigger value="fiscal" className="gap-2 data-[state=active]:bg-slate-100"><Scale className="h-4 w-4 text-emerald-600" /> Fiscalité</TabsTrigger>
                </TabsList>

                <TabsContent value="tous">
                    <TemplateTable data={templates} />
                </TabsContent>
                <TabsContent value="affaires">
                    <TemplateTable data={affaires} />
                </TabsContent>
                <TabsContent value="procedure">
                    {/* Combine Procedure, Penal, Civil for visibility */}
                    <TemplateTable data={[...procedure, ...penal, ...civil]} />
                </TabsContent>
                <TabsContent value="international">
                    <TemplateTable data={international} />
                </TabsContent>
                <TabsContent value="admin">
                    <TemplateTable data={admin} />
                </TabsContent>
                <TabsContent value="travail">
                    <TemplateTable data={travail} />
                </TabsContent>
                <TabsContent value="social">
                    <TemplateTable data={social} />
                </TabsContent>
                <TabsContent value="tech">
                    <TemplateTable data={tech} />
                </TabsContent>
                <TabsContent value="foncier">
                    <TemplateTable data={foncier} />
                </TabsContent>
                <TabsContent value="energie">
                    <TemplateTable data={energie} />
                </TabsContent>
                <TabsContent value="fiscal">
                    <TemplateTable data={fiscalite} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
