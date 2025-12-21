
"use client"

import { useState } from "react"
import { Book, Search, Bookmark, ChevronRight, MessageSquare, Send, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { generateAIResponse } from "@/app/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const LAW_CODES = [
    {
        id: "OHADA_COMM",
        title: "Acte Uniforme Droit Commercial Général",
        category: "OHADA",
        articles: [
            { id: "AUDCG-1", number: "Article 1", content: "Le présent Acte Uniforme régit le statut de commerçant, l'entreprenant, le registre du commerce et du crédit mobilier, le bail à usage professionnel..." },
            { id: "AUDCG-100", number: "Article 100", content: "La vente commerciale est formée dès qu'il y a accord sur la chose et le prix, même si la chose n'est pas encore livrée ni le prix payé." }
        ]
    },
    {
        id: "SN_CPCC",
        title: "Code de Procédure Civile (Sénégal)",
        category: "Sénégal",
        articles: [
            { id: "CPCC-268", number: "Article 268", content: "Le délai d'appel est d'un mois pour les jugements contradictoires. Il court à compter de la signification à personne ou à domicile." },
            { id: "CPCC-29", number: "Article 29", content: "L'assignation doit contenir à peine de nullité : les noms, prénoms, profession et domicile du demandeur ; la constitution d'avocat..." }
        ]
    },
    {
        id: "SN_COCC",
        title: "Code des Obligations Civiles et Commerciales",
        category: "Sénégal",
        articles: [
            { id: "COCC-40", number: "Article 40", content: "Le contrat est une convention par laquelle une ou plusieurs personnes s'obligent envers une ou plusieurs autres à donner, à faire ou à ne pas faire quelque chose." }
        ]
    }
]

export function LegalLibrary() {
    const [search, setSearch] = useState("")
    const [selectedCode, setSelectedCode] = useState<typeof LAW_CODES[0] | null>(null)

    // AI Chat State
    const [query, setQuery] = useState("")
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: 'Bonjour. Je suis votre assistant juridique LexAI. Posez-moi une question sur le droit OHADA ou Sénégalais.' }
    ])
    const [loading, setLoading] = useState(false)

    const filteredCodes = LAW_CODES.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))

    const handleSendMessage = async () => {
        if (!query.trim()) return

        const userMsg = query
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setQuery("")
        setLoading(true)

        // Use the Server Action acting as AI
        const response = await generateAIResponse(userMsg, 'RESEARCH')

        setMessages(prev => [...prev, { role: 'assistant', content: response.text }])
        setLoading(false)
    }

    return (
        <Card className="h-full border-slate-200 flex flex-col overflow-hidden">
            <Tabs defaultValue="library" className="flex-1 flex flex-col">
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-emerald-600" />
                        <div>
                            <CardTitle>Bibliothèque Juridique</CardTitle>
                            <CardDescription>Documentation & Assistant IA</CardDescription>
                        </div>
                    </div>
                    <TabsList>
                        <TabsTrigger value="library">Codes & Lois</TabsTrigger>
                        <TabsTrigger value="ai-chat" className="flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Assistant LexAI
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* TAB 1: LIBRARY BOOK READER */}
                <TabsContent value="library" className="flex-1 flex overflow-hidden m-0 p-0 h-full">
                    {/* List */}
                    <div className="w-1/3 border-r border-slate-100 bg-white flex flex-col">
                        <div className="p-4 border-b border-slate-50">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Filtrer..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-1">
                                {filteredCodes.map(code => (
                                    <button
                                        key={code.id}
                                        onClick={() => setSelectedCode(code)}
                                        className={`w-full text-left p-3 rounded-md text-sm transition-colors flex items-center justify-between group ${selectedCode?.id === code.id ? 'bg-indigo-50 text-indigo-900 border border-indigo-100 font-medium' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
                                    >
                                        <div className="space-y-1">
                                            <div className="line-clamp-2">{code.title}</div>
                                            <Badge variant="outline" className={`text-[10px] ${code.category === 'OHADA' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {code.category}
                                            </Badge>
                                        </div>
                                        <ChevronRight className={`h-4 w-4 text-slate-400 ${selectedCode?.id === code.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Reader */}
                    <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto">
                        {selectedCode ? (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                                <div className="border-b pb-4 mb-4 border-slate-200">
                                    <h3 className="text-2xl font-serif text-slate-900">{selectedCode.title}</h3>
                                    <Badge className="mt-2 bg-slate-900">{selectedCode.category}</Badge>
                                </div>
                                <div className="space-y-4">
                                    {selectedCode.articles.map(art => (
                                        <Card key={art.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                            <CardHeader className="py-3 px-4 bg-white border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                                                <span className="font-bold text-sm text-indigo-700">{art.number}</span>
                                                <Bookmark className="h-4 w-4 text-slate-300 hover:text-indigo-500 cursor-pointer" />
                                            </CardHeader>
                                            <CardContent className="p-5 text-sm leading-relaxed text-slate-700 font-serif">
                                                {art.content}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Book className="h-16 w-16 mb-4 opacity-10" />
                                <p>Sélectionnez un texte juridique à consulter</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* TAB 2: AI CHAT ASSISTANT */}
                <TabsContent value="ai-chat" className="flex-1 flex flex-col overflow-hidden m-0 p-0 h-full bg-slate-50/50">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-lg p-4 shadow-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
                                                <Sparkles className="h-3 w-3" /> LexAI
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 rounded-lg p-4 rounded-bl-none shadow-sm flex items-center gap-2">
                                        <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="max-w-3xl mx-auto flex gap-2">
                            <Input
                                placeholder="Posez une question juridique (ex: Quel est le délai d'appel ?)"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage} disabled={loading || !query.trim()} className="bg-indigo-900 text-white">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-center text-xs text-slate-400 mt-2">LexAI peut faire des erreurs. Vérifiez toujours les sources officielles.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    )
}
