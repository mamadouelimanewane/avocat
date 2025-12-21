
"use client"

import { useState } from 'react'
import { Video, Phone, MessageCircle, Calendar as CalendarIcon, Users, Link as LinkIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createMeeting, logCommunication } from '../actions'

export default function CommunicationPage() {
    const [meetingTitle, setMeetingTitle] = useState('')
    const [meetingDate, setMeetingDate] = useState('')
    const [meetingTime, setMeetingTime] = useState('')
    const [platform, setPlatform] = useState('ZOOM')

    const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)

    // Workflow Logic
    const [workflowType, setWorkflowType] = useState('TRANSMISSION')
    const [selectedMailId, setSelectedMailId] = useState<string | null>(null)
    const [isWorkflowOpen, setIsWorkflowOpen] = useState(false)

    const handleStartWorkflow = (mailId: string) => {
        setSelectedMailId(mailId)
        setIsWorkflowOpen(true)
    }

    const executeWorkflow = () => {
        // Simulation of Workflow Engine
        setIsWorkflowOpen(false)
        let message = ""
        switch (workflowType) {
            case 'TRANSMISSION':
                message = "Courrier transmis à Me Diop pour information. Notification envoyée."
                break
            case 'TASK':
                message = "Tâche 'Traiter le courrier' créée avec échéance à J+2. Assignée au collaborateur."
                break
            case 'VALIDATION':
                message = "Circuit de validation lancé. En attente de l'approbation de l'associé gérant."
                break
        }
        alert(`Workflow Initié : ${message}`) // Using alert for immediate feedback in this demo, usually Toast
    }

    const handleCreateMeeting = async () => {
        await createMeeting({
            title: meetingTitle,
            startTime: `${meetingDate}T${meetingTime}:00`,
            duration: 60,
            platform,
            participants: [] // Simulated
        })
        setIsMeetingDialogOpen(false)
        alert('Réunion planifiée ! Lien généré.')
    }

    // WhatsApp Simulation
    const handleWhatsAppRedirect = () => {
        window.open('https://web.whatsapp.com/', '_blank');
        logCommunication({
            type: 'WHATSAPP',
            direction: 'OUTBOUND',
            content: 'Ouverture WhatsApp Web',
            dossierId: null
        })
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Workflow Dialog */}
            <Dialog open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Initier un Workflow Dynamique</DialogTitle>
                        <DialogDescription>
                            Définissez le circuit de traitement pour ce document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Type de Workflow</Label>
                            <Select value={workflowType} onValueChange={setWorkflowType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TRANSMISSION">Transmission Simple (Info)</SelectItem>
                                    <SelectItem value="TASK">Création de Tâche (Traitement)</SelectItem>
                                    <SelectItem value="VALIDATION">Circuit de Validation (Facture/Acte)</SelectItem>
                                    <SelectItem value="CLASSEMENT">Procédure d'Archivage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {workflowType === 'TRANSMISSION' && (
                            <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                                Le document sera envoyé à la bannette numérique du destinataire. Aucun suivi de délai.
                            </div>
                        )}
                        {workflowType === 'TASK' && (
                            <div className="p-3 bg-orange-50 text-orange-700 text-sm rounded-md">
                                Une tâche sera créée dans le dossier concerné avec une échéance automatique de 48h.
                            </div>
                        )}
                        {workflowType === 'VALIDATION' && (
                            <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-md">
                                Le document sera bloqué jusqu'à validation électronique par un associé.
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label>Destinataire / Responsable</Label>
                            <Select defaultValue="me_diop">
                                <SelectTrigger><SelectValue placeholder="Choisir un collaborateur" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="me_diop">Me Diop (Associé)</SelectItem>
                                    <SelectItem value="collab_1">Collaborateur Senior</SelectItem>
                                    <SelectItem value="sec_gen">Secrétariat Général</SelectItem>
                                    <SelectItem value="compta">Service Comptabilité</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Note / Instructions</Label>
                            <Input placeholder="Ex: A traiter en urgence avant l'audience..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWorkflowOpen(false)}>Annuler</Button>
                        <Button onClick={executeWorkflow} className="bg-indigo-600 hover:bg-indigo-700 text-white">Lancer le Workflow</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Communication & Workflows</h1>
                    <p className="text-slate-500 mt-1">Gérez le courrier entrant/sortant et automatisez les processus internes.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Video className="mr-2 h-4 w-4" /> Nouvelle Réunion
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Planifier une visioconférence</DialogTitle>
                                <DialogDescription>Créez un lien Zoom/Teams sécurisé pour vos clients.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Sujet</Label>
                                    <Input value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} placeholder="Ex: Point Dossier Ndiaye" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Date</Label>
                                        <Input type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Heure</Label>
                                        <Input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Plateforme</Label>
                                    <Select value={platform} onValueChange={setPlatform}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ZOOM">Zoom</SelectItem>
                                            <SelectItem value="TEAMS">Microsoft Teams</SelectItem>
                                            <SelectItem value="GOOGLE_MEET">Google Meet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateMeeting}>Générer Lien</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="courrier" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
                    <TabsTrigger value="courrier">Registre Courrier</TabsTrigger>
                    <TabsTrigger value="admin">Dossiers Cabinet</TabsTrigger>
                    <TabsTrigger value="meetings">Réunions</TabsTrigger>
                    <TabsTrigger value="whatsapp">Messagerie</TabsTrigger>
                </TabsList>

                <TabsContent value="courrier" className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="bg-red-50/50 pb-3">
                                <CardTitle className="text-red-700 flex items-center gap-2">
                                    <div className="bg-red-100 p-2 rounded-full"><LinkIcon className="h-4 w-4" /></div>
                                    Courrier Arrivée
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {/* Mock Data from Seed */}
                                    <div className="p-4 hover:bg-slate-50 flex justify-between items-center group">
                                        <div className="flex gap-3">
                                            <div className="mt-1"><Badge variant="outline" className="text-xs">10 Mai</Badge></div>
                                            <div>
                                                <p className="font-semibold text-slate-800">Lettre Recommandée - Ordre des Avocats</p>
                                                <p className="text-sm text-slate-500">Objet : Convocation AG Ordinaire</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">A Traiter</Badge>
                                            <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => handleStartWorkflow('mail_1')}>
                                                Workflow
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-slate-50 flex justify-between items-center group">
                                        <div className="flex gap-3">
                                            <div className="mt-1"><Badge variant="outline" className="text-xs">12 Mai</Badge></div>
                                            <div>
                                                <p className="font-semibold text-slate-800">Facture SENELEC - Mai 2024</p>
                                                <p className="text-sm text-slate-500">Ref: FAC-2938492</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Comptabilité</Badge>
                                            <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => handleStartWorkflow('mail_2')}>
                                                Workflow
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t bg-slate-50 text-center">
                                    <Button variant="ghost" size="sm" className="text-red-600 w-full">+ Enregistrer un courrier arrivée</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="bg-blue-50/50 pb-3">
                                <CardTitle className="text-blue-700 flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-full"><LinkIcon className="h-4 w-4 rotate-180" /></div>
                                    Courrier Départ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    <div className="p-4 hover:bg-slate-50 flex justify-between items-center group">
                                        <div className="flex gap-3">
                                            <div className="mt-1"><Badge variant="outline" className="text-xs">14 Mai</Badge></div>
                                            <div>
                                                <p className="font-semibold text-slate-800">Réponse Barreau</p>
                                                <p className="text-sm text-slate-500">Dest : Bâtonnier de l'Ordre</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Envoyé</Badge>
                                            <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => handleStartWorkflow('mail_3')}>
                                                Workflow
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t bg-slate-50 text-center">
                                    <Button variant="ghost" size="sm" className="text-blue-600 w-full">+ Enregistrer un départ</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="admin" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>Dossiers Administratifs du Cabinet</CardTitle>
                                    <CardDescription>Ressources Humaines, Fiscalité, Charges, Contrats Fournisseurs.</CardDescription>
                                </div>
                                <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Nouveau Dossier</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="p-4 border rounded-lg bg-orange-50 border-orange-100 hover:shadow-md transition-all cursor-pointer">
                                    <Users className="h-8 w-8 text-orange-500 mb-3" />
                                    <h3 className="font-bold text-slate-800">Ressources Humaines</h3>
                                    <p className="text-xs text-slate-500 mt-1">Contrats, Paie, Staff</p>
                                </div>
                                <div className="p-4 border rounded-lg bg-emerald-50 border-emerald-100 hover:shadow-md transition-all cursor-pointer">
                                    <CalendarIcon className="h-8 w-8 text-emerald-500 mb-3" />
                                    <h3 className="font-bold text-slate-800">Fiscalité & Taxes</h3>
                                    <p className="text-xs text-slate-500 mt-1">TVA, BRS, Impôts</p>
                                </div>
                                <div className="p-4 border rounded-lg bg-indigo-50 border-indigo-100 hover:shadow-md transition-all cursor-pointer">
                                    <LinkIcon className="h-8 w-8 text-indigo-500 mb-3" />
                                    <h3 className="font-bold text-slate-800">Fournisseurs</h3>
                                    <p className="text-xs text-slate-500 mt-1">Senelec, Orange, Eau</p>
                                </div>
                                <div className="p-4 border rounded-lg bg-slate-50 border-slate-200 hover:shadow-md transition-all cursor-pointer">
                                    <LinkIcon className="h-8 w-8 text-slate-500 mb-3" />
                                    <h3 className="font-bold text-slate-800">Bail & Loyer</h3>
                                    <p className="text-xs text-slate-500 mt-1">Contrat, Quittances</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="meetings" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Prochaines Réunions</CardTitle>
                            <CardDescription>Vos visioconférences planifiées.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Mock List - In real app, fetch from DB */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Video className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">Consultation - M. Ba</div>
                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                <CalendarIcon className="h-3 w-3" /> Aujourd'hui, 14:00 • 45 min
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                            <LinkIcon className="mr-2 h-3 w-3" /> Copier Lien
                                        </Button>
                                        <Button size="sm" className="bg-blue-600">Démarrer (Zoom)</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="whatsapp" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-[#25D366]/10 border-[#25D366]/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#075E54]">
                                    <MessageCircle className="h-6 w-6" /> WhatsApp Web
                                </CardTitle>
                                <CardDescription>
                                    Lancez WhatsApp Web pour échanger rapidement avec vos clients.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" onClick={handleWhatsAppRedirect}>
                                    Ouvrir WhatsApp Web
                                </Button>
                                <p className="text-xs text-slate-500 mt-4 text-center">
                                    Astuce: Utilisez l'extension Chrome "Save to Dossier" pour archiver les conversations.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Journal des échanges</CardTitle>
                                <CardDescription>Historique des communications enregistrées.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 text-sm">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-0.5">WhatsApp</Badge>
                                        <div>
                                            <p className="font-medium text-slate-900">Envoi pièces dossier TechCorp</p>
                                            <p className="text-xs text-slate-500">Hier à 10:23 • Vers Client</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
