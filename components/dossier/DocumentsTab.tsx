"use client";

import { useState } from 'react';
import {
    FileText,
    Upload,
    Maximize2,
    MoreVertical,
    ScanLine,
    FilePlus,
    Search,
    History,
    ShieldCheck,
    Cloud,
    Mail,
    PenTool,
    BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createDocumentFromTemplate } from '@/app/actions';
import { Label } from '@/components/ui/label';

// Mock data for Documents
const initialDocuments = [
    { id: 1, name: 'Assignation TGI.pdf', version: 3, type: 'ACTE', size: '2.4 MB', updated: 'Il y a 2h', author: 'Maître Dupont', status: 'SIGNED' },
    { id: 2, name: 'Preuve n°1 - Email.msg', version: 1, type: 'PREUVE', size: '450 KB', updated: 'Hier', author: 'Maître Dupont', status: 'DRAFT' },
    { id: 3, name: 'Conclusions Récapitulatives.docx', version: 12, type: 'ACTE', size: '1.1 MB', updated: 'Il y a 3j', author: 'Collaborateur Senior', status: 'REVIEW' },
    { id: 4, name: 'Facture Honoraire.pdf', version: 1, type: 'CORRESPONDANCE', size: '120 KB', updated: 'Semaine dernière', author: 'Comptabilité', status: 'FINAL' },
];

interface Template {
    id: string;
    name: string;
    category: string | null;
    variables: string | null;
}

