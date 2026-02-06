"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, X, Phone, User, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PortalMessenger() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, sender: 'lawyer', text: 'Bonjour, j\'ai bien reçu vos documents pour le dossier W-2024. Nous les étudions.', time: '09:30' },
        { id: 2, sender: 'client', text: 'Merci Maître. Pensez-vous que nous pourrons plaider avant la fin du mois ?', time: '10:05' },
        { id: 3, sender: 'lawyer', text: 'C\'est l\'objectif. L\'audience de mise en état est prévue pour mardi prochain.', time: '10:15' },
    ])
    const [inputValue, setInputValue] = useState('')

    const handleSend = () => {
        if (!inputValue.trim()) return
        const newMessage = {
            id: messages.length + 1,
            sender: 'client',
            text: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages([...messages, newMessage])
        setInputValue('')

        // Mock lawyer auto-reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                sender: 'lawyer',
                text: "Bien entendu. Je reviens vers vous dès que j'ai du nouveau.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
        }, 2000)
    }

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white p-0 z-50 flex items-center justify-center animate-bounce"
                >
                    <MessageSquare className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full border-2 border-white text-[10px] flex items-center justify-center font-bold">1</span>
                </Button>
            )}

            {/* Messenger Panel */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-[380px] h-[580px] shadow-2xl border-indigo-100 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    <CardHeader className="bg-indigo-600 text-white p-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold">Cabinet LexPremium</CardTitle>
                                <p className="text-[10px] text-indigo-100 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    Me. Mamadou Wane (En ligne)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 h-8 w-8">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col bg-slate-50">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[85%]",
                                            msg.sender === 'client' ? "ml-auto items-end" : "mr-auto items-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "p-3 rounded-2xl text-sm shadow-sm",
                                                msg.sender === 'client'
                                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                                            )}
                                        >
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 px-1">
                                            <span className="text-[9px] text-slate-400 uppercase font-medium">{msg.time}</span>
                                            {msg.sender === 'client' && <CheckCheck className="h-3 w-3 text-indigo-400" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Écrivez votre message..."
                                    className="border-none bg-slate-50 focus:ring-1 focus:ring-indigo-500 rounded-xl"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'ENTER' && handleSend()}
                                />
                                <Button
                                    size="icon"
                                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                                    onClick={handleSend}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[9px] text-slate-400 text-center mt-2 font-medium">
                                Communication chiffrée & Confidentielle
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
