"use client";

import { useState, useRef, useEffect } from 'react';
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
    BrainCircuit,
    Download,
    Eye,
    Trash2,
    AlertTriangle,
    Bell,
    Sparkles
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createDocumentFromTemplate, uploadDocument, generateAIDocument, runOCR, deleteDocument, addDocumentVersion, generateLandDraftFromAI } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { SignatureDialog } from '@/components/documents/SignatureDialog';

// Types
interface DocumentProps {
    id: string;
    name: string;
    type: string | null;
    category: string | null;
    tags: string | null;
    status: string;
    updatedAt: Date;
    folder: string | null;
    ocrStatus: string | null;
    ocrContent: string | null;
    versions: {
        version: number;
        size: number;
        createdAt: Date;
        comment?: string | null;
        uploadedBy?: { name: string | null } | null;
    }[];
}

interface Template {
    id: string;
    name: string;
    category: string | null;
    variables: string | null;
}

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatTimeAgo = (date: any) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";

    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours} h`;
    return `Il y a ${days} j`;
};

export default function DocumentsTab({ dossierId, templates = [], initialDocuments = [] }: { dossierId: string, templates?: Template[], initialDocuments?: any[] }) {
    const [documents, setDocuments] = useState<any[]>(initialDocuments);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setDocuments(initialDocuments);
    }, [initialDocuments]);

    // Generator State
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [variables, setVariables] = useState<any[]>([]);
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    // ...

    const [selectedDocForSigning, setSelectedDocForSigning] = useState<DocumentProps | null>(null);
    const [selectedDocForView, setSelectedDocForView] = useState<DocumentProps | null>(null);
    const [isLandDialogOpen, setIsLandDialogOpen] = useState(false);
    const [selectedLandTemplate, setSelectedLandTemplate] = useState("");

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.ocrContent && doc.ocrContent.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    }

    const handleFiles = async (files: FileList) => {
        const fileArray = Array.from(files);
        let successCount = 0;
        setIsGenerating(true);

        try {
            for (const file of fileArray) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('dossierId', dossierId);

                const res = await uploadDocument(formData);
                if (res.success && res.document) {
                    successCount++;
                    // Real-time Intelligence: Run OCR & Classification immediately
                    await runOCR(res.document.id);
                }
            }

            if (successCount > 0) {
                toast({
                    title: "Import & Analyse terminés",
                    description: `${successCount} fichier(s) importés et analysés par LexAI.`
                });
                router.refresh();
            }
        } catch (error) {
            console.error('Upload exception', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de l'importation."
            });
        } finally {
            setIsGenerating(false);
        }
    }

    const onSelectTemplate = (id: string) => {
        setSelectedTemplateId(id);
        const t = templates.find(t => t.id === id);
        if (t && t.variables) {
            try {
                const vars = JSON.parse(t.variables);
                setVariables(vars); // string[]
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
        const userDesc = prompt("Décrivez le document que vous souhaitez que l'IA rédige (ex: Requête en référé, Mise en demeure...) :");
        if (userDesc) {
            setIsGenerating(true);
            try {
                const res = await generateAIDocument(dossierId, userDesc);
                if (res.success) {
                    toast({
                        title: "Document généré",
                        description: res.message,
                    });
                    router.refresh(); // Refresh to show the new document
                } else {
                    toast({
                        title: "Erreur",
                        description: res.message,
                        variant: "destructive",
                    });
                }
            } catch (e) {
                toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la communication avec l'IA.",
                    variant: "destructive",
                });
            } finally {
                setIsGenerating(false);
            }
        }
    }

    const handleLandGenerate = async () => {
        if (!selectedLandTemplate) return;
        setIsGenerating(true);
        try {
            const res = await generateLandDraftFromAI(dossierId, selectedLandTemplate);
            if (res.success) {
                toast({
                    title: "Acte Foncier Généré",
                    description: "Le projet d'acte a été rédigé avec succès par LexAI.",
                });
                setIsLandDialogOpen(false);
                router.refresh();
            } else {
                toast({
                    title: "Erreur",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (e) {
            toast({
                title: "Erreur",
                description: "Échec de la génération foncière.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        const res = await createDocumentFromTemplate(dossierId, selectedTemplateId, variableValues);
        setIsGenerating(false);
        if (res.success) {
            setIsDialogOpen(false);
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
            alert("Document généré avec succès !");
        }
    }

    // Actions Handlers
    const handleOCR = async () => {
        if (documents.length === 0) return;

        setIsGenerating(true);
        let successCount = 0;

        try {
            for (const doc of documents) {
                const res = await runOCR(doc.id);
                if (res.success) successCount++;
            }

            toast({
                title: "Scan OCR terminé",
                description: `${successCount} document(s) analysé(s) et indexé(s).`,
            });
            router.refresh();
        } catch (e) {
            toast({
                title: "Erreur OCR",
                description: "Une erreur est survenue lors du traitement des documents.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    }

    const handleOpenFile = (doc: DocumentProps) => {
        setSelectedDocForView(doc);
    }

    const handleStamp = () => {
        toast({
            title: "Tamponnage Bates",
            description: "Tamponnage numérique appliqué aux documents sélectionnés.",
        });
    }

    const handleCompare = () => {
        toast({
            title: "Comparaison",
            description: "Comparaison des versions lancée. Différences en cours d'analyse.",
        });
    }

    const handleSign = (doc?: DocumentProps) => {
        if (doc) {
            setSelectedDocForSigning(doc);
        } else {
            toast({
                title: "Signature",
                description: "Veuillez sélectionner un document à signer via le menu d'actions.",
            });
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Confirmer la suppression de ce document et de son historique ?")) {
            const res = await deleteDocument(id);
            if (res.success) {
                toast({
                    title: "Document supprimé",
                    description: res.message,
                });
                router.refresh();
            } else {
                toast({
                    title: "Erreur",
                    description: res.message,
                    variant: "destructive"
                });
            }
        }
    }

    const handleAddVersion = async (docId: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const comment = prompt("Commentaire pour cette nouvelle version :");
                const formData = new FormData();
                formData.append('file', file);
                if (comment) formData.append('comment', comment);

                setIsGenerating(true);
                try {
                    const res = await addDocumentVersion(docId, formData);
                    if (res.success) {
                        toast({ title: "Succès", description: res.message });
                        router.refresh();
                    } else {
                        toast({ title: "Erreur", description: res.message, variant: "destructive" });
                    }
                } finally {
                    setIsGenerating(false);
                }
            }
        };
        input.click();
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={handleFileInput}
                    />
                    <Button variant="default" className="bg-slate-900 text-white" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Importer
                    </Button>
                    <Button variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" onClick={handleAIGenerate}>
                        <BrainCircuit className="mr-2 h-4 w-4" /> Assistant Rédaction IA
                    </Button>

                    <Dialog open={isLandDialogOpen} onOpenChange={setIsLandDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                <Sparkles className="mr-2 h-4 w-4" /> Actes Fonciers (IA)
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-emerald-500" />
                                    Rédaction Foncière Intelligente
                                </DialogTitle>
                                <DialogDescription>
                                    LexAI va rédiger un projet d'acte en extrayant automatiquement les données du dossier (titres fonciers, surfaces, parties).
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label>Type d'acte foncier professionnel</Label>
                                    <Select onValueChange={setSelectedLandTemplate} value={selectedLandTemplate}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un acte à générer..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Réquisition d'Immatriculation Foncière">Réquisition d'Immatriculation</SelectItem>
                                            <SelectItem value="Assignation en Expulsion (Occupant sans droit ni titre)">Assignation en Expulsion</SelectItem>
                                            <SelectItem value="Demande de Transformation de Titre Précaire en Titre Foncier">Transformation de Titre</SelectItem>
                                            <SelectItem value="Mise en Demeure de Payer (Bail Habitation - Décret 2023)">Mise en demeure (Bail)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 italic">
                                    Note : L'IA consultera tous les documents OCRisés du dossier pour remplir les champs contractuels.
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleLandGenerate} disabled={!selectedLandTemplate || isGenerating}>
                                    {isGenerating ? "Rédaction par LexAI..." : "Générer le projet d'acte"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="text-slate-700 border-slate-300" onClick={handleOCR}>
                        <ScanLine className="mr-2 h-4 w-4" /> Scan OCR
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

                    <Button variant="outline" className="text-slate-700 border-slate-300" onClick={handleOCR}>
                        <ScanLine className="mr-2 h-4 w-4" /> Scan OCR
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            className="pl-9 h-9 w-[250px] text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Recherche dans le contenu (OCR)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
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
                                {filteredDocuments.map((doc) => {
                                    const latestVersion = doc.versions?.[0];
                                    return (
                                        <TableRow key={doc.id} className="group hover:bg-slate-50">
                                            <TableCell>
                                                <FileIcon type={doc.category || 'AUTRE'} />
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-900 cursor-pointer hover:underline" onClick={() => handleOpenFile(doc)}>
                                                <div className="flex items-center gap-2">
                                                    {doc.name}
                                                    {doc.ocrStatus === 'DONE' && (
                                                        <Badge variant="outline" className="h-4 px-1 text-[8px] bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center gap-0.5">
                                                            <ScanLine className="h-2 w-2" /> OCR
                                                        </Badge>
                                                    )}
                                                    {doc.tags?.includes("URGENT") && (
                                                        <Badge variant="destructive" className="h-4 px-1 text-[8px] flex items-center gap-0.5 animate-pulse">
                                                            <AlertTriangle className="h-2 w-2" /> URGENT
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 font-normal flex items-center gap-2">
                                                    Modifié {formatTimeAgo(doc.updatedAt)} par {latestVersion?.uploadedBy?.name || latestVersion?.uploadedBy?.email || 'Système'}
                                                    {doc.folder && doc.folder !== '/' && (
                                                        <span className="flex items-center text-indigo-500 font-medium">
                                                            <FolderOpenIcon /> {doc.folder}
                                                        </span>
                                                    )}
                                                </div>
                                                {doc.ocrContent && (
                                                    <div className="text-[10px] text-slate-400 truncate max-w-[200px] italic mt-0.5">
                                                        "{doc.ocrContent.substring(0, 50)}..."
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px]">{doc.category || 'AUTRE'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-xs font-mono bg-slate-100 px-2 py-1 rounded w-fit">
                                                    v{latestVersion?.version || 1}.0 <History className="h-3 w-3 text-slate-400 ml-1 cursor-pointer hover:text-slate-900" onClick={() => alert("Historique des versions...")} />
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">{formatSize(latestVersion?.size || 0)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={doc.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" onClick={handleStamp} title="Tamponner">
                                                        <ShieldCheck className="h-4 w-4" />
                                                    </Button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleOpenFile(doc)}><Eye className="mr-2 h-4 w-4" /> Ouvrir</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAddVersion(doc.id)}><FilePlus className="mr-2 h-4 w-4" /> Nouvelle version</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={async () => {
                                                                setIsGenerating(true);
                                                                await runOCR(doc.id);
                                                                toast({ title: "OCR Terminé", description: "Le document a été scanné." });
                                                                setIsGenerating(false);
                                                                router.refresh();
                                                            }}><ScanLine className="mr-2 h-4 w-4" /> Re-scanner (OCR)</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleSign(doc)}><PenTool className="mr-2 h-4 w-4" /> Signer (Élec.)</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => alert("Téléchargement lancé...")}><Download className="mr-2 h-4 w-4" /> Télécharger</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(doc.id)}><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Empty State / Drop Prompt */}
                        {documents.length === 0 && (
                            <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-t border-slate-100 mt-4 border-dashed" onClick={() => fileInputRef.current?.click()}>
                                <Mail className="h-8 w-8 mb-2 text-slate-300" />
                                <p className="text-sm">Glissez des fichiers ici ou cliquez pour importer</p>
                            </div>
                        )}
                        {documents.length > 0 && documents.length < 10 && (
                            <div className="py-8 flex flex-col items-center justify-center text-slate-400 border-t border-slate-100 mt-4 border-dashed border-2 rounded-lg bg-slate-50/30 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-6 w-6 mb-2 text-slate-300" />
                                <p className="text-xs">Glissez d'autres fichiers ici pour ajouter</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Details & Actions */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-sm text-slate-900">Actions Rapides</h3>
                            <Button className="w-full justify-start text-xs bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200" variant="ghost" onClick={handleStamp}>
                                <ShieldCheck className="mr-2 h-4 w-4" /> Tamponner (Bates)
                            </Button>
                            <Button className="w-full justify-start text-xs" variant="outline" onClick={handleCompare}>
                                <Maximize2 className="mr-2 h-4 w-4" /> Comparer Versions
                            </Button>
                            <Button className="w-full justify-start text-xs text-blue-700 bg-blue-50 border-blue-200" variant="ghost" onClick={() => handleSign()}>
                                <PenTool className="mr-2 h-4 w-4" /> Signature (Parapheur)
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50 border-slate-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-sm text-slate-900 mb-2">Statistiques GED</h3>
                            <div className="text-xs space-y-2 text-slate-600">
                                <div className="flex justify-between"><span>Espace utilisé</span> <span className="font-medium">450 MB</span></div>
                                <div className="flex justify-between"><span>Fichiers</span> <span className="font-medium text-indigo-600">{documents.length}</span></div>
                                <div className="flex justify-between"><span>Dernier ajout</span> <span className="font-medium">Aujourd'hui</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Generation / OCR Processing State Dialog */}
            <Dialog open={isGenerating}>
                <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center py-10">
                    <BrainCircuit className="h-12 w-12 text-indigo-600 animate-pulse mb-4" />
                    <DialogTitle className="text-lg font-semibold animate-pulse">Action intelligente en cours...</DialogTitle>
                    <DialogDescription className="text-sm text-slate-500 text-center mt-2">
                        LexAI analyse, traite ou rédige vos documents juridiques pour votre dossier.
                    </DialogDescription>
                </DialogContent>
            </Dialog>

            {/* Document Visionnaire (Preview) */}
            <Dialog open={!!selectedDocForView} onOpenChange={(open) => !open && setSelectedDocForView(null)}>
                <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-slate-50">
                        <div className="flex items-center justify-between pr-8">
                            <div>
                                <DialogTitle className="text-xl flex items-center gap-2">
                                    <FileIcon type={selectedDocForView?.category || 'AUTRE'} />
                                    {selectedDocForView?.name}
                                </DialogTitle>
                                <DialogDescription>
                                    Visualisation du contenu extrait par LexAI • {selectedDocForView?.folder || 'Racine'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        <Tabs defaultValue="preview" className="flex-1 flex flex-col">
                            <TabsList className="mx-4 mt-2">
                                <TabsTrigger value="preview" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Contenu (OCR)</TabsTrigger>
                                <TabsTrigger value="versions" className="flex items-center gap-2"><History className="h-4 w-4" /> Versions</TabsTrigger>
                            </TabsList>

                            <TabsContent value="preview" className="flex-1 p-0 overflow-hidden">
                                <ScrollArea className="h-full p-6 bg-white">
                                    <div className="max-w-2xl mx-auto">
                                        {selectedDocForView?.ocrContent ? (
                                            <div className="prose prose-slate max-w-none">
                                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-6 text-sm text-amber-800 flex items-start gap-3">
                                                    <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                                                    <div>
                                                        <strong>Intelligence LexAI :</strong> Ce texte a été extrait et structuré automatiquement.
                                                        Il est indexé pour vos recherches croisées.
                                                    </div>
                                                </div>
                                                <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-base bg-slate-50 p-6 rounded-xl border border-slate-100 italic">
                                                    {selectedDocForView.ocrContent}
                                                </pre>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                                <ScanLine className="h-16 w-16 mb-4 opacity-20" />
                                                <p>Aucun contenu textuel extrait pour ce document.</p>
                                                <Button variant="outline" className="mt-4" onClick={async () => {
                                                    if (selectedDocForView) {
                                                        const res = await runOCR(selectedDocForView.id);
                                                        if (res.success) {
                                                            toast({ title: "OCR Terminé" });
                                                            router.refresh();
                                                            setSelectedDocForView(null);
                                                        }
                                                    }
                                                }}>Lancer l'OCR maintenant</Button>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="versions" className="flex-1 p-6">
                                <div className="space-y-4">
                                    {selectedDocForView?.versions?.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-slate-600">
                                                    v{v.version}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{v.comment || 'Sans commentaire'}</div>
                                                    <div className="text-[10px] text-slate-400">Ajouté le {new Date(v.createdAt).toLocaleDateString()} par {v.uploadedBy?.name || 'Système'}</div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                <Download className="h-4 w-4 mr-1" /> Télécharger
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => {
                                        if (selectedDocForView) handleAddVersion(selectedDocForView.id);
                                    }}>
                                        <FilePlus className="h-4 w-4 mr-2" /> Ajouter une nouvelle version
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Signature Dialog */}
            {selectedDocForSigning && (
                <SignatureDialog
                    documentId={selectedDocForSigning.id}
                    documentName={selectedDocForSigning.name}
                    onSigned={() => {
                        setSelectedDocForSigning(null)
                        router.refresh()
                    }}
                />
            )}
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
