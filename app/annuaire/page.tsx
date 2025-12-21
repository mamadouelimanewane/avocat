
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Phone, Mail, MapPin, Building, Briefcase, User } from "lucide-react"

const prisma = new PrismaClient()

export default async function AnnuairePage() {
    const contacts = await prisma.directoryContact.findMany({
        orderBy: { name: 'asc' }
    })

    const categories = ['HUISSIER', 'NOTAIRE', 'AVOCAT', 'EXPERT', 'GREFFE', 'JURIDICTION']

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Annuaire Pro & Partenaires</h1>
                    <p className="text-slate-500 mt-1">Le carnet d'adresses essentiel du cabinet : Huissiers, Notaires, Experts...</p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    <User className="mr-2 h-4 w-4" /> Ajouter un Contact
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input placeholder="Rechercher un confrère, un huissier, une juridiction..." className="pl-8" />
                </div>
            </div>

            <Tabs defaultValue="TOUS" className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger value="TOUS" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border border-slate-200">
                        Tous
                    </TabsTrigger>
                    {categories.map(cat => (
                        <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-slate-900 data-[state=active]:text-white border border-slate-200 uppercase text-xs">
                            {cat}s
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="TOUS" className="mt-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        {contacts.map(contact => (
                            <ContactCard key={contact.id} contact={contact} />
                        ))}
                    </div>
                </TabsContent>

                {categories.map(cat => (
                    <TabsContent key={cat} value={cat} className="mt-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {contacts.filter(c => c.category === cat).map(contact => (
                                <ContactCard key={contact.id} contact={contact} />
                            ))}
                            {contacts.filter(c => c.category === cat).length === 0 && (
                                <div className="text-slate-500 col-span-3 text-center py-10">Aucun contact dans cette catégorie.</div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

function ContactCard({ contact }: { contact: any }) {
    const getIcon = (cat: string) => {
        switch (cat) {
            case 'JURIDICTION': return <Building className="h-5 w-5 text-slate-600" />
            case 'GREFFE': return <Briefcase className="h-5 w-5 text-amber-600" />
            default: return <User className="h-5 w-5 text-indigo-600" />
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        {getIcon(contact.category)}
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800">{contact.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-[10px]">{contact.category}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mt-2">
                    {contact.speciality && (
                        <div className="text-xs font-medium text-slate-900 bg-slate-50 p-1 rounded inline-block mb-2">
                            {contact.speciality}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-3 w-3" /> {contact.phone || '-'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-3 w-3" /> {contact.email || '-'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-3 w-3" /> {contact.city || '-'}
                    </div>
                    {contact.notes && (
                        <div className="text-xs text-slate-400 mt-2 italic border-t pt-2">
                            "{contact.notes}"
                        </div>
                    )}
                </div>
                <div className="mt-4 pt-3 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="w-full text-xs">Appeler</Button>
                    <Button variant="outline" size="sm" className="w-full text-xs">Email</Button>
                </div>
            </CardContent>
        </Card>
    )
}
