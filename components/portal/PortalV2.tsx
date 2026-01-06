"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LiveChat } from '@/components/portal/LiveChat'
import { DocumentUpload } from '@/components/portal/DocumentUpload'
import { MobileMoneyPayment } from '@/components/portal/MobileMoneyPayment'
import { Badge } from '@/components/ui/badge'
import {
    MessageSquare,
    Upload,
    CreditCard,
    Bell,
    CheckCircle2,
    AlertCircle,
    Clock
} from 'lucide-react'

interface PortalV2Props {
    clientData: {
        id: string
        name: string
        facturesImpayees: Array<{
            id: string
            number: string
            amount: number
            reference: string
        }>
    }
    dossierId?: string
}

export function PortalV2({ clientData, dossierId }: PortalV2Props) {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'info' as const,
            title: 'Document signé',
            message: 'Votre acte de vente a été signé par Me. Diop',
            timestamp: new Date(),
            read: false
        },
        {
            id: '2',
            type: 'warning' as const,
            title: 'Facture en attente',
            message: 'La facture FAC-2024-123 est due dans 5 jours',
            timestamp: new Date(Date.now() - 86400000),
            read: false
        },
        {
            id: '3',
            type: 'success' as const,
            title: 'Audience reportée',
            message: 'Nouvelle date: 25 Janvier 2026 à 14h',
            timestamp: new Date(Date.now() - 172800000),
            read: true
        }
    ])

    const handleNotificationClick = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="space-y-6">
            {/* Notifications Banner */}
            <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-white">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">Notifications</CardTitle>
                            {unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {notifications.slice(0, 3).map(notif => (
                            <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${notif.read
                                        ? 'bg-white border-slate-100 opacity-60'
                                        : 'bg-white border-blue-200 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {notif.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                        {notif.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                                        {notif.type === 'info' && <Clock className="h-4 w-4 text-blue-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                                        <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {notif.timestamp.toLocaleString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    {!notif.read && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-14">
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Message instantané</span>
                        <span className="sm:hidden">Chat</span>
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Envoyer documents</span>
                        <span className="sm:hidden">Upload</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Paiement Mobile</span>
                        <span className="sm:hidden">Payer</span>
                        {clientData.facturesImpayees?.length > 0 && (
                            <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                                {clientData.facturesImpayees.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-6">
                    <LiveChat
                        dossierId={dossierId}
                        clientName={clientData.name}
                        avocatName="Me. Mamadou Diop"
                    />
                </TabsContent>

                <TabsContent value="upload" className="mt-6">
                    <DocumentUpload
                        dossierId={dossierId}
                        onUploadComplete={(files) => {
                            console.log('Files uploaded:', files)
                            // Add notification
                            setNotifications(prev => [{
                                id: Date.now().toString(),
                                type: 'success',
                                title: 'Documents envoyés',
                                message: `${files.length} document(s) transmis au cabinet`,
                                timestamp: new Date(),
                                read: false
                            }, ...prev])
                        }}
                    />
                </TabsContent>

                <TabsContent value="payment" className="mt-6">
                    <div className="space-y-6">
                        {clientData.facturesImpayees && clientData.facturesImpayees.length > 0 ? (
                            clientData.facturesImpayees.map(facture => (
                                <MobileMoneyPayment
                                    key={facture.id}
                                    factureId={facture.id}
                                    amount={facture.amount}
                                    reference={facture.reference}
                                    onPaymentSuccess={() => {
                                        setNotifications(prev => [{
                                            id: Date.now().toString(),
                                            type: 'success',
                                            title: 'Paiement réussi',
                                            message: `Facture ${facture.number} réglée avec succès`,
                                            timestamp: new Date(),
                                            read: false
                                        }, ...prev])
                                    }}
                                    onPaymentFailed={(error) => {
                                        setNotifications(prev => [{
                                            id: Date.now().toString(),
                                            type: 'warning',
                                            title: 'Échec du paiement',
                                            message: error,
                                            timestamp: new Date(),
                                            read: false
                                        }, ...prev])
                                    }}
                                />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        Aucune facture en attente
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Tous vos paiements sont à jour. Merci de votre confiance !
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
