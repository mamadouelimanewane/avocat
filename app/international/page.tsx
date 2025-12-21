"use client"

import { useState } from 'react'
import {
    Globe,
    Languages,
    ClipboardList,
    FileSignature,
    Video,
    Shield,
    Building,
    Search,
    ExternalLink,
    ChevronRight,
    Check,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Configuration des langues disponibles pour un cabinet international
const LANGUAGES = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
]

// Types de procurations disponibles
const POWER_OF_ATTORNEY_TYPES = [
    { id: 'general', name: 'Procuration Générale', description: 'Pour toutes les actions en justice' },
    { id: 'specific', name: 'Procuration Spéciale', description: 'Pour un dossier spécifique' },
    { id: 'administrative', name: 'Mandat Administratif', description: 'Démarches auprès des administrations' },
]

// Mock: Liste des juridictions internationales OHADA
const JURISDICTIONS = [
    { id: 'ccja', name: 'CCJA - OHADA', country: 'International', flag: '🌍' },
    { id: 'tpi_dakar', name: 'TPI Dakar', country: 'Sénégal', flag: '🇸🇳' },
    { id: 'tc_abidjan', name: 'Tribunal Commerce Abidjan', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { id: 'tgi_douala', name: 'TGI Douala', country: 'Cameroun', flag: '🇨🇲' },
    { id: 'ta_bamako', name: 'Tribunal Arbitrage Bamako', country: 'Mali', flag: '🇲🇱' },
]

export default function InternationalToolsPage() {
    const [selectedLang, setSelectedLang] = useState('fr')
    const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false)
    const [signatureData, setSignatureData] = useState({
        clientName: '',
        type: '',
        dossierRef: ''
    })
    const [searchJurisdiction, setSearchJurisdiction] = useState('')

    const filteredJurisdictions = JURISDICTIONS.filter(j =>
        j.name.toLowerCase().includes(searchJurisdiction.toLowerCase()) ||
        j.country.toLowerCase().includes(searchJurisdiction.toLowerCase())
    )

    const handleRequestSignature = () => {
        // Simulation de l'envoi d'une demande de signature électronique
        alert(`Demande de signature envoyée pour ${signatureData.clientName}. Le client recevra un email Yousign.`)
        setIsSignatureDialogOpen(false)
        setSignatureData({ clientName: '', type: '', dossierRef: '' })
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Outils Internationaux</h1>
                    <p className="text-slate-500 mt-1">Gestion multi-pays, signatures à distance et juridictions OHADA.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-slate-400" />
                    <select
                        className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white"
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Tabs defaultValue="signature" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[500px] mb-6">
                    <TabsTrigger value="signature">
                        <FileSignature className="mr-2 h-4 w-4" /> Signatures
                    </TabsTrigger>
                    <TabsTrigger value="jurisdictions">
                        <Building className="mr-2 h-4 w-4" /> Juridictions
                    </TabsTrigger>
                    <TabsTrigger value="portal">
                        <Globe className="mr-2 h-4 w-4" /> Portail Client
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Signature Électronique */}
                <TabsContent value="signature" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileSignature className="h-5 w-5 text-blue-600" />
                                    Signature Électronique
                                </CardTitle>
                                <CardDescription>
                                    Envoyez des mandats et documents à signer à distance via Yousign.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            <FileSignature className="mr-2 h-4 w-4" />
                                            Nouvelle Demande de Signature
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Demande de Signature à Distance</DialogTitle>
                                            <DialogDescription>
                                                Le client recevra un lien sécurisé par email.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label>Nom du Client</Label>
                                                <Input
                                                    value={signatureData.clientName}
                                                    onChange={e => setSignatureData({ ...signatureData, clientName: e.target.value })}
                                                    placeholder="M. Dupont / TechCorp SARL"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Type de Document</Label>
                                                <select
                                                    className="border border-slate-200 rounded-md px-3 py-2 text-sm"
                                                    value={signatureData.type}
                                                    onChange={e => setSignatureData({ ...signatureData, type: e.target.value })}
                                                >
                                                    <option value="">Sélectionner...</option>
                                                    {POWER_OF_ATTORNEY_TYPES.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Référence Dossier</Label>
                                                <Input
                                                    value={signatureData.dossierRef}
                                                    onChange={e => setSignatureData({ ...signatureData, dossierRef: e.target.value })}
                                                    placeholder="DOS-2025-001"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleRequestSignature}>
                                                Envoyer la Demande
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        <span className="font-medium text-slate-700">Conforme eIDAS (EU) & OHADA</span>
                                    </div>
                                    Signatures électroniques valides juridiquement dans l'espace OHADA.
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Signatures en Attente</CardTitle>
                                <CardDescription>Statut des demandes envoyées.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* Mock Data */}
                                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div>
                                            <div className="font-medium text-slate-900">Procuration Spéciale - M. Ba</div>
                                            <div className="text-xs text-slate-500">Envoyé il y a 2h</div>
                                        </div>
                                        <Badge variant="warning" className="bg-amber-100 text-amber-800">En attente</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div>
                                            <div className="font-medium text-slate-900">Mandat Général - TechCorp</div>
                                            <div className="text-xs text-slate-500">Signé le 15 déc</div>
                                        </div>
                                        <Badge variant="success" className="bg-green-100 text-green-800">
                                            <Check className="mr-1 h-3 w-3" /> Signé
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: Juridictions Internationales */}
                <TabsContent value="jurisdictions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5 text-indigo-600" />
                                Juridictions OHADA & Internationales
                            </CardTitle>
                            <CardDescription>
                                Recherchez et consultez les informations des tribunaux partenaires.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Rechercher une juridiction..."
                                    className="pl-10"
                                    value={searchJurisdiction}
                                    onChange={e => setSearchJurisdiction(e.target.value)}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredJurisdictions.map(j => (
                                    <Card key={j.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="text-2xl mb-2">{j.flag}</div>
                                                    <div className="font-semibold text-slate-900">{j.name}</div>
                                                    <div className="text-sm text-slate-500">{j.country}</div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Portail Client */}
                <TabsContent value="portal" className="space-y-6">
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-emerald-600" />
                                Portail Client Sécurisé
                            </CardTitle>
                            <CardDescription>
                                Offrez un accès en temps réel à vos clients internationaux sur l'avancement de leurs dossiers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <Card className="bg-emerald-50 border-emerald-200">
                                    <CardContent className="p-4 text-center">
                                        <ClipboardList className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                                        <div className="font-semibold text-slate-900">Suivi Dossiers</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Statut et historique en temps réel
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-4 text-center">
                                        <FileSignature className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <div className="font-semibold text-slate-900">Documents</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Téléchargement et signature
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-purple-50 border-purple-200">
                                    <CardContent className="p-4 text-center">
                                        <Video className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                        <div className="font-semibold text-slate-900">Consultations</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Planification visioconférence
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-slate-900">Configuration Requise</div>
                                        <div className="text-sm text-slate-500 mt-1">
                                            Pour activer le portail client, configurez votre domaine dans les paramètres d'administration.
                                            L'accès client sera sécurisé par authentification à deux facteurs (2FA).
                                        </div>
                                        <Button variant="outline" size="sm" className="mt-3">
                                            <ExternalLink className="mr-2 h-3 w-3" />
                                            Configurer le Portail
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
