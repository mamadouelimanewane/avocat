import { getPortalDashboardData } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, Bell, Globe, CreditCard, ChevronRight } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function PortalProfilePage() {
    const { success, client } = await getPortalDashboardData()

    if (!success || !client) redirect('/portal/login')

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-indigo-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                    {client.name?.charAt(0) || 'C'}
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">{client.name}</h1>
                    <p className="text-slate-500 font-medium">{client.email}</p>
                    <div className="flex gap-2 mt-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Compte Vérifié</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">Premium OHADA</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger value="general" className="rounded-lg">Général</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg">Sécurité</TabsTrigger>
                    <TabsTrigger value="payment" className="rounded-lg">Paiement</TabsTrigger>
                    <TabsTrigger value="international" className="rounded-lg">International</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Informations de Contact</CardTitle>
                            <CardDescription>Ces informations sont utilisées pour vos actes et factures.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom Complet</Label>
                                    <Input defaultValue={client.name ?? ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input defaultValue={client.email ?? ""} readOnly className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone</Label>
                                    <Input defaultValue={client.phone ?? "+221 77 ..."} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Adresse</Label>
                                    <Input defaultValue={client.address ?? "Dakar, Sénégal"} />
                                </div>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4">Enregistrer les modifications</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="international" className="mt-6 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="h-5 w-5 text-indigo-600" />
                                Préférences Internationales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-900">Langue d'interface</p>
                                    <p className="text-sm text-slate-500">Choisissez votre langue de navigation.</p>
                                </div>
                                <select className="bg-white border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option>Français (Sénégal/OHADA)</option>
                                    <option>English (UK)</option>
                                    <option>Arabic (SA)</option>
                                    <option>Wolof (Senegal)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-900">Devise Principale</p>
                                    <p className="text-sm text-slate-500">Affichage des montants et factures.</p>
                                </div>
                                <select className="bg-white border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option>FCFA (XOF)</option>
                                    <option>Euro (€)</option>
                                    <option>US Dollar ($)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-900">Fuseau Horaire</p>
                                    <p className="text-sm text-slate-500">Pour les rappels d'audiences.</p>
                                </div>
                                <select className="bg-white border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option>(GMT+00:00) Dakar, Reykjavik</option>
                                    <option>(GMT+01:00) Paris, Brussels</option>
                                    <option>(GMT-05:00) New York</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Sécurité du Compte</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-bold">Double Authentification (2FA)</p>
                                        <p className="text-xs text-slate-500">Activé via SMS / Email</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Gérer</Button>
                            </div>
                            <Button variant="outline" className="w-full justify-between">
                                Modifier le mot de passe / Code d'accès
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
