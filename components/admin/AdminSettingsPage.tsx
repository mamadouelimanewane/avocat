
"use client"

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateCabinetSettings } from '@/app/actions'

export default function AdminSettingsPage({ settings }: { settings: any }) {
    const [formData, setFormData] = useState({
        name: settings?.name || '',
        address: settings?.address || '',
        phone: settings?.phone || '',
        email: settings?.email || '',
        defaultHourlyRate: settings?.defaultHourlyRate || 200,
        tvaRate: settings?.tvaRate || 18,
        legalForm: settings?.legalForm || 'INDIVIDUEL',
        tradeRegister: settings?.tradeRegister || '',
        ninea: settings?.ninea || '',
        capital: settings?.capital || ''
    })

    const [taxConfig, setTaxConfig] = useState({
        brs: 5,
        vrs: 5,
        css: 7,
        ipm: 6
    })

    useEffect(() => {
        if (settings?.taxConfig) {
            try {
                const parsed = JSON.parse(settings.taxConfig)
                setTaxConfig(prev => ({ ...prev, ...parsed }))
            } catch (e) {
                // Ignore parse error
            }
        }
    }, [settings])

    const handleSave = async () => {
        const payload = {
            ...formData,
            taxConfig: JSON.stringify(taxConfig)
        }
        await updateCabinetSettings(payload)
        alert('Paramètres enregistrés')
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Paramètres du Cabinet</h2>
                <p className="text-slate-500">Configuration générale de l'application.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Identité & Forme Juridique</CardTitle>
                    <CardDescription>Définissez votre structure légale pour la documentation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Nom du Cabinet</Label>
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Forme Juridique</Label>
                            <Select value={formData.legalForm} onValueChange={v => setFormData({ ...formData, legalForm: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INDIVIDUEL">Cabinet Individuel</SelectItem>
                                    <SelectItem value="SCP">SCP (Société Civile Professionnelle)</SelectItem>
                                    <SelectItem value="SEL">SEL (Société d'Exercice Libéral)</SelectItem>
                                    <SelectItem value="SELARL">SELARL</SelectItem>
                                    <SelectItem value="SELAS">SELAS</SelectItem>
                                    <SelectItem value="SAS">SAS (Société de Participation)</SelectItem>
                                    <SelectItem value="SUARL">SUARL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Capital Social</Label>
                            <Input placeholder="Ex: 1.000.000 FCFA" value={formData.capital} onChange={e => setFormData({ ...formData, capital: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>RCCM (Registre Commerce)</Label>
                            <Input value={formData.tradeRegister} onChange={e => setFormData({ ...formData, tradeRegister: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>NINEA (Fiscal)</Label>
                            <Input value={formData.ninea} onChange={e => setFormData({ ...formData, ninea: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Adresse</Label>
                        <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Téléphone</Label>
                            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email contact</Label>
                            <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Facturation par défaut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Taux Horaire Standard (FCFA/h)</Label>
                            <Input type="number" value={formData.defaultHourlyRate} onChange={e => setFormData({ ...formData, defaultHourlyRate: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>TVA Globale (%)</Label>
                            <Input type="number" value={formData.tvaRate} onChange={e => setFormData({ ...formData, tvaRate: e.target.value })} />
                        </div>
                    </div>
                </CardContent>
            </Card>


            <Card className="mt-6 border-l-4 border-l-indigo-500">
                <CardHeader>
                    <CardTitle>Configuration Fiscale (Sénégal/OHADA)</CardTitle>
                    <CardDescription>Définissez les taux applicables pour l'automatisation comptable.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>BRS (%) - Prestations</Label>
                            <Input
                                type="number"
                                value={taxConfig.brs}
                                onChange={e => setTaxConfig({ ...taxConfig, brs: parseFloat(e.target.value) })}
                            />
                            <p className="text-xs text-slate-500">Retenue BRS services</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>VRS (%) - Retenue à la source</Label>
                            <Input
                                type="number"
                                value={taxConfig.vrs}
                                onChange={e => setTaxConfig({ ...taxConfig, vrs: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>CSS (%) - Charges Sociales</Label>
                            <Input
                                type="number"
                                value={taxConfig.css}
                                onChange={e => setTaxConfig({ ...taxConfig, css: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>IPM (%) - Institut Prévoyance</Label>
                            <Input
                                type="number"
                                value={taxConfig.ipm}
                                onChange={e => setTaxConfig({ ...taxConfig, ipm: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end mt-4">
                <Button onClick={handleSave} className="bg-slate-900 text-white">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
                </Button>
            </div>
        </div>
    )
}
