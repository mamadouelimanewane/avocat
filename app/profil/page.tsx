import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="space-y-6 container mx-auto py-10 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mon Profil</h1>
                <p className="text-slate-500">Gérez vos informations personnelles et votre sécurité.</p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="account">Compte</TabsTrigger>
                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du Compte</CardTitle>
                            <CardDescription>
                                Vos informations de base. Contactez un administrateur pour modifier ces informations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center">
                                    <User className="h-10 w-10 text-slate-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Mamadou Dia</h3>
                                    <p className="text-slate-500 text-sm">Associé Gérant</p>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input value="mamadou.dia@avocat.sn" disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label>Rôle</Label>
                                <Input value="Administrateur" disabled />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <ChangePasswordForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}
