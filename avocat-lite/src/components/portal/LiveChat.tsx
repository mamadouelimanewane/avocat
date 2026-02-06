"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Send,
    Paperclip,
    CheckCheck,
    Clock,
    User,
    Bot,
    Phone,
    Video
} from 'lucide-react'

interface Message {
    id: string
    sender: 'CLIENT' | 'AVOCAT' | 'SYSTEM'
    content: string
    timestamp: Date
    status: 'SENT' | 'DELIVERED' | 'READ'
    attachments?: string[]
}

interface LiveChatProps {
    dossierId?: string
    clientName?: string
    avocatName?: string
}

export function LiveChat({ dossierId, clientName = "Client", avocatName = "Me. Diop" }: LiveChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'SYSTEM',
            content: `Bienvenue ! Vous êtes en conversation avec ${avocatName}. Posez vos questions.`,
            timestamp: new Date(),
            status: 'READ'
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isAvocatOnline, setIsAvocatOnline] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    // Simulate avocat response (in production, this would be WebSocket)
    const simulateAvocatResponse = (userMessage: string) => {
        setIsTyping(true)

        setTimeout(() => {
            const responses: Record<string, string> = {
                'honoraires': "Nos honoraires dépendent du type de dossier. Pour une consultation, c'est 50 000 FCFA. Souhaitez-vous prendre rendez-vous ?",
                'rdv': "Bien sûr ! Nos prochaines disponibilités sont : Lundi 10h, Mercredi 14h, Vendredi 16h. Quelle heure vous convient ?",
                'dossier': "Votre dossier progresse bien ! Nous sommes actuellement en phase de mise en état. Je vous tiendrai informé de chaque étape.",
                'document': "Vous pouvez uploader vos documents directement depuis votre portail. Cliquez sur 'Mes Documents' puis 'Ajouter un fichier'.",
                'default': "Je note votre message. Un membre de notre cabinet vous répondra dans les plus brefs délais. Pour une urgence, appelez le +221 77 123 45 67."
            }

            const keyword = Object.keys(responses).find(key =>
                userMessage.toLowerCase().includes(key)
            )

            const avocatMessage: Message = {
                id: Date.now().toString(),
                sender: 'AVOCAT',
                content: responses[keyword || 'default'],
                timestamp: new Date(),
                status: 'SENT'
            }

            setMessages(prev => [...prev, avocatMessage])
            setIsTyping(false)

            // Mark as delivered after 1s, read after 2s
            setTimeout(() => {
                setMessages(prev => prev.map(msg =>
                    msg.id === avocatMessage.id ? { ...msg, status: 'DELIVERED' } : msg
                ))
            }, 1000)

            setTimeout(() => {
                setMessages(prev => prev.map(msg =>
                    msg.id === avocatMessage.id ? { ...msg, status: 'READ' } : msg
                ))
            }, 2000)
        }, 2000)
    }

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'CLIENT',
            content: inputMessage,
            timestamp: new Date(),
            status: 'SENT'
        }

        setMessages(prev => [...prev, newMessage])
        setInputMessage('')

        // Simulate avocat response
        simulateAvocatResponse(inputMessage)

        // Mark message as delivered/read
        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: 'DELIVERED' } : msg
            ))
        }, 500)

        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: 'READ' } : msg
            ))
        }, 1500)
    }

    const getMessageIcon = (status: Message['status']) => {
        switch (status) {
            case 'SENT':
                return <Clock className="h-3 w-3 text-slate-400" />
            case 'DELIVERED':
                return <CheckCheck className="h-3 w-3 text-slate-400" />
            case 'READ':
                return <CheckCheck className="h-3 w-3 text-blue-500" />
        }
    }

    return (
        <Card className="h-[600px] flex flex-col border-2 border-blue-100">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarFallback className="bg-blue-500 text-white">
                                {avocatName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{avocatName}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`h-2 w-2 rounded-full ${isAvocatOnline ? 'bg-green-400' : 'bg-slate-400'}`} />
                                <span className="text-xs opacity-90">
                                    {isAvocatOnline ? 'En ligne' : 'Hors ligne'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <Video className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'CLIENT' ? 'justify-end' : 'justify-start'} ${message.sender === 'SYSTEM' ? 'justify-center' : ''
                                    }`}
                            >
                                {message.sender === 'SYSTEM' ? (
                                    <Badge variant="secondary" className="text-xs py-1">
                                        {message.content}
                                    </Badge>
                                ) : (
                                    <div className={`flex gap-2 max-w-[80%] ${message.sender === 'CLIENT' ? 'flex-row-reverse' : ''}`}>
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className={
                                                message.sender === 'CLIENT'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-slate-100 text-slate-700'
                                            }>
                                                {message.sender === 'CLIENT' ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`flex flex-col ${message.sender === 'CLIENT' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-4 py-2 rounded-2xl ${message.sender === 'CLIENT'
                                                ? 'bg-blue-600 text-white rounded-tr-sm'
                                                : 'bg-slate-100 text-slate-900 rounded-tl-sm'
                                                }`}>
                                                <p className="text-sm">{message.content}</p>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1 px-2">
                                                <span className="text-xs text-slate-500">
                                                    {message.timestamp.toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                {message.sender === 'CLIENT' && getMessageIcon(message.status)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-2">
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarFallback className="bg-slate-100">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-slate-50">
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="shrink-0">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                            placeholder="Tapez votre message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        Temps de réponse moyen : ~2 minutes pendant les heures de bureau
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