export default function DocumentsTab({ dossierId, templates = [] }: { dossierId: string, templates?: Template[] }) {
    const [documents, setDocuments] = useState(initialDocuments);
    const [isDragging, setIsDragging] = useState(false);

    // Generator State
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [variables, setVariables] = useState<any[]>([]);
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newDocs = Array.from(e.dataTransfer.files).map((file, index) => ({
                id: Math.random(),
                name: file.name,
                version: 1,
                type: 'AUTRE',
                size: (file.size / 1024).toFixed(1) + ' KB',
                updated: "À l'instant",
                author: 'Moi',
                status: 'DRAFT'
            }));

            setDocuments(prev => [...newDocs, ...prev]);
        }
    };

    const onSelectTemplate = (id: string) => {
        setSelectedTemplateId(id);
        const t = templates.find(t => t.id === id);
        if (t && t.variables) {
            try {
                const vars = JSON.parse(t.variables);
                setVariables(vars); // string[]
                // Initialize values
                const init: Record<string, string> = {};
                vars.forEach((v: string) => init[v] = "");
                setVariableValues(init);
            } catch (e) {
                setVariables([]);
            }
        } else {
            setVariables([]);
        }
    }

    const handleAIGenerate = async () => {
        alert("L'Assistant IA analyse le dossier et génère une ébauche basée sur les modèles OHADA...")
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        const res = await createDocumentFromTemplate(dossierId, selectedTemplateId, variableValues);
        setIsGenerating(false);
        if (res.success) {
            setIsDialogOpen(false);
            // In a real app, we would re-fetch documents. For now, let's mock the addition
            const t = templates.find(t => t.id === selectedTemplateId);
            setDocuments([{
                id: Math.random(),
                name: `${t?.name || 'Document'} - Généré.txt`,
                version: 1,
                type: 'ACTE',
                size: '12 KB',
                updated: 'À l\'instant',
                author: 'Moi',
                status: 'DRAFT'
            }, ...documents]);
        }
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex gap-2">
                    <Button variant="default" className="bg-slate-900 text-white">
                        <Upload className="mr-2 h-4 w-4" /> Importer
                    </Button>
                    <Button variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" onClick={handleAIGenerate}>
                        <BrainCircuit className="mr-2 h-4 w-4" /> Assistant Rédaction IA
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-slate-700 border-slate-300">
                                <FilePlus className="mr-2 h-4 w-4" /> Générer Acte
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Générer un acte depuis un modèle</DialogTitle>
                                <DialogDescription>
                                    Choisissez un modèle de votre Bible et remplissez les variables.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Modèle</Label>
                                    <Select onValueChange={onSelectTemplate} value={selectedTemplateId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un modèle..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templates.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {variables.length > 0 && (
                                    <div className="space-y-3 mt-2 border-t pt-4">
                                        <h4 className="text-sm font-medium text-slate-900">Variables à remplir</h4>
                                        {variables.map(v => (
                                            <div key={v} className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={v} className="text-right text-xs uppercase text-slate-500">
                                                    {v}
                                                </Label>
                                                <Input
                                                    id={v}
                                                    value={variableValues[v] || ''}
                                                    onChange={(e) => setVariableValues({ ...variableValues, [v]: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleGenerate} disabled={!selectedTemplateId || isGenerating}>
                                    {isGenerating ? 'Génération...' : 'Créer le document'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="text-slate-700 border-slate-300">
                        <ScanLine className="mr-2 h-4 w-4" /> Scan OCR
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Recherche dans le contenu (OCR)..."
                            className="pl-9 h-9 w-[250px] text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
            </div>

            {/* Split View Content */}
            <div className="grid grid-cols-12 gap-6 h-[600px]">

                {/* Drag & Drop Zone (Drop email from Outlook) */}
                <div
                    className={`col-span-12 lg:col-span-9 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col cursor-copy ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* Header of Content Area */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center text-sm text-slate-500 gap-2">
                            <span className="flex items-center gap-1 font-semibold text-slate-700"><FolderOpenIcon /> Dossier</span>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100"><Cloud className="mr-1 h-3 w-3" /> Sync OneDrive</Badge>
                        </div>
                    </div>

                    {/* File List */}
                    <div className="flex-1 overflow-auto p-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px]"></TableHead>
                                    <TableHead>Nom du fichier</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow key={doc.id} className="group hover:bg-slate-50">
                                        <TableCell>
                                            <FileIcon type={doc.type} />
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-900">
                                            {doc.name}
                                            <div className="text-xs text-slate-400 font-normal">Modifié {doc.updated} par {doc.author}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px]">{doc.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-xs font-mono bg-slate-100 px-2 py-1 rounded w-fit">
                                                v{doc.version}.0 <History className="h-3 w-3 text-slate-400 ml-1 cursor-pointer hover:text-slate-900" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={doc.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900"><ShieldCheck className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900"><MoreVertical className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Empty State / Drop Prompt */}
                        {documents.length < 10 && (
                            <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-t border-slate-100 mt-4 border-dashed">
                                <Mail className="h-8 w-8 mb-2 text-slate-300" />
                                <p className="text-sm">Glissez des emails Outlook ou des fichiers ici</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Details & Actions */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-sm text-slate-900">Actions Rapides</h3>
                            <Button className="w-full justify-start text-xs bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200" variant="ghost">
                                <ShieldCheck className="mr-2 h-4 w-4" /> Tamponner (Bates)
                            </Button>
                            <Button className="w-full justify-start text-xs" variant="outline">
                                <Maximize2 className="mr-2 h-4 w-4" /> Comparer Versions
                            </Button>
                            <Button className="w-full justify-start text-xs text-blue-700 bg-blue-50 border-blue-200" variant="ghost">
                                <PenTool className="mr-2 h-4 w-4" /> Signature (Yousign)
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50 border-slate-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-sm text-slate-900 mb-2">Statistiques GED</h3>
                            <div className="text-xs space-y-2 text-slate-600">
                                <div className="flex justify-between"><span>Espace utilisé</span> <span className="font-medium">450 MB</span></div>
                                <div className="flex justify-between"><span>Fichiers</span> <span className="font-medium">124</span></div>
                                <div className="flex justify-between"><span>Versions</span> <span className="font-medium">32</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function FileIcon({ type }: { type: string }) {
    if (type === 'ACTE') return <FileText className="h-5 w-5 text-blue-500" />;
    if (type === 'PREUVE') return <FileText className="h-5 w-5 text-amber-500" />;
    if (type === 'CORRESPONDANCE') return <Mail className="h-5 w-5 text-green-500" />;
    return <FileText className="h-5 w-5 text-slate-400" />;
}

function FolderOpenIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-3.25 7a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" /></svg>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'SIGNED') return <Badge variant="success" className="text-[10px] px-1.5 h-5">Signé</Badge>;
    if (status === 'REVIEW') return <Badge variant="warning" className="text-[10px] px-1.5 h-5">Revue</Badge>;
    if (status === 'FINAL') return <Badge variant="secondary" className="text-[10px] px-1.5 h-5">Final</Badge>;
    return <Badge variant="outline" className="text-[10px] px-1.5 h-5">Brouillon</Badge>;
}
