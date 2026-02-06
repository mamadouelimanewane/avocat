"use client"

import { useState } from "react"
import { Scale, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // On définit le cookie pour le middleware
        document.cookie = "auth=true; path=/;"

        setTimeout(() => {
            window.location.href = "/"
        }, 1000)
    }


    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Côté Gauche - Branding & Identité */}
            <div className="hidden md:flex md:w-1/2 bg-[#0f172a] p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-x-2 text-white mb-24">
                        <div className="p-2 bg-white rounded-lg">
                            <Scale className="h-6 w-6 text-[#0f172a]" />
                        </div>
                        <span className="text-2xl font-bold">LexPremium <span className="text-secondary">Lite</span></span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-bold text-white leading-tight">
                            L'intelligence au cœur de votre cabinet.
                        </h1>
                        <p className="text-slate-400 text-lg font-light">
                            Gagnez en temps et en expertise avec la plateforme de gestion nouvelle génération pour les avocats d'élite de la zone UEMOA.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-x-8">
                    <div className="flex flex-col gap-y-1">
                        <span className="text-white font-bold text-2xl">100%</span>
                        <span className="text-slate-500 text-xs uppercase tracking-widest">Conforme OHADA</span>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <span className="text-white font-bold text-2xl">24/7</span>
                        <span className="text-slate-500 text-xs uppercase tracking-widest">Support Dédié</span>
                    </div>
                </div>

                {/* Décoration de fond */}
                <div className="absolute top-0 right-0 w-full h-full">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                </div>
            </div>

            {/* Côté Droit - Formulaire */}
            <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-20 bg-white">
                <div className="max-w-md w-full mx-auto">
                    <div className="md:hidden flex items-center gap-x-2 text-[#0f172a] mb-8">
                        <Scale className="h-8 w-8 text-secondary" />
                        <span className="text-xl font-bold">LexPremium <span className="text-secondary-600">Lite</span></span>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Bon retour Maître</h2>
                        <p className="text-slate-500 text-sm">Identifiez-vous pour accéder à votre espace sécurisé.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="email">
                                Email professionnel
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="maitre.diag@lexpremium.sn"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest" htmlFor="password">
                                    Mot de passe
                                </label>
                                <Link href="#" className="text-xs font-bold text-secondary-600 hover:underline">Oublié ?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold flex items-center justify-center group hover:bg-slate-800 transition shadow-lg active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-x-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Connexion...</span>
                                </div>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 space-y-3">
                        <div className="flex items-center gap-x-3 text-slate-400 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            <span className="text-[10px] leading-tight font-medium">SSL 256-bits | Données zone UEMOA</span>
                        </div>
                        <div className="flex items-center gap-x-3 text-slate-400 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Sparkles className="h-5 w-5 text-secondary" />
                            <span className="text-[10px] leading-tight font-medium">Propulsé par LexAI Assistant</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
