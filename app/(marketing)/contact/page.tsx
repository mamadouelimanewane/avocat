
"use client"

import { Phone, Mail, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">Parlons de <span className="text-amber-500">votre Futur.</span></h1>
                    <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto italic">
                        Notre équipe est à votre disposition pour une démonstration personnalisée ou répondre à vos questions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                                    <Phone className="h-6 w-6 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1">Téléphone</h4>
                                    <p className="text-slate-400">+221 33 800 00 00</p>
                                    <p className="text-slate-400 text-sm italic">Du Lundi au Vendredi, 9h-18h</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                    <Mail className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1">Email</h4>
                                    <p className="text-slate-400">contact@lexpremium.sn</p>
                                    <p className="text-slate-400 text-sm italic">Réponse sous 24h</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                    <MapPin className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1">Siège</h4>
                                    <p className="text-slate-400">Avenue Cheikh Anta Diop,</p>
                                    <p className="text-slate-400">Dakar, Sénégal</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-amber-500" /> Support Dédié
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed font-light">
                                Nos clients bénéficient d'une assistance prioritaire via leur tableau de bord et une ligne directe réservée aux abonnements Elite.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-12 rounded-[3.5rem] bg-slate-900/50 border border-white/5 shadow-2xl">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Prénom</label>
                                    <Input placeholder="Jean" className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-amber-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nom</label>
                                    <Input placeholder="Dupont" className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-amber-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Professionnel</label>
                                <Input type="email" placeholder="jean@cabinet.sn" className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-amber-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Message</label>
                                <Textarea placeholder="Comment pouvons-nous vous aider ?" className="min-h-[150px] bg-white/5 border-white/10 rounded-xl focus:border-amber-500" />
                            </div>
                            <Button className="w-full h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg">
                                Envoyer le Message
                                <Send className="h-5 w-5 ml-2" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
