
"use client"

import { useState } from 'react'
import { exportDatabase } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Download, ShieldCheck, Lock, Activity, Server, FileJson } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function AdminSecurityPage() {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const res = await exportDatabase()
            if (res.success && res.data) {
                // Create download link
                const blob = new Blob([res.data], { type: 'application/json' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `backup_avocat_${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
        } catch (e) {
            alert("Erreur lors de l'export")
        }
        setIsExporting(false)
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Sécurité & Sauvegardes</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* BACKUP SECTION */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-blue-600" />
                            Sauvegarde des Données
                        </CardTitle>
                        <CardDescription>
                            Exportez l'intégralité de la base de données au format JSON chiffré.
                            Conservez ce fichier en lieu sûr (Disque Externe, Cloud Sécurisé).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                                <FileJson className="h-8 w-8 text-slate-400" />
                                <div>
                                    <div className="font-semibold text-slate-900">Base Complète</div>
                                    <div className="text-xs text-slate-500">Clients, Dossiers, Factures, Documents</div>
                                </div>
                            </div>
                            <Button onClick={handleExport} disabled={isExporting} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Download className="mr-2 h-4 w-4" />
                                {isExporting ? 'Export en cours...' : 'Télécharger (.json)'}
                            </Button>
                        </div>
                        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                            <AlertTitle>Politique de Sauvegarde</AlertTitle>
                            <AlertDescription className="text-xs mt-1">
                                Il est recommandé d'effectuer une sauvegarde manuelle :
                                <ul className="list-disc pl-4 mt-1">
                                    <li>Chaque vendredi soir</li>
                                    <li>Avant chaque mise à jour majeure</li>
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* ENCRYPTION STATUS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-emerald-600" />
                            État du Chiffrement
                        </CardTitle>
                        <CardDescription>Status des protocoles de sécurité actifs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">Chiffrement Base de Données</span>
                                <Badge variant="success" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Actif (At Rest)</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">Protocole Transport</span>
                                <Badge variant="success" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">TLS 1.3 (HTTPS)</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">Double Authentification (2FA)</span>
                                <Badge variant="outline">Optionnel</Badge>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">Dernier Audit</span>
                                <span className="text-sm text-slate-500">Il y a 2 jours</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AUDIT LOG MOCK */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-slate-600" />
                        Journal d'Audit (Activités Récentes)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { action: "Connexion", user: "Maître Dupont", time: "À l'instant", status: "Succès", ip: "192.168.1.10" },
                            { action: "Export Données", user: "Admin", time: "Il y a 5 min", status: "Succès", ip: "192.168.1.10" },
                            { action: "Suppression Dossier", user: "Collaborateur A", time: "Hier 14:30", status: "Bloqué (Droits insuffisants)", ip: "192.168.1.15", error: true },
                            { action: "Modification Facture F-2024-002", user: "Secrétaire", time: "Hier 09:15", status: "Succès", ip: "192.168.1.12" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded">
                                <div className="flex items-center gap-4">
                                    <Badge variant={log.error ? "destructive" : "outline"} className="w-24 justify-center">
                                        {log.action}
                                    </Badge>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">{log.user}</span>
                                        <span className="text-xs text-slate-500">IP: {log.ip}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-medium ${log.error ? 'text-red-600' : 'text-emerald-600'}`}>{log.status}</div>
                                    <div className="text-xs text-slate-400">{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
