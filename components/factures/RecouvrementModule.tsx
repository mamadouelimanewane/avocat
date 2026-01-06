"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Send, FileText, Mail, MessageSquare, Calendar, TrendingUp, Clock, DollarSign, Eye, Zap, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { sendRelance, generateMiseEnDemeure } from "@/app/actions"

interface UnpaidInvoice {
    id: string
    number: string
    client: {
        id: string
        name: string
        email: string
        phone?: string
        riskScore: number
    }
    amountTTC: number
    issueDate: Date
    dueDate: Date
    ageInDays: number
    relancesCount: number
    lastRelanceDate?: Date
    status: 'EMISE' | 'RETARD_30' | 'RETARD_60' | 'RETARD_90' | 'CONTENTIEUX'
}

interface RecouvrementModuleProps {
    unpaidInvoices: UnpaidInvoice[]
}

export function RecouvrementModule({ unpaidInvoices }: RecouvrementModuleProps) {
    const { toast } = useToast()
    const [selectedInvoice, setSelectedInvoice] = useState<UnpaidInvoice | null>(null)
    const [relanceType, setRelanceType] = useState<'COURTOISE' | 'FERME' | 'MISE_EN_DEMEURE'>('COURTOISE')
    const [customMessage, setCustomMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    // Statistiques
    const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.amountTTC, 0)
    const criticalInvoices = unpaidInvoices.filter(inv => inv.ageInDays > 60).length
    const avgRecoveryTime = unpaidInvoices.reduce((sum, inv) => sum + inv.ageInDays, 0) / unpaidInvoices.length

    // Groupement par catégorie
    const invoicesByStatus = {
        recent: unpaidInvoices.filter(inv => inv.ageInDays <= 30),
        medium: unpaidInvoices.filter(inv => inv.ageInDays > 30 && inv.ageInDays <= 60),
        critical: unpaidInvoices.filter(inv => inv.ageInDays > 60)
    }

    const handleSendRelance = async () => {
        if (!selectedInvoice) return

        setIsSending(true)

        try {
            const result = await sendRelance({
                invoiceId: selectedInvoice.id,
                type: relanceType,
                customMessage: customMessage || undefined,
                channel: selectedInvoice.client.email ? 'EMAIL' : 'WHATSAPP'
            })

            if (result.success) {
                toast({
                    title: "✅ Relance envoyée",
                    description: `Email envoyé à ${selectedInvoice.client.name}`
                })
                setSelectedInvoice(null)
                setCustomMessage('')
            } else {
                toast({
                    title: "❌ Erreur",
                    description: result.message || "Impossible d'envoyer la relance",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "❌ Erreur technique",
                description: "Une erreur est survenue",
                variant: "destructive"
            })
        } finally {
            setIsSending(false)
        }
    }

    const getStatusBadge = (invoice: UnpaidInvoice) => {
        if (invoice.ageInDays <= 30) {
            return <Badge className="bg-blue-500">Récent (≤30j)</Badge>
        } else if (invoice.ageInDays <= 60) {
            return <Badge className="bg-amber-500">Retard Moyen (30-60j)</Badge>
        } else {
            return <Badge className="bg-red-500 animate-pulse">Critique (&gt;60j)</Badge>
        }
    }

    const getRiskBadge = (score: number) => {
        if (score >= 80) return <Badge variant="destructive">Risque Élevé</Badge>
        if (score >= 50) return <Badge className="bg-amber-500">Risque Moyen</Badge>
        return <Badge className="bg-emerald-500">Risque Faible</Badge>
    }

    const getRelanceTemplate = (type: string) => {
        const templates = {
            COURTOISE: `Bonjour,

Nous constatons que la facture ${selectedInvoice?.number} d'un montant de ${selectedInvoice?.amountTTC.toLocaleString('fr-FR')} FCFA n'a pas encore été réglée.

Nous vous serions reconnaissants de bien vouloir procéder au paiement dans les meilleurs délais.

Cordialement,
Cabinet LexPremium`,
            FERME: `Madame, Monsieur,

Malgré notre précédente relance, nous constatons que la facture ${selectedInvoice?.number} demeure impayée.

Montant dû : ${selectedInvoice?.amountTTC.toLocaleString('fr-FR')} FCFA
Date d'échéance : ${selectedInvoice?.dueDate.toLocaleDateString('fr-FR')}

Nous vous demandons de régulariser cette situation sous 8 jours, faute de quoi nous nous verrons contraints de suspendre nos prestations.

Cordialement,
Cabinet LexPremium`,
            MISE_EN_DEMEURE: `MISE EN DEMEURE DE PAYER

Par la présente, nous vous mettons formellement en demeure de procéder au règlement de la facture ${selectedInvoice?.number}.

Montant dû : ${selectedInvoice?.amountTTC.toLocaleString('fr-FR')} FCFA
Date d'échéance dépassée : ${selectedInvoice?.dueDate.toLocaleDateString('fr-FR')}

À défaut de paiement sous 15 jours à compter de la réception de ce courrier, nous engagerons une procédure de recouvrement contentieux sans autre avis.

Cabinet LexPremium`
        }
        return templates[type as keyof typeof templates] || ''
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Module de Recouvrement</h1>
                    <p className="text-slate-500 mt-1">Gestion automatisée des factures impayées</p>
                </div>
            </div>

            {/* KPI Recouvrement */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-red-700 text-sm font-medium">Total Impayés</p>
                            <DollarSign className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-900">{totalUnpaid.toLocaleString('fr-FR')} F</p>
                        <p className="text-xs text-red-600 mt-2">{unpaidInvoices.length} factures</p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-amber-700 text-sm font-medium">Factures Critiques</p>
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <p className="text-3xl font-bold text-amber-900">{criticalInvoices}</p>
                        <p className="text-xs text-amber-600 mt-2">&gt; 60 jours de retard</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 text-sm font-medium">Délai Moyen</p>
                            <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{avgRecoveryTime.toFixed(0)} j</p>
                        <p className="text-xs text-slate-500 mt-2">Temps de recouvrement</p>
                    </CardContent>
                </Card>

                <Card className="bg-indigo-50 border-indigo-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-indigo-700 text-sm font-medium">Relances Envoyées</p>
                            <Send className="h-5 w-5 text-indigo-600" />
                        </div>
                        <p className="text-3xl font-bold text-indigo-900">
                            {unpaidInvoices.reduce((sum, inv) => sum + inv.relancesCount, 0)}
                        </p>
                        <p className="text-xs text-indigo-600 mt-2">Ce mois</p>
                    </CardContent>
                </Card>
            </div>

            {/* Onglets */}
            <Tabs defaultValue="recent" className="w-full">
                <TabsList className="bg-slate-100 grid w-full grid-cols-3">
                    <TabsTrigger value="recent">
                        Récents ({invoicesByStatus.recent.length})
                    </TabsTrigger>
                    <TabsTrigger value="medium" className="text-amber-700">
                        30-60j ({invoicesByStatus.medium.length})
                    </TabsTrigger>
                    <TabsTrigger value="critical" className="text-red-700">
                        Critiques ({invoicesByStatus.critical.length})
                    </TabsTrigger>
                </TabsList>

                {['recent', 'medium', 'critical'].map(status => (
                    <TabsContent key={status} value={status} className="mt-4">
                        <Card>
                            <ScrollArea className="h-[500px]">
                                <div className="p-4 space-y-3">
                                    {invoicesByStatus[status as keyof typeof invoicesByStatus].map(invoice => (
                                        <div key={invoice.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-slate-900">{invoice.number}</p>
                                                        {getStatusBadge(invoice)}
                                                        {getRiskBadge(invoice.client.riskScore)}
                                                    </div>
                                                    <p className="text-sm text-slate-700">
                                                        <span className="font-semibold">{invoice.client.name}</span>
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Émise : {invoice.issueDate.toLocaleDateString('fr-FR')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Retard : {invoice.ageInDays}j
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Send className="h-3 w-3" />
                                                            {invoice.relancesCount} relance(s)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-slate-900">{invoice.amountTTC.toLocaleString('fr-FR')} F</p>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                className="mt-3 bg-slate-900"
                                                                onClick={() => setSelectedInvoice(invoice)}
                                                            >
                                                                <Send className="h-4 w-4 mr-2" />
                                                                Relancer
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Relance de Paiement</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="p-4 bg-slate-50 rounded-lg">
                                                                    <p className="text-sm text-slate-600">Facture : <span className="font-bold">{invoice.number}</span></p>
                                                                    <p className="text-sm text-slate-600">Client : <span className="font-bold">{invoice.client.name}</span></p>
                                                                    <p className="text-sm text-slate-600">Montant : <span className="font-bold text-red-600">{invoice.amountTTC.toLocaleString('fr-FR')} FCFA</span></p>
                                                                    <p className="text-sm text-slate-600">Retard : <span className="font-bold">{invoice.ageInDays} jours</span></p>
                                                                </div>

                                                                <div>
                                                                    <label className="text-sm font-medium mb-2 block">Type de Relance</label>
                                                                    <Select value={relanceType} onValueChange={(v: any) => {
                                                                        setRelanceType(v)
                                                                        setCustomMessage(getRelanceTemplate(v))
                                                                    }}>
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="COURTOISE">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Mail className="h-4 w-4 text-blue-500" />
                                                                                    <span>Relance Courtoise</span>
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="FERME">
                                                                                <div className="flex items-center gap-2">
                                                                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                                                                    <span>Relance Ferme</span>
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="MISE_EN_DEMEURE">
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="h-4 w-4 text-red-500" />
                                                                                    <span>Mise en Demeure</span>
                                                                                </div>
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div>
                                                                    <label className="text-sm font-medium mb-2 block">Message</label>
                                                                    <Textarea
                                                                        rows={10}
                                                                        value={customMessage}
                                                                        onChange={(e) => setCustomMessage(e.target.value)}
                                                                        className="font-mono text-xs"
                                                                    />
                                                                </div>

                                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                    {invoice.client.email ? (
                                                                        <>
                                                                            <Mail className="h-4 w-4 text-blue-500" />
                                                                            <span>Sera envoyé par email à : {invoice.client.email}</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <MessageSquare className="h-4 w-4 text-green-500" />
                                                                            <span>Sera envoyé par WhatsApp</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button
                                                                    onClick={handleSendRelance}
                                                                    disabled={isSending || !customMessage}
                                                                    className="bg-indigo-600"
                                                                >
                                                                    {isSending ? (
                                                                        <>Envoi en cours...</>
                                                                    ) : (
                                                                        <>
                                                                            <Send className="h-4 w-4 mr-2" />
                                                                            Envoyer la Relance
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {invoicesByStatus[status as keyof typeof invoicesByStatus].length === 0 && (
                                        <div className="text-center py-12 text-slate-400">
                                            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                            <p className="font-medium">Aucune facture dans cette catégorie</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
