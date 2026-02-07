
"use client"

import Link from 'next/link';
import { Scale } from 'lucide-react';

export function PublicFooter() {
    return (
        <footer className="py-20 px-6 border-t border-white/5 bg-[#020617]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
                    <Scale className="h-8 w-8 text-amber-500" />
                    <span>LEX<span className="text-amber-500">PREMIUM</span></span>
                </Link>
                <div className="flex gap-12 text-slate-500 text-sm">
                    <Link href="/expertise" className="hover:text-white">Expertise</Link>
                    <Link href="/lex-ai" className="hover:text-white">LexAI</Link>
                    <Link href="/tarifs" className="hover:text-white">Tarifs CFA</Link>
                    <Link href="/about" className="hover:text-white">À Propos</Link>
                    <Link href="/contact" className="hover:text-white">Contact</Link>
                </div>
                <div className="text-slate-600 text-[10px] tracking-widest uppercase font-black">
                    &copy; 2026 LexPremium. L'excellence au service de la justice OHADA.
                </div>
            </div>
        </footer>
    );
}
