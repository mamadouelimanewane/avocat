"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    PenTool,
    Upload,
    FileText,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Download,
    Eye,
    History,
    Users,
    AlertCircle,
    UserCheck,
    Lock
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SignaturePad } from "@/components/ui/signature-pad"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { signDocument } from "@/app/actions"

interface SignatureDocument {
    id: string
    name: string
    type: string
    status: 'PENDING' | 'SIGNED' | 'EXPIRED'
    date: string
    signatories: Array<{ name: string, status: 'WAITING' | 'SIGNED', role: string }>
    securityLevel: 'SIMPLE' | 'ADVANCED' | 'QUALIFIED'
}

export function SignatureCenter() {
    const [isUploading, setIsUploading] = useState(false)
    const [documents, setDocuments] = useState<SignatureDocument[]>([
        {
            id: '1',
            name: 'Contrat_Bail_Commercial_Ndiaye.pdf',
            type: 'Contrat',
            status: 'PENDING',
            date: '25/12/2024',
            signatories: [
                { name: 'Me Ndiaye', status: 'SIGNED', role: 'Avocat' },
                { name: 'M. Sow', status: 'WAITING', role: 'Bailleur' }
            ],
            securityLevel: 'ADVANCED'
        },
        {
            id: '2',
            name: 'Avenant_Travail_Diop.pdf',
            type: 'Actes',
            status: 'SIGNED',
            date: '24/12/2024',
            signatories: [
                { name: 'Société ABC', status: 'SIGNED', role: 'Employeur' },
                { name: 'A. Diop', status: 'SIGNED', role: 'Salarié' }
            ],
            securityLevel: 'SIMPLE'
        }
    ])
    const [isSigning, setIsSigning] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState<SignatureDocument | null>(null)
    const { toast } = useToast()

    const handleFileUpload = () => {
        setIsUploading(true)
        setTimeout(() => {
            setIsUploading(false)
            toast({
                title: "Document ajouté",
                description: "Le document a été préparé pour la signature."
            })
        }, 1500)
    }

    const handleSign = async (signatureData: string) => {
        if (!selectedDoc) return

        setIsSigning(true)
        try {
            const result = await signDocument(selectedDoc.id, signatureData)
            if (result.success) {
                setDocuments(prev => prev.map(doc =>
                    doc.id === selectedDoc.id
                        ? { ...doc, status: 'SIGNED', signatories: doc.signatories.map(s => s.role === 'Avocat' ? { ...s, status: 'SIGNED' } : s) }
                        : doc
                ))
                toast({
                    title: "✅ Succès",
                    description: result.message
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Échec de l'authentification de la signature.",
                variant: "destructive"
            })
        } finally {
            setIsSigning(false)
            setSelectedDoc(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SIGNED': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Signé</Badge>
            case 'PENDING': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">En attente</Badge>
            default: return <Badge variant="outline">Expiré</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <PenTool className="h-8 w-8 text-indigo-600" />
                        Parapheur & Signature Électronique
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Signez et faites signer vos actes juridiques en toute conformité (OHADA/Sénégal).
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <History className="h-4 w-4" />
                        Historique
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={handleFileUpload} disabled={isUploading}>
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Traitement..." : "Nouveau Document"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Statistiques</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Total documents</span>
                                <span className="font-bold">24</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">En attente</span>
                                <span className="font-bold text-amber-600">8</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Complétés</span>
                                <span className="font-bold text-emerald-600">16</span>
                            </div>
                            <Progress value={66} className="h-1.5" />
                        </CardContent>
                    </Card>

                    <Card className="bg-indigo-50 border-indigo-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-900 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                Sécurité & Conformité
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-indigo-700 space-y-2 leading-relaxed">
                            <p>Tous les documents sont horodatés et scellés à l'aide d'un certificat X.509 conforme aux normes eIDAS et aux dispositions du Code des Obligations Civiles et Commerciales du Sénégal.</p>
                            <div className="flex items-center gap-1 font-semibold">
                                <Lock className="h-3 w-3" />
                                Chiffrement AES-256
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Parapheur View */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader className="border-b bg-slate-50/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-indigo-600" />
                                Parapheur En Cours
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[500px]">
                                {documents.length > 0 ? (
                                    <div className="divide-y">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-semibold text-slate-900">{doc.name}</h4>
                                                                {getStatusBadge(doc.status)}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Badge variant="outline" className="text-[10px] h-4">
                                                                        {doc.type}
                                                                    </Badge>
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    Ajouté le {doc.date}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    Niveau : {doc.securityLevel}
                                                                </span>
                                                            </div>

                                                            <div className="mt-3 flex flex-wrap gap-4">
                                                                {doc.signatories.map((sig, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-700">
                                                                        {sig.status === 'SIGNED' ? (
                                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                                        ) : (
                                                                            <Clock className="h-3 w-3 text-amber-500" />
                                                                        )}
                                                                        <span className="font-medium">{sig.name}</span>
                                                                        <span className="text-slate-400">({sig.role})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" title="Consulter">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Signataires">
                                                            <Users className="h-4 w-4" />
                                                        </Button>
                                                        {doc.status === 'SIGNED' ? (
                                                            <Button variant="ghost" size="icon" title="Télécharger">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="bg-indigo-600 hover:bg-indigo-700"
                                                                onClick={() => setSelectedDoc(doc)}
                                                            >
                                                                Signer
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                                        <PenTool className="h-16 w-16 mb-4 opacity-10" />
                                        <p>Aucun document dans le parapheur</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-amber-100 bg-amber-50/50">
                            <CardContent className="p-4 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-amber-900">Actions requises</p>
                                    <p className="text-xs text-amber-700">3 documents attendent votre signature avant demain.</p>
                                    <Button variant="link" className="p-0 h-auto text-xs text-amber-800 font-bold">Consulter les urgences</Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-indigo-100 bg-indigo-50/50">
                            <CardContent className="p-4 flex items-start gap-3">
                                <UserCheck className="h-5 w-5 text-indigo-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-indigo-900">Nouveaux signataires</p>
                                    <p className="text-xs text-indigo-700">M. Faye a validé son identité numérique avec succès.</p>
                                    <Button variant="link" className="p-0 h-auto text-xs text-indigo-800 font-bold">Voir son dossier</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Signature Dialog */}
            <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Signature Électronique Certifiée</DialogTitle>
                        <DialogDescription>
                            Vous vous apprêtez à signer : <span className="font-semibold text-slate-900">{selectedDoc?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <SignaturePad
                            onSave={handleSign}
                            onCancel={() => setSelectedDoc(null)}
                        />
                    </div>
                    <div className="text-[10px] text-slate-400 text-center italic">
                        En signant ce document, vous reconnaissez l'authenticité de votre consentement conformément au COCC et aux Actes Uniformes de l'OHADA.
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
